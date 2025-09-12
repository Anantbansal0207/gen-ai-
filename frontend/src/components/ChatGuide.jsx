import React from "react";
import { Brain, Heart, Shield, Zap, Lock, TrendingUp, Sprout, ArrowRight, Target, MessageCircle, Compass, User, Settings, Eye, Lightbulb, CheckCircle, ChevronRight } from "lucide-react"
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FloatingShapes } from "@/components/ui/floating-shapes";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const ChatGuidePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Chat Guide | How to Talk with Lumaya for Supportive Conversations</title>
        <meta
          name="description"
          content="New to Lumaya? This guide shows you how to start conversations, get emotional support, and use features like memory and privacy controls for a better experience."
        />
        <meta property="og:title" content="Chat Guide | How to Talk with Lumaya for Supportive Conversations" />
        <meta property="og:description" content="New to Lumaya? This guide shows you how to start conversations, get emotional support, and use features like memory and privacy controls for a better experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thelumaya.com/chat-guide" />
        <meta property="og:image" content="https://thelumaya.com/images/chat-guide-cover.png" />
        <link rel="canonical" href="https://thelumaya.com/chat-guide" />
      </Helmet>

      <div className="min-h-screen bg-background relative">
        {/* Floating Background Shapes - Removed from here since they're only in specific sections */}

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
          <FloatingShapes/>
          <div className="absolute inset-0 bg-gradient-serenity opacity-30"></div>
          
          <motion.div
            className="relative z-10 text-center px-8 max-w-6xl mx-auto py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-full mb-8 border border-primary/30">
                <Compass className="w-10 h-10 text-primary" />
              </div>
              
              <p className="text-lg md:text-xl font-semibold text-primary mb-6 tracking-wide uppercase">
                YOUR WELLNESS JOURNEY STARTS HERE
              </p>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-12 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                Chat Guide
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed font-light mb-12">
                Getting the Most Out of Your Wellness Companion
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {[
                  "Safe Space",
                  "Your Pace", 
                  "Personalized",
                  "Always Private"
                ].map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-foreground/80 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Welcome Section */}
        <section className="py-32 px-8 bg-gradient-to-br from-muted/20 to-background">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="glass rounded-3xl p-8 lg:p-12 text-center border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/20 backdrop-blur-sm rounded-full mb-8 border border-secondary/30">
                <Heart className="w-10 h-10 text-secondary" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-8 text-foreground">
                Welcome!
              </h2>
              
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed">
                This space is designed to support your{" "}
                <span className="font-semibold text-primary">mental clarity</span>,{" "}
                <span className="font-semibold text-secondary">emotional wellness</span>, and{" "}
                <span className="font-semibold text-accent">daily reflections</span>{" "}
                — all in a safe and private environment.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Step 1: Start with You */}
        <section className="py-32 px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-20 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-full mb-8 border border-primary/30">
                  <User className="w-10 h-10 text-primary" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-8">
                  1. Start with You
                </h2>
                
                <p className="text-xl text-foreground/70 leading-relaxed mb-6">
                  In the beginning, your digital companion is learning about you — your tone, your preferences, and the kinds of thoughts or emotions you're sharing.
                </p>
                
                <div className="bg-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
                  <p className="text-lg font-medium text-foreground flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    The more relevant and honest information you share, the more helpful and personalized the responses will be.
                  </p>
                </div>
              </div>
              
              <div className="glass rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-6">
                  Feel free to talk about:
                </h3>
                
                <div className="space-y-4">
                  {[
                    "What's on your mind today",
                    "Your past experiences, emotions, or patterns", 
                    "Specific situations, stressors, or goals",
                    "What kind of support you expect (comfort, perspective, motivation, etc.)"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                      </div>
                      <p className="text-foreground/70 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Steps 2 & 3 */}
        <section className="py-32 px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="glass rounded-2xl p-8 border border-white/20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 backdrop-blur-sm rounded-full mb-6 border border-secondary/30">
                  <Settings className="w-8 h-8 text-secondary" />
                </div>
                
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-6">
                  2. You're in Control
                </h3>
                
                <p className="text-lg text-foreground/70 leading-relaxed mb-4">
                  There's no script. You can:
                </p>
                
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    Share a thought, rant, or question
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    Ask for tools (breathing exercises, journaling prompts, mindset shifts)
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    Check in daily or occasionally — your pace is up to you
                  </li>
                </ul>
              </div>

              <div className="glass rounded-2xl p-8 border border-white/20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 backdrop-blur-sm rounded-full mb-6 border border-accent/30">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-6">
                  3. No Judgment. Ever.
                </h3>
                
                <p className="text-lg text-foreground/70 leading-relaxed">
                  This space is private, secure, and non-judgmental. Whatever you share stays encrypted and cannot be viewed by anyone — not even us. It's here only to help the system remember context and make future interactions smoother.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Helpful Tips Section */}
        <section className="py-32 px-8 bg-gradient-to-r from-accent/10 to-primary/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 backdrop-blur-sm rounded-full mb-8 border border-accent/30">
                <Lightbulb className="w-10 h-10 text-accent" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6">
                4. Helpful Tips
              </h2>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Target,
                  title: "Be Specific",
                  description: 'Try "I feel drained when I wake up" vs. "I\'m tired" — specificity helps create better, more targeted responses.',
                  color: "primary"
                },
                {
                  icon: TrendingUp,
                  title: "Reflect on Patterns", 
                  description: "Share what helps or hurts in your daily routine — patterns create insights for better support.",
                  color: "secondary"
                },
                {
                  icon: MessageCircle,
                  title: "Use It Your Way",
                  description: "Think of it like a journal, sounding board, or wellness check-in — whatever feels right for you.",
                  color: "accent"
                }
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  className="glass rounded-2xl p-8 border border-white/20"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${tip.color}/20 backdrop-blur-sm rounded-full mb-6 border border-${tip.color}/30`}>
                    <tip.icon className={`w-6 h-6 text-${tip.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                    {tip.title}
                  </h3>
                  
                  <p className="text-foreground/70 leading-relaxed">
                    {tip.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Always Optional Section */}
        <section className="py-32 px-8 bg-background">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-full mb-8 border border-primary/30">
                <Eye className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-12">
                5. Always Optional
              </h2>
              
              <div className="glass rounded-3xl p-12 border-2 border-primary/20">
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed mb-8">
                  Share as much or as little as you're comfortable with. You can stop, pause, or delete your data any time.
                </p>
                
                <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
                
                <p className="text-lg font-medium text-foreground/60">
                  Your comfort and privacy always come first.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ready to Begin Section */}
        <section className="py-32 px-8 bg-gradient-serenity">
        <FloatingShapes/>
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30">
                <Sprout className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-8">
                Ready to Begin?
              </h2>
              
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-12 max-w-3xl mx-auto">
                Just say hi, or tell it something you've been thinking about lately.
              </p>
              
              <motion.button
                onClick={() => navigate('/chat')}
                className="text-xl px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-primary hover:bg-white/90 font-semibold flex items-center mx-auto group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
                <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ChatGuidePage