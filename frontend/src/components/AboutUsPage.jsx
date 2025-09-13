import React from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Heart, 
  Shield, 
  Zap, 
  Lock, 
  TrendingUp, 
  Sprout, 
  ChevronRight, 
  Target, 
  MessageCircle,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { FloatingShapes } from "@/components/ui/floating-shapes";

// Animation variants matching Homepage
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

const AboutUsPage = () => {
  const navigate = useNavigate();
  
  const handleStartClick = () => {
    navigate("/chat");
  };

  return (
    <>
      <Helmet>
        <title>About Lumaya | AI Emotional Support That Feels Human</title>
        <meta name="description" content="Learn how Lumaya was created to offer real emotional support through AI. Our mission is to build trust, empathy, and a safe space for honest conversations." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="About Lumaya | AI Emotional Support That Feels Human" />
        <meta property="og:description" content="Discover Lumaya's mission to make emotional wellness more accessible. Our AI companion listens with empathy, offering secure, private support." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thelumaya.com/about" />
        <meta property="og:image" content="https://thelumaya.com/assets/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Lumaya | AI Emotional Support That Feels Human" />
        <meta name="twitter:description" content="Discover how Lumaya uses AI to offer empathetic support, privacy-first conversations, and a judgment-free zone." />
        <meta name="twitter:image" content="https://thelumaya.com/assets/og-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="absolute inset-0 bg-gradient-serenity opacity-30"></div>
          <FloatingShapes />
          
          <motion.div
            className="relative z-10 text-center px-8 max-w-6xl mx-auto py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-16">
              <p className="text-lg md:text-xl font-semibold text-primary mb-6 tracking-wide uppercase">
                ABOUT OUR MISSION
              </p>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-12 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                About Us
              </h1>
              
              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {[
                  "Mental Wellness",
                  "Accessible Support", 
                  "Judgment-Free",
                  "Privacy First",
                  "Empathetic AI",
                  "Always Available"
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

        {/* Mission Section */}
        <section className="py-32 px-8 bg-gradient-to-br from-muted/20 to-background">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-8">
                <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
                  <Heart className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-8 text-foreground">
                Our Mission
              </h2>
            </motion.div>
            
            <motion.div
              className="bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed text-center">
                We're a small, passionate team on a mission to make mental wellness more accessible, relatable, and
                judgment-free — especially for those who may not feel ready (or able) to seek traditional therapy. Our
                platform acts as a <span className="font-semibold text-primary">digital wellness companion</span>,
                designed to bridge the gap between silence and support. It's a space where you can think out loud, reflect
                on your emotions, and get gentle guidance — anytime, anywhere.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why We Built This Section */}
        <section className="py-32 px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-20 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div className="flex items-center mb-6">
                  <MessageCircle className="h-10 w-10 text-secondary mr-4" />
                  <h3 className="text-2xl font-serif font-semibold text-secondary">Why We Built This</h3>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-8">
                  Emotional support shouldn't feel robotic
                </h2>
                <div className="space-y-6">
                  <p className="text-xl text-foreground/70 leading-relaxed">
                    In a world where stress, overthinking, and emotional overwhelm have become daily struggles, many
                    people are turning to tech for relief — but most tools feel robotic, generic, or transactional.
                  </p>
                  <p className="text-xl text-foreground/70 leading-relaxed">
                    We wanted to change that. So, we created a system that listens better, responds with empathy, and
                    improves the more you engage with it — without ever compromising your privacy.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-accent/20">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-2">Not Robotic</h4>
                      <p className="text-foreground/70">Genuine, empathetic responses that feel human</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-primary/20">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-2">Personalized</h4>
                      <p className="text-foreground/70">Tailored to your unique needs and journey</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-secondary/20">
                      <Lock className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-2">Private</h4>
                      <p className="text-foreground/70">Your data stays completely secure and encrypted</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-8">
                <div className="p-4 rounded-full bg-secondary/10 border border-secondary/20">
                  <Brain className="h-12 w-12 text-secondary" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-8">
                How It Works
              </h2>
            </motion.div>
            
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-primary/20">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-4 text-center">
                  Advanced Understanding
                </h3>
                <p className="text-lg text-foreground/70 leading-relaxed text-center">
                  Behind the scenes, your companion uses advanced language models trained to understand patterns in how we
                  think and feel.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-secondary/20">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-4 text-center">
                  Privacy First
                </h3>
                <p className="text-lg text-foreground/70 leading-relaxed text-center">
                  The more context you give it, the more personal and helpful it becomes — while always keeping your data
                  encrypted and invisible to any human eyes.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-8">
                What Makes Us Different
              </h2>
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
                Three pillars that set us apart in the world of digital wellness
              </p>
            </motion.div>
            
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center hover:scale-105 transition-all duration-500">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-primary/20">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                  Empathetic Responses
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  Unlike generic tools, our system responds with genuine empathy and understanding, making every
                  interaction feel meaningful.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center hover:scale-105 transition-all duration-500">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-secondary/20">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                  Complete Privacy
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  Your conversations are encrypted and never seen by human eyes. Your privacy is sacred, and we protect it
                  at all costs.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center hover:scale-105 transition-all duration-500">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-accent/20">
                    <TrendingUp className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                  Adaptive Learning
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  The more you engage, the better we understand and support your unique journey towards mental wellness.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Belief Section */}
        <section className="py-32 px-8 bg-gradient-to-br from-accent/20 to-primary/20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-8">
                <div className="p-4 rounded-full bg-accent/10 border border-accent/20">
                  <Sprout className="h-12 w-12 text-accent" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-12">
                Our Belief
              </h2>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
                <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-8">
                  Everyone deserves a safe space to unpack their mind. Whether you're feeling stuck, burnt out, overwhelmed,
                  or just need to vent — we're here to support you in becoming more grounded and self-aware.
                </p>
                
                <div className="h-1 w-24 bg-primary mx-auto mb-8 rounded-full"></div>
                
                <blockquote className="text-xl md:text-2xl font-medium italic text-primary leading-relaxed">
                  "Thank you for trusting us with your thoughts. We're honored to be a small part of your journey."
                </blockquote>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8 bg-gradient-serenity">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-serif font-semibold mb-8 text-foreground">
                Ready to Start Your Journey?
              </h2>
              <p className="text-2xl text-foreground/70 mb-12 leading-relaxed max-w-3xl mx-auto">
                Take the first step towards better mental wellness. Your companion is ready to listen, understand, and
                support you.
              </p>
              <button 
                onClick={handleStartClick}
                className="text-xl px-16 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex items-center mx-auto group"
              >
                Start Talking
                <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUsPage;