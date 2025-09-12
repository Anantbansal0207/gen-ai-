import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Shield, Heart, Lock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animation variants for this component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

function HighlightSection() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/chat");
  };

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Judgement Doesn't Live Here",
      description: "Say anything—swear, cry, be confused. Lumaya listens without judgment and gently supports you.",
      bgClass: "bg-white/20 backdrop-blur-md border-white/30",
      offset: false
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: "Real Talk. No Scripts.",
      description: "Lumaya doesn't follow a script. It speaks like someone who gets you—real, not robotic or cheesy.",
      bgClass: "bg-gradient-to-br from-secondary/20 to-accent/20 border-secondary/30",
      offset: true
    },
    {
      icon: <Lock className="h-8 w-8 text-accent" />,
      title: "Private Like a Diary Under a Pillow",
      description: "What you share stays with Lumaya. You can even ask Lumaya to forget something.",
      bgClass: "bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30",
      offset: false
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Grows With You",
      description: "Lumaya remembers your past moods and gently reminds you how far you've truly come on your journey.",
      bgClass: "bg-white/20 backdrop-blur-md border-white/30",
      offset: true
    }
  ];

  return (
    <section className="py-32 px-8 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-serenity opacity-20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Cards Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`
                p-8 rounded-2xl border backdrop-blur-sm
                hover:scale-105 transition-all duration-500
                hover:shadow-lg group cursor-pointer
                ${feature.bgClass}
                ${feature.offset ? 'md:mt-12' : ''}
              `}
              whileHover={{ y: -5 }}
            >
              {/* Icon */}
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h4 className="text-xl font-serif font-semibold mb-4 text-foreground leading-tight">
                {feature.title}
              </h4>
              
              {/* Description */}
              <p className="text-foreground/70 leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Text Content */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Intro Text */}
          <p className="text-xl md:text-2xl font-light text-primary mb-8 tracking-wide">
            Every feeling matters. Every voice counts.
            <br />
            Let your healing begin with a single message.
          </p>
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-12 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            You Deserve To Be Heard. And Understood.
          </h2>
          
          {/* CTA Button */}
          <motion.button
            onClick={handleStartClick}
            className="text-xl px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex items-center mx-auto group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start a Conversation
            <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          {/* Supporting Text */}
          <p className="text-lg text-foreground/50 font-light mt-8">
            Join thousands finding peace through meaningful conversations
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default HighlightSection