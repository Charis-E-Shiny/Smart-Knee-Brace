import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSensorDataSchema,
  insertExerciseSessionSchema,
  insertFallDetectionSchema,
  insertAlertSchema,
  insertDailyStatsSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sensor Data Routes
  app.get("/api/sensor/latest/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const data = await storage.getLatestSensorData(userId);
      res.json(data || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sensor data" });
    }
  });

  app.get("/api/sensor/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const data = await storage.getSensorData(userId, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sensor history" });
    }
  });

  app.post("/api/sensor", async (req, res) => {
    try {
      const validatedData = insertSensorDataSchema.parse(req.body);
      const data = await storage.createSensorData(validatedData);
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid sensor data" });
    }
  });

  // Exercise Routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const exercises = await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get("/api/exercise-sessions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const sessions = await storage.getExerciseSessions(userId, date);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise sessions" });
    }
  });

  app.post("/api/exercise-sessions", async (req, res) => {
    try {
      const validatedData = insertExerciseSessionSchema.parse(req.body);
      const session = await storage.createExerciseSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid exercise session data" });
    }
  });

  app.patch("/api/exercise-sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updateExerciseSession(id, req.body);
      if (!session) {
        return res.status(404).json({ message: "Exercise session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Failed to update exercise session" });
    }
  });

  // Fall Detection Routes
  app.get("/api/falls/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const falls = await storage.getFallDetections(userId, limit);
      res.json(falls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fall detections" });
    }
  });

  app.post("/api/falls", async (req, res) => {
    try {
      const validatedData = insertFallDetectionSchema.parse(req.body);
      const fall = await storage.createFallDetection(validatedData);
      res.json(fall);
    } catch (error) {
      res.status(400).json({ message: "Invalid fall detection data" });
    }
  });

  app.patch("/api/falls/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const fall = await storage.updateFallDetection(id, req.body);
      if (!fall) {
        return res.status(404).json({ message: "Fall detection not found" });
      }
      res.json(fall);
    } catch (error) {
      res.status(400).json({ message: "Failed to update fall detection" });
    }
  });

  // Alert Routes
  app.get("/api/alerts/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const alerts = await storage.getAlerts(userId, limit);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const alert = await storage.markAlertRead(id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: "Failed to mark alert as read" });
    }
  });

  // Daily Stats Routes
  app.get("/api/stats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : undefined;
      const stats = await storage.getDailyStats(userId, days);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily stats" });
    }
  });

  app.post("/api/stats", async (req, res) => {
    try {
      const validatedData = insertDailyStatsSchema.parse(req.body);
      const stats = await storage.createDailyStats(validatedData);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: "Invalid daily stats data" });
    }
  });

  // Export data route
  app.get("/api/export/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const format = req.query.format as string || 'json';
      
      // Fetch all user data
      const [sensorData, exerciseSessions, fallDetections, alerts, dailyStats] = await Promise.all([
        storage.getSensorData(userId),
        storage.getExerciseSessions(userId),
        storage.getFallDetections(userId),
        storage.getAlerts(userId),
        storage.getDailyStats(userId, 30)
      ]);

      const exportData = {
        sensorData,
        exerciseSessions,
        fallDetections,
        alerts,
        dailyStats,
        exportedAt: new Date().toISOString()
      };

      if (format === 'csv') {
        // Simple CSV export of daily stats
        const csvHeaders = 'Date,Steps,Exercise Minutes,Fall Count,Stability Score,Goal Achieved\n';
        const csvRows = dailyStats.map(stat => 
          `${new Date(stat.date).toDateString()},${stat.totalSteps},${stat.exerciseMinutes},${stat.fallCount},${stat.averageStability || 0},${stat.goalAchieved}`
        ).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="knee-brace-data-${userId}.csv"`);
        res.send(csvHeaders + csvRows);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="knee-brace-data-${userId}.json"`);
        res.json(exportData);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
