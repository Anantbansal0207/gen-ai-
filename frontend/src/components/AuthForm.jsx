import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Lock, Phone, Mail, KeyRound, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import imgpodcasting from '../assets/Podcasting.png';
import { supabase } from "../utils/supabase1";
import { useLocation } from "react-router-dom";

// Import the backend services and utilities
import { signInWithGoogle, initiateSignUp, completeSignUp, signIn, initiatePasswordReset, completePasswordReset, handleGoogleAuthCallback } from '../services/authService';
import { useToast } from '../hooks/useToast';
import { validateEmail } from '../utils/validation';
import { FloatingShapes } from "@/components/ui/floating-shapes";



const AuthForm = ({ onAuthSuccess }) => {
  const [currentMode, setCurrentMode] = useState("signin"); // signin, signup, forgot, reset, verify
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [authProcessed, setAuthProcessed] = useState(false);
  
  // Loading states for different actions
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();

  // Token detection useEffect (keeping original backend logic)
  useEffect(() => {
    // Check if we're in password recovery mode (set by App.jsx)
    const isPasswordRecovery = sessionStorage.getItem('isPasswordRecovery');
    const recoveryToken = sessionStorage.getItem('recoveryToken');
    
    // Check if App.jsx passed reset mode via navigation state
    const navigationState = location.state;
    
    console.log('AuthForm initialization:', { 
      isPasswordRecovery: !!isPasswordRecovery,
      recoveryToken: !!recoveryToken,
      navigationState 
    });

    if (isPasswordRecovery && recoveryToken) {
      console.log('Setting up password reset mode from App.jsx');
      setResetToken(recoveryToken);
      setCurrentMode('reset');
    } else if (navigationState?.mode === 'reset' && navigationState?.token) {
      console.log('Setting up password reset mode from navigation state');
      setResetToken(navigationState.token);
      setCurrentMode('reset');
      sessionStorage.setItem('recoveryToken', navigationState.token);
      sessionStorage.setItem('isPasswordRecovery', 'true');
    }
  }, []); // Only run once on mount

  // All the original backend functions remain unchanged
  const handleGoogleSignIn = async () => {
    if (isGoogleLoading || isLoading) return;
    
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // The actual redirect and success handling will be done by the redirect
    } catch (error) {
      console.error('Google sign in error:', error);
      showError('Failed to initiate Google sign in');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isLoading || isGoogleLoading) return;

    // Validation for email (except reset mode)
    if (!validateEmail(email) && currentMode !== 'reset') {
      showError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      switch (currentMode) {
        case "signin":
          if (!password || password.length < 6) {
            showError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
          }
          const { user } = await signIn(email, password);
          showSuccess('Successfully signed in!');
          if (onAuthSuccess) {
            onAuthSuccess(user);
          }
          break;

        case "signup":
          if (!password || password.length < 6) {
            showError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
          }
          if (password !== confirmPassword) {
            showError('Passwords do not match');
            setIsLoading(false);
            return;
          }
          await initiateSignUp(email, password, phoneNumber);
          showSuccess('Verification code sent to your email');
          setCurrentMode("verify");
          break;

        case "forgot":
          await initiatePasswordReset(email);
          showSuccess('Password reset instructions sent to your email. Please check your email and click the reset link.');
          break;

        case "reset":
          if (!newPassword || newPassword.length < 6) {
            showError('New password must be at least 6 characters');
            setIsLoading(false);
            return;
          }
          if (newPassword !== confirmNewPassword) {
            showError('Passwords do not match');
            setIsLoading(false);
            return;
          }
          if (!resetToken) {
            showError('Invalid reset token. Please use the link from your email.');
            setIsLoading(false);
            return;
          }
          
          try {
            await completePasswordReset(newPassword);
            showSuccess('Password reset successful! You can now sign in with your new password.');
            
            // Clear all tokens and storage
            sessionStorage.removeItem('recoveryToken');
            sessionStorage.removeItem('isPasswordRecovery');
            
            // Sign out the recovery session
            await supabase.auth.signOut();
            
            // Switch to sign in mode
            setCurrentMode("signin");
            resetForm();
            
            // Navigate to clean auth page
            navigate('/auth', { replace: true });
          } catch (error) {
            showError(error.message || 'Failed to reset password');
          }
          break;

        case "verify":
          if (!verificationCode) {
            showError('Please enter the verification code');
            setIsLoading(false);
            return;
          }
          const signUpData = await completeSignUp(email, verificationCode);
          showSuccess('Email verified and account created!');
          if (onAuthSuccess) {
            onAuthSuccess(signUpData.user);
          }
          setCurrentMode("signin");
          resetForm();
          break;

        default:
          break;
      }
    } catch (error) {
      showError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowPassword(false);
    setResetToken("");
    setIsLoading(false);
    setIsGoogleLoading(false);
  };

  const switchMode = (mode) => {
    // Prevent mode switching while loading
    if (isLoading || isGoogleLoading) return;
    
    setCurrentMode(mode);
    if (mode === "signin" || mode === "signup") {
      resetForm();
    }
  };

  const handleBackToSignIn = () => {
    if (isLoading || isGoogleLoading) return;
    
    setCurrentMode('signin');
    setResetToken('');
    
    // Clear all recovery-related storage
    sessionStorage.removeItem('recoveryToken');
    sessionStorage.removeItem('isPasswordRecovery');
    
    // Sign out any recovery session
    supabase.auth.signOut();
    
    // Clear the reset token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    resetForm();
  };

  const getTitle = () => {
    switch (currentMode) {
      case "signin": return "Welcome Back";
      case "signup": return "Create Account";
      case "forgot": return "Forgot Password";
      case "reset": return "Reset Password";
      case "verify": return "Verify Account";
      default: return "Welcome Back";
    }
  };

  const getSubtitle = () => {
    switch (currentMode) {
      case "signin": return "Welcome back! Please enter your details.";
      case "signup": return "Please fill in your details to create an account.";
      case "forgot": return "Enter your email to receive reset instructions.";
      case "reset": return "Enter your new password to complete the reset process.";
      case "verify": return "Enter the verification code sent to your email.";
      default: return "Welcome back! Please enter your details.";
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      switch (currentMode) {
        case "signin": return "Signing In...";
        case "signup": return "Creating Account...";
        case "forgot": return "Sending Instructions...";
        case "reset": return "Resetting Password...";
        case "verify": return "Verifying...";
        default: return "Loading...";
      }
    }
    
    switch (currentMode) {
      case "signin": return "Sign In";
      case "signup": return "Sign Up";
      case "forgot": return "Send Reset Instructions";
      case "reset": return "Reset Password";
      case "verify": return "Verify Account";
      default: return "Submit";
    }
  };

  const renderGoogleButton = () => {
    // Only show Google button for signin and signup modes
    if (currentMode !== "signin" && currentMode !== "signup") {
      return null;
    }

    return (
      <div className="mt-6">
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/10 backdrop-blur-sm text-white/70 rounded-full">or</span>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className="w-full mt-4 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white/90 font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}
        </motion.button>
      </div>
    );
  };

  const renderInputField = ({ icon: Icon, type, placeholder, value, onChange, disabled, maxLength, required = true, showToggle = false }) => (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
        <input
          type={showToggle && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className="w-full pl-11 pr-12 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </motion.div>
  );

  const renderForm = () => {
    switch (currentMode) {
      case "signin":
        return (
          <div className="space-y-4">
            {renderInputField({
              icon: User,
              type: "email",
              placeholder: "Enter your email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              disabled: isLoading || isGoogleLoading
            })}
            {renderInputField({
              icon: Lock,
              type: "password",
              placeholder: "Enter your password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              disabled: isLoading || isGoogleLoading,
              showToggle: true
            })}
          </div>
        );

      case "signup":
        return (
          <div className="space-y-4">
            {renderInputField({
              icon: User,
              type: "email",
              placeholder: "Enter your email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              disabled: isLoading || isGoogleLoading
            })}
            {renderInputField({
              icon: Phone,
              type: "tel",
              placeholder: "Enter your phone number",
              value: phoneNumber,
              onChange: (e) => setPhoneNumber(e.target.value),
              disabled: isLoading || isGoogleLoading
            })}
            {renderInputField({
              icon: Lock,
              type: "password",
              placeholder: "Enter your password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              disabled: isLoading || isGoogleLoading,
              showToggle: true
            })}
            {renderInputField({
              icon: Lock,
              type: "password",
              placeholder: "Confirm your password",
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              disabled: isLoading || isGoogleLoading
            })}
          </div>
        );

      case "forgot":
        return (
          <div className="space-y-4">
            {renderInputField({
              icon: Mail,
              type: "email",
              placeholder: "Enter your email address",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              disabled: isLoading
            })}
          </div>
        );

      case "reset":
        return (
          <div className="space-y-4">
            {renderInputField({
              icon: Lock,
              type: "password",
              placeholder: "Enter new password",
              value: newPassword,
              onChange: (e) => setNewPassword(e.target.value),
              disabled: isLoading,
              showToggle: true
            })}
            {renderInputField({
              icon: Lock,
              type: "password",
              placeholder: "Confirm new password",
              value: confirmNewPassword,
              onChange: (e) => setConfirmNewPassword(e.target.value),
              disabled: isLoading
            })}
          </div>
        );

      case "verify":
        return (
          <div className="space-y-4">
            {renderInputField({
              icon: KeyRound,
              type: "text",
              placeholder: "Enter verification code",
              value: verificationCode,
              onChange: (e) => setVerificationCode(e.target.value),
              disabled: isLoading,
              maxLength: 6
            })}
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    const FooterButton = ({ children, onClick, disabled }) => (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="text-white/80 hover:text-white font-medium underline underline-offset-2 transition-colors disabled:opacity-50"
      >
        {children}
      </button>
    );

    switch (currentMode) {
      case "signin":
        return (
          <div className="text-center space-y-2">
            <div className="text-white/70">
              New here?{" "}
              <FooterButton onClick={() => switchMode("signup")} disabled={isLoading || isGoogleLoading}>
                Sign up
              </FooterButton>
            </div>
            <div className="text-white/70">
              <FooterButton onClick={() => setCurrentMode("forgot")} disabled={isLoading || isGoogleLoading}>
                Forgot Password?
              </FooterButton>
            </div>
          </div>
        );

      case "signup":
        return (
          <div className="text-center text-white/70">
            Already have an account?{" "}
            <FooterButton onClick={() => switchMode("signin")} disabled={isLoading || isGoogleLoading}>
              Log in
            </FooterButton>
          </div>
        );

      case "forgot":
      case "verify":
        return (
          <div className="text-center text-white/70">
            Remember your password?{" "}
            <FooterButton onClick={() => switchMode("signin")} disabled={isLoading}>
              Back to Login
            </FooterButton>
          </div>
        );

      case "reset":
        return (
          <div className="text-center text-white/70">
            Remember your password?{" "}
            <FooterButton onClick={handleBackToSignIn} disabled={isLoading}>
              Back to Login
            </FooterButton>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="  h-full min-h-screen bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden relative">
      {/* Floating Background Shapes */}
      <FloatingShapes />
      
      <div className=" h-full min-h-screen flex items-center justify-center relative z-10">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Welcome Content */}
          <motion.div 
            className="order-2 lg:order-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <motion.p 
                className="text-lg font-semibold text-white/90 mb-4 tracking-wide uppercase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your Mind, Made Lighter
              </motion.p>
              
              <motion.h1 
                className="text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Welcome to
                <br />
                <span className="text-white/80">Lumaya</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/70 leading-relaxed max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Your AI companion for mental clarity & emotional growth. 
                Always here, always private.
              </motion.p>
            </div>

            {/* Feature Tags */}
            <motion.div 
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                "Non-Judgmental Listening",
                "Always Available", 
                "Privacy First"
              ].map((tag, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/80 border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Hero Image for smaller screens */}
            <motion.div 
              className="lg:hidden mt-8 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="w-64 h-64 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <img
                  src={imgpodcasting}
                  alt="Lumaya"
                  className="w-full h-full object-cover rounded-xl opacity-80"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-10 max-w-md mx-auto border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <motion.h2 
                  className="text-3xl font-serif font-semibold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {getTitle()}
                </motion.h2>
                <motion.p 
                  className="text-white/70"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {getSubtitle()}
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {renderForm()}
                
                <motion.button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {getButtonText()}
                  {!isLoading && <ChevronRight className="w-5 h-5" />}
                </motion.button>

                {renderGoogleButton()}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {renderFooter()}
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Hero Image for larger screens */}
          <motion.div 
            className="hidden lg:block order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-80 h-80 bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <img
                src={imgpodcasting}
                alt="Lumaya"
                className="w-full h-full object-cover rounded-2xl opacity-70"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;