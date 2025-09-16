import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './HomePage.jsx';
import "./App.css";
import ChatInterface from './components/new.jsx';
import { supabase } from "./utils/supabase1";

import AuthForm from './components/AuthForm';

import Footer from './components/Footer';
import AboutUsPage from './components/AboutUsPage';
import ChatGuide from './components/ChatGuide';
import PrivacyPolicy from './components/PrivacyPolicy';
import { checkAuthStatus, signOut } from './services/authService.js';

import Dashboard from "./components/Dashboard";
import Journal from "./components/Journal";
import Insights from "./components/Insights";
import Profile from "./components/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import SelfSpacePage from './components/SelfSpacePage.jsx';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authRedirectHandled, setAuthRedirectHandled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // FIXED: Better auth initialization
  useEffect(() => {
    const initializeAuth = async () => {
      // Don't reinitialize if we already have a user from handleAuthSuccess
      if (user) {
        console.log('User already authenticated, skipping initialization');
        return;
      }

      try {
        setLoading(true);
        const { user } = await checkAuthStatus();
        setUser(user);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authRedirectHandled && !user) { // Add !user condition
      initializeAuth();
    }
  }, [authRedirectHandled, user]); // Add user as dependency

  // Replace the existing auth redirect useEffect in App.jsx with this:

  useEffect(() => {
    if (authRedirectHandled) return;

    const handleAuthRedirect = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const queryParams = new URLSearchParams(location.search);

      const token =
        hashParams.get('access_token') ||
        queryParams.get('token') ||
        sessionStorage.getItem('recoveryToken');

      const type = queryParams.get('type') || hashParams.get('type');

      // Check if this is a password recovery
      const isPasswordRecovery = type === 'recovery' ||
        (token && location.hash.includes('type=recovery')) ||
        (token && sessionStorage.getItem('recoveryToken'));

      console.log('App.jsx Token detection:', {
        token: !!token,
        type,
        isPasswordRecovery,
        currentPath: location.pathname
      });

      if (token && isPasswordRecovery) {
        // Handle password recovery - store token and navigate to auth
        console.log('Handling password recovery in App.jsx');
        sessionStorage.setItem('recoveryToken', token);
        sessionStorage.setItem('isPasswordRecovery', 'true');

        // Set the session for Supabase but don't trigger auth state change
        supabase.auth.setSession({
          access_token: token,
          refresh_token: hashParams.get('refresh_token') || ''
        });

        // Navigate to auth page if not already there
        if (location.pathname !== '/auth') {
          navigate('/auth', {
            state: {
              from: location.pathname,
              mode: 'reset',
              token: token
            }
          });
        }

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

      } else if (token && !isPasswordRecovery) {
        // Handle Google OAuth or other auth tokens
        console.log('Handling OAuth token in App.jsx');
        // Let the existing auth flow handle this
      }

      setAuthRedirectHandled(true);
    };

    handleAuthRedirect();
  }, [location, navigate, authRedirectHandled]);

  // Also update the Supabase auth state listener in App.jsx:
  const handleAuthSuccess = (userData) => {
    console.log("Authentication successful", userData);
    setUser(userData);

    // Clear any recovery state
    sessionStorage.removeItem('recoveryToken');
    sessionStorage.removeItem('isPasswordRecovery');

    // Only redirect if we're on the auth page
    if (location.pathname === '/auth') {
      navigate('/', { replace: true });
    }
  };

  // Also update the Supabase auth state listener to redirect to homepage:
  // Replace your existing auth state listener in App.jsx with this:
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('App.jsx auth state change:', event, session);

        // Skip processing if this is password recovery
        if (event === 'PASSWORD_RECOVERY' || sessionStorage.getItem('isPasswordRecovery')) {
          console.log('Password recovery detected - skipping auto sign in');
          return;
        }

        // Skip INITIAL_SESSION if we already have a user (from backend auth)
        if (event === 'INITIAL_SESSION' && !session && user) {
          console.log('Skipping INITIAL_SESSION - user already authenticated via backend');
          return;
        }

        if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
          setUser(null);
        } else if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          localStorage.setItem('authToken', session.access_token);
          localStorage.setItem('userId', session.user.id);

          // Only redirect if we're on the auth page
          if (location.pathname === '/auth') {
            navigate('/', { replace: true });
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, user]); // Add user as dependency

  // FIXED: Complete logout handler
  const handleLogout = async () => {
    try {
      setLoading(true);

      // Call the improved signOut function
      await signOut();

      // Reset all local state
      setUser(null);
      setAuthRedirectHandled(false);

      // Navigate to home page
      navigate('/', { replace: true });

      // Force a page reload to ensure all state is cleared


    } catch (error) {
      console.error("Error signing out:", error);
      // Even if logout fails, clear local state and redirect
      setUser(null);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { path: '/chat', label: 'Chat' },
    { path: '/selfspace', label: 'Self Space' }, // NEW
  ];


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {location.pathname !== '/chat' && location.pathname !== "/" && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          navLinks={navLinks}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatInterface user={user} />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/chat-guide" element={<ChatGuide />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute user={user}><Journal /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute user={user}><Insights /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
        <Route
          path="/selfspace"
          element={
            <ProtectedRoute user={user}>
              <SelfSpacePage user={user} />
            </ProtectedRoute>
          }
        />




        <Route
          path="/auth"
          element={

            <AuthForm onAuthSuccess={handleAuthSuccess} />

          }
        />
        <Route
          path="/authorisation"
          element={

            <AuthForm onAuthSuccess={handleAuthSuccess} />

          }
        />
        <Route path="*" element={<HomePage />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-background text-accent',
        }}
      />

      {location.pathname !== '/chat' && location.pathname !== "/" && <Footer />}
    </div>
  );
}

export default App;