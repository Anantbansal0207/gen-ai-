// SelfSpacePage.jsx
import React, { useState, useRef } from 'react';
import { useSelfSpace } from '../hooks/useSelfSpace';
import './SelfSpacePage.css';

const SelfSpacePage = ({ showError, showSuccess }) => {
  const {
    entries,
    loading,
    uploading,
    error,
    stats,
    uploadTextEntry,
    uploadImageEntry,
    deleteEntry,
    clearError
  } = useSelfSpace();

  const [activeTab, setActiveTab] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  // Handle text form submission
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    
    if (!textContent.trim()) {
      showError('Please enter some text');
      return;
    }

    try {
      await uploadTextEntry(textContent);
      setTextContent('');
      showSuccess('Text entry added successfully!');
    } catch (err) {
      showError(err.message);
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showError('Image size must be less than 10MB');
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Handle image form submission
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      showError('Please select an image');
      return;
    }

    try {
      await uploadImageEntry(selectedImage);
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      showSuccess('Image uploaded successfully!');
    } catch (err) {
      showError(err.message);
    }
  };

  // Handle delete entry
  const handleDeleteEntry = async (entryId) => {
    try {
      await deleteEntry(entryId);
      setDeleteConfirm(null);
      showSuccess('Entry deleted successfully');
    } catch (err) {
      showError(err.message);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // Clear error when component mounts or error changes
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="self-space-page">
      <div className="self-space-container">
        {/* Header */}
        <header className="self-space-header">
          <h1>Self Space</h1>
          <p>Your private space for thoughts and memories</p>
          {stats && (
            <div className="stats-summary">
              <span>{stats.total} entries</span>
              <span>•</span>
              <span>{stats.textEntries} text</span>
              <span>•</span>
              <span>{stats.imageEntries} images</span>
            </div>
          )}
        </header>

        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-tabs">
            <button
              className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              Text Entry
            </button>
            <button
              className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
              onClick={() => setActiveTab('image')}
            >
              Image Upload
            </button>
          </div>

          {activeTab === 'text' ? (
            <form onSubmit={handleTextSubmit} className="text-form">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="What's on your mind?"
                rows="4"
                maxLength="2000"
                disabled={uploading}
              />
              <div className="form-footer">
                <span className="char-count">
                  {textContent.length}/2000
                </span>
                <button
                  type="submit"
                  disabled={uploading || !textContent.trim()}
                  className="submit-button"
                >
                  {uploading ? 'Adding...' : 'Add Entry'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleImageSubmit} className="image-form">
              <div className="file-input-container">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={uploading}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="remove-preview"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={uploading || !selectedImage}
                className="submit-button"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>
          )}
        </div>

        {/* Entries Grid */}
        <div className="entries-section">
          {loading && entries.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No entries yet</h3>
              <p>Start by adding your first text or image entry above</p>
            </div>
          ) : (
            <div className="entries-grid">
              {entries.map((entry) => (
                <div key={entry.id} className={`entry-card ${entry.type}`}>
                  <div className="entry-header">
                    <span className="entry-type-badge">
                      {entry.type === 'text' ? '📝' : '🖼️'}
                    </span>
                    <span className="entry-date">
                      {formatDate(entry.created_at)}
                    </span>
                    <button
                      className="delete-button"
                      onClick={() => setDeleteConfirm(entry.id)}
                      title="Delete entry"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div className="entry-content">
                    {entry.type === 'text' ? (
                      <p>{entry.content}</p>
                    ) : (
                      <div className="image-container">
                        {entry.signedUrl ? (
                          <img
                            src={entry.signedUrl}
                            alt="User upload"
                            loading="lazy"
                          />
                        ) : (
                          <div className="image-placeholder">
                            <span>Image not available</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Entry</h3>
              <p>Are you sure you want to delete this entry? This action cannot be undone.</p>
              <div className="modal-actions">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEntry(deleteConfirm)}
                  className="delete-confirm-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfSpacePage;