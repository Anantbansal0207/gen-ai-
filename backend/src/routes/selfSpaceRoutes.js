// selfSpaceRoutes.js
import express from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/authMiddleware.js';
import { SelfSpaceService } from '../services/selfSpaceService.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.fieldname === 'image') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * POST /api/selfspace/upload
 * Upload a text entry or image
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, content } = req.body;

    // Validate entry type
    if (!type || !['text', 'image'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid or missing entry type. Must be "text" or "image"' 
      });
    }

    let entry;

    if (type === 'text') {
      // Handle text entry
      if (!content || content.trim() === '') {
        return res.status(400).json({ 
          error: 'Content is required for text entries' 
        });
      }

      entry = await SelfSpaceService.createEntry(
        userId, 
        'text', 
        content.trim(), 
        null
      );

    } else if (type === 'image') {
      // Handle image entry
      if (!req.file) {
        return res.status(400).json({ 
          error: 'Image file is required for image entries' 
        });
      }

      // Upload image to storage
      const imagePath = await SelfSpaceService.uploadImage(
        userId,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Create entry in database
      entry = await SelfSpaceService.createEntry(
        userId, 
        'image', 
        null, 
        imagePath
      );
    }

    res.status(201).json({
      message: 'Entry created successfully',
      entry
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Handle specific multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File size too large. Maximum size is 10MB' 
      });
    }
    
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({ 
        error: 'Only image files are allowed for image uploads' 
      });
    }

    res.status(500).json({ 
      error: error.message || 'Failed to upload entry' 
    });
  }
});

/**
 * GET /api/selfspace
 * Get all entries for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await SelfSpaceService.getUserEntries(userId);

    res.status(200).json({
      message: 'Entries retrieved successfully',
      entries
    });

  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to retrieve entries' 
    });
  }
});

/**
 * GET /api/selfspace/:id
 * Get a specific entry by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Basic UUID validation
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({ error: 'Invalid entry ID format' });
    }

    const entry = await SelfSpaceService.getEntryById(userId, id);

    res.status(200).json({
      message: 'Entry retrieved successfully',
      entry
    });

  } catch (error) {
    console.error('Get entry error:', error);
    
    if (error.message === 'Entry not found') {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.status(500).json({ 
      error: error.message || 'Failed to retrieve entry' 
    });
  }
});

/**
 * DELETE /api/selfspace/:id
 * Delete a specific entry
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Basic UUID validation
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({ error: 'Invalid entry ID format' });
    }

    await SelfSpaceService.deleteEntry(userId, id);

    res.status(200).json({
      message: 'Entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete entry error:', error);
    
    if (error.message === 'Entry not found') {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.status(500).json({ 
      error: error.message || 'Failed to delete entry' 
    });
  }
});

/**
 * GET /api/selfspace/stats/summary
 * Get summary statistics for user's entries
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await SelfSpaceService.getUserEntries(userId);

    const stats = {
      total: entries.length,
      textEntries: entries.filter(e => e.type === 'text').length,
      imageEntries: entries.filter(e => e.type === 'image').length,
      latestEntry: entries.length > 0 ? entries[0].created_at : null
    };

    res.status(200).json({
      message: 'Statistics retrieved successfully',
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to retrieve statistics' 
    });
  }
});

export default router;