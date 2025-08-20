import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sensorData = pgTable("sensor_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  stepCount: integer("step_count").default(0),
  flexionAngle: real("flexion_angle"), // in degrees
  extensionAngle: real("extension_angle"), // in degrees
  stabilityScore: integer("stability_score"), // 0-100
  batteryLevel: integer("battery_level"), // 0-100
  isConnected: boolean("is_connected").default(true),
});

export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  targetSets: integer("target_sets").default(1),
  targetReps: integer("target_reps").default(1),
  estimatedMinutes: integer("estimated_minutes").default(10),
  category: text("category").notNull(), // "strength", "flexibility", "balance"
});

export const exerciseSessions = pgTable("exercise_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  exerciseId: varchar("exercise_id").notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  completedSets: integer("completed_sets").default(0),
  completedReps: integer("completed_reps").default(0),
  status: text("status").default("pending"), // "pending", "in_progress", "completed", "skipped"
});

export const fallDetections = pgTable("fall_detections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  severity: text("severity").notNull(), // "low", "medium", "high"
  isConfirmed: boolean("is_confirmed").default(false),
  responseTime: integer("response_time"), // seconds to respond
  location: text("location"),
  emergencyContacted: boolean("emergency_contacted").default(false),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // "fall", "battery", "exercise", "device", "goal"
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").default("info"), // "info", "warning", "error", "success"
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isRead: boolean("is_read").default(false),
});

export const dailyStats = pgTable("daily_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").notNull(),
  totalSteps: integer("total_steps").default(0),
  exerciseMinutes: integer("exercise_minutes").default(0),
  fallCount: integer("fall_count").default(0),
  averageStability: real("average_stability"),
  goalAchieved: boolean("goal_achieved").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSensorDataSchema = createInsertSchema(sensorData).omit({
  id: true,
  timestamp: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertExerciseSessionSchema = createInsertSchema(exerciseSessions).omit({
  id: true,
  startTime: true,
});

export const insertFallDetectionSchema = createInsertSchema(fallDetections).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertDailyStatsSchema = createInsertSchema(dailyStats).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SensorData = typeof sensorData.$inferSelect;
export type InsertSensorData = z.infer<typeof insertSensorDataSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type ExerciseSession = typeof exerciseSessions.$inferSelect;
export type InsertExerciseSession = z.infer<typeof insertExerciseSessionSchema>;

export type FallDetection = typeof fallDetections.$inferSelect;
export type InsertFallDetection = z.infer<typeof insertFallDetectionSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type DailyStats = typeof dailyStats.$inferSelect;
export type InsertDailyStats = z.infer<typeof insertDailyStatsSchema>;
