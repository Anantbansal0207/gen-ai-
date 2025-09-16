// useSelfSpace.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const useSelfSpace = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Create headers with auth token
  const getHeaders = (includeContentType = true) => {
    const headers = {
      'Authorization': `Bearer ${getAuthToken()}`
    };
    
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  };

  // Fetch all entries
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/selfspace`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch entries');
      }

      const data = await response.json();
      setEntries(data.entries || []);
      return data.entries;
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload text entry
  const uploadTextEntry = useCallback(async (content) => {
    if (!content || content.trim() === '') {
      throw new Error('Content is required for text entries');
    }

    setUploading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/selfspace/upload`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          type: 'text',
          content: content.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload text entry');
      }

      const data = await response.json();
      
      // Add new entry to the beginning of the list
      setEntries(prevEntries => [data.entry, ...prevEntries]);
      
      return data.entry;
    } catch (err) {
      console.error('Error uploading text entry:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  // Upload image entry
  const uploadImageEntry = useCallback(async (imageFile) => {
    if (!imageFile) {
      throw new Error('Image file is required');
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      throw new Error('Image size must be less than 10MB');
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('type', 'image');
      formData.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/api/selfspace/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Add new entry to the beginning of the list
      setEntries(prevEntries => [data.entry, ...prevEntries]);
      
      return data.entry;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  // Delete entry
  const deleteEntry = useCallback(async (entryId) => {
    if (!entryId) {
      throw new Error('Entry ID is required');
    }

    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/selfspace/${entryId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete entry');
      }

      // Remove entry from local state
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
      
      return true;
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Get entry by ID
  const getEntryById = useCallback(async (entryId) => {
    if (!entryId) {
      throw new Error('Entry ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/selfspace/${entryId}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch entry');
      }

      const data = await response.json();
      return data.entry;
    } catch (err) {
      console.error('Error fetching entry:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get statistics
  const fetchStats = useCallback(async () => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/selfspace/stats/summary`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data.stats);
      return data.stats;
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load entries on hook initialization
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchEntries();
      fetchStats();
    }
  }, [fetchEntries, fetchStats]);

  return {
    entries,
    loading,
    uploading,
    error,
    stats,
    fetchEntries,
    uploadTextEntry,
    uploadImageEntry,
    deleteEntry,
    getEntryById,
    fetchStats,
    clearError
  };
};