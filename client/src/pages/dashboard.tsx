import { useQuery } from "@tanstack/react-query";
import StatsCards from "@/components/dashboard/stats-cards";
import Charts from "@/components/dashboard/charts";
import ExercisePlan from "@/components/dashboard/exercise-plan";
import ActivityFeed from "@/components/dashboard/activity-feed";
import FallDetectionModal from "@/components/modals/fall-detection-modal";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock user ID for demo
const MOCK_USER_ID = "user-123";

export default function Dashboard() {
  const { toast } = useToast();
  const [showFallModal, setShowFallModal] = useState(false);

  const { data: latestSensorData, isLoading: sensorLoading } = useQuery({
    queryKey: ["/api/sensor/latest", MOCK_USER_ID],
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/alerts", MOCK_USER_ID],
  });

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export/${MOCK_USER_ID}?format=json`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `knee-brace-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Data exported successfully",
        description: "Your knee brace data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* Header */}
      <header className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" data-testid="dashboard-title">
              Dashboard Overview
            </h2>
            <p className="text-gray-600 mt-1" data-testid="current-date">
              Today, {currentDate}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Device Status */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-green rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600" data-testid="device-status">
                {latestSensorData?.isConnected ? "Device Connected" : "Device Disconnected"}
              </span>
            </div>
            {/* Battery Level */}
            <div className="flex items-center space-x-2">
              <div className="text-success-green">🔋</div>
              <span className="text-sm text-gray-600" data-testid="battery-level">
                {latestSensorData?.batteryLevel || 0}%
              </span>
            </div>
            {/* Export Button */}
            <Button 
              onClick={handleExport}
              className="bg-medical-blue hover:bg-blue-700"
              data-testid="button-export"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Stats Cards */}
      <StatsCards 
        sensorData={latestSensorData} 
        isLoading={sensorLoading}
        userId={MOCK_USER_ID}
      />

      {/* Charts Section */}
      <Charts userId={MOCK_USER_ID} />

      {/* Exercise Tracking Section */}
      <ExercisePlan userId={MOCK_USER_ID} />

      {/* Recent Alerts */}
      <ActivityFeed 
        alerts={alerts} 
        isLoading={alertsLoading} 
      />

      {/* Fall Detection Modal */}
      <FallDetectionModal
        isOpen={showFallModal}
        onClose={() => setShowFallModal(false)}
        onConfirmSafety={() => setShowFallModal(false)}
        onRequestHelp={() => {
          toast({
            title: "Help requested",
            description: "Emergency services have been notified.",
          });
          setShowFallModal(false);
        }}
      />
    </>
  );
}
