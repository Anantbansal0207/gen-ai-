"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { 
  User, 
  ArrowLeft, 
  Settings, 
  Bell, 
  Moon, 
  Sun,
  Palette,
  Shield,
  Download,
  Trash2,
  Edit3,
  Camera,
  Mail,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Profile = () => {
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyInsights: true,
    moodCheckins: false,
    achievements: true
  });
  
  const [theme, setTheme] = useState('serenity');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com", 
    phone: "+1 (555) 123-4567",
    joinDate: "March 15, 2024"
  });

  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="relative">
        <FloatingShapes />
        
        <div className="relative z-10 max-w-6xl mx-auto p-6">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display mb-4 flex items-center justify-center">
              <Settings className="h-8 w-8 text-primary mr-3" />
              Profile & Settings
            </h1>
            <p className="text-subheading text-muted-foreground">
              Customize your wellness journey and manage your account
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-heading">Profile Information</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      {isEditing ? 'Save' : 'Edit'}
                    </Button>
                  </div>

                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-serenity rounded-full flex items-center justify-center mr-6">
                        <User className="h-10 w-10 text-primary-foreground" />
                      </div>
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        variant="outline"
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    </div>
                    <div>
                      <h4 className="text-heading mb-1">{profileData.name}</h4>
                      <p className="text-caption text-muted-foreground">
                        Member since {profileData.joinDate}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium mb-2 block flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium mb-2 block flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Notification Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-6 flex items-center">
                    <Bell className="h-5 w-5 text-primary mr-2" />
                    Notification Preferences
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="daily-reminder" className="font-medium">
                          Daily Journal Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get gentle reminders to reflect on your day
                        </p>
                      </div>
                      <Switch
                        id="daily-reminder"
                        checked={notifications.dailyReminder}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, dailyReminder: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-insights" className="font-medium">
                          Weekly Insights
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive AI-generated insights about your emotional patterns
                        </p>
                      </div>
                      <Switch
                        id="weekly-insights"
                        checked={notifications.weeklyInsights}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, weeklyInsights: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="mood-checkins" className="font-medium">
                          Mood Check-ins
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Periodic prompts to log your current emotional state
                        </p>
                      </div>
                      <Switch
                        id="mood-checkins"
                        checked={notifications.moodCheckins}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, moodCheckins: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="achievements" className="font-medium">
                          Achievement Celebrations
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you reach wellness milestones
                        </p>
                      </div>
                      <Switch
                        id="achievements"
                        checked={notifications.achievements}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, achievements: checked})
                        }
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Data & Privacy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-6 flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    Data & Privacy
                  </h3>
                  
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full rounded-xl justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Your Data
                    </Button>
                    
                    <Button variant="outline" className="w-full rounded-xl justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Privacy Settings
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl justify-start text-destructive border-destructive/20 hover:bg-destructive/5"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Theme Settings */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-4 flex items-center">
                    <Palette className="h-5 w-5 text-primary mr-2" />
                    Theme
                  </h3>
                  
                  <div className="space-y-3">
                    <div 
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        theme === 'light' ? 'ring-2 ring-primary' : 'hover:bg-muted/30'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 text-yellow-500 mr-3" />
                        <div>
                          <p className="font-medium">Light</p>
                          <p className="text-xs text-muted-foreground">Clean and bright interface</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        theme === 'dark' ? 'ring-2 ring-primary' : 'hover:bg-muted/30'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">Dark</p>
                          <p className="text-xs text-muted-foreground">Easy on the eyes for evening use</p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        theme === 'serenity' ? 'ring-2 ring-primary' : 'hover:bg-muted/30'
                      }`}
                      onClick={() => setTheme('serenity')}
                    >
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gradient-serenity rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">Serenity Gradient</p>
                          <p className="text-xs text-muted-foreground">Calming pastels for wellness</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Account Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-4">Account Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Journal Entries</span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Days Active</span>
                      <span className="font-medium">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Longest Streak</span>
                      <span className="font-medium">12 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Insights Generated</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">AI Conversations</span>
                      <span className="font-medium">15</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full rounded-xl justify-start">
                        Return to Dashboard
                      </Button>
                    </Link>
                    
                    <Button variant="outline" className="w-full rounded-xl justify-start">
                      Contact Support
                    </Button>
                    
                    <Button variant="outline" className="w-full rounded-xl justify-start">
                      Share Feedback
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;