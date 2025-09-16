// SelfSpacePage.jsx - Enhanced Structure
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, FileText, Trash2, Calendar, Heart, BookOpen, Camera, Plus } from 'lucide-react';
import { useSelfSpace } from '../hooks/useSelfSpace';
import './SelfSpacePage.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

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
      {/* Background decorative elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="self-space-container">
        {/* Enhanced Header */}
        <motion.header 
          className="self-space-header"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="header-content">
            <div className="header-icon">
              <Heart className="main-icon" />
            </div>
            <h1>Self Space</h1>
            <p>Your private sanctuary for thoughts, memories, and reflections</p>
            
            {stats && (
              <motion.div variants={itemVariants} className="stats-summary">
                <div className="stat-item">
                  <BookOpen className="stat-icon" />
                  <span className="stat-number">{stats.total}</span>
                  <span className="stat-label">Total Entries</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <FileText className="stat-icon" />
                  <span className="stat-number">{stats.textEntries}</span>
                  <span className="stat-label">Text</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <Camera className="stat-icon" />
                  <span className="stat-number">{stats.imageEntries}</span>
                  <span className="stat-label">Images</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.header>

        {/* Enhanced Upload Section */}
        <motion.section 
          className="upload-section"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="section-header">
            <h2>Create New Entry</h2>
            <p>Share your thoughts or capture a moment</p>
          </div>

          <div className="upload-content">
            {/* Enhanced Tab Navigation */}
            <div className="upload-tabs">
              <motion.button
                className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
                onClick={() => setActiveTab('text')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="tab-icon" />
                <span>Text Entry</span>
              </motion.button>
              <motion.button
                className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
                onClick={() => setActiveTab('image')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image className="tab-icon" />
                <span>Image Upload</span>
              </motion.button>
            </div>

            {/* Enhanced Forms */}
            <motion.div 
              className="form-container"
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'text' ? (
                <form onSubmit={handleTextSubmit} className="text-form">
                  <div className="input-group">
                    <label className="input-label">
                      <FileText className="label-icon" />
                      What's on your mind?
                    </label>
                    <div className="textarea-container">
                      <textarea
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder="Express your thoughts, feelings, or reflections here..."
                        rows="6"
                        maxLength="2000"
                        disabled={uploading}
                        className="enhanced-textarea"
                      />
                      <div className="textarea-overlay"></div>
                    </div>
                  </div>
                  
                  <div className="form-footer">
                    <div className="char-count">
                      <span className={textContent.length > 1800 ? 'warning' : ''}>
                        {textContent.length}/2000 characters
                      </span>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={uploading || !textContent.trim()}
                      className="submit-button text-submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {uploading ? (
                        <>
                          <div className="loading-spinner small"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="button-icon" />
                          Add Entry
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleImageSubmit} className="image-form">
                  <div className="input-group">
                    <label className="input-label">
                      <Camera className="label-icon" />
                      Upload an Image
                    </label>
                    
                    <div className="file-input-wrapper">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        disabled={uploading}
                        className="file-input-hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="file-input-label">
                        <div className="file-input-content">
                          <Upload className="upload-icon" />
                          <div className="upload-text">
                            <span className="upload-primary">Drop your image here or click to browse</span>
                            <span className="upload-secondary">Supports JPG, PNG, GIF up to 10MB</span>
                          </div>
                        </div>
                      </label>
                    </div>

                    {imagePreview && (
                      <motion.div 
                        className="image-preview-container"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="image-preview">
                          <img src={imagePreview} alt="Preview" />
                          <motion.button
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="remove-preview"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="form-footer center">
                    <motion.button
                      type="submit"
                      disabled={uploading || !selectedImage}
                      className="submit-button image-submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {uploading ? (
                        <>
                          <div className="loading-spinner small"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="button-icon" />
                          Upload Image
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Entries Section */}
        <motion.section 
          className="entries-section"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="section-header">
            <h2>Your Journey</h2>
            <p>A collection of your thoughts and memories</p>
          </div>

          <div className="entries-content">
            {loading && entries.length === 0 ? (
              <motion.div 
                className="loading-state"
                variants={itemVariants}
              >
                <div className="loading-spinner large"></div>
                <h3>Loading your entries...</h3>
                <p>Gathering your thoughts and memories</p>
              </motion.div>
            ) : entries.length === 0 ? (
              <motion.div 
                className="empty-state"
                variants={itemVariants}
              >
                <div className="empty-illustration">
                  <div className="empty-icon">
                    <BookOpen size={64} />
                  </div>
                  <div className="empty-shapes">
                    <div className="empty-shape"></div>
                    <div className="empty-shape"></div>
                    <div className="empty-shape"></div>
                  </div>
                </div>
                <h3>Your story starts here</h3>
                <p>Begin documenting your journey by adding your first entry above. Every thought matters, every moment counts.</p>
                <motion.button
                  className="empty-cta"
                  onClick={() => setActiveTab('text')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} />
                  Create First Entry
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="entries-grid"
                variants={containerVariants}
              >
                {entries.map((entry, index) => (
                  <motion.div 
                    key={entry.id} 
                    className={`entry-card ${entry.type}`}
                    variants={cardVariants}
                    custom={index}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="entry-header">
                      <div className="entry-meta">
                        <div className="entry-type-badge">
                          {entry.type === 'text' ? (
                            <FileText className="badge-icon" />
                          ) : (
                            <Camera className="badge-icon" />
                          )}
                        </div>
                        <div className="entry-date">
                          <Calendar className="date-icon" />
                          <span>{formatDate(entry.created_at)}</span>
                        </div>
                      </div>
                      <motion.button
                        className="delete-button"
                        onClick={() => setDeleteConfirm(entry.id)}
                        title="Delete entry"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="delete-icon" />
                      </motion.button>
                    </div>
                    
                    <div className="entry-content">
                      {entry.type === 'text' ? (
                        <div className="text-content">
                          <p>{entry.content}</p>
                        </div>
                      ) : (
                        <div className="image-content">
                          {entry.signedUrl ? (
                            <img
                              src={entry.signedUrl}
                              alt="User upload"
                              loading="lazy"
                            />
                          ) : (
                            <div className="image-placeholder">
                              <Image size={48} />
                              <span>Image not available</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* <div className="entry-footer">
                      <div className="entry-stats">
                        <span className="entry-type">
                          {entry.type === 'text' ? 'Text Entry' : 'Image'}
                        </span>
                      </div>
                    </div> */}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Enhanced Delete Confirmation Modal */}
        {deleteConfirm && (
          <motion.div 
            className="modal-overlay" 
            onClick={() => setDeleteConfirm(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal" 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="modal-icon">
                <Trash2 className="warning-icon" />
              </div>
              <h3>Delete Entry</h3>
              <p>Are you sure you want to delete this entry? This action cannot be undone and your memory will be lost forever.</p>
              <div className="modal-actions">
                <motion.button
                  onClick={() => setDeleteConfirm(null)}
                  className="cancel-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Keep Entry
                </motion.button>
                <motion.button
                  onClick={() => handleDeleteEntry(deleteConfirm)}
                  className="delete-confirm-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="button-icon" />
                  Delete Forever
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SelfSpacePage;