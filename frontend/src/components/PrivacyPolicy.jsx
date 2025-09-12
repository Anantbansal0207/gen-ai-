import React from "react";
import { Shield, Lock, Heart, Eye, Trash2, Users, Mail, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Lumaya - Your Privacy is Sacred</title>
        <meta name="description" content="Learn how Lumaya protects your privacy with end-to-end encryption, zero human access, and complete data control. Your mental wellness conversations stay private." />
        <meta property="og:title" content="Privacy Policy | Lumaya - Your Privacy is Sacred" />
        <meta property="og:description" content="Learn how Lumaya protects your privacy with end-to-end encryption, zero human access, and complete data control." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://thelumaya.com/privacy-policy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
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
                YOUR PRIVACY MATTERS
              </p>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-12 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                Privacy Policy
              </h1>
              
              {/* Privacy Badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[
                  "End-to-End Encrypted",
                  "No Human Access",
                  "Your Data, Your Control"
                ].map((badge, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-foreground/80 border border-white/20"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              
              <p className="text-lg text-foreground/60 font-light">
                Effective Date: June 15, 2025
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Our Promise Section */}
        <section className="py-32 px-8 bg-gradient-to-br from-muted/20 to-background">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/20 backdrop-blur-sm rounded-full mb-8 border border-secondary/30">
                <Heart className="w-10 h-10 text-secondary" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-8 text-foreground">
                Our Promise to You
              </h2>
            </motion.div>

            <motion.div
              className="glass rounded-3xl p-8 lg:p-12 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed text-center">
                Thank you for trusting us with your thoughts and choosing our digital wellness companion. We value your privacy and are deeply committed to protecting your personal information. This Privacy Policy explains how your data is collected, used, and safeguarded when you interact with our platform — because your{" "}
                <span className="font-semibold text-primary">privacy is sacred</span>, and we protect it at all costs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="py-32 px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 backdrop-blur-sm rounded-full mb-8 border border-accent/30">
                <FileText className="w-10 h-10 text-accent" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6">
                Information We Collect
              </h2>
              
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
                We collect only what's necessary to provide you with the best possible experience
              </p>
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
                  icon: Mail,
                  title: "Basic Account Details",
                  description: "Such as your email address, used for login and communication purposes only.",
                  color: "primary"
                },
                {
                  icon: Users,
                  title: "Usage Information",
                  description: "This includes interaction patterns, feature usage, and conversation inputs to improve response accuracy and personalization.",
                  color: "secondary"
                },
                {
                  icon: Shield,
                  title: "Device Data",
                  description: "Information like device type, browser, and session duration, used to enhance performance and user experience.",
                  color: "accent"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="glass rounded-2xl p-8 border border-white/20"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${item.color}/20 backdrop-blur-sm rounded-full mb-6 border border-${item.color}/30`}>
                    <item.icon className={`w-6 h-6 text-${item.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="py-32 px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-full mb-8 border border-primary/30">
                <ArrowRight className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground">
                How Your Information Is Used
              </h2>
            </motion.div>

            <motion.div
              className="glass rounded-3xl p-8 lg:p-12 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8 mb-8">
                {[
                  {
                    icon: Heart,
                    title: "Personalize Your Experience",
                    description: "Enhance your mental wellness journey with tailored responses and support"
                  },
                  {
                    icon: Shield,
                    title: "Improve System Performance",
                    description: "Enhance learning capabilities and response accuracy over time"
                  },
                  {
                    icon: FileText,
                    title: "Ensure Service Reliability",
                    description: "Maintain platform stability and provide technical support when needed"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-lg text-foreground/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-accent/10 backdrop-blur-sm rounded-2xl p-6 border border-accent/20">
                <p className="text-lg font-medium text-foreground">
                  <strong>Important:</strong> All interaction data is end-to-end encrypted and stored securely. This information is never visible to any individual, including our internal team. It is used only to maintain context during your sessions.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Data Security */}
        <section className="py-32 px-8 bg-gradient-to-r from-accent/10 to-primary/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-full mb-8 border border-primary/30">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-6">
                Data Security & Confidentiality
              </h2>
              
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
                Your privacy is sacred — here's how we protect it
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-8 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Shield,
                  title: "Military-Grade Encryption",
                  description: "All user data is encrypted both in transit and at rest using industry-standard security protocols."
                },
                {
                  icon: Eye,
                  title: "Zero Human Access",
                  description: "No human can view or access user messages or session data directly. Your conversations remain completely private."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="glass rounded-2xl p-8 border border-white/20"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 backdrop-blur-sm rounded-full mb-6 border border-secondary/30">
                    <item.icon className="w-8 h-8 text-secondary" />
                  </div>
                  
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-lg text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="glass rounded-2xl p-8 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    Restricted Access
                  </h3>
                  <p className="text-lg text-foreground/70 leading-relaxed">
                    Access is strictly restricted and monitored only for essential system maintenance or legal compliance (if ever required by law).
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Data Retention & Children's Privacy */}
        <section className="py-32 px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Trash2,
                  title: "Data Retention",
                  content: [
                    "Your conversation data is stored temporarily to preserve context across sessions, making your experience more personalized and meaningful.",
                    "If you choose to delete your data or account, all associated information will be permanently removed from our systems within 30 days."
                  ]
                },
                {
                  icon: Users,
                  title: "Children's Privacy",
                  content: [
                    "Our platform is designed for individuals aged 13 and above. We do not knowingly collect personal information from children under 13.",
                    "If we become aware that we have collected information from a child under 13, we will take immediate steps to delete such information."
                  ]
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="glass rounded-2xl p-8 border border-white/20"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-full mb-6 border border-primary/30">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-3xl font-serif font-semibold text-foreground mb-6">
                    {item.title}
                  </h3>
                  
                  <div className="space-y-6">
                    {item.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-lg text-foreground/70 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Policy Changes & Contact */}
        <section className="py-32 px-8 bg-gradient-to-r from-secondary/10 to-accent/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/20 backdrop-blur-sm rounded-full mb-8 border border-secondary/30">
                  <FileText className="w-10 h-10 text-secondary" />
                </div>
                
                <h2 className="text-4xl font-serif font-semibold text-foreground mb-8">
                  Changes to This Policy
                </h2>
                
                <div className="space-y-6">
                  <p className="text-lg text-foreground/70 leading-relaxed">
                    We may update this policy as our services evolve and improve. When we make significant changes, we'll notify you through the platform or via email.
                  </p>
                  <p className="text-lg text-foreground/70 leading-relaxed">
                    We encourage you to review this policy periodically to stay informed about how we're protecting your information.
                  </p>
                </div>
              </div>

              <motion.div
                className="glass rounded-2xl p-8 border border-white/20"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 backdrop-blur-sm rounded-full mb-8 border border-accent/30">
                  <Mail className="w-10 h-10 text-accent" />
                </div>
                
                <h3 className="text-3xl font-serif font-semibold text-foreground mb-6">
                  Contact Us
                </h3>
                
                <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                  If you have any questions about this Privacy Policy or how we handle your data, we're here to help.
                </p>
                
                <div className="bg-accent/10 backdrop-blur-sm rounded-2xl p-4 border border-accent/20">
                  <p className="text-lg font-medium text-foreground">
                    📧 <span className="text-accent font-semibold">thelumaya@gmail.com</span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Closing Message */}
        <section className="py-32 px-8 bg-gradient-serenity relative overflow-hidden">
          <FloatingShapes />
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              className="glass rounded-3xl p-12 lg:p-16 text-center border-2 border-white/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30">
                <Heart className="w-10 h-10 text-white" />
              </div>
              
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
                Your trust means everything to us. We're committed to maintaining the highest standards of privacy and security because everyone deserves a safe space to unpack their mind.
              </p>
              
              <div className="w-24 h-1 bg-white/60 mx-auto mb-8 rounded-full"></div>
              
              <blockquote className="text-xl md:text-2xl font-medium italic text-white/80">
                "Your privacy is sacred, and we protect it at all costs."
              </blockquote>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default PrivacyPolicyPage