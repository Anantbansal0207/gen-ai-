import Redis from 'ioredis';
import { PineconeClient } from 'pinecone-client';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, initializeConfig } from '../config/index.js'; //

// Ensure config is initialized before accessing environment variables
await initializeConfig();

// Initialize Redis client
const redis = new Redis(config.redis.url);

// Initialize Pinecone client
const pinecone = new PineconeClient({
  apiKey: config.pinecone.apiKey,
  environment: config.pinecone.environment
});

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export class MemoryService {
  // Short-term memory management (Redis)
  static async saveSessionMemory(sessionId, userId, context) {
    try {
      const sessionData = {
        session_id: sessionId,
        user_id: userId,
        chat_context: context,
        expires_in: 1800 // 30 minutes in seconds
      };
      
      await redis.setex(`chat_session:${sessionId}`, 1800, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('❌ Error saving session memory:', error);
      return false;
    }
  }

  static async getSessionMemory(sessionId) {
    try {
      const data = await redis.get(`chat_session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Error retrieving session memory:', error);
      return null;
    }
  }

  static async summarizeConversation(context) {
    try {
      // Only summarize if there are enough messages
      if (context.length < 6) {
        return context;
      }
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Extract the conversation as a string
      const conversationText = context.map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n');
      
      // Request a summary
      const summaryPrompt = `Summarize the following therapy conversation while preserving key emotional context, important details, and therapeutic insights. Keep the summary concise but comprehensive:
  
  ${conversationText}`;
  
      const result = await model.generateContent(summaryPrompt);
      const summary = await result.response.text();
      
      // Create a new context with the summary
      return [
        {
          role: 'system',
          content: `Previous conversation summary: ${summary}`
        },
        // Keep the last 2 exchanges (4 messages) for immediate context
        ...context.slice(-4)
      ];
    } catch (error) {
      console.error('❌ Error summarizing conversation:', error);
      return context; // Return original context if summarization fails
    }
  }

  // Long-term memory management (Pinecone)
  static async saveLongTermMemory(userId, data) {
    try {
      const index = pinecone.Index(config.pinecone.index);
      const vector = await this.generateEmbedding(data.content);

      await index.upsert({
        vectors: [{
          id: `memory:${userId}:${Date.now()}`,
          values: vector,
          metadata: {
            user_id: userId,
            type: data.type,
            mood: data.mood,
            topic: data.topic,
            timestamp: new Date().toISOString()
          }
        }]
      });

      return true;
    } catch (error) {
      console.error('❌ Error saving long-term memory:', error);
      return false;
    }
  }

  static async queryLongTermMemory(userId, query, limit = 5) {
    try {
      const index = pinecone.Index(config.pinecone.index);
      const queryVector = await this.generateEmbedding(query);

      const results = await index.query({
        vector: queryVector,
        filter: { user_id: userId },
        topK: limit,
        includeMetadata: true
      });

      return results.matches;
    } catch (error) {
      console.error('❌ Error querying long-term memory:', error);
      return [];
    }
  }

  // Helper method to generate embeddings using Gemini AI
  static async generateEmbedding(text) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-embedding-exp-03-07" });
      const result = await model.embedContent(text);
      return result.embedding.values; // Returns the vector representation of text
    } catch (error) {
      console.error("❌ Error generating embedding:", error);
      return []; // Return empty array if there's an error
    }
  }
}
