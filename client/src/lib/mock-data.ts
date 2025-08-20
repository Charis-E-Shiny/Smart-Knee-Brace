import type { 
  SensorData, 
  Exercise, 
  ExerciseSession, 
  FallDetection, 
  Alert, 
  DailyStats 
} from "@shared/schema";

export const generateMockSensorData = (userId: string, count: number = 7): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - i * 4); // Every 4 hours

    data.push({
      id: `sensor-${i}`,
      userId,
      timestamp,
      stepCount: Math.floor(Math.random() * 1000) + 1000, // 1000-2000 steps per reading
      flexionAngle: Math.random() * 45 + 65, // 65-110 degrees
      extensionAngle: Math.random() * 15 + 5, // 5-20 degrees
      stabilityScore: Math.floor(Math.random() * 20) + 80, // 80-100%
      batteryLevel: Math.max(20, 100 - i * 3), // Decreasing battery
      isConnected: true,
    });
  }

  return data;
};

export const generateMockDailyStats = (userId: string, days: number = 30): DailyStats[] => {
  const stats: DailyStats[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const steps = Math.floor(Math.random() * 5000) + 5000; // 5000-10000 steps
    const exerciseMinutes = Math.floor(Math.random() * 60) + 15; // 15-75 minutes
    const fallCount = Math.random() < 0.05 ? 1 : 0; // 5% chance of fall
    const stability = Math.random() * 20 + 75; // 75-95%

    stats.push({
      id: `stats-${i}`,
      userId,
      date,
      totalSteps: steps,
      exerciseMinutes,
      fallCount,
      averageStability: stability,
      goalAchieved: steps >= 8000 && exerciseMinutes >= 30,
    });
  }

  return stats.reverse(); // Most recent first
};

export const generateMockAlerts = (userId: string, count: number = 10): Alert[] => {
  const alertTypes = ['exercise', 'goal', 'battery', 'device', 'fall'];
  const severities = ['info', 'warning', 'error', 'success'];
  
  const alertTemplates = {
    exercise: {
      titles: ['Exercise completed', 'Missed exercise session', 'New exercise available'],
      messages: ['Great job on your workout!', 'Remember to complete your exercises', 'A new exercise has been added to your plan'],
    },
    goal: {
      titles: ['Goal achieved', 'Daily target reached', 'Weekly milestone'],
      messages: ['You hit your step goal!', 'Excellent progress today', 'Another successful week completed'],
    },
    battery: {
      titles: ['Battery low', 'Charging needed', 'Battery critical'],
      messages: ['Device battery below 20%', 'Please charge your device', 'Device will shut down soon'],
    },
    device: {
      titles: ['Connection lost', 'Device synchronized', 'Firmware update'],
      messages: ['Device disconnected', 'Data synchronized successfully', 'New firmware available'],
    },
    fall: {
      titles: ['Fall detected', 'Emergency alert', 'Safety check'],
      messages: ['Potential fall detected', 'Emergency services contacted', 'Are you okay?'],
    },
  };

  const alerts: Alert[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const templates = alertTemplates[type as keyof typeof alertTemplates];
    
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - i * 2); // Every 2 hours

    alerts.push({
      id: `alert-${i}`,
      userId,
      type,
      title: templates.titles[Math.floor(Math.random() * templates.titles.length)],
      message: templates.messages[Math.floor(Math.random() * templates.messages.length)],
      severity,
      timestamp,
      isRead: Math.random() < 0.6, // 60% chance of being read
    });
  }

  return alerts;
};

export const generateMockFallDetections = (userId: string, count: number = 5): FallDetection[] => {
  const severities = ['low', 'medium', 'high'];
  const locations = ['Living Room', 'Bathroom', 'Kitchen', 'Bedroom', 'Stairs'];
  
  const falls: FallDetection[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - i * 3); // Every 3 days

    falls.push({
      id: `fall-${i}`,
      userId,
      timestamp,
      severity: severities[Math.floor(Math.random() * severities.length)] as 'low' | 'medium' | 'high',
      isConfirmed: Math.random() < 0.8, // 80% confirmed as safe
      responseTime: Math.floor(Math.random() * 120) + 10, // 10-130 seconds
      location: locations[Math.floor(Math.random() * locations.length)],
      emergencyContacted: Math.random() < 0.1, // 10% required emergency contact
    });
  }

  return falls;
};

export const mockStepData = [
  { day: 'Mon', steps: 7200, goal: 8000 },
  { day: 'Tue', steps: 8100, goal: 8000 },
  { day: 'Wed', steps: 6800, goal: 8000 },
  { day: 'Thu', steps: 9200, goal: 8000 },
  { day: 'Fri', steps: 7500, goal: 8000 },
  { day: 'Sat', steps: 8900, goal: 8000 },
  { day: 'Sun', steps: 8247, goal: 8000 },
];

export const mockMovementData = [
  { subject: 'Flexion', current: 85, target: 95 },
  { subject: 'Extension', current: 92, target: 95 },
  { subject: 'Stability', current: 78, target: 90 },
  { subject: 'Strength', current: 88, target: 95 },
  { subject: 'Mobility', current: 82, target: 90 },
  { subject: 'Balance', current: 90, target: 95 },
];
