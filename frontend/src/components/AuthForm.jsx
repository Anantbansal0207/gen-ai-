import React, { useState, useEffect } from 'react';
import { initiateSignUp, completeSignUp, signIn, initiatePasswordReset, completePasswordReset } from '../services/authService';
import { useToast } from '../hooks/useToast';
import { validateEmail } from '../utils/validation';

import bg from '../assets/signUpBg.jpg';

const AuthForm = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const { showSuccess, showError } = useToast();

  // Enhanced token detection on component mount
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    
    // Check for token in multiple locations
    const token = 
      hashParams.get('access_token') || 
      queryParams.get('token') ||
      sessionStorage.getItem('recoveryToken') ||
      window.location.hash.split('access_token=')[1]?.split('&')[0];

    if (token) {
      setResetToken(token);
      setMode('reset');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Store token temporarily if needed
      sessionStorage.setItem('recoveryToken', token);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(email) && mode !== 'reset') {
      showError('Please enter a valid email address');
      return;
    }
  
    try {
      switch (mode) {
        case 'signin':
          if (!password || password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
          }
          const { user } = await signIn(email, password);
          showSuccess('Successfully signed in!');
          onAuthSuccess(user);
          break;
  
        case 'signup':
          if (!password || password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
          }
          await initiateSignUp(email, password);
          showSuccess('Verification code sent to your email');
          setMode('verify');
          break;

        case 'verify':
          if (!otp) {
            showError('Please enter the verification code');
            return;
          }
          const signUpData = await completeSignUp(email, otp);
          showSuccess('Email verified and account created!');
          onAuthSuccess(signUpData.user);
          break;
  
        case 'forgot':
          await initiatePasswordReset(email);
          showSuccess('Password reset instructions sent to your email');
          break;
  
        case 'reset':
          if (!newPassword || newPassword.length < 6) {
            showError('New password must be at least 6 characters');
            return;
          }
          if (!resetToken) {
            showError('Invalid reset token. Please use the link from your email.');
            return;
          }
          try {
            await completePasswordReset(newPassword);
            showSuccess('Password reset successful!');
            setMode('signin');
            // Clear the recovery token from storage
            sessionStorage.removeItem('recoveryToken');
            // Clear the reset token from URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (error) {
            showError(error.message || 'Failed to reset password');
          }
          break;
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const handleBackToSignIn = () => {
    setMode('signin');
    setResetToken('');
    // Clear any stored tokens
    sessionStorage.removeItem('recoveryToken');
    // Clear the reset token from URL when going back to sign in
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <div style={{marginTop:'60px'}} className="w-full max-w-md px-6">
        <div className="backdrop-blur-sm bg-white/20 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              {mode === 'signin' ? 'Welcome to' : 
               mode === 'signup' ? 'Join' :
               mode === 'verify' ? 'Verify Email' :
               mode === 'forgot' ? 'Reset Password' :
               'Set New Password'}
            </h2>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {mode !== 'verify' && mode !== 'forgot' && mode !== 'reset' && "AI Therapist"}
            </h1>
            <p className="text-slate-600">
              {mode === 'signin' ? 'Supporting your mental wellness' : 
               mode === 'signup' ? 'Start your wellness journey' :
               mode === 'verify' ? 'Check your email for the verification code' :
               mode === 'forgot' ? 'We\'ll send recovery instructions to your email' :
               'Create a new secure password'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(mode !== 'reset') && (
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={mode !== 'reset'}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
                />
              </div>
            )}

            {['signin', 'signup'].includes(mode) && (
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-5 w-5 text-teal-600 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" fill="currentColor"/>
                    <path d="M21.8 11.9C18.3 5.9 5.7 5.9 2.2 11.9C2.07 12.12 2 12.38 2 12.65C2 12.91 2.07 13.17 2.2 13.4C5.7 19.4 18.3 19.4 21.8 13.4C21.93 13.17 22 12.91 22 12.65C22 12.38 21.93 12.12 21.8 11.9Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            )}

            {mode === 'verify' && (
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  placeholder="Verification Code"
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
                />
              </div>
            )}

            {mode === 'reset' && (
              <div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="New Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              {mode === 'signin' ? 'Log in' :
               mode === 'signup' ? 'Sign up' :
               mode === 'verify' ? 'Verify Email' :
               mode === 'forgot' ? 'Send Reset Instructions' :
               'Reset Password'}
            </button>

            <div className="text-center text-sm mt-6">
              {mode === 'signin' && (
                <div className="flex flex-col space-y-3">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setMode('forgot');
                    }}
                    className="text-teal-700 hover:text-teal-900"
                  >
                    Forgot password?
                  </a>
                  <div className="flex items-center justify-center space-x-1 mt-4">
                    <span className="text-slate-600">Don't have an account?</span>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setMode('signup');
                      }}
                      className="text-teal-700 hover:text-teal-900 font-medium"
                    >
                      Sign up
                    </a>
                  </div>
                </div>
              )}
              
              {['signup', 'verify', 'forgot', 'reset'].includes(mode) && (
                <div className="flex items-center justify-center mt-4">
                  <span className="text-slate-600">Already have an account?</span>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleBackToSignIn();
                    }}
                    className="text-teal-700 hover:text-teal-900 font-medium ml-1"
                  >
                    Log in
                  </a>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;