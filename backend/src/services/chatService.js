import { MemoryService } from './memoryService.js';
import { generateChatResponse } from './geminiService.js';

export class ChatService {
  static async processMessage(userId, sessionId, message) {
    try {
      // Get session context
      let sessionMemory = await MemoryService.getSessionMemory(sessionId);
      
      if (!sessionMemory) {
        sessionMemory = {
          session_id: sessionId,
          user_id: userId,
          chat_context: []
        };
      }

      // Add user message to context
      sessionMemory.chat_context.push({
        role: 'user',
        content: message
      });

      // Query long-term memory for relevant context
      const relevantMemories = await MemoryService.queryLongTermMemory(
        userId,
        message
      );

      // Generate response with context
      const response = await generateChatResponse(
        message,
        this.formatContextFromMemories(relevantMemories)
      );

      // Add AI response to context
      sessionMemory.chat_context.push({
        role: 'assistant',
        content: response
      });

      // Save updated session memory
      await MemoryService.saveSessionMemory(
        sessionId,
        userId,
        sessionMemory.chat_context
      );

      // Save important interactions to long-term memory
      if (this.shouldSaveToLongTerm(message, response)) {
        await MemoryService.saveLongTermMemory(userId, {
          content: message,
          response: response,
          type: 'interaction',
          mood: this.analyzeMood(message),
          topic: this.analyzeTopic(message)
        });
      }

      return {
        response,
        context: sessionMemory.chat_context
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  static formatContextFromMemories(memories) {
    return memories
      .map(memory => `Previous interaction about ${memory.metadata.topic}: ${memory.metadata.content}`)
      .join('\n');
  }

  static shouldSaveToLongTerm(message, response) {
    // Implement logic to determine if interaction should be saved long-term
    // For example, based on emotional content, topic importance, etc.
    return true; // For now, save everything
  }

  static analyzeMood(message) {
    // Implement mood analysis logic
    // For now, return neutral
    return 'neutral';
  }

  static analyzeTopic(message) {
    // Implement topic analysis logic
    // For now, return general
    return 'general';
  }
}