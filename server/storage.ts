import { 
  type User, 
  type InsertUser,
  type SensorData,
  type InsertSensorData,
  type Exercise,
  type InsertExercise,
  type ExerciseSession,
  type InsertExerciseSession,
  type FallDetection,
  type InsertFallDetection,
  type Alert,
  type InsertAlert,
  type DailyStats,
  type InsertDailyStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sensor Data
  getLatestSensorData(userId: string): Promise<SensorData | undefined>;
  getSensorData(userId: string, limit?: number): Promise<SensorData[]>;
  createSensorData(data: InsertSensorData): Promise<SensorData>;
  
  // Exercises
  getExercises(): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // Exercise Sessions
  getExerciseSessions(userId: string, date?: Date): Promise<ExerciseSession[]>;
  getExerciseSession(id: string): Promise<ExerciseSession | undefined>;
  createExerciseSession(session: InsertExerciseSession): Promise<ExerciseSession>;
  updateExerciseSession(id: string, updates: Partial<ExerciseSession>): Promise<ExerciseSession | undefined>;
  
  // Fall Detections
  getFallDetections(userId: string, limit?: number): Promise<FallDetection[]>;
  createFallDetection(fall: InsertFallDetection): Promise<FallDetection>;
  updateFallDetection(id: string, updates: Partial<FallDetection>): Promise<FallDetection | undefined>;
  
  // Alerts
  getAlerts(userId: string, limit?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertRead(id: string): Promise<Alert | undefined>;
  
  // Daily Stats
  getDailyStats(userId: string, days?: number): Promise<DailyStats[]>;
  createDailyStats(stats: InsertDailyStats): Promise<DailyStats>;
  updateDailyStats(userId: string, date: Date, updates: Partial<DailyStats>): Promise<DailyStats | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sensorData: Map<string, SensorData>;
  private exercises: Map<string, Exercise>;
  private exerciseSessions: Map<string, ExerciseSession>;
  private fallDetections: Map<string, FallDetection>;
  private alerts: Map<string, Alert>;
  private dailyStats: Map<string, DailyStats>;

  constructor() {
    this.users = new Map();
    this.sensorData = new Map();
    this.exercises = new Map();
    this.exerciseSessions = new Map();
    this.fallDetections = new Map();
    this.alerts = new Map();
    this.dailyStats = new Map();
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default exercises
    const defaultExercises: InsertExercise[] = [
      {
        name: "Leg Extensions",
        description: "3 sets of 15 repetitions",
        targetSets: 3,
        targetReps: 15,
        estimatedMinutes: 15,
        category: "strength"
      },
      {
        name: "Range of Motion",
        description: "Slow flexion and extension",
        targetSets: 2,
        targetReps: 10,
        estimatedMinutes: 10,
        category: "flexibility"
      },
      {
        name: "Balance Training",
        description: "Single leg stands - 30 seconds each",
        targetSets: 3,
        targetReps: 1,
        estimatedMinutes: 10,
        category: "balance"
      }
    ];

    defaultExercises.forEach(exercise => {
      this.createExercise(exercise);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Sensor Data
  async getLatestSensorData(userId: string): Promise<SensorData | undefined> {
    const userSensorData = Array.from(this.sensorData.values())
      .filter(data => data.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return userSensorData[0];
  }

  async getSensorData(userId: string, limit = 50): Promise<SensorData[]> {
    return Array.from(this.sensorData.values())
      .filter(data => data.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async createSensorData(insertData: InsertSensorData): Promise<SensorData> {
    const id = randomUUID();
    const data: SensorData = {
      ...insertData,
      id,
      timestamp: new Date(),
    };
    this.sensorData.set(id, data);
    return data;
  }

  // Exercises
  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = randomUUID();
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }

  // Exercise Sessions
  async getExerciseSessions(userId: string, date?: Date): Promise<ExerciseSession[]> {
    let sessions = Array.from(this.exerciseSessions.values())
      .filter(session => session.userId === userId);
    
    if (date) {
      const dateStr = date.toDateString();
      sessions = sessions.filter(session => 
        new Date(session.startTime).toDateString() === dateStr
      );
    }
    
    return sessions.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  async getExerciseSession(id: string): Promise<ExerciseSession | undefined> {
    return this.exerciseSessions.get(id);
  }

  async createExerciseSession(insertSession: InsertExerciseSession): Promise<ExerciseSession> {
    const id = randomUUID();
    const session: ExerciseSession = {
      ...insertSession,
      id,
      startTime: new Date(),
    };
    this.exerciseSessions.set(id, session);
    return session;
  }

  async updateExerciseSession(id: string, updates: Partial<ExerciseSession>): Promise<ExerciseSession | undefined> {
    const session = this.exerciseSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.exerciseSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Fall Detections
  async getFallDetections(userId: string, limit = 20): Promise<FallDetection[]> {
    return Array.from(this.fallDetections.values())
      .filter(fall => fall.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async createFallDetection(insertFall: InsertFallDetection): Promise<FallDetection> {
    const id = randomUUID();
    const fall: FallDetection = {
      ...insertFall,
      id,
      timestamp: new Date(),
    };
    this.fallDetections.set(id, fall);
    return fall;
  }

  async updateFallDetection(id: string, updates: Partial<FallDetection>): Promise<FallDetection | undefined> {
    const fall = this.fallDetections.get(id);
    if (!fall) return undefined;
    
    const updatedFall = { ...fall, ...updates };
    this.fallDetections.set(id, updatedFall);
    return updatedFall;
  }

  // Alerts
  async getAlerts(userId: string, limit = 20): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      timestamp: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertRead(id: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, isRead: true };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  // Daily Stats
  async getDailyStats(userId: string, days = 7): Promise<DailyStats[]> {
    return Array.from(this.dailyStats.values())
      .filter(stats => stats.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, days);
  }

  async createDailyStats(insertStats: InsertDailyStats): Promise<DailyStats> {
    const id = randomUUID();
    const stats: DailyStats = { ...insertStats, id };
    this.dailyStats.set(id, stats);
    return stats;
  }

  async updateDailyStats(userId: string, date: Date, updates: Partial<DailyStats>): Promise<DailyStats | undefined> {
    const dateStr = date.toDateString();
    const existingStats = Array.from(this.dailyStats.values())
      .find(stats => stats.userId === userId && new Date(stats.date).toDateString() === dateStr);
    
    if (!existingStats) return undefined;
    
    const updatedStats = { ...existingStats, ...updates };
    this.dailyStats.set(existingStats.id, updatedStats);
    return updatedStats;
  }
}

export const storage = new MemStorage();
