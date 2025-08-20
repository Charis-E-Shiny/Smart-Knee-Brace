import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { useState } from "react";

interface ChartsProps {
  userId: string;
}

// Mock data for charts
const stepData = [
  { day: 'Mon', steps: 7200, goal: 8000 },
  { day: 'Tue', steps: 8100, goal: 8000 },
  { day: 'Wed', steps: 6800, goal: 8000 },
  { day: 'Thu', steps: 9200, goal: 8000 },
  { day: 'Fri', steps: 7500, goal: 8000 },
  { day: 'Sat', steps: 8900, goal: 8000 },
  { day: 'Sun', steps: 8247, goal: 8000 },
];

const movementData = [
  { subject: 'Flexion', current: 85, target: 95 },
  { subject: 'Extension', current: 92, target: 95 },
  { subject: 'Stability', current: 78, target: 90 },
  { subject: 'Strength', current: 88, target: 95 },
  { subject: 'Mobility', current: 82, target: 90 },
  { subject: 'Balance', current: 90, target: 95 },
];

export default function Charts({ userId }: ChartsProps) {
  const [stepTimeRange, setStepTimeRange] = useState("7");
  const [movementView, setMovementView] = useState("flexion");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Step Activity Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle data-testid="step-chart-title">Step Activity</CardTitle>
            <Select value={stepTimeRange} onValueChange={setStepTimeRange}>
              <SelectTrigger className="w-32" data-testid="select-step-timerange">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value.toLocaleString(), 
                    name === 'steps' ? 'Steps' : 'Goal'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#0D47A1" 
                  strokeWidth={3}
                  dot={{ fill: "#0D47A1", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#0D47A1", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="goal" 
                  stroke="#4CAF50" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ fill: "#4CAF50", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Movement Pattern Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle data-testid="movement-chart-title">Movement Patterns</CardTitle>
            <div className="flex space-x-2">
              <Button 
                size="sm"
                variant={movementView === "flexion" ? "default" : "outline"}
                onClick={() => setMovementView("flexion")}
                className={movementView === "flexion" ? "bg-medical-blue" : ""}
                data-testid="button-flexion"
              >
                Flexion
              </Button>
              <Button 
                size="sm"
                variant={movementView === "extension" ? "default" : "outline"}
                onClick={() => setMovementView("extension")}
                className={movementView === "extension" ? "bg-medical-blue" : ""}
                data-testid="button-extension"
              >
                Extension
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={movementData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={false}
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#00BCD4"
                  fill="#00BCD4"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#4CAF50"
                  fill="#4CAF50"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Legend />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value}%`, 
                    name === 'current' ? 'Current Score' : 'Target Score'
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
