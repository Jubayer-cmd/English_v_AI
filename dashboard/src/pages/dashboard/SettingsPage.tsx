import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  Palette,
  Mic,
  Volume2,
  Globe,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Settings</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@Engla.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    defaultValue="••••••••"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Voice Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mic className="w-5 h-5" />
                <span>Voice Settings</span>
              </CardTitle>
              <CardDescription>
                Configure your voice recording preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice">Voice</Label>
                  <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                    <option>Default</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speed">Speed</Label>
                  <Input
                    id="speed"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    defaultValue="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pitch">Pitch</Label>
                  <Input
                    id="pitch"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    defaultValue="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume</Label>
                  <Input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recording Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about scheduled recordings
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Role</span>
                <Badge variant="secondary">Admin</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Member Since</span>
                <span className="text-sm font-medium">Jan 2024</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Language & Region
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Volume2 className="w-4 h-4 mr-2" />
                Audio Settings
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
              <Button variant="outline" className="w-full text-destructive">
                Export Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
