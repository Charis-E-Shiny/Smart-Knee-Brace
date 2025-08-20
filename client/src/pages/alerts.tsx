import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Info, CheckCircle, XCircle, Clock, MapPin } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Alert, FallDetection } from "@shared/schema";

const MOCK_USER_ID = "user-123";

const getAlertIcon = (type: string, severity: string) => {
  switch (severity) {
    case "error":
      return <XCircle className="w-5 h-5 text-error-red" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-warning-orange" />;
    case "success":
      return <CheckCircle className="w-5 h-5 text-success-green" />;
    default:
      return <Info className="w-5 h-5 text-medical-blue" />;
  }
};

const getSeverityColor = (severity: string) => {
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

const getFallSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-error-red";
    case "medium":
      return "bg-warning-orange";
    case "low":
      return "bg-success-green";
    default:
      return "bg-gray-500";
  }
};

export default function Alerts() {
  const { toast } = useToast();

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/alerts", MOCK_USER_ID],
  });

  const { data: fallDetections, isLoading: fallsLoading } = useQuery({
    queryKey: ["/api/falls", MOCK_USER_ID],
  });

  const markReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await apiRequest("PATCH", `/api/alerts/${alertId}/read`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alert marked as read",
        description: "The alert has been updated.",
      });
    },
  });

  const updateFallMutation = useMutation({
    mutationFn: async ({ fallId, updates }: { fallId: string; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/falls/${fallId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/falls"] });
      toast({
        title: "Fall detection updated",
        description: "The fall detection record has been updated.",
      });
    },
  });

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

  if (alertsLoading || fallsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const unreadAlerts = alerts?.filter((alert: Alert) => !alert.isRead) || [];
  const readAlerts = alerts?.filter((alert: Alert) => alert.isRead) || [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900" data-testid="alerts-title">
          Alerts & Fall Detection
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor system alerts and review fall detection events for your safety.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Unread Alerts</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="unread-count">
                  {unreadAlerts.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Needs attention</p>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-error-red" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Fall Detections</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="falls-count">
                  {fallDetections?.length || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total recorded</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-warning-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Response Time</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="response-time">
                  {fallDetections?.length > 0 
                    ? `${Math.round(fallDetections.reduce((sum: number, fall: FallDetection) => sum + (fall.responseTime || 0), 0) / fallDetections.length)}s`
                    : "N/A"
                  }
                </p>
                <p className="text-sm text-gray-600 mt-1">Average</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <Clock className="w-6 h-6 text-success-green" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different alert types */}
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList>
          <TabsTrigger value="alerts" data-testid="tab-alerts">
            System Alerts ({alerts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="falls" data-testid="tab-falls">
            Fall Detections ({fallDetections?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-6">
          <div className="space-y-6">
            {/* Unread Alerts */}
            {unreadAlerts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Unread Alerts
                </h3>
                <div className="space-y-3">
                  {unreadAlerts.map((alert: Alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                      data-testid={`alert-${alert.id}`}
                    >
                      {getAlertIcon(alert.type, alert.severity)}
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium" data-testid={`alert-title-${alert.id}`}>
                          {alert.title}
                        </p>
                        <p className="text-sm text-gray-600" data-testid={`alert-message-${alert.id}`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTimeAgo(alert.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{alert.type}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markReadMutation.mutate(alert.id)}
                          disabled={markReadMutation.isPending}
                          data-testid={`button-mark-read-${alert.id}`}
                        >
                          Mark as Read
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read Alerts */}
            {readAlerts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Alerts
                </h3>
                <div className="space-y-3">
                  {readAlerts.slice(0, 10).map((alert: Alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg opacity-75"
                      data-testid={`read-alert-${alert.id}`}
                    >
                      {getAlertIcon(alert.type, alert.severity)}
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTimeAgo(alert.timestamp)}
                        </p>
                      </div>
                      <Badge variant="secondary">{alert.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {alerts?.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-success-green mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts</h3>
                <p className="text-gray-600">All systems are running normally.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="falls" className="mt-6">
          <div className="space-y-4">
            {fallDetections?.map((fall: FallDetection) => (
              <Card key={fall.id} data-testid={`fall-${fall.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-red-50 p-3 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-error-red" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          Fall Detection Event
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(fall.timestamp).toLocaleString()}</span>
                          </p>
                          {fall.location && (
                            <p className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{fall.location}</span>
                            </p>
                          )}
                          {fall.responseTime && (
                            <p className="text-gray-600">
                              Response time: {fall.responseTime} seconds
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge 
                        className={`${getFallSeverityColor(fall.severity)} text-white`}
                        data-testid={`fall-severity-${fall.id}`}
                      >
                        {fall.severity.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant={fall.isConfirmed ? "default" : "secondary"}
                        className={fall.isConfirmed ? "bg-success-green" : ""}
                        data-testid={`fall-status-${fall.id}`}
                      >
                        {fall.isConfirmed ? "Confirmed Safe" : "Unconfirmed"}
                      </Badge>
                      {fall.emergencyContacted && (
                        <Badge className="bg-error-red">
                          Emergency Contacted
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {!fall.isConfirmed && (
                    <div className="mt-4 flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-success-green text-white hover:bg-green-600"
                        onClick={() => updateFallMutation.mutate({
                          fallId: fall.id,
                          updates: { isConfirmed: true, responseTime: 30 }
                        })}
                        disabled={updateFallMutation.isPending}
                        data-testid={`button-confirm-safe-${fall.id}`}
                      >
                        Confirm I'm Safe
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-error-red text-white hover:bg-red-600"
                        onClick={() => updateFallMutation.mutate({
                          fallId: fall.id,
                          updates: { emergencyContacted: true }
                        })}
                        disabled={updateFallMutation.isPending}
                        data-testid={`button-request-help-${fall.id}`}
                      >
                        Request Help
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {fallDetections?.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-success-green mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Fall Detections</h3>
                <p className="text-gray-600">Great! No fall events have been detected.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
