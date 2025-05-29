// Enhanced ChatService with improved AI detection prevention and SOS crisis handling
import { MemoryService } from './memoryService.js';
import { generateChatResponse } from './geminiService.js';
import fetch from 'node-fetch';
import TopicAnalyzer from './topicAnalyzer.js';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, initializeConfig } from '../config/index.js';
import { 
  BASE_THERAPIST_PROMPT,
  INTRO_PROMPT,
  WELCOME_BACK_PROMPT,
  ONBOARDING_PROMPT,
  PERSONAL_CONVO_PROMPT
} from './prompts.js';

// Import our enhanced detection functions
import {
  detectTechnicalRequest,
  containsAITerm,
  refineTherapyResponse,
  preprocessUserMessage,
  humanizeTherapyResponse
} from './aiDetectionPrevention.js';

// Ensure the configuration is loaded before using it
await initializeConfig();

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

function shouldIncludeNameInContext(sessionMemory, userName) {
  if (!userName) return false;
  
  // Only include name in roughly 15% of messages
  const randomChance = Math.random() < 0.2;
  
  // Count recent messages to avoid consecutive name usage
  const recentMessages = sessionMemory.chat_context
    .filter(msg => msg.role === 'assistant')
    .slice(-3); // Look at last 3 assistant messages
  
  // Check if name was used in recent messages
  const namePattern = new RegExp(`\\b${userName}\\b`, 'i');
  const nameUsedRecently = recentMessages.some(msg => 
    namePattern.test(msg.content)
  );
  
  // Only include name if random chance hits AND name wasn't used recently
  return randomChance && !nameUsedRecently;
}

export class ChatService {
  /**
   * Process user message with Redis-based crisis blocking
   */
  static async processMessage(userId, sessionId, message) {
    console.log(`📨 Processing message for User: ${userId}, Session: ${sessionId}`);
    console.log(`💬 Message Content: ${message || 'EMPTY (Auto Welcome)'}`);

    try {
      // Check if user is blocked due to SOS crisis (from Redis with auto-expiration)
      const blockedStatus = await MemoryService.isUserBlocked(userId);
      
      if (blockedStatus) {
        console.log(`🚫 User ${userId} is blocked due to previous SOS crisis`);
        
        // Get crisis details for context
        const crisisStatus = await MemoryService.getUserCrisisStatus(userId);
        
        const blockedResponse = `I'm still concerned about your wellbeing. Please contact the crisis resources I shared earlier:

• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911

Your safety is the priority right now. Please reach out to professional crisis counselors.

🕒 This restriction will automatically lift in ${Math.ceil(blockedStatus.timeRemaining / 3600)} hours.`;

        return {
          response: blockedResponse,
          context: [],
          userBlocked: true,
          blockReason: 'SOS_CRISIS_CONTINUED',
          crisisTimestamp: crisisStatus?.crisisTimestamp,
          timeRemaining: blockedStatus.timeRemaining,
          expiresAt: blockedStatus.expiresAt
        };
      }

      // FIRST: Check if this is a technical request or SOS situation and handle it immediately
      if (message && message.trim() !== '') {
        const preprocessResult = await preprocessUserMessage(message, genAI);
        
        // Handle SOS situations with user blocking
        if (preprocessResult.intent === 'SELF_HARM_INTENT') {
          console.log('🚨 SOS Crisis detected - blocking user in Redis with 24-hour auto-expiration');
          
          // Mark user in crisis using MemoryService (automatically sets Redis expiration)
          const crisisInfo = await MemoryService.markUserInCrisis(userId, {
            message: message,
            sessionId: sessionId,
            detectedKeywords: preprocessResult.keywords || []
          });
          
          // Save the SOS interaction to session memory
          let sessionMemory = await MemoryService.getSessionMemory(sessionId);
          if (!sessionMemory || !sessionMemory.chat_context) {
            sessionMemory = {
              session_id: sessionId,
              user_id: userId,
              chat_context: []
            };
          }
          
          // Add user message and crisis response to context
          const updatedContext = [
            ...((sessionMemory.chat_context) || []),
            {
              role: 'user',
              content: message,
              timestamp: new Date().toISOString()
            },
            {
              role: 'assistant',
              content: preprocessResult.response,
              timestamp: new Date().toISOString(),
              type: 'crisis_response'
            }
          ];
          
          await MemoryService.saveSessionMemory(sessionId, userId, updatedContext);
          
          return {
            response: preprocessResult.response,
            context: updatedContext,
            userBlocked: true,
            blockReason: 'SOS_CRISIS',
            crisisInfo: crisisInfo,
            autoUnblockIn: '24 hours',
            blockExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          };
        }y
        
        // Handle technical requests
        if (preprocessResult.shouldBlock) {
          console.log('Technical request blocked - returning therapy deflection');
          
          // Still save this interaction to memory but mark it as deflected
          let sessionMemory = await MemoryService.getSessionMemory(sessionId);
          if (!sessionMemory || !sessionMemory.chat_context) {
            sessionMemory = {
              session_id: sessionId,
              user_id: userId,
              chat_context: []
            };
          }
          
          sessionMemory.chat_context.push({
            role: 'user',
            content: message
          });
          
          sessionMemory.chat_context.push({
            role: 'assistant',
            content: preprocessResult.response
          });
          
          await MemoryService.saveSessionMemory(sessionId, userId, sessionMemory.chat_context);
          
          return {
            response: preprocessResult.response,
            context: sessionMemory.chat_context
          };
        }
      }

      console.log(message);
      // Get session context
      if(message=='1236') {
        await MemoryService.deleteUserProfile(userId); 
        console.log('delete session cleared');
      }
      
      let sessionMemory = await MemoryService.getSessionMemory(sessionId);
      let isFirstInteraction = false;
      let isOnboarding = false;
      let isWelcomeBack = false;
      let isAutoWelcome = !message || message.trim() === '';
      let customPrompt = BASE_THERAPIST_PROMPT;
      let userName = null;

      // Get user profile data if it exists
      const userProfile = await MemoryService.getUserProfile(userId);

      // Check if this is a brand new user with no history
      if (!sessionMemory || !sessionMemory.chat_context) {
        console.log(`Creating new session memory for Session: ${sessionId}`);
        sessionMemory = {
          session_id: sessionId,
          user_id: userId,
          chat_context: []
        };
      }
        
      // If user has no profile, this is the first interaction ever
      if (!userProfile || !userProfile.name) {
        isFirstInteraction = true;
        customPrompt = INTRO_PROMPT;
        console.log('First interaction detected, using introduction prompt');
      }
      
      // Check if we're in the onboarding phase
      if (userProfile && userProfile.name && !userProfile.onboardingComplete) {
        isOnboarding = true;
        userName = userProfile.name;
        customPrompt = ONBOARDING_PROMPT;
        console.log(`Onboarding phase for user ${userName}`);
      } 
      // If user has a complete profile, use personalized prompt
      else if (userProfile && userProfile.name && userProfile.onboardingComplete) {
        userName = userProfile.name;
        
        if (isAutoWelcome) {
          isWelcomeBack = true;
          customPrompt = WELCOME_BACK_PROMPT.replace('{userName}', userName);
          console.log(`Welcome back trigger for returning user ${userName}`);
        } else {
          customPrompt = BASE_THERAPIST_PROMPT;
          console.log(`Personalized conversation for returning user ${userName}`);
        }
      }

      // Only add user message to context if it's not an auto welcome
      sessionMemory.chat_context.push({
        role: 'user',
        content: message
      });

      console.log(`Current Chat Context Length: ${sessionMemory.chat_context.length}`);

      // Query memory for context
      let relevantMemories = [];
      let relevantContext = '';
      
      if (!isFirstInteraction && !isOnboarding && !isWelcomeBack && !isAutoWelcome) {
        console.log(`Querying Long-Term Memory for User: ${userId}`);
        relevantMemories = await MemoryService.queryLongTermMemory(userId, message);
        console.log(`Found ${relevantMemories.length} Relevant Memories`);
        relevantContext = this.formatContextFromMemories(relevantMemories);
      }

      // Build context with memories and user profile
      let contextWithMemories = [...sessionMemory.chat_context];
      if (relevantContext) {
        console.log(`Adding Relevant Memory Context: ${relevantContext}`);
        contextWithMemories.unshift({
          role: 'user',
          content: `Relevant past information: ${relevantContext}`
        });
      }

      // Enhanced user profile handling
      if (userName) {
        const shouldIncludeName = shouldIncludeNameInContext(sessionMemory, userName);
      
        let userInfo = '';
        let profileSummary = '';
      
        if (shouldIncludeName) {
          userInfo = `[CRITICAL CLIENT INFORMATION]
      The client's name is: ${userName}. Use their name sometimes (30 percent) in your responses. Use their name once in your response in a natural way.`;
          console.log(`Including instruction to use ${userName}'s name in this response`);
      
          if (userProfile.onboardingSummary) {
            profileSummary = `
      
      [CLIENT PROFILE - ESSENTIAL CONTEXT]
      ${userProfile.onboardingSummary}
      
      [INSTRUCTIONS FOR USING PROFILE DATA]
      - Reference specific details from this profile in your responses
      - Tailor your therapeutic approach based on the client's background
      - Remember their history and previous challenges
      - Use this information to personalize your support
      - Show you remember who they are through subtle references`;
          }
        } else {
          console.log(`Excluding name usage for this response`);
          userInfo = `[CRITICAL CLIENT INFORMATION]
      DO NOT use their name in this response.`;
          // profileSummary remains empty
        }
      
        contextWithMemories.unshift({
          role: 'user',
          content: userInfo + profileSummary
        });
      }
      

      // Generate response
      console.log(`Generating response...`);
      const userMessage = isAutoWelcome ? '' : message;
      
      const response = await generateChatResponse(
        userMessage,
        contextWithMemories,
        customPrompt
      );
      
      let processedResponse = response;
      console.log(`Initial Response: ${response}`);
      
      // Check for AI terms and refine if needed
      const check = containsAITerm(response);
      if (check.found) {
        console.log(`AI identifying term "${check.keyword}" found in response. Refining...`);
        processedResponse = await refineTherapyResponse(response, genAI);
        console.log(`Refined Response: ${processedResponse}`);
      } else {
        console.log('No AI identifying terms found in response.');
      }

      // Apply therapy-specific humanization
      console.log('Applying therapy-specific humanization...');
      const finalResponse = await humanizeTherapyResponse(processedResponse);
      console.log(`Humanized Response: ${finalResponse}`);

      // Add AI response to context
      sessionMemory.chat_context.push({
        role: 'assistant',
        content: finalResponse
      });
      
      // Handle name extraction for first interaction
      if (isFirstInteraction && !userProfile && !isAutoWelcome) {
        const extractedName = await this.extractUserName(message, finalResponse);
        if (extractedName) {
          console.log(`Extracted user name: ${extractedName}`);
          await MemoryService.saveUserProfile(userId, {
            name: extractedName,
            onboardingComplete: false,
            firstSessionDate: new Date().toISOString()
          });
          userName = extractedName;
        }
      }
      
      // Handle onboarding completion
      if (isOnboarding && sessionMemory.chat_context.length >= 10) {
        console.log(`Marking onboarding as complete for user ${userName}`);
        const onboardingSummary = await this.generateOnboardingSummary(sessionMemory.chat_context, userName);
        await MemoryService.updateUserProfile(userId, { 
          onboardingComplete: true,
          onboardingSummary: onboardingSummary
        });
      }

      // Save session memory
      console.log(`Saving Session Memory for Session: ${sessionId}`);
      await MemoryService.saveSessionMemory(sessionId, userId, sessionMemory.chat_context);

      // Handle summarization for long conversations
      if (sessionMemory.chat_context.length > 20 && !isAutoWelcome) {
        const isSummarizing = true;
        console.log(`Context length > 20, attempting summarization for Session: ${sessionId}`);

        const summarizedContext = await MemoryService.summarizeConversation(sessionMemory.chat_context);

        if (summarizedContext !== sessionMemory.chat_context) {
          sessionMemory.chat_context = summarizedContext;
          console.log(`Summarization complete. New context length: ${sessionMemory.chat_context.length}`);
          await MemoryService.saveSessionMemory(sessionId, userId, sessionMemory.chat_context);

          if (this.shouldSaveToLongTerm(isSummarizing, message, finalResponse)) {
            console.log(`Saving summarized interaction to long-term memory for User: ${userId}`);
            const mood = await TopicAnalyzer.analyzeMood(message);
            const topic = await TopicAnalyzer.analyzeTopic(message);
            console.log(`Determined Mood: ${mood}, Topic: ${topic}`);
            await MemoryService.saveLongTermMemory(userId, {
              content: message,
              response: finalResponse,
              type: 'summary_interaction',
              mood: mood,
              topic: topic
            });
          }
        } else {
          console.log(`Summarization skipped or failed for Session: ${sessionId}`);
        }
      }

      return {
        response: finalResponse,
        context: sessionMemory.chat_context
      };
      
    } catch (error) {
      console.error('Critical Error Processing Message:', error);
      console.error('Error Details:', {
        userId,
        sessionId,
        message: message ? message.substring(0, 100) + '...' : 'EMPTY (Auto Welcome)',
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      });
      throw new Error('Failed to process chat message due to an internal server error.');
    }
  }
  // Existing helper methods
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

  static shouldSaveToLongTerm(isSummarizing, message, response) {
    return isSummarizing;
  }

  static async extractUserName(userMessage, aiResponse) {
    try {
      if (!userMessage || userMessage.trim() === '') {
        return null;
      }
      
      const extractPrompt = `
      Based on this conversation exchange, extract the user's name if they shared it.
      Only return the name, nothing else. If no name is found, return "NULL".
      
      User message: "${userMessage}"
      AI response: "${aiResponse}"
      `;
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(extractPrompt);
      const extractedText = result.response.text().trim();
      
      return extractedText === "NULL" ? null : extractedText;
    } catch (error) {
      console.error('Error extracting user name:', error);
      return null;
    }
  }
  
  static async generateOnboardingSummary(chatContext, userName) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const summaryPrompt = `
    Based on this conversation, create a concise summary (150-200 words) of key information learned during their initial therapy sessions. 
    
    IMPORTANT: Include the following information if mentioned:
    1. Don't include name here
    2. Their age (exact number if mentioned)
    3. Their occupation/profession
    4. Their likely gender based on context and name
    5. Primary concerns or goals they mentioned
    6. Notable emotional patterns or challenges
    7. Important life context (relationships, family situation, etc.)
    8. Previous coping strategies they've found helpful
    9. Communication preferences or response styles they seem to prefer
    
    Format as a professional clinical summary that captures essential context for future therapeutic conversations.
    `;
    
    const conversationOnly = chatContext.filter(msg => 
      msg.role === 'user' || msg.role === 'assistant');
    
    const conversationText = conversationOnly.map(msg => 
      `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
    
    try {
      const result = await model.generateContent([summaryPrompt, conversationText]);
      const summary = result.response.text();
      console.log(`Generated onboarding summary for ${userName}`);
      return summary;
    } catch (error) {
      console.error('Error generating onboarding summary:', error);
      return `${userName} - Basic information captured during onboarding.`;
    }
  }
  //Not very importan for now
    static async adminUnblockUser(userId, adminId) {
    try {
      console.log(`👤 Admin ${adminId} attempting to unblock user ${userId}`);
      
      const result = await MemoryService.unblockUser(userId, adminId);
      
      if (result.success) {
        console.log(`✅ Admin unblock successful for user ${userId}`);
        return {
          success: true,
          message: `User ${userId} has been successfully unblocked by admin ${adminId}`,
          unblockTimestamp: new Date().toISOString(),
          previousBlockInfo: result.previousBlockInfo
        };
      } else {
        console.log(`⚠️ Admin unblock failed for user ${userId}: ${result.message}`);
        return {
          success: false,
          message: result.message,
          userId: userId,
          adminId: adminId
        };
      }
    } catch (error) {
      console.error('❌ Error in admin unblock operation:', error);
      return {
        success: false,
        message: 'An error occurred while attempting to unblock the user',
        error: error.message,
        userId: userId,
        adminId: adminId
      };
    }
  }
    static async getBlockedUsersDetails() {
    try {
      const blockedUsers = await MemoryService.getAllBlockedUsers();
      
      // Get additional details for each blocked user
      const detailedUsers = await Promise.all(
        blockedUsers.map(async (user) => {
          const crisisStatus = await MemoryService.getUserCrisisStatus(user.userId);
          const userProfile = await MemoryService.getUserProfile(user.userId);
          
          return {
            ...user,
            crisisDetails: crisisStatus,
            hasProfile: !!userProfile,
            formattedTimeRemaining: this.formatTimeRemaining(user.timeRemaining)
          };
        })
      );

      return {
        success: true,
        totalBlocked: blockedUsers.length,
        users: detailedUsers,
        retrievedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error getting blocked users details:', error);
      return {
        success: false,
        error: error.message,
        users: []
      };
    }
  }

  /**
   * Check if a specific user is currently blocked
   */
  static async checkUserBlockStatus(userId) {
    try {
      const blockStatus = await MemoryService.isUserBlocked(userId);
      const crisisStatus = await MemoryService.getUserCrisisStatus(userId);
      
      return {
        userId,
        isBlocked: !!blockStatus,
        blockInfo: blockStatus,
        crisisInfo: crisisStatus,
        checkedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Error checking block status for user ${userId}:`, error);
      return {
        userId,
        isBlocked: false,
        error: error.message,
        checkedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Utility function to format time remaining in human-readable format
   */
  static formatTimeRemaining(seconds) {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
}