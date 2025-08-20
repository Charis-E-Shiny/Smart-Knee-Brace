import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play, Clock } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Exercise, ExerciseSession } from "@shared/schema";

interface ExercisePlanProps {
  userId: string;
}

export default function ExercisePlan({ userId }: ExercisePlanProps) {
  const { toast } = useToast();

  const { data: exercises, isLoading: exercisesLoading } = useQuery({
    queryKey: ["/api/exercises"],
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/exercise-sessions", userId],
  });

  const startSessionMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      const response = await apiRequest("POST", "/api/exercise-sessions", {
        userId,
        exerciseId,
        status: "in_progress",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercise-sessions"] });
      toast({
        title: "Exercise started",
        description: "Your exercise session has begun.",
      });
    },
  });

  const getTodaySessions = () => {
    if (!sessions) return [];
    const today = new Date().toDateString();
    return sessions.filter((session: ExerciseSession) => 
      new Date(session.startTime).toDateString() === today
    );
  };

  const getSessionForExercise = (exerciseId: string) => {
    return getTodaySessions().find((session: ExerciseSession) => 
      session.exerciseId === exerciseId
    );
  };

  if (exercisesLoading || sessionsLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Today's Exercise Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle data-testid="exercise-plan-title">Today's Exercise Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exercises?.slice(0, 3).map((exercise: Exercise, index: number) => {
            const session = getSessionForExercise(exercise.id);
            const isCompleted = session?.status === "completed";
            const isInProgress = session?.status === "in_progress";

            return (
              <div 
                key={exercise.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                data-testid={`exercise-plan-item-${exercise.id}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? "bg-success-green" 
                      : isInProgress 
                        ? "bg-medical-blue" 
                        : "bg-gray-300"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`font-medium ${
                        isInProgress ? "text-white" : "text-gray-600"
                      }`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900" data-testid={`exercise-name-${exercise.id}`}>
                      {exercise.name}
                    </h4>
                    <p className="text-sm text-gray-600" data-testid={`exercise-description-${exercise.id}`}>
                      {exercise.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {isCompleted ? (
                    <div>
                      <p className="text-success-green font-medium" data-testid={`exercise-status-${exercise.id}`}>
                        Completed
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {exercise.estimatedMinutes} minutes
                      </p>
                    </div>
                  ) : isInProgress ? (
                    <div>
                      <p className="text-medical-blue font-medium">In Progress</p>
                      <p className="text-sm text-gray-600">
                        {exercise.estimatedMinutes} minutes
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => startSessionMutation.mutate(exercise.id)}
                        disabled={startSessionMutation.isPending}
                        className="bg-medical-blue hover:bg-blue-700"
                        size="sm"
                        data-testid={`button-start-exercise-${exercise.id}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Exercise
                      </Button>
                      <p className="text-sm text-gray-600 mt-1">
                        {exercise.estimatedMinutes} minutes
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
