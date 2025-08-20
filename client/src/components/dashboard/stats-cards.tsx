import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { SensorData } from "@shared/schema";

interface StatsCardsProps {
  sensorData?: SensorData;
  isLoading: boolean;
  userId: string;
}

export default function StatsCards({ sensorData, isLoading, userId }: StatsCardsProps) {
  const { data: dailyStats } = useQuery({
    queryKey: ["/api/stats", userId],
  });

  const { data: exerciseSessions } = useQuery({
    queryKey: ["/api/exercise-sessions", userId],
  });

  const { data: fallDetections } = useQuery({
    queryKey: ["/api/falls", userId],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const todayStats = dailyStats?.[0];
  const yesterdayStats = dailyStats?.[1];
  
  const todaySteps = todayStats?.totalSteps || 8247;
  const yesterdaySteps = yesterdayStats?.totalSteps || 7350;
  const stepIncrease = yesterdaySteps > 0 ? 
    Math.round(((todaySteps - yesterdaySteps) / yesterdaySteps) * 100) : 12;

  const todayExerciseMinutes = todayStats?.exerciseMinutes || 45;
  const exerciseGoal = 45;
  const exerciseAchieved = todayExerciseMinutes >= exerciseGoal;

  const todayFalls = todayStats?.fallCount || 0;
  const stabilityScore = Math.round(sensorData?.stabilityScore || 92);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Steps Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Daily Steps</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="daily-steps">
                {todaySteps.toLocaleString()}
              </p>
              <p className={`text-sm mt-1 flex items-center ${stepIncrease >= 0 ? 'text-success-green' : 'text-error-red'}`}>
                {stepIncrease >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span data-testid="step-increase">
                  {Math.abs(stepIncrease)}% from yesterday
                </span>
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              👟
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Time Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Exercise Time</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="exercise-time">
                {todayExerciseMinutes} min
              </p>
              <p className="text-success-green text-sm mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                <span data-testid="exercise-status">
                  {exerciseAchieved ? "Target achieved" : `${exerciseGoal - todayExerciseMinutes} min to goal`}
                </span>
              </p>
            </div>
            <div className="bg-teal-50 p-3 rounded-full">
              🏋️
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fall Detection Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Fall Alerts</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="fall-alerts">
                {todayFalls}
              </p>
              <p className="text-success-green text-sm mt-1 flex items-center">
                <span className="text-success-green mr-1">✓</span>
                <span data-testid="fall-status">
                  {todayFalls === 0 ? "No incidents today" : `${todayFalls} incident${todayFalls > 1 ? 's' : ''} today`}
                </span>
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              🛡️
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knee Stability Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stability Score</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="stability-score">
                {stabilityScore}%
              </p>
              <p className="text-success-green text-sm mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                <span data-testid="stability-trend">
                  {stabilityScore >= 90 ? "Excellent" : stabilityScore >= 75 ? "Good" : "Improving"}
                </span>
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-full">
              📈
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
