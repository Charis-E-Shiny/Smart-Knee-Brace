import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Exercise, ExerciseSession } from "@shared/schema";

const MOCK_USER_ID = "user-123";

export default function Exercises() {
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const { data: exercises, isLoading: exercisesLoading } = useQuery({
    queryKey: ["/api/exercises"],
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/exercise-sessions", MOCK_USER_ID],
  });

  const startSessionMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      const response = await apiRequest("POST", "/api/exercise-sessions", {
        userId: MOCK_USER_ID,
        exerciseId,
        status: "in_progress",
      });
      return response.json();
    },
    onSuccess: (session) => {
      setActiveSession(session.id);
      queryClient.invalidateQueries({ queryKey: ["/api/exercise-sessions"] });
      toast({
        title: "Exercise started",
        description: "Your exercise session has begun.",
      });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async ({ sessionId, sets, reps }: { sessionId: string; sets: number; reps: number }) => {
      const response = await apiRequest("PATCH", `/api/exercise-sessions/${sessionId}`, {
        completedSets: sets,
        completedReps: reps,
        status: "completed",
        endTime: new Date(),
      });
      return response.json();
    },
    onSuccess: () => {
      setActiveSession(null);
      queryClient.invalidateQueries({ queryKey: ["/api/exercise-sessions"] });
      toast({
        title: "Exercise completed",
        description: "Great job! Keep up the good work.",
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

  const getExerciseProgress = (exercise: Exercise) => {
    const session = getSessionForExercise(exercise.id);
    if (!session) return 0;
    
    const setsProgress = (session.completedSets / exercise.targetSets) * 50;
    const repsProgress = session.status === "completed" ? 50 : 0;
    return Math.min(setsProgress + repsProgress, 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'bg-medical-blue';
      case 'flexibility': return 'bg-medical-teal';
      case 'balance': return 'bg-success-green';
      default: return 'bg-gray-500';
    }
  };

  if (exercisesLoading || sessionsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900" data-testid="exercises-title">
          Exercise Program
        </h1>
        <p className="text-gray-600 mt-2">
          Complete your daily rehabilitation exercises to improve knee strength and mobility.
        </p>
      </header>

      <div className="grid gap-6">
        {exercises?.map((exercise: Exercise) => {
          const session = getSessionForExercise(exercise.id);
          const progress = getExerciseProgress(exercise);
          const isActive = activeSession === session?.id;
          const isCompleted = session?.status === "completed";

          return (
            <Card key={exercise.id} className="overflow-hidden" data-testid={`exercise-card-${exercise.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${getCategoryColor(exercise.category)} rounded-full flex items-center justify-center text-white font-semibold`}>
                      {exercise.category === 'strength' && '💪'}
                      {exercise.category === 'flexibility' && '🤸'}
                      {exercise.category === 'balance' && '⚖️'}
                    </div>
                    <div>
                      <CardTitle className="text-xl" data-testid={`exercise-name-${exercise.id}`}>
                        {exercise.name}
                      </CardTitle>
                      <p className="text-gray-600" data-testid={`exercise-description-${exercise.id}`}>
                        {exercise.description}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={isCompleted ? "default" : "secondary"}
                    className={isCompleted ? "bg-success-green" : ""}
                    data-testid={`exercise-status-${exercise.id}`}
                  >
                    {isCompleted ? "Completed" : isActive ? "In Progress" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Sets:</span>
                    <span className="font-medium">{session?.completedSets || 0}/{exercise.targetSets}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Reps:</span>
                    <span className="font-medium">{session?.completedReps || 0}/{exercise.targetReps}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{exercise.estimatedMinutes} min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" data-testid={`exercise-progress-${exercise.id}`} />
                </div>

                <div className="flex justify-end">
                  {isCompleted ? (
                    <Button 
                      disabled 
                      className="bg-success-green hover:bg-success-green"
                      data-testid={`button-completed-${exercise.id}`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </Button>
                  ) : isActive ? (
                    <Button
                      onClick={() => completeSessionMutation.mutate({
                        sessionId: session!.id,
                        sets: exercise.targetSets,
                        reps: exercise.targetReps,
                      })}
                      disabled={completeSessionMutation.isPending}
                      className="bg-success-green hover:bg-green-600"
                      data-testid={`button-complete-${exercise.id}`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Exercise
                    </Button>
                  ) : (
                    <Button
                      onClick={() => startSessionMutation.mutate(exercise.id)}
                      disabled={startSessionMutation.isPending}
                      className="bg-medical-blue hover:bg-blue-700"
                      data-testid={`button-start-${exercise.id}`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Exercise
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
