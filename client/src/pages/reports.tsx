import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, TrendingUp, Activity, Shield } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";

const MOCK_USER_ID = "user-123";

// Mock data for reports
const weeklyProgressData = [
  { week: 'Week 1', steps: 6500, exercises: 3, stability: 85 },
  { week: 'Week 2', steps: 7200, exercises: 4, stability: 88 },
  { week: 'Week 3', steps: 7800, exercises: 5, stability: 90 },
  { week: 'Week 4', steps: 8100, exercises: 6, stability: 92 },
];

const exerciseDistribution = [
  { name: 'Strength', value: 40, color: '#0D47A1' },
  { name: 'Flexibility', value: 35, color: '#00BCD4' },
  { name: 'Balance', value: 25, color: '#4CAF50' },
];

const monthlyComparison = [
  { month: 'Jan', steps: 185000, exercises: 24, falls: 0 },
  { month: 'Feb', steps: 198000, exercises: 28, falls: 1 },
  { month: 'Mar', steps: 220000, exercises: 32, falls: 0 },
  { month: 'Apr', steps: 235000, exercises: 30, falls: 0 },
];

export default function Reports() {
  const { toast } = useToast();

  const { data: dailyStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats", MOCK_USER_ID],
  });

  const { data: exerciseSessions, isLoading: exercisesLoading } = useQuery({
    queryKey: ["/api/exercise-sessions", MOCK_USER_ID],
  });

  const handleExportReport = async (format: 'pdf' | 'csv') => {
    try {
      const response = await fetch(`/api/export/${MOCK_USER_ID}?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `knee-brace-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Report exported successfully",
        description: `Your ${format.toUpperCase()} report has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error generating your report.",
        variant: "destructive",
      });
    }
  };

  if (statsLoading || exercisesLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalSteps = monthlyComparison.reduce((sum, month) => sum + month.steps, 0);
  const totalExercises = monthlyComparison.reduce((sum, month) => sum + month.exercises, 0);
  const totalFalls = monthlyComparison.reduce((sum, month) => sum + month.falls, 0);
  const averageStability = weeklyProgressData.reduce((sum, week) => sum + week.stability, 0) / weeklyProgressData.length;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="reports-title">
            Progress Reports
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analysis of your rehabilitation progress and activity patterns.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => handleExportReport('csv')}
            variant="outline"
            data-testid="button-export-csv"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV Report
          </Button>
          <Button 
            onClick={() => handleExportReport('pdf')}
            className="bg-medical-blue hover:bg-blue-700"
            data-testid="button-export-pdf"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF Report
          </Button>
        </div>
      </header>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Steps</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="total-steps">
                  {totalSteps.toLocaleString()}
                </p>
                <p className="text-success-green text-sm mt-1">Last 4 months</p>
              </div>
              <Activity className="w-8 h-8 text-medical-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Exercise Sessions</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="total-exercises">
                  {totalExercises}
                </p>
                <p className="text-success-green text-sm mt-1">Completed</p>
              </div>
              <TrendingUp className="w-8 h-8 text-medical-teal" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Stability Score</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="avg-stability">
                  {Math.round(averageStability)}%
                </p>
                <p className="text-success-green text-sm mt-1">Average</p>
              </div>
              <Shield className="w-8 h-8 text-success-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Fall Incidents</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="total-falls">
                  {totalFalls}
                </p>
                <p className="text-success-green text-sm mt-1">
                  {totalFalls === 0 ? "Excellent!" : "Monitored"}
                </p>
              </div>
              <Shield className="w-8 h-8 text-warning-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList>
          <TabsTrigger value="progress" data-testid="tab-progress">Progress Overview</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity">Activity Analysis</TabsTrigger>
          <TabsTrigger value="trends" data-testid="tab-trends">Trends & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Weekly Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="stability" 
                        stroke="#0D47A1" 
                        strokeWidth={2}
                        name="Stability Score (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Exercise Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={exerciseDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {exerciseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  {exerciseDistribution.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="steps" fill="#0D47A1" name="Steps" />
                    <Bar yAxisId="right" dataKey="exercises" fill="#00BCD4" name="Exercises" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6 space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights & Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-success-green">
                  <h4 className="font-semibold text-success-green mb-2">Excellent Progress</h4>
                  <p className="text-sm text-gray-700">
                    Your stability score has improved by 7% over the past month, indicating excellent rehabilitation progress.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-medical-blue">
                  <h4 className="font-semibold text-medical-blue mb-2">Activity Goal Achievement</h4>
                  <p className="text-sm text-gray-700">
                    You've consistently exceeded your daily step goals, showing great commitment to your recovery.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-warning-orange">
                  <h4 className="font-semibold text-warning-orange mb-2">Balance Training Focus</h4>
                  <p className="text-sm text-gray-700">
                    Consider increasing balance training exercises to further improve stability scores.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-success-green">
                  <h4 className="font-semibold text-success-green mb-2">Fall Prevention</h4>
                  <p className="text-sm text-gray-700">
                    No fall incidents detected this month - your improvement in knee stability is working effectively.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recovery Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-success-green rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Month 1-2: Foundation Building</p>
                      <p className="text-sm text-gray-600">Basic strength and mobility exercises completed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-success-green rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Month 3: Stability Improvement</p>
                      <p className="text-sm text-gray-600">Balance training shows significant progress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-medical-blue rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Month 4: Advanced Training (Current)</p>
                      <p className="text-sm text-gray-600">Focus on complex movement patterns and endurance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-500">Month 5-6: Full Recovery Target</p>
                      <p className="text-sm text-gray-500">Return to normal activities and sports</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
