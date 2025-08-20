import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Bell, Shield, Battery, Wifi, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Device Settings
    sensitivity: [75],
    batteryAlerts: true,
    connectionAlerts: true,
    dataSync: true,
    
    // Notifications
    fallDetection: true,
    exerciseReminders: true,
    goalAchievements: true,
    emergencyContact: "+1 (555) 123-4567",
    
    // Goals
    dailySteps: 8000,
    weeklyExercises: 5,
    
    // Privacy
    dataSharing: false,
    analytics: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Setting updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleFactoryReset = () => {
    if (confirm("Are you sure you want to reset all settings to factory defaults? This action cannot be undone.")) {
      toast({
        title: "Settings reset",
        description: "All settings have been restored to factory defaults.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3" data-testid="settings-title">
          <SettingsIcon className="w-8 h-8" />
          <span>Settings</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Customize your smart knee brace preferences and system configuration.
        </p>
      </header>

      <Tabs defaultValue="device" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="device" data-testid="tab-device">Device</TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
          <TabsTrigger value="goals" data-testid="tab-goals">Goals</TabsTrigger>
          <TabsTrigger value="privacy" data-testid="tab-privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="device" className="mt-6 space-y-6">
          {/* Device Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="w-5 h-5" />
                <span>Device Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success-green rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Connection</span>
                  </div>
                  <Badge className="bg-success-green">Connected</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4 text-medical-blue" />
                    <span className="text-sm font-medium">Battery</span>
                  </div>
                  <Badge variant="secondary">78%</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Firmware</span>
                  </div>
                  <Badge variant="secondary">v2.1.3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sensitivity Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Fall Detection Sensitivity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="sensitivity">Sensitivity Level</Label>
                  <span className="text-sm text-gray-600">{settings.sensitivity[0]}%</span>
                </div>
                <Slider
                  id="sensitivity"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.sensitivity}
                  onValueChange={(value) => handleSettingChange('sensitivity', value)}
                  className="w-full"
                  data-testid="slider-sensitivity"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low (Less sensitive)</span>
                  <span>High (More sensitive)</span>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-warning-orange">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Higher sensitivity may result in more false alarms, 
                  while lower sensitivity might miss actual falls.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Device Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Device Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="battery-alerts">Battery Low Alerts</Label>
                  <p className="text-sm text-gray-600">Get notified when battery drops below 20%</p>
                </div>
                <Switch
                  id="battery-alerts"
                  checked={settings.batteryAlerts}
                  onCheckedChange={(checked) => handleSettingChange('batteryAlerts', checked)}
                  data-testid="switch-battery-alerts"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="connection-alerts">Connection Alerts</Label>
                  <p className="text-sm text-gray-600">Alert when device loses connection</p>
                </div>
                <Switch
                  id="connection-alerts"
                  checked={settings.connectionAlerts}
                  onCheckedChange={(checked) => handleSettingChange('connectionAlerts', checked)}
                  data-testid="switch-connection-alerts"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sync">Automatic Data Sync</Label>
                  <p className="text-sm text-gray-600">Sync data automatically when connected</p>
                </div>
                <Switch
                  id="data-sync"
                  checked={settings.dataSync}
                  onCheckedChange={(checked) => handleSettingChange('dataSync', checked)}
                  data-testid="switch-data-sync"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="fall-alerts">Fall Detection Alerts</Label>
                  <p className="text-sm text-gray-600">Immediate alerts for potential falls</p>
                </div>
                <Switch
                  id="fall-alerts"
                  checked={settings.fallDetection}
                  onCheckedChange={(checked) => handleSettingChange('fallDetection', checked)}
                  data-testid="switch-fall-alerts"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="exercise-reminders">Exercise Reminders</Label>
                  <p className="text-sm text-gray-600">Daily reminders for scheduled exercises</p>
                </div>
                <Switch
                  id="exercise-reminders"
                  checked={settings.exerciseReminders}
                  onCheckedChange={(checked) => handleSettingChange('exerciseReminders', checked)}
                  data-testid="switch-exercise-reminders"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="goal-achievements">Goal Achievement Notifications</Label>
                  <p className="text-sm text-gray-600">Celebrate when you reach your targets</p>
                </div>
                <Switch
                  id="goal-achievements"
                  checked={settings.goalAchievements}
                  onCheckedChange={(checked) => handleSettingChange('goalAchievements', checked)}
                  data-testid="switch-goal-achievements"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emergency-contact">Primary Emergency Contact</Label>
                <Input
                  id="emergency-contact"
                  type="tel"
                  value={settings.emergencyContact}
                  onChange={(e) => handleSettingChange('emergencyContact', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-2"
                  data-testid="input-emergency-contact"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This contact will be notified during fall detection emergencies
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily & Weekly Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="daily-steps">Daily Step Goal</Label>
                <Input
                  id="daily-steps"
                  type="number"
                  value={settings.dailySteps}
                  onChange={(e) => handleSettingChange('dailySteps', parseInt(e.target.value))}
                  className="mt-2"
                  data-testid="input-daily-steps"
                />
                <p className="text-sm text-gray-600 mt-1">Recommended: 8,000 steps per day</p>
              </div>
              
              <div>
                <Label htmlFor="weekly-exercises">Weekly Exercise Sessions</Label>
                <Select 
                  value={settings.weeklyExercises.toString()} 
                  onValueChange={(value) => handleSettingChange('weeklyExercises', parseInt(value))}
                >
                  <SelectTrigger className="mt-2" data-testid="select-weekly-exercises">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 sessions per week</SelectItem>
                    <SelectItem value="4">4 sessions per week</SelectItem>
                    <SelectItem value="5">5 sessions per week</SelectItem>
                    <SelectItem value="6">6 sessions per week</SelectItem>
                    <SelectItem value="7">7 sessions per week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing">Share Anonymous Data</Label>
                  <p className="text-sm text-gray-600">Help improve the system with anonymous usage data</p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                  data-testid="switch-data-sharing"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics">Usage Analytics</Label>
                  <p className="text-sm text-gray-600">Allow analytics to improve your experience</p>
                </div>
                <Switch
                  id="analytics"
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                  data-testid="switch-analytics"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-export-data"
              >
                Export My Data
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full text-error-red border-error-red hover:bg-red-50"
                onClick={handleFactoryReset}
                data-testid="button-factory-reset"
              >
                Factory Reset
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Factory reset will erase all data and return settings to defaults
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
