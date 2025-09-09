// authService.js - Fixed version
import { supabase } from "../utils/supabase1";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: import.meta.env.VITE_REDIRECT_URL
    }
  });
  if (error) console.error('Google sign‑in error:', error.message);
};

export const handleGoogleAuthCallback = async (onAuthSuccess, navigate, showSuccess, showError) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Google auth error:', error.message);
      showError('Google authentication failed');
      return false;
    }
    
    if (session) {
      localStorage.setItem('authToken', session.access_token);
      localStorage.setItem('userId', session.user.id);
      getSessionId(session.user.id);
      
      showSuccess('Successfully signed in with Google!');
      
      if (onAuthSuccess) {
        onAuthSuccess(session.user);
      } else if (navigate) {
        navigate('/');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Google auth handling error:', error);
    showError('Failed to process Google authentication');
    return false;
  }
};

export const initiateSignUp = async (email, password, phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup/initiate`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, phoneNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  } catch (error) {
    console.error('Error initiating signup:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

export const completeSignUp = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup/complete`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    
    if (data.session?.access_token) {
      localStorage.setItem('authToken', data.session.access_token);
    }
    if (data.user?.id) {
      localStorage.setItem('userId', data.user.id);
      getSessionId(data.user.id);
    }

    return data;
  } catch (error) {
    console.error('Error completing signup:', error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    
    if (data.session?.access_token) {
      localStorage.setItem('authToken', data.session.access_token);
    }
    if (data.user?.id) {
      localStorage.setItem('userId', data.user.id);
      getSessionId(data.user.id);
    }

    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const initiatePasswordReset = async (email) => {
  try {
    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${FRONTEND_URL}`
    });

    if (error) throw error;
    return { message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error initiating password reset:', error);
    throw new Error('Failed to send password reset email. Please try again.');
  }
};

export const completePasswordReset = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return { message: 'Password reset successful' };
  } catch (error) {
    console.error('Error completing password reset:', error);
    throw error;
  }
};

// FIXED: Unified authentication status check
export const checkAuthStatus = async () => {
  try {
    // Check both Supabase session and localStorage
    const { data: { session }, error } = await supabase.auth.getSession();
    const authToken = localStorage.getItem('authToken');
    
    // If we have a Supabase session, use that
    if (session && session.user) {
      // Sync localStorage with Supabase session
      localStorage.setItem('authToken', session.access_token);
      localStorage.setItem('userId', session.user.id);
      getSessionId(session.user.id);
      return { user: session.user };
    }
    
    // If we have a localStorage token but no Supabase session, verify it
    if (authToken && !session) {
      try {
        const { data, error: userError } = await supabase.auth.getUser(authToken);
        if (userError || !data.user) {
          // Token is invalid, clear everything
          clearAllAuthData();
          return { user: null };
        }
        return { user: data.user };
      } catch (verifyError) {
        console.error('Token verification failed:', verifyError);
        clearAllAuthData();
        return { user: null };
      }
    }
    
    // No authentication found
    if (!session && !authToken) {
      clearAllAuthData();
      return { user: null };
    }
    
    return { user: null };
  } catch (error) {
    console.error('Error checking auth status:', error);
    clearAllAuthData();
    return { user: null };
  }
};

// FIXED: Complete logout function
export const signOut = async () => {
  try {
    // Clear Supabase session first
    const { error: supabaseError } = await supabase.auth.signOut();
    if (supabaseError) {
      console.error('Supabase signout error:', supabaseError.message);
    }
    
    // Try to call backend signout (if using backend auth)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });
      
      // Don't throw error if backend signout fails - we still want to clear local data
      if (!response.ok) {
        console.warn('Backend signout failed, but continuing with local cleanup');
      }
    } catch (backendError) {
      console.warn('Backend signout request failed:', backendError);
    }
    
    // Always clear all local data regardless of backend response
    clearAllAuthData();
    
    return { message: 'Signed out successfully' };
  } catch (error) {
    console.error('Error during signout:', error);
    // Even if there's an error, clear local data
    clearAllAuthData();
    throw error;
  }
};

// FIXED: Comprehensive auth data clearing
const clearAllAuthData = () => {
  // Clear main auth tokens
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  
  // Clear session storage
  sessionStorage.removeItem('recoveryToken');
  
  // // Clear all session IDs
  // Object.keys(localStorage).forEach(key => {
  //   if (key.startsWith('sessionId_')) {
  //     localStorage.removeItem(key);
  //   }
  // });
  
  // Clear any other auth-related data you might have
  localStorage.removeItem('user');
  localStorage.removeItem('userSession');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userId');
  
  // Clear cookies if any (adjust domain as needed)
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
};

export const getSessionId = (userId) => {
  if (!userId) return null;
  
  const sessionId = localStorage.getItem(`sessionId_${userId}`);
  if (sessionId) {
    return sessionId;
  }
  
  const newSessionId = crypto.randomUUID();
  localStorage.setItem(`sessionId_${userId}`, newSessionId);
  return newSessionId;
};

export const getAllUsersWithPhoneNumbers = async () => {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) throw error;
    
    const usersWithPhones = users
      .filter(user => user.user_metadata?.phone_number)
      .map(user => ({
        id: user.id,
        email: user.email,
        phone_number: user.user_metadata.phone_number,
        created_at: user.created_at
      }));
    
    return usersWithPhones;
  } catch (error) {
    console.error('Error getting users with phone numbers:', error);
    throw error;
  }
};