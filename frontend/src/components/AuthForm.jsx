import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Lock, Phone, Mail, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import './LoginForm.css';
import imgpodcasting from '../assets/Podcasting.png';
import { supabase } from "../utils/supabase1";
import { useLocation } from "react-router-dom";

// Import the backend services and utilities
import { signInWithGoogle, initiateSignUp, completeSignUp, signIn, initiatePasswordReset, completePasswordReset, handleGoogleAuthCallback } from '../services/authService';
import { useToast } from '../hooks/useToast';
import { validateEmail } from '../utils/validation';

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
  const { showSuccess, showError } = useToast();

// Replace the token detection useEffect in AuthForm.jsx with this simplified version:

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
const location = useLocation();

// Remove the complex token detection useEffect completely
// Remove the Supabase auth state change listener from AuthForm (App.jsx handles it now)
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

        // Update the password reset success handler in handleSubmit:
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
      case "signin": return "Log In";
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
      <div style={{ marginTop: '-20px' }}>
        <div style={{
          textAlign: 'center',
          margin: '15px 0',
          position: 'relative'
        }}>
          <span style={{
            background: 'white',
            padding: '0 15px',
            color: '#666',
            fontSize: '12px',
            position: 'relative',
            zIndex: 1
          }}>
            or
          </span>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: '#ddd',
            zIndex: 0
          }} />
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            background: 'white',
            color: '#333',
            fontSize: '14px',
            cursor: isLoading || isGoogleLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: (isLoading || isGoogleLoading) ? 0.6 : 1,
            ...(isGoogleLoading && { opacity: 0.7 })
          }}
          onMouseEnter={(e) => {
            if (!isLoading && !isGoogleLoading) {
              e.target.style.background = '#f5f5f5';
              e.target.style.borderColor = '#ccc';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !isGoogleLoading) {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#ddd';
            }
          }}
        >
          {isGoogleLoading ? 'Signing in with Google...' : 'Sign in with Google'}
        </button>
      </div>
    );
  };

  const renderForm = () => {
    switch (currentMode) {
      case "signin":
        return (
          <>
            <div className="login-input-group">
              <User className="icon" />
              <input
                type="email"
                placeholder="Enter your username/email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div className="login-input-group">
              <Lock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading || isGoogleLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isGoogleLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </>
        );

      case "signup":
        return (
          <>
            <div className="login-input-group">
              <User className="icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div className="login-input-group">
              <Phone className="icon" />
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div className="login-input-group">
              <Lock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading || isGoogleLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isGoogleLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="login-input-group">
              <Lock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
          </>
        );

      case "forgot":
        return (
          <div className="login-input-group">
            <Mail className="icon" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        );

      case "reset":
        return (
          <>
            <div className="login-input-group">
              <Lock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="login-input-group">
              <Lock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </>
        );

      case "verify":
        return (
          <div className="login-input-group">
            <KeyRound className="icon" />
            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              maxLength={6}
              disabled={isLoading}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (currentMode) {
      case "signin":
        return (
          <div className="login-footer">
            <span>New here?</span>
            <button 
              type="button" 
              onClick={() => switchMode("signup")}
              disabled={isLoading || isGoogleLoading}
            >
              Sign up
            </button>
            <span style={{ margin: '0 10px' }}>•</span>
            <button 
              type="button" 
              onClick={() => setCurrentMode("forgot")}
              disabled={isLoading || isGoogleLoading}
            >
              Forgot Password?
            </button>
          </div>
        );

      case "signup":
        return (
          <div className="signup-footer">
            <span>Already have an account?</span>
            <button 
              type="button" 
              onClick={() => switchMode("signin")}
              disabled={isLoading || isGoogleLoading}
            >
              Log in
            </button>
          </div>
        );

      case "forgot":
      case "verify":
        return (
          <div className="login-footer">
            <span>Remember your password?</span>
            <button 
              type="button" 
              onClick={() => switchMode("signin")}
              disabled={isLoading}
            >
              Back to Login
            </button>
          </div>
        );

      case "reset":
        return (
          <div className="login-footer">
            <span>Remember your password?</span>
            <button 
              type="button" 
              onClick={handleBackToSignIn}
              disabled={isLoading}
            >
              Back to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={imgpodcasting} alt="Podcasting" className="login-image" />
      </div>
      <div className="login-right">
        <div className={currentMode === "signup" ? "signup-card" : "login-card"}>
          <h1 className="login-title">{getTitle()}</h1>
          <p className="login-subtitle">{getSubtitle()}</p>
          <form onSubmit={handleSubmit} className="login-form">
            {renderForm()}
            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || isGoogleLoading}
            >
              {getButtonText()}
            </button>
            {renderGoogleButton()}
            {renderFooter()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;