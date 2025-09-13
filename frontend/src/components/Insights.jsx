"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { 
  TrendingUp, 
  Calendar, 
  ArrowLeft, 
  Brain, 
  Heart, 
  Target,
  Award,
  Lightbulb,
  User,
  BarChart3,
  Clock,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const mockInsights = [
  {
    title: "Your Emotional Patterns",
    insight: "You tend to feel most positive on weekends and Wednesday evenings. Consider what activities during these times contribute to your well-being.",
    type: "pattern",
    confidence: 85
  },
  {
    title: "Stress Triggers",
    insight: "Monday mornings and work deadlines appear to be your primary stress triggers. Try implementing a Sunday evening preparation routine.",
    type: "trigger",
    confidence: 92
  },
  {
    title: "Growth Opportunity",
    insight: "Your journal entries show increasing self-awareness over time. You're developing a stronger emotional vocabulary.",
    type: "growth",
    confidence: 78
  }
];

const moodData = [
  { day: "Mon", mood: 6, entries: 1 },
  { day: "Tue", mood: 7, entries: 1 },
  { day: "Wed", mood: 8, entries: 2 },
  { day: "Thu", mood: 5, entries: 1 },
  { day: "Fri", mood: 7, entries: 1 },
  { day: "Sat", mood: 9, entries: 2 },
  { day: "Sun", mood: 8, entries: 1 }
];

const Insights = () => {
  const avgMood = moodData.reduce((acc, day) => acc + day.mood, 0) / moodData.length;
  const totalEntries = moodData.reduce((acc, day) => acc + day.entries, 0);

  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="relative">
        <FloatingShapes />
        
        <div className="relative z-10 max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-primary mr-3" />
              Your Insights
            </h1>
            <p className="text-subheading text-muted-foreground">
              Discover patterns, track progress, and unlock deeper self-understanding
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {avgMood.toFixed(1)}
              </div>
              <p className="text-caption text-muted-foreground">Average Mood</p>
              <div className="text-xs text-primary mt-1">This Week</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {totalEntries}
              </div>
              <p className="text-caption text-muted-foreground">Journal Entries</p>
              <div className="text-xs text-secondary mt-1">7 Days</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                12
              </div>
              <p className="text-caption text-muted-foreground">Day Streak</p>
              <div className="text-xs text-accent mt-1">Personal Best</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                89%
              </div>
              <p className="text-caption text-muted-foreground">Wellness Score</p>
              <div className="text-xs text-primary mt-1">↗ +5% this week</div>
            </GlassCard>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Charts and Analysis */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mood Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-heading flex items-center">
                      <BarChart3 className="h-5 w-5 text-primary mr-2" />
                      Weekly Mood Trends
                    </h3>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Calendar className="h-4 w-4 mr-1" />
                      This Week
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {moodData.map((day, index) => (
                      <div key={day.day} className="flex items-center space-x-4">
                        <div className="w-12 text-sm font-medium">{day.day}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                              <motion.div 
                                className="h-full bg-gradient-serenity rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${day.mood * 10}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                              />
                            </div>
                            <div className="w-8 text-sm font-medium">{day.mood}/10</div>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {day.entries} entries
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-calm rounded-xl">
                    <p className="text-body text-primary-foreground">
                      <strong>Observation:</strong> Your mood peaks on weekends and dips mid-week. 
                      Consider planning more restorative activities for Thursday and Friday.
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-6 flex items-center">
                    <Brain className="h-5 w-5 text-primary mr-2" />
                    AI-Generated Insights
                  </h3>
                  
                  <div className="space-y-4">
                    {mockInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        className="border-l-4 border-primary/30 pl-4 py-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-card-foreground flex items-center">
                            {insight.type === 'pattern' && <Heart className="h-4 w-4 text-accent mr-2" />}
                            {insight.type === 'trigger' && <Target className="h-4 w-4 text-destructive mr-2" />}
                            {insight.type === 'growth' && <Award className="h-4 w-4 text-primary mr-2" />}
                            {insight.title}
                          </h4>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-body text-muted-foreground">
                          {insight.insight}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Progress Tracking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-6 flex items-center">
                    <Target className="h-5 w-5 text-secondary mr-2" />
                    Goal Progress
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Daily Journaling</span>
                        <span>5/7 days this week</span>
                      </div>
                      <Progress value={71} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Great consistency! Just 2 more days to hit your weekly goal.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Mood Awareness</span>
                        <span>12 day streak</span>
                      </div>
                      <Progress value={100} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Amazing! You're building a strong mindfulness habit.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Emotional Vocabulary</span>
                        <span>47 unique emotions identified</span>
                      </div>
                      <Progress value={64} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Your emotional awareness is expanding beautifully.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Right Column - Recommendations */}
            <div className="space-y-6">
              {/* Personal Recommendations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 text-accent mr-2" />
                    Recommendations
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-warm rounded-xl p-4">
                      <h4 className="font-semibold text-accent-foreground mb-2">
                        Tuesday Boost
                      </h4>
                      <p className="text-sm text-accent-foreground/80">
                        Try scheduling something you enjoy on Tuesday afternoons to break up your week.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-peaceful rounded-xl p-4">
                      <h4 className="font-semibold text-secondary-foreground mb-2">
                        Weekend Wisdom
                      </h4>
                      <p className="text-sm text-secondary-foreground/80">
                        Reflect on what makes your weekends special and incorporate those elements into weekdays.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-calm rounded-xl p-4">
                      <h4 className="font-semibold text-primary-foreground mb-2">
                        Mindful Moments
                      </h4>
                      <p className="text-sm text-primary-foreground/80">
                        Consider adding brief mindfulness breaks during your busy periods.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-4 flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    Recent Achievements
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-muted/30 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-serenity rounded-full flex items-center justify-center mr-3">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Consistency Master</p>
                        <p className="text-xs text-muted-foreground">12 days of mood tracking</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-muted/30 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-peaceful rounded-full flex items-center justify-center mr-3">
                        <Heart className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Self-Awareness Growth</p>
                        <p className="text-xs text-muted-foreground">Emotional vocabulary expanded</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-muted/30 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center mr-3">
                        <Brain className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Mindful Writer</p>
                        <p className="text-xs text-muted-foreground">Weekly journaling goal met</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-4">Continue Your Journey</h3>
                  
                  <div className="space-y-3">
                    <Link to="/journal">
                      <Button className="w-full rounded-xl justify-start" variant="outline">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Write Today's Entry
                      </Button>
                    </Link>
                    
                    <Link to="/dashboard">
                      <Button className="w-full rounded-xl justify-start" variant="outline">
                        <Heart className="h-4 w-4 mr-2" />
                        Log Current Mood
                      </Button>
                    </Link>
                    
                    <Button className="w-full rounded-xl justify-start" variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
                      Chat with AI Companion
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

export default Insights;