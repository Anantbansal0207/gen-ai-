"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Textarea } from "@/components/ui/textarea";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { 
  BookOpen, 
  Calendar, 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Clock,
  User,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const mockEntries = [
  {
    id: 1,
    date: "Today",
    title: "Morning Reflections",
    excerpt: "Started the day with meditation and felt a sense of calm wash over me...",
    time: "9:30 AM",
    mood: "😊"
  },
  {
    id: 2,
    date: "Yesterday",
    title: "Gratitude Practice",
    excerpt: "Three things I'm grateful for today: my morning coffee, the supportive text from Sarah...",
    time: "7:45 PM",
    mood: "🙏"
  },
  {
    id: 3,
    date: "2 days ago",
    title: "Processing Anxiety",
    excerpt: "Had a challenging moment at work today. The presentation didn't go as planned...",
    time: "6:20 PM",
    mood: "😟"
  },
  {
    id: 4,
    date: "3 days ago",
    title: "Weekend Reflections",
    excerpt: "Spent quality time with family. These moments remind me what truly matters...",
    time: "8:15 PM",
    mood: "❤️"
  }
];

const Journal = () => {
  const [newEntry, setNewEntry] = useState("");
  const [isWriting, setIsWriting] = useState(false);

  const todaysPrompt = "What emotions did you experience today, and what might have triggered them?";

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
              <BookOpen className="h-8 w-8 text-secondary mr-3" />
              Your Journal
            </h1>
            <p className="text-subheading text-muted-foreground">
              A safe space for your thoughts, feelings, and reflections
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Writing Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* New Entry */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-heading">New Entry</h3>
                    <div className="flex items-center text-caption text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>

                  {/* Today's Prompt */}
                  <div className="bg-gradient-peaceful rounded-xl p-4 mb-4">
                    <div className="flex items-start">
                      <Sparkles className="h-5 w-5 text-secondary mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-body font-medium text-secondary-foreground mb-1">
                          Today's Prompt
                        </p>
                        <p className="text-body text-secondary-foreground/80 italic">
                          "{todaysPrompt}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Textarea
                      placeholder="Start writing your thoughts here... Let your mind flow freely."
                      value={newEntry}
                      onChange={(e) => setNewEntry(e.target.value)}
                      onFocus={() => setIsWriting(true)}
                      className="min-h-[200px] border-0 bg-muted/30 rounded-xl resize-none text-body leading-relaxed font-serif"
                    />
                    
                    {isWriting && (
                      <motion.div
                        className="flex justify-between"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl"
                          onClick={() => {
                            setIsWriting(false);
                            setNewEntry("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="rounded-xl bg-secondary hover:bg-secondary/90"
                          disabled={newEntry.trim().length === 0}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Save Entry
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Recent Entries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-heading">Recent Entries</h3>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Plus className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <GlassCard className="p-4 hover:shadow-medium transition-smooth cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{entry.mood}</span>
                            <div>
                              <h4 className="font-semibold text-card-foreground">
                                {entry.title}
                              </h4>
                              <div className="flex items-center text-caption text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {entry.date} • {entry.time}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-body text-muted-foreground line-clamp-2">
                          {entry.excerpt}
                        </p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Writing Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 text-primary mr-2" />
                    Writing Tips
                  </h3>
                  <div className="space-y-3 text-body">
                    <p>• Write without judgment - let your thoughts flow naturally</p>
                    <p>• Include specific emotions and what triggered them</p>
                    <p>• Note what you're grateful for</p>
                    <p>• Reflect on lessons learned</p>
                    <p>• Set intentions for tomorrow</p>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Weekly Streak */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-4">Writing Streak</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">12</div>
                    <p className="text-body text-muted-foreground">Days in a row</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This week</span>
                      <span>5/7 days</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-serenity h-2 rounded-full transition-all duration-500" 
                        style={{ width: '71%' }}
                      ></div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Mood Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-heading mb-4">This Week's Moods</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {["😊", "🙏", "😟", "❤️", "😄", "😐", "✨"].map((emoji, index) => (
                      <div 
                        key={index}
                        className="text-2xl text-center p-2 rounded-lg bg-muted/30"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <p className="text-caption text-muted-foreground mt-3 text-center">
                    Overall: Positive trend this week! 📈
                  </p>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;