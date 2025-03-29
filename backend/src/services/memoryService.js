import Redis from 'ioredis';
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, initializeConfig } from '../config/index.js';

// Ensure config is initialized before accessing environment variables
await initializeConfig();

// Initialize Redis client
const redis = new Redis(config.redis.url);

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: config.pinecone.apiKey, // Removed invalid 'environment' key
});

const index = pinecone.index(config.pinecone.index);


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
  static async getUserProfile(userId) {
    try {
      const profileKey = `user:${userId}:profile`;
      const profileData = redis.get(profileKey);
      
      if (!profileData) {
        return null;
      }
      
      return JSON.parse(profileData);
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      return null;
    }
  }
  
  // Save user profile data
  static async saveUserProfile(userId, profileData) {
    try {
      const profileKey = `user:${userId}:profile`;
      await redis.set(profileKey, JSON.stringify(profileData));
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }
  
  // Update user profile data (merge with existing)
  static async updateUserProfile(userId, updatedFields) {
    try {
      const currentProfile = await this.getUserProfile(userId) || {};
      const updatedProfile = { ...currentProfile, ...updatedFields };
      return await this.saveUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  static async getSessionMemory(sessionId) {
    try {
      const data = await redis.get(`chat_session:${sessionId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error retrieving session memory:', error);
      return [];
    }
  }
  static async deleteSessionMemory(sessionId) {
    try {
      // Check if session exists first
      const existingSession = await this.getSessionMemory(sessionId);
      
      if (!existingSession) {
        console.log(`⚠️ No session found for session ID: ${sessionId}`);
        return false;
      }
  
      // Delete the session memory from Redis
      await redis.del(`chat_session:${sessionId}`);
      console.log(`✅ Session memory deleted for session ID: ${sessionId}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting session memory:', error);
      return false;
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
      const summaryPrompt = `*Task:* Summarize the following therapy conversation segment.
*Purpose:* Create a concise context summary for the AI therapist to ensure continuity in the ongoing session. This summary will replace the older messages in the conversation history.
*Instructions:*
- Focus on the *main topics* discussed (e.g., anxiety, relationship issues, work stress).
- Capture the *user's key emotional state(s)* and any significant shifts observed.
- Note *critical details, events, or figures* mentioned by the user that are central to the discussion.
- Include any specific *problems, goals, or insights* that emerged during this part of the conversation.
- Briefly mention the *therapist's main line of inquiry or support* offered.
- *Be concise but comprehensive.* Aim for significantly shorter than the original text while retaining the core therapeutic essence.
- *Format:* Use clear, narrative sentences or brief bullet points.

*Conversation Segment to Summarize:*
${conversationText}

*Concise Summary:*`; // Added a marker to encourage immediate summarization
  
      const result = await model.generateContent(summaryPrompt);
      const summary = await result.response.text();
      
      // Create a new context with the summary
      return [
        {
          role: 'user',
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
      const vector = await this.generateEmbedding(data.content);
  
      // Wrap the vector in an array to match Pinecone's expected format
      await index.upsert([{
        id: `memory:${userId}:${Date.now()}`,
        values: vector,
        metadata: {
          user_id: userId,
          content: data.content, // Include the actual content in metadata
          response: data.response, // Include the response in metadata
          type: data.type,
          mood: data.mood,
          topic: data.topic,
          timestamp: new Date().toISOString()
        }
      }]);
  
      return true;
    } catch (error) {
      console.error('❌ Error saving long-term memory:', error);
      return false;
    }
  }

  static async queryLongTermMemory(userId, query, limit = 5) {
    try {
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
      
      // Truncate embedding to match index dimensions
      return result.embedding.values.slice(0, 1024);
    } catch (error) {
      console.error("❌ Error generating embedding:", error);
      return []; // Return empty array if there's an error
    }
  }
}
