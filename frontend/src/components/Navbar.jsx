import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  MessageCircle,
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  User,
  LogOut,
  ChevronRight,
  Home
} from "lucide-react";
import logo from "../assets/LumayaLogo.png";

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    setMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Navigation items that are always visible
  const publicNavigationItems = [
    { label: 'Home', path: '/', icon: Home },
  ];

  // Navigation items only for authenticated users
  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Journal', path: '/journal', icon: BookOpen },
    { label: 'Insights', path: '/insights', icon: TrendingUp },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Enhanced Styling to match footer */}
      <style jsx>{`
        .enhanced-navbar {
          background: linear-gradient(135deg, 
            hsl(250 50% 8% / 0.95) 0%, 
            hsl(150 30% 12% / 0.95) 40%, 
            hsl(340 40% 15% / 0.95) 100%
          );
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .enhanced-navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at 30% 50%, 
            rgba(139, 92, 246, 0.1) 0%, 
            transparent 50%
          ),
          radial-gradient(
            circle at 70% 50%, 
            rgba(20, 184, 166, 0.08) 0%, 
            transparent 50%
          );
          pointer-events: none;
        }
        
        .navbar-container {
          position: relative;
          z-index: 1;
        }
        
        .enhanced-brand-title {
          background: linear-gradient(135deg, 
            hsl(250 50% 70%), 
            hsl(150 30% 60%), 
            hsl(340 40% 70%)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Playfair Display', serif;
        }
        
        .enhanced-logo {
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
        }
        
        .enhanced-logo:hover {
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
        }
        
        .nav-link-enhanced {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 500;
        }
        
        .nav-link-enhanced:hover {
          color: white;
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        
        .chat-button-enhanced {
          background: linear-gradient(135deg, 
            hsl(250 50% 50%), 
            hsl(150 30% 40%), 
            hsl(340 40% 45%)
          );
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);
        }
        
        .chat-button-enhanced:hover {
          background: linear-gradient(135deg, 
            hsl(250 50% 60%), 
            hsl(150 30% 50%), 
            hsl(340 40% 55%)
          );
          transform: translateY(-1px);
          box-shadow: 0 6px 25px rgba(139, 92, 246, 0.3);
        }
        
        .get-started-enhanced {
          background: linear-gradient(135deg, 
            hsl(250 50% 50%), 
            hsl(150 30% 40%), 
            hsl(340 40% 45%)
          );
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);
        }
        
        .get-started-enhanced:hover {
          background: linear-gradient(135deg, 
            hsl(250 50% 60%), 
            hsl(150 30% 50%), 
            hsl(340 40% 55%)
          );
          transform: translateY(-1px);
          box-shadow: 0 6px 25px rgba(139, 92, 246, 0.3);
        }
        
        .login-button-enhanced {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .login-button-enhanced:hover {
          color: white;
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .logout-button-enhanced {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.05);
        }
        
        .logout-button-enhanced:hover {
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .mobile-menu-enhanced {
          background: linear-gradient(135deg, 
            hsl(250 50% 8% / 0.98) 0%, 
            hsl(150 30% 12% / 0.98) 40%, 
            hsl(340 40% 15% / 0.98) 100%
          );
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .mobile-menu-button {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .mobile-menu-button:hover {
          color: white;
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <motion.nav
        className="enhanced-navbar sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="navbar-container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={handleLogoClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <img
                  src={logo}
                  alt="Lumaya Logo"
                  className="enhanced-logo h-10 w-10 rounded-lg transition-all duration-300"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="enhanced-brand-title text-2xl font-bold">
                LUMAYA
              </span>
            </motion.div>

            {/* Desktop Navigation */}

            <div className=" md:flex items-center gap-2">
              {/* Navigation Links */}

              {user && (
                <>
                  <button
                    style={{
                      backgroundColor: "#f8b404",
                      color: "#fff",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "100px",
                      fontWeight: "bold",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/chat")}
                  >
                    Chat
                  </button>

                  <button
                    style={{
                      backgroundColor: "#667eea", // different color for distinction
                      color: "#fff",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "100px",
                      fontWeight: "bold",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/selfspace")}
                  >
                    Self Space
                  </button>
                </>
              )}



              {/* Action Buttons */}
              {user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleNavClick('/chat')}
                    className="chat-button-enhanced flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 group"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="logout-button-enhanced flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleNavClick('/auth')}
                    className="get-started-enhanced px-8 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="mobile-menu-button md:hidden p-2 rounded-lg transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mobile-menu-enhanced md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-2 border-t border-white/10">
                  {/* Mobile Navigation Links */}
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNavClick(item.path)}
                      className="nav-link-enhanced flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all duration-300"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}

                  {/* Chat button for authenticated users */}
                  {user && (
                    <div className="border-t border-white/10 pt-2 mt-4">
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => handleNavClick('/chat')}
                        className="chat-button-enhanced flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold mb-2"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>Chat</span>
                      </motion.button>
                    </div>
                  )}

                  {/* Authentication Buttons */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: user ? 0.5 : 0.1 }}
                  >
                    {user ? (
                      <button
                        onClick={handleLogout}
                        className="logout-button-enhanced flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all duration-300"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavClick('/login')}
                          className="login-button-enhanced flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium mb-2 transition-all duration-300"
                        >
                          <span>Login</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('/auth')}
                          className="get-started-enhanced flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          <span>Get Started</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;