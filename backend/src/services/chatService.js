import { MemoryService } from './memoryService.js';
import { generateChatResponse } from './geminiService.js';
import fetch from 'node-fetch';
import { config } from '../config/index.js';
import axios from 'axios';

export class ChatService {
  static async processMessage(userId, sessionId, message) {
    console.log(`Processing message for User: ${userId}, Session: ${sessionId}`);
    console.log(`Message Content: ${message}`);

    try {
      // Get session context
      let sessionMemory = await MemoryService.getSessionMemory(sessionId);
      
      if (!sessionMemory || !sessionMemory.chat_context) {
        console.log(`Creating new session memory for Session: ${sessionId}`);
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

      console.log(`Current Chat Context Length: ${sessionMemory.chat_context.length}`);
      console.log("Detailed Chat Context:", JSON.stringify(sessionMemory.chat_context, null, 2));

      // Query long-term memory for relevant context
      console.log(`Querying Long-Term Memory for User: ${userId}`);
      const relevantMemories = await MemoryService.queryLongTermMemory(
        userId,
        message
      );

      console.log(`Found ${relevantMemories.length} Relevant Memories`);

      const relevantContext = this.formatContextFromMemories(relevantMemories);

       // Add system message with relevant memories if any
       let contextWithMemories = [...sessionMemory.chat_context];
       if (relevantContext) {
         console.log(`Adding Relevant Memory Context: ${relevantContext}`);
         contextWithMemories.unshift({
           role: 'user',
           content: `Relevant past information: ${relevantContext}`
         });
       }

      // Generate response with full context
      console.log(`Generating Chat Response`);
      const response = await generateChatResponse(
        message,
        contextWithMemories,
        `THERAPEUTIC APPROACH:
      - Active, empathetic listening
      - Non-judgmental understanding
      - Strategic emotional exploration
      - Professional, trauma-informed communication
      
      RESPONSE PRINCIPLES:
      - Reflect emotional experiences precisely
      - Guide self-reflection through thoughtful inquiry
      - Maintain compassionate professional boundaries
      - Recognize psychological subtleties
      
      CORE GUIDELINES:
      - Length: 40-100 words
      - Tone: Warmly professional
      - Focus: Client's emotional journey
      - Technique: Dynamic, adaptive support
      
      ETHICAL PRIORITIES:
      - No medical diagnosis
      - Ensure psychological safety
      - Recommend professional help if needed
      - Absolute confidentiality
      
      Respond with genuine empathy, focusing on understanding and facilitating the client's path to emotional insight.`
      );

      console.log(`Generated Response: ${response}`);

      // Add AI response to context
      sessionMemory.chat_context.push({
        role: 'assistant',
        content: response
      });

      // Save updated session memory
      console.log(`Saving Session Memory for Session: ${sessionId}`);
      await MemoryService.saveSessionMemory(
        sessionId,
        userId,
        sessionMemory.chat_context
      );

      // Summarize the context if it's getting long

      if (sessionMemory.chat_context.length > 10) {

        const isSummarizing = true; // Flag to indicate summarization

        sessionMemory.chat_context = await MemoryService.summarizeConversation(sessionMemory.chat_context);
        await MemoryService.saveSessionMemory(sessionId, userId, sessionMemory.chat_context);

        // Now, only save to long-term memory if summarization is happening

        if (this.shouldSaveToLongTerm(isSummarizing, message, response)){
          const mood = await this.analyzeMood(message);
          const topic = await this.analyzeTopic(message);
          console.log("this is the topic: "+topic);
          await MemoryService.saveLongTermMemory(userId, { 
            content: message,
            response: response,
            type: 'summary',
            mood: mood,
            topic: topic
          });
        }

    }
      return {
        response,
        context: sessionMemory.chat_context
      };
    } catch (error) {
      console.error('Critical Error Processing Message:', error);
      console.error('Error Details:', {
        userId,
        sessionId,
        message,
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      });
      throw error;
    }
  }

  static formatContextFromMemories(memories) {
    console.log(`Formatting Context from ${memories ? memories.length : 0} Memories`);
    
    if (!memories || memories.length === 0) {
      return '';
    }
    
    return memories
      .map(memory => {
        const content = memory.metadata.content || "Unknown content";
        const topic = memory.metadata.topic || "general topic";
        const mood = memory.metadata.mood || "neutral mood";
        return `Previous interaction about ${topic}: ${content}: ${mood}`;
      })
      .join('\n');
  }

  static  shouldSaveToLongTerm(isSummarizing, message, response) {
    return isSummarizing; // Properly return the boolean flag
  }

  static async analyzeMood(message) {
    console.log(`Analyzing Mood for Message: ${message.substring(0, 50)}...`);
    try {
      const HUGGINGFACE_MOOD_API_URL="https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base";
      console.log(`Sending Mood Analysis Request to: ${HUGGINGFACE_MOOD_API_URL}`);
      
      const response = await axios.post(
        HUGGINGFACE_MOOD_API_URL,
        { inputs: message },
        {
          headers: {
            Authorization: `Bearer ${config.huggingface.apiKey2}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Extract highest-confidence emotion
      const emotions = response.data[0];
      const highestEmotion = emotions.reduce((prev, current) =>
        prev.score > current.score ? prev : current
      );

      console.log("Mood Analysis Result:", {
        emotion: highestEmotion.label,
        confidence: highestEmotion.score
      });

      return highestEmotion.label; 
    } catch (error) {
      console.error("Mood Analysis Error:", {
        errorMessage: error.message,
        apiResponse: error.response ? error.response.data : 'No API response'
      });
      return "unknown";
    }
  }

  static async analyzeTopic(message) {
    console.log(`Analyzing Topic for Message: ${message.substring(0, 50)}...`);
    try {
      // Validate input
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        console.warn('Invalid message for topic analysis');
        return this.analyzeTopicWithKeywords(message);
      }
  
      // Truncate very long messages to avoid payload issues
      const truncatedMessage = message.substring(0, 500);
  
      // HuggingFace API endpoint for inference
      const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
      
      // Therapy-relevant topic labels to classify against
      const candidateLabels = [
        "mental health",      // Covers anxiety, depression, grief, trauma
        "relationships",      // Covers romantic, family, friendships, identity
        "work & career",      // Covers work-stress, life-transition
        "self-esteem",        // Covers self-worth, confidence issues
        "addiction",          // Stays as it is
        "sleep issues",       // Stays as it is
        "health concerns",    // Covers health-anxiety, chronic illness stress
        "parenting",          // Stays as it is
        "loneliness",         // Stays as it is
        "existential crisis"  // Stays as it is
      ];
  
      // Prepare the request payload with more robust error checking
      const payload = {
        inputs: truncatedMessage,
        parameters: {
          candidate_labels: candidateLabels,
          multi_label: false
        }
      };
  
      // Make API call to Hugging Face with additional error handling
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.huggingface.apiKey2}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      // Check response status
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Hugging Face API Error: ${response.status}`, errorBody);
        throw new Error(`Hugging Face API returned ${response.status}: ${errorBody}`);
      }
  
      const result = await response.json();
      
      // Validate result structure
      if (!result.labels || !result.scores) {
        console.warn('Unexpected API response structure');
        return this.analyzeTopicWithKeywords(message);
      }
      
      // Get the highest scoring label
      const topLabelIndex = result.scores.indexOf(Math.max(...result.scores));
      const topLabel = result.labels[topLabelIndex];
      
      // Only accept the classification if confidence is reasonable
      if (result.scores[topLabelIndex] > 0.3) {
        return topLabel;
      }
      
      // Fallback to secondary analysis for low-confidence results
      return this.analyzeTopicWithKeywords(message);
    } catch (error) {
      console.error('Error using Hugging Face for topic analysis:', 
        error.message, 
        error.response ? error.response.data : 'No additional error details'
      );
      
      // Always fall back to keyword analysis
      return this.analyzeTopicWithKeywords(message);
    }
  }

  // Fallback method using keyword matching
  static analyzeTopicWithKeywords(message) {
    console.log(`Analyzing Topic with Keyword Method: ${message.substring(0, 50)}...`);
    const messageLower = message.toLowerCase();
    
    // Topic keywords mapping
    const topicKeywords = {
      'anxiety': ['anxious', 'worry', 'nervous', 'panic', 'stress', 'overwhelm', 'fear'],
      'depression': ['depressed', 'sad', 'hopeless', 'empty', 'unmotivated', 'tired', 'despair'],
      'relationships': ['partner', 'marriage', 'boyfriend', 'girlfriend', 'family', 'friend', 'coworker'],
      'grief': ['loss', 'death', 'died', 'passed away', 'miss', 'grieving', 'mourning'],
      'trauma': ['trauma', 'ptsd', 'abuse', 'assault', 'flashback', 'nightmare', 'trigger'],
      'self-esteem': ['confidence', 'worth', 'failure', 'inadequate', 'not good enough', 'self-image'],
      'work-stress': ['job', 'career', 'workplace', 'boss', 'burnout', 'overworked', 'deadline'],
      'identity': ['identity', 'purpose', 'meaning', 'values', 'goals', 'sexuality', 'gender'],
      'addiction': ['addiction', 'substance', 'alcohol', 'drinking', 'drugs', 'gambling', 'recovery'],
      'sleep': ['insomnia', 'sleep', 'tired', 'fatigue', 'nightmare', 'rest', 'exhausted'],
      'health-anxiety': ['health', 'illness', 'disease', 'symptoms', 'doctor', 'medical', 'diagnosis'],
      'life-transition': ['change', 'transition', 'move', 'new job', 'graduation', 'retirement', 'milestone']
    };
    
    // Count keyword matches for each topic
    const topicScores = {};
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      topicScores[topic] = 0;
      keywords.forEach(keyword => {
        if (messageLower.includes(keyword)) {
          topicScores[topic]++;
        }
      });
    }
    
    // Find topic with highest score
    let maxScore = 0;
    let detectedTopic = 'general-discussion';
    
    for (const [topic, score] of Object.entries(topicScores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedTopic = topic;
      }
    }
    
    console.log(`Keyword Topic Detection Result: ${detectedTopic} (Score: ${maxScore})`);
    
    return maxScore > 0 ? detectedTopic : 'general-discussion';
  }
}