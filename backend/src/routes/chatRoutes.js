import express from 'express';
import { ChatService } from '../services/chatService.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body;

    if (!userId || !sessionId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process message using ChatService
    const chatResponse = await ChatService.processMessage(userId, sessionId, message);

    res.status(200).json(chatResponse);
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
