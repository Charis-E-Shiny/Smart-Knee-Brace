import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, AlertTriangle, Battery } from "lucide-react";
import { Link } from "wouter";
import type { Alert } from "@shared/schema";

interface ActivityFeedProps {
  alerts?: Alert[];
  isLoading: boolean;
}

const getAlertIcon = (type: string, severity: string) => {
  switch (severity) {
    case "error":
      return <AlertTriangle className="text-error-red" />;
    case "warning":
      return <Battery className="text-warning-orange" />;
    case "success":
      return <CheckCircle className="text-success-green" />;
    default:
      return <Info className="text-medical-blue" />;
  }
};

const getAlertBgColor = (severity: string) => {
  switch (severity) {
    case "error":
      return "bg-red-50 border-error-red";
    case "warning":
      return "bg-yellow-50 border-warning-orange";
    case "success":
      return "bg-green-50 border-success-green";
    default:
      return "bg-blue-50 border-medical-blue";
  }
};

const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  }
};

// Mock recent activity data since we don't have alerts in storage yet
const mockAlerts: Alert[] = [
  {
    id: "1",
    userId: "user-123",
    type: "exercise",
    title: "Exercise session completed successfully",
    message: "Leg Extensions completed with excellent form",
    severity: "success",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
  },
  {
    id: "2",
    userId: "user-123",
    type: "goal",
    title: "Daily step goal achieved",
    message: "Congratulations! You've reached 8,247 steps today",
    severity: "info",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    isRead: false,
  },
  {
    id: "3",
    userId: "user-123",
    type: "battery",
    title: "Device battery at 78%",
    message: "Consider charging your device soon",
    severity: "warning",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isRead: false,
  },
];

export default function ActivityFeed({ alerts, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity & Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use mock data if no alerts are provided
  const displayAlerts = alerts && alerts.length > 0 ? alerts.slice(0, 3) : mockAlerts;

  return (
    <Card>
      <CardHeader>
        <CardTitle data-testid="activity-feed-title">Recent Activity & Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center space-x-4 p-3 rounded-lg border-l-4 ${getAlertBgColor(alert.severity)}`}
              data-testid={`activity-item-${alert.id}`}
            >
              {getAlertIcon(alert.type, alert.severity)}
              <div className="flex-1">
                <p className="text-gray-900 font-medium" data-testid={`activity-title-${alert.id}`}>
                  {alert.title}
                </p>
                <p className="text-sm text-gray-600" data-testid={`activity-message-${alert.id}`}>
                  {alert.message}
                </p>
                <p className="text-sm text-gray-500" data-testid={`activity-time-${alert.id}`}>
                  {getTimeAgo(alert.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link href="/alerts">
            <Button 
              variant="ghost" 
              className="text-medical-blue hover:text-blue-700 font-medium"
              data-testid="button-view-all-alerts"
            >
              View All Activity History
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
