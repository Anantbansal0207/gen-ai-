import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Brain, BookOpen, Star } from "lucide-react";
import HighlightSection from "./HighlightSection";
import FAQComponent from "./FAQComponent";
import img3 from './assets/LumayaLogo.jpg';
import heroImage from "@/assets/hero-bg.jpg";
import aiChatMockup from "@/assets/ai-chat-mockup.jpg";
import journalMockup from "@/assets/journal-mockup.jpg";
import moodTrackerMockup from "@/assets/mood-tracker-mockup.jpg";
import Svgmair from "./Svgmair";
import SvgSecond from "./SvgSecond";
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

const Homepage = () => {
  const navigate = useNavigate();
  
  const handleStartClick = () => {
    navigate("/chat");
  };

  const handledashClick = () => {
    navigate("/dashboard");
  };
  
  
  const handleAboutClick = () => {
    navigate("/about");
  };

  const TypewriterText = ({ text, speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setDisplayedText((prev) => text.slice(0, (index % (text.length + 1))));
        setIndex((prev) => (prev + 1) % (text.length + 1));
      }, speed);
      return () => clearInterval(interval);
    }, [index, text, speed]);
    
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="typewriter-text"
      >
        {displayedText}
        <span className="cursor">|</span>
      </motion.span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Lumaya | Free AI Emotional Support Chat | Private & 24/7</title>
        <meta 
          name="description" 
          content="Talk to Lumaya, your free, private AI companion for emotional support. Always available, non-judgmental, and ready to listen when you need it most." 
        />
        <meta property="og:title" content="Lumaya | Free AI Emotional Support Chat | Private & 24/7" />
        <meta property="og:description" content="Talk to Lumaya, your free, private AI companion for emotional support. Always available, non-judgmental, and ready to listen when you need it most." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thelumaya.com" />
        <meta property="og:image" content="https://thelumaya.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="absolute inset-0 bg-gradient-serenity opacity-30"></div>
          <FloatingShapes />
          {/* Hero background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${heroImage})` }}
          ></div>
          
          <motion.div
            className="relative z-10 text-center px-8 max-w-6xl mx-auto py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-16">
              <p className="text-lg md:text-xl font-semibold text-primary mb-6 tracking-wide uppercase">
                YOUR MIND, MADE LIGHTER
              </p>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-12 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                <strong>
                  Talk. Feel Understood.<br />
                  <TypewriterText text="Grow." speed={200} />
                </strong>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed font-light mb-12">
                Your AI companion for mental clarity & emotional growth
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {[
                  "Personal Reflections",
                  "Non-Judgemental Listening", 
                  "Always Available",
                  "Thoughtful Conversations",
                  "Empathy, Not Scripts",
                  "Privacy First",
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
            
            <motion.div variants={itemVariants} className="mb-20">
              <button 
                onClick={handledashClick}
                className="text-xl px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex items-center mx-auto group"
              >
                Start your journey
                <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <p className="text-lg text-foreground/50 font-light">
                Join thousands finding peace through AI-guided wellness
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Why Section */}
        <section className="py-32 px-8 bg-gradient-to-br from-muted/20 to-background">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-8 text-foreground">
                You Deserve A Space To Feel Safe, Heard, And Understood.
              </h2>
              <p className="text-xl md:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed font-light mb-8">
                No scripts. Just empathy and reflection that feels real. Start with a calming conversation.
              </p>
              <p className="text-lg text-foreground/60 max-w-3xl mx-auto leading-relaxed mb-12">
                Feeling stuck or just need to talk? This is your space. Always here, always private — for real conversations that help you breathe a little easier.
              </p>
              
              <button 
                onClick={handleStartClick}
                className="text-lg px-10 py-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 font-semibold flex items-center mx-auto group"
              >
                Start Healing
                <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            
            <motion.div
              className="grid lg:grid-cols-2 gap-20 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="order-2 lg:order-1">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <img
                    src={aiChatMockup}
                    alt="AI Therapist Interface"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                <div className="flex items-center mb-6">
                  <Heart className="h-10 w-10 text-primary mr-4" />
                  <h3 className="text-2xl font-serif font-semibold text-primary">Always Here For You</h3>
                </div>
                <h4 className="text-3xl md:text-4xl font-serif font-semibold leading-tight text-foreground">
                  Emotional support that feels genuinely human
                </h4>
                <p className="text-xl text-foreground/70 leading-relaxed">
                  Built to feel genuinely human — it listens without rushing to fix, adds natural pauses, and responds with honesty when unsure.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Highlight Section */}
        <HighlightSection />

        {/* What Makes Us Different Section */}
        <section className="py-32 px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-20 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-8">
                  What Makes Us Different?
                </h2>
                <p className="text-xl text-foreground/70 leading-relaxed">
                  Lumaya is built to feel genuinely human — it listens without rushing to fix, adds natural pauses, and responds with honesty when unsure. Shaped by insights from psychologists and real conversations, it gently remembers your past interactions and speaks with warmth and nuance.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <img
                  src={img3}
                  alt="Lumaya Logo"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Smart Journaling Feature Section */}
        <section className="py-32 px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-20 items-center mb-32"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div className="flex items-center mb-6">
                  <BookOpen className="h-10 w-10 text-secondary mr-4" />
                  <h3 className="text-2xl font-serif font-semibold text-secondary">Smart Journaling</h3>
                </div>
                <h4 className="text-3xl md:text-4xl font-serif font-semibold leading-tight text-foreground">
                  Guided reflection for deeper insights
                </h4>
                <p className="text-xl text-foreground/70 leading-relaxed">
                  Transform your thoughts into clarity with AI-guided prompts that help you process emotions, track patterns, and celebrate growth. Your private digital sanctuary for self-discovery.
                </p>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-secondary mr-3" />
                    Personalized daily prompts
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-secondary mr-3" />
                    Mood-based writing suggestions
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-secondary mr-3" />
                    Progress tracking and insights
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <img
                  src={journalMockup}
                  alt="Smart Journaling Interface"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Growth Feature Section */}
        <section className="py-32 px-8 bg-gradient-to-r from-accent/20 to-primary/20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-20 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="order-2 lg:order-1">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <img
                    src={moodTrackerMockup}
                    alt="Mood Tracking Interface"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                <div className="flex items-center mb-6">
                  <Brain className="h-10 w-10 text-secondary mr-4" />
                  <h3 className="text-2xl font-serif font-semibold text-secondary">Emotional Growth</h3>
                </div>
                <h4 className="text-3xl md:text-4xl font-serif font-semibold leading-tight text-foreground">
                  Grow emotionally with clarity and confidence.
                </h4>
                <ul className="space-y-4 text-lg text-foreground/70">
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                    Build emotional resilience, one conversation at a time.
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                    Clarify your thoughts with kind, guided reflection.
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                    Unlock insights through mindful daily check-ins.
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                    Learn how to set healthy emotional boundaries.
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                    Reframe your self-talk for confidence & calm.
                  </li>
                </ul>
                
                <button 
                  onClick={handleStartClick}
                  className="text-lg px-8 py-4 rounded-xl bg-secondary text-background hover:bg-secondary/90 transition-all duration-300 font-semibold flex items-center group mt-8"
                >
                  Open Up
                  <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQComponent />

        {/* Footer CTA */}
       <section className="py-32 px-8 bg-gradient-serenity">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-serif font-semibold mb-8 text-foreground">
                Take the first step toward mental clarity
              </h2>
              <p className="text-2xl text-foreground/70 mb-12 leading-relaxed max-w-3xl mx-auto">
                Your journey to emotional well-being starts with a single decision.
                Let Lumaya guide you toward a more peaceful, mindful life.
              </p>
              <button 
                onClick={handleStartClick}
                className="text-xl px-16 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex items-center mx-auto group"
              >
                Begin Your Wellness Journey
                <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Homepage;