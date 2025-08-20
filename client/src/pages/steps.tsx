import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Target, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useState } from "react";

const MOCK_USER_ID = "user-123";

// Mock data for different time periods
const generateStepData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date,
      steps: Math.floor(Math.random() * 5000) + 5000, // 5000-10000 steps
      goal: 8000,
    });
  }
  
  return data;
};

export default function Steps() {
  const [activeTab, setActiveTab] = useState("daily");
  
  const { data: dailyStats, isLoading } = useQuery({
    queryKey: ["/api/stats", MOCK_USER_ID],
  });

  const { data: sensorData } = useQuery({
    queryKey: ["/api/sensor", MOCK_USER_ID],
  });

  // Generate mock data for visualization
  const weeklyData = generateStepData(7);
  const monthlyData = generateStepData(30);
  const yearlyData = generateStepData(365);

  const getCurrentData = () => {
    switch (activeTab) {
      case "weekly": return weeklyData;
      case "monthly": return monthlyData;
      case "yearly": return yearlyData;
      default: return weeklyData;
    }
  };

  const todaySteps = weeklyData[weeklyData.length - 1]?.steps || 0;
  const yesterdaySteps = weeklyData[weeklyData.length - 2]?.steps || 0;
  const stepIncrease = todaySteps > yesterdaySteps ? 
    Math.round(((todaySteps - yesterdaySteps) / yesterdaySteps) * 100) : 0;

  const weekTotal = weeklyData.reduce((sum, day) => sum + day.steps, 0);
  const weekAverage = Math.round(weekTotal / weeklyData.length);
  const goalAchievedDays = weeklyData.filter(day => day.steps >= day.goal).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900" data-testid="steps-title">
          Step Counter
        </h1>
        <p className="text-gray-600 mt-2">
          Track your daily activity and monitor your progress towards your step goals.
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Steps</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="today-steps">
                  {todaySteps.toLocaleString()}
                </p>
                <p className="text-success-green text-sm mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  {stepIncrease}% from yesterday
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                👟
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Week Average</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="week-average">
                  {weekAverage.toLocaleString()}
                </p>
                <p className="text-medical-blue text-sm mt-1">
                  <Target className="w-4 h-4 inline mr-1" />
                  Goal: 8,000 steps
                </p>
              </div>
              <div className="bg-teal-50 p-3 rounded-full">
                📊
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Goals Achieved</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="goals-achieved">
                  {goalAchievedDays}/7
                </p>
                <p className="text-success-green text-sm mt-1">
                  <Award className="w-4 h-4 inline mr-1" />
                  This week
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                🏆
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Step Activity</span>
            </CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="daily" data-testid="tab-daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" data-testid="tab-monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === "daily" ? (
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value: number) => [value.toLocaleString(), "Steps"]}
                  />
                  <Bar dataKey="steps" fill="#0D47A1" />
                  <Bar dataKey="goal" fill="#4CAF50" opacity={0.3} />
                </BarChart>
              ) : (
                <LineChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value: number) => [value.toLocaleString(), "Steps"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="#0D47A1" 
                    strokeWidth={2}
                    dot={{ fill: "#0D47A1" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="goal" 
                    stroke="#4CAF50" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={{ fill: "#4CAF50" }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.slice(-7).reverse().map((day, index) => (
              <div key={day.date} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center text-white font-semibold">
                    {index === 0 ? "T" : index === 1 ? "Y" : day.date.slice(-1)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {index === 0 ? "Today" : index === 1 ? "Yesterday" : day.date}
                    </p>
                    <p className="text-sm text-gray-600">
                      {day.fullDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900" data-testid={`steps-${index}`}>
                    {day.steps.toLocaleString()}
                  </span>
                  <Badge 
                    variant={day.steps >= day.goal ? "default" : "secondary"}
                    className={day.steps >= day.goal ? "bg-success-green" : ""}
                    data-testid={`goal-status-${index}`}
                  >
                    {day.steps >= day.goal ? "Goal Met" : "Below Goal"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
