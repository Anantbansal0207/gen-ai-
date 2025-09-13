"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { 
  Brain, 
  BookOpen, 
  Heart, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  MessageCircle,
  Target,
  Sun,
  Moon,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const [moodValue, setMoodValue] = useState([7]);
  const [isAITyping, setIsAITyping] = useState(true);
  
  const userName = "Alex";
  const currentStreak = 12;
  const weeklyGoal = 5;
  const completedJournals = 3;
  
  const moodEmojis = ["😢", "😞", "😐", "🙂", "😊", "😄", "🤩", "✨", "🌟", "🎉"];
  
  setTimeout(() => setIsAITyping(false), 2000);

  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="relative">
        <FloatingShapes />
        
        <div className="relative z-10 max-w-7xl mx-auto p-6">
          {/* Welcome Hero */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-serenity rounded-2xl p-8 text-primary-foreground">
              <h1 className="text-display mb-2">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {userName}! 
                {new Date().getHours() < 12 ? <Sun className="inline ml-2 h-6 w-6" /> : <Moon className="inline ml-2 h-6 w-6" />}
              </h1>
              <p className="text-subheading opacity-90">
                How are you feeling today? Let's check in with your mind and heart.
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mood Logging Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center mb-4">
                    <Heart className="h-6 w-6 text-accent mr-3" />
                    <h3 className="text-heading">How are you feeling?</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-6xl mb-2 animate-float">
                        {moodEmojis[moodValue[0] - 1]}
                      </div>
                      <p className="text-subheading">
                        {moodValue[0] <= 3 ? "Having a tough time" : 
                         moodValue[0] <= 5 ? "Feeling okay" : 
                         moodValue[0] <= 7 ? "Pretty good" : 
                         "Feeling amazing!"}
                      </p>
                    </div>
                    
                    <div className="px-4">
                      <Slider
                        value={moodValue}
                        onValueChange={setMoodValue}
                        max={10}
                        min={1}
                        step={1}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-caption">
                        <span>Struggling</span>
                        <span>Balanced</span>
                        <span>Thriving</span>
                      </div>
                    </div>
                    
                    <Button className="w-full rounded-xl">
                      Log Today's Mood
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Journal Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <BookOpen className="h-6 w-6 text-secondary mr-3" />
                      <h3 className="text-heading">Today's Reflection</h3>
                    </div>
                    <Link to="/journal">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        View All
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="bg-muted/50 rounded-xl p-4 mb-4">
                    <p className="text-body text-muted-foreground italic mb-2">
                      "What brought you joy today, and how can you carry that feeling forward?"
                    </p>
                    <p className="text-caption">Today's Prompt</p>
                  </div>
                  
                  <Link to="/journal">
                    <Button className="w-full rounded-xl bg-secondary hover:bg-secondary/90">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Writing
                    </Button>
                  </Link>
                </GlassCard>
              </motion.div>

              {/* Quick Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-primary mr-3" />
                      <h3 className="text-heading">Your Progress</h3>
                    </div>
                    <Link to="/insights">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        View Insights
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {currentStreak}
                      </div>
                      <p className="text-caption">Day Streak</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary mb-1">
                        {Math.round((completedJournals / weeklyGoal) * 100)}%
                      </div>
                      <p className="text-caption">Weekly Goal</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Weekly Journaling Goal</span>
                      <span>{completedJournals}/{weeklyGoal}</span>
                    </div>
                    <Progress value={(completedJournals / weeklyGoal) * 100} className="h-2" />
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Right Column - AI Companion */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <GlassCard className="p-6 h-[600px] flex flex-col">
                  <div className="flex items-center mb-4">
                    <Brain className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-heading">AI Companion</h3>
                    <div className="ml-auto w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto">
                    <div className="bg-primary/10 rounded-2xl p-4">
                      <p className="text-body">
                        Hello {userName}! I've noticed you've been maintaining a wonderful journaling streak. 
                        How has this consistency been affecting your overall well-being?
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-2xl p-4 ml-8">
                      <p className="text-body">
                        It's been really helpful actually. I feel more aware of my thoughts and emotions.
                      </p>
                    </div>
                    
                    {isAITyping ? (
                      <div className="bg-primary/10 rounded-2xl p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-caption">AI is typing...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-primary/10 rounded-2xl p-4">
                        <p className="text-body">
                          That's wonderful to hear! Self-awareness is a cornerstone of emotional well-being. 
                          Would you like to explore any specific emotions or situations that have been on your mind lately?
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-border/50 pt-4">
                    <Button className="w-full rounded-xl" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Continue Conversation
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

export default Dashboard;