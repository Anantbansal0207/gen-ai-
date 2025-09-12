import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Shield, BookOpen, Mail, ChevronRight } from "lucide-react";
import logo from "../assets/LumayaLogo.png";
import "./Footer.css"; // Keep your existing CSS file

const Footer = () => {
  const navigate = useNavigate();
  
  // Keep your EXACT original navigation function
  const handleNavigation = (path) => {
    console.log(`Attempting to navigate to: ${path}`);
    try {
      navigate(path);
      window.scrollTo(0, 0);
      console.log(`Navigation to ${path} called successfully`);
    } catch (error) {
      console.error(`Navigation error:`, error);
    }
  };

  const navigationItems = [
    { label: 'About Us', path: '/about', icon: Heart },
    { label: 'Privacy Policy', path: '/privacy', icon: Shield },
    { label: 'Chat Guide', path: '/chat-guide', icon: BookOpen }
  ];

  return (
    <>
      {/* Enhanced Styling - Add to your existing Footer.css */}
      <style jsx>{`
        .enhanced-footer {
          background: linear-gradient(135deg, 
            hsl(250 50% 8%) 0%, 
            hsl(150 30% 12%) 40%, 
            hsl(340 40% 15%) 100%
          );
          position: relative;
          overflow: hidden;
          padding: 4rem 2rem;
        }
        
        .enhanced-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at 30% 20%, 
            rgba(139, 92, 246, 0.1) 0%, 
            transparent 50%
          ),
          radial-gradient(
            circle at 70% 80%, 
            rgba(20, 184, 166, 0.08) 0%, 
            transparent 50%
          );
          pointer-events: none;
        }
        
        .footer-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }
        }
        
        .enhanced-footer-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        @media (max-width: 768px) {
          .enhanced-footer-brand {
            align-items: center;
          }
        }
        
        .brand-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .enhanced-footer-logo {
          width: 48px;
          height: 48px;
          margin-right: 1rem;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
        }
        
        .enhanced-brand-title {
          font-size: 2rem;
          font-weight: bold;
          font-family: 'Playfair Display', serif;
          background: linear-gradient(135deg, 
            hsl(250 50% 70%), 
            hsl(150 30% 60%), 
            hsl(340 40% 70%)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }
        
        .enhanced-brand-tagline {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.025em;
        }
        
        .enhanced-contact-section h4 {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          font-family: 'Playfair Display', serif;
        }
        
        .contact-info {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          font-size: 1rem;
        }
        
        .contact-icon {
          width: 18px;
          height: 18px;
          margin-right: 0.75rem;
          color: hsl(250 50% 70%);
        }
        
        .navigation-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-end;
        }
        
        @media (max-width: 768px) {
          .navigation-links {
            align-items: center;
          }
        }
        
        .nav-link {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 500;
          width: fit-content;
        }
        
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          transform: translateX(4px);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .nav-icon {
          width: 16px;
          height: 16px;
          margin-right: 0.75rem;
          color: hsl(250 50% 70%);
        }
        
        .nav-arrow {
          width: 14px;
          height: 14px;
          margin-left: 0.5rem;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover .nav-arrow {
          opacity: 1;
          transform: translateX(2px);
        }
        
        .footer-divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2) 50%,
            transparent
          );
          margin: 2rem 0;
        }
        
        .enhanced-footer-bottom {
          text-align: center;
          position: relative;
        }
        
        .enhanced-footer-title {
          font-size: 2.5rem;
          font-weight: bold;
          font-family: 'Playfair Display', serif;
          background: linear-gradient(135deg, 
            hsl(250 50% 40%), 
            hsl(150 30% 35%), 
            hsl(340 40% 40%)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          opacity: 0.6;
          letter-spacing: 0.1em;
        }
        
        @media (max-width: 768px) {
          .enhanced-footer-title {
            font-size: 2rem;
          }
        }
        
        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }
        
        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.1), 
            rgba(20, 184, 166, 0.1)
          );
          animation: float 8s ease-in-out infinite;
        }
        
        .floating-shape:nth-child(1) {
          width: 120px;
          height: 120px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-shape:nth-child(2) {
          width: 80px;
          height: 80px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }
        
        .floating-shape:nth-child(3) {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>

      <footer className="enhanced-footer">
        {/* Floating background elements */}
        <div className="floating-elements">
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
        </div>

        <div className="footer-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="footer-content"
          >
            {/* Brand Section - Enhanced version of your original */}
            <div className="enhanced-footer-brand">
              <div className="brand-header">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ width: '48px' }}
                  src={logo}
                  alt="Lumaya Logo"
                  className="enhanced-footer-logo"
                />
                <h2 className="enhanced-brand-title">Lumaya</h2>
              </div>
              <p className="enhanced-brand-tagline">Your mind, made lighter.</p>
              
              {/* Enhanced email contact */}
              <div className="contact-info">
                <Mail className="contact-icon" />
                <span>support@lumaya.com</span>
              </div>
            </div>

            {/* Navigation Section - Enhanced version of your original links */}
            <div className="enhanced-contact-section">
            
              <div className="navigation-links">
                  <h4>Stay Connected</h4>
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className="nav-link"
                      onClick={() => handleNavigation(item.path)}
                    >
                      <item.icon className="nav-icon" />
                      <span>{item.label}</span>
                      <ChevronRight className="nav-arrow" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="footer-divider"></div>

          {/* Bottom Section - Enhanced version of your original */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="enhanced-footer-bottom"
          >
            <h1 className="enhanced-footer-title animate-gradient">LUMAYA</h1>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;