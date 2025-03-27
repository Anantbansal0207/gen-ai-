import express from 'express';
import { ChatService } from '../services/chatService.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { MemoryService } from '../services/memoryService.js';

const router = express.Router();

router.post('/chat', authenticate, async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const userId = req.user.id;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const chatResponse = await ChatService.processMessage(userId, sessionId, message);
    res.status(200).json(chatResponse);
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refresh-session', authenticate, async (req, res) => {
  console.log('Refresh session endpoint hit'); // Debug log
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Delete the existing session
    await MemoryService.deleteSessionMemory(sessionId);

    // Create a new empty session context
    await MemoryService.saveSessionMemory(sessionId, userId, []);

    res.status(200).json({ 
      message: 'Session refreshed successfully',
      sessionId 
    });
  } catch (error) {
    console.error('Session refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh session' });
  }
});

router.post('/nudge', authenticate, async (req, res) => {
  console.log('Nudge endpoint hit'); // Debug log
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required for nudge' });
    }

    // Call a new service method to handle nudge generation
    const nudgeResponse = await ChatService.generateNudge(userId, sessionId);

    res.status(200).json(nudgeResponse); // Send back the generated nudge message

  } catch (error) {
    console.error('Nudge generation error:', error);
    res.status(500).json({ error: 'Failed to generate nudge message' });
  }
});
export default router;