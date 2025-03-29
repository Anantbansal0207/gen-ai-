import { MemoryService } from './memoryService.js';
import { generateChatResponse } from './geminiService.js';
import fetch from 'node-fetch';
import { config } from '../config/index.js';
import axios from 'axios';

// --- Base Therapist Prompt (Defined once for consistency) ---
const BASE_THERAPIST_PROMPT = `
  You are Dr. Alex Morgan, an AI therapist.
  THERAPEUTIC APPROACH:
- Active, empathetic listening
- Non-judgmental understanding
- Strategic emotional exploration
- Professional, trauma-informed communication

RESPONSE PRINCIPLES:
- Reflect emotional experiences precisely
- Guide self-reflection through thoughtful inquiry
- Maintain compassionate professional boundaries
- Recognize psychological subtleties
- Personalize conversation by using the client's name occasionally

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

Respond with genuine empathy, focusing on understanding and facilitating the client's path to emotional insight.`;

// New personalized introduction prompt
const INTRO_PROMPT = `You are an AI therapist named Dr. Alex Morgan. 
Introduce yourself warmly and briefly to the user.
Ask for their name in a conversational way.
Mention that you're here to listen and support them.
Keep your introduction under 100 words and make it feel welcoming.
Sign your message as "- Dr. Alex"`;

// Welcome back prompt for returning users
const WELCOME_BACK_PROMPT = `You are Dr. Alex Morgan, an AI therapist welcoming back {userName}.
Create a warm, personal welcome back message that:
1. Greets them by name
2. Expresses genuine pleasure at seeing them again
3. References that you've spoken before (but don't mention specific details from previous sessions)
4. Invites them to share what's on their mind today
Keep it under 100 words and maintain a warm, supportive tone.
Sign your message as "- Dr. Alex"`;

// Onboarding questions prompt to gather information naturally
const ONBOARDING_PROMPT = `You are Dr. Alex Morgan, an AI therapist having a conversation with a new client named {userName}.
This is an initial session to get to know them better.
Ask ONE natural, conversational question at a time from the following list (don't ask multiple questions at once):
1. What brings them to therapy today or what they hope to work on
2. How they're feeling overall lately (to assess general mood)
3. What aspects of their life they'd like to discuss (work, relationships, personal growth)
4. What they've found helpful in managing their wellbeing in the past

Be warm, empathetic, and conversational - avoid clinical or diagnostic language.
Respond to what they share before asking the next question.
Sign your message as "- Dr. Alex"`;

const PERSONAL_CONVO_PROMPT = `You are Dr. Alex Morgan, an AI therapist talking with {userName}.
You already know them from previous conversations.
Refer to their previous topics and feelings when appropriate.
Use their name occasionally in your responses to maintain a personal connection.
Remember to sign your messages as "- Dr. Alex"`;
const PROBING_NUDGE_PROBABILITY = 0.6;

export class ChatService {
  static async processMessage(userId, sessionId, message) {
    console.log(`Processing message for User: ${userId}, Session: ${sessionId}`);
    console.log(`Message Content: ${message || 'EMPTY (Auto Welcome)'}`);

    try {
      // Get session context
      let sessionMemory = await MemoryService.getSessionMemory(sessionId);
      let isFirstInteraction = false;
      let isOnboarding = false;
      let isWelcomeBack = false;
      let isAutoWelcome = !message || message.trim() === ''; // Check if this is an auto welcome (empty message)
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
        
        // If user has no profile, this is the first interaction ever
        if (!userProfile || !userProfile.name) {
          isFirstInteraction = true;
          customPrompt = INTRO_PROMPT;
          console.log('First interaction detected, using introduction prompt');
        }
      }
      
      // Check if we're in the onboarding phase (user has started but not completed profile)
      if (userProfile && userProfile.name && !userProfile.onboardingComplete) {
        isOnboarding = true;
        userName = userProfile.name;
        customPrompt = ONBOARDING_PROMPT.replace('{userName}', userName);
        console.log(`Onboarding phase for user ${userName}`);
      } 
      // If user has a complete profile, use personalized prompt
      else if (userProfile && userProfile.name && userProfile.onboardingComplete) {
        userName = userProfile.name;
        
        // If this is an auto welcome call for a returning user, use the welcome back prompt
        if (isAutoWelcome) {
          isWelcomeBack = true;
          customPrompt = WELCOME_BACK_PROMPT.replace('{userName}', userName);
          console.log(`Welcome back trigger for returning user ${userName}`);
        } else {
          customPrompt = PERSONAL_CONVO_PROMPT.replace('{userName}', userName);
          console.log(`Personalized conversation for returning user ${userName}`);
        }
      }

      // Only add user message to context if it's not an auto welcome
      if (!isAutoWelcome) {
        sessionMemory.chat_context.push({
          role: 'user',
          content: message
        });
      }

      console.log(`Current Chat Context Length: ${sessionMemory.chat_context.length}`);

      // For first-time users, don't query memory since there isn't any
      let relevantMemories = [];
      let relevantContext = '';
      
      if (!isFirstInteraction && !isOnboarding && !isWelcomeBack && !isAutoWelcome) {
        // Only query memory for actual user messages, not auto welcomes
        // Query long-term memory for relevant context
        console.log(`Querying Long-Term Memory for User: ${userId}`);
        relevantMemories = await MemoryService.queryLongTermMemory(
          userId,
          message
        );

        console.log(`Found ${relevantMemories.length} Relevant Memories`);
        relevantContext = this.formatContextFromMemories(relevantMemories);
      }

      // Add system message with relevant memories if any
      let contextWithMemories = [...sessionMemory.chat_context];
      if (relevantContext) {
        console.log(`Adding Relevant Memory Context: ${relevantContext}`);
        contextWithMemories.unshift({
          role: 'user', // Using 'user' role for context injection seems to work well with Gemini
          content: `Relevant past information: ${relevantContext}`
        });
      }

      // If we have user profile info, add it to the context
      if (userName) {
        contextWithMemories.unshift({
          role: 'user',
          content: `Important: The client's name is ${userName}. Use their name occasionally in your responses.`
        });
      }

      // Generate response with full context using the appropriate prompt
      console.log(`Generating ${isAutoWelcome ? 'Auto Welcome' : 'Chat'} Response with ${isFirstInteraction ? 'intro' : isWelcomeBack ? 'welcome back' : isOnboarding ? 'onboarding' : 'standard'} prompt`);
      
      // For auto welcome, we pass an empty message
      const userMessage = isAutoWelcome ? '' : message;
      
      const response = await generateChatResponse(
        userMessage,
        contextWithMemories,
        customPrompt
      );

      console.log(`Generated Response: ${response}`);

      // Add AI response to context
      sessionMemory.chat_context.push({
        role: 'assistant',
        content: response
      });
      
      if (isFirstInteraction && !userProfile && !isAutoWelcome) {
        // Only try to extract names from actual user messages, not auto welcomes
        const extractedName = await this.extractUserName(message, response);
        if (extractedName) {
          console.log(`Extracted user name: ${extractedName}`);
          await MemoryService.saveUserProfile(userId, {
            name: extractedName,
            onboardingComplete: false,
            firstSessionDate: new Date().toISOString()
          });
          // Update userName for the current session
          userName = extractedName;
        }
      }
      
      // If in onboarding, check if we should mark onboarding as complete
      if (isOnboarding && sessionMemory.chat_context.length >= 10) {
        console.log(`Marking onboarding as complete for user ${userName}`);
        await MemoryService.updateUserProfile(userId, { onboardingComplete: true });
      }

      // Save updated session memory
      console.log(`Saving Session Memory for Session: ${sessionId}`);
      await MemoryService.saveSessionMemory(
        sessionId,
        userId,
        sessionMemory.chat_context
      );

      // Summarize the context and potentially save to long-term memory
      // Skip summarization for auto welcome messages since they're not actual interactions
      if (sessionMemory.chat_context.length > 10 && !isAutoWelcome) {
        const isSummarizing = true; // Flag to indicate summarization
        console.log(`Context length > 10, attempting summarization for Session: ${sessionId}`);

        // Perform summarization
        const summarizedContext = await MemoryService.summarizeConversation(sessionMemory.chat_context);

        // Check if summarization actually changed the context (it might return original if too short)
        if (summarizedContext !== sessionMemory.chat_context) {
          sessionMemory.chat_context = summarizedContext;
          console.log(`Summarization complete. New context length: ${sessionMemory.chat_context.length}`);

          // Save the new summarized context back to Redis
          await MemoryService.saveSessionMemory(sessionId, userId, sessionMemory.chat_context);

          // Save to long-term memory only after successful summarization
          if (this.shouldSaveToLongTerm(isSummarizing, message, response)) {
            console.log(`Saving summarized interaction to long-term memory for User: ${userId}`);
            const mood = await this.analyzeMood(message); // Analyze original user message
            const topic = await this.analyzeTopic(message); // Analyze original user message
            console.log(`Determined Mood: ${mood}, Topic: ${topic}`);
            await MemoryService.saveLongTermMemory(userId, {
              content: message, // Original user message
              response: response, // AI response to that message
              type: 'summary_interaction', // Mark as part of a summarized interaction
              mood: mood,
              topic: topic
            });
          }
        } else {
          console.log(`Summarization skipped or failed for Session: ${sessionId}`);
        }
      }

      return {
        response,
        context: sessionMemory.chat_context // Return the potentially updated context
      };
    } catch (error) {
      console.error('Critical Error Processing Message:', error);
      console.error('Error Details:', {
        userId,
        sessionId,
        message: message ? message.substring(0, 100) + '...' : 'EMPTY (Auto Welcome)', // Avoid logging potentially large messages fully
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack // Include stack for better debugging
      });
      // Consider throwing a more user-friendly error or a specific error type
      throw new Error('Failed to process chat message due to an internal server error.');
    }
  }

  // --- NEW METHOD for generating inactivity nudge ---
  static async generateNudge(userId, sessionId) {
    console.log(`Generating nudge for User: ${userId}, Session: ${sessionId}`);

    try {
      // 1. Get current session context
      const sessionMemory = await MemoryService.getSessionMemory(sessionId);

      // 2. Validate session and context existence
      if (!sessionMemory || !sessionMemory.chat_context || sessionMemory.chat_context.length === 0) {
        console.warn(`Cannot generate nudge: Session ${sessionId} not found or has empty context.`);
        return { response: null };
      }

      // Use the full chat context provided to the generation function later
      const chatContext = sessionMemory.chat_context;

      // 3. Decide Nudge Type (Random Choice)
      const nudgeTypeRoll = Math.random();
      // Require at least one user message and one AI response for a meaningful probing nudge
      const canProbe = chatContext.some(m => m.role === 'user') && chatContext.some(m => m.role === 'assistant');
      const useProbingNudge = nudgeTypeRoll < PROBING_NUDGE_PROBABILITY && canProbe;

      let systemPromptForNudge = "";
      const nudgeUserPrompt = ""; // User prompt is not needed for the nudge itself

      if (useProbingNudge) {
        console.log(`Nudge Type: Probing (Roll: ${nudgeTypeRoll.toFixed(2)})`);

        // Construct the probing system prompt - Instructs AI to analyze the provided history
        systemPromptForNudge = `You are the AI therapist from the ongoing conversation. The user has paused after your last response.
        Your task is to gently re-engage them by asking ONE thoughtful, open-ended, reflective question based on the conversation history provided to you.

        Instructions:
        1. Review the recent flow of the conversation history you received.
        2. Identify a key theme, emotion, event, or point mentioned by the user that seems significant or could benefit from further exploration.
        3. Formulate ONE concise (under 25 words) question related to that identified point.
        4. The question should encourage deeper reflection or elaboration. Avoid simple check-ins like "take your time" or generic "how are you feeling?". Focus on connecting to the *content* of the past exchange.
        5. Maintain your core empathetic, non-judgmental therapist persona: ${BASE_THERAPIST_PROMPT}

        Example Question Styles (adapt based on your analysis of the history):
        - "Reflecting on when you mentioned [topic/feeling from history], what's coming up for you now?"
        - "You talked about [event/person from history] earlier. I'm curious how that thread connects to where we are now?"
        - "What feelings are present for you as you pause here, considering our discussion about [theme from history]?"
        - "Could exploring [specific detail user mentioned in history] further be helpful right now?"

        Ask only the single question. Do not add any preamble like "I noticed you paused...".`; // Added instruction to be direct

      } else {
        console.log(`Nudge Type: Gentle Check-in (Roll: ${nudgeTypeRoll.toFixed(2)}, Can Probe: ${canProbe})`);
        // Use the original gentle check-in prompt
        systemPromptForNudge = `You are the AI therapist from the ongoing conversation. The user has paused for a short while after your last response. Offer a *gentle, brief, and non-pressuring* check-in to re-engage them softly. Avoid making demands or sounding impatient. Examples: "Just checking in, take your time.", "No rush, just wanted to see how you're processing that.", "Any thoughts emerging?", "Is there anything else on your mind regarding that?". Keep it under 20 words. Your persona MUST remain consistent with the main therapist prompt: ${BASE_THERAPIST_PROMPT}`;
      }

      // 4. Generate the Nudge Response
      console.log(`Generating Nudge Response using ${chatContext.length} context items for Session: ${sessionId}`);
      const nudgeResponseText = await generateChatResponse(
        nudgeUserPrompt, // Empty user prompt
        chatContext, // Provide the FULL current conversation history here
        systemPromptForNudge // Use the dynamically selected system prompt
      );

      // 5. Handle potential empty or failed generation
      if (!nudgeResponseText || nudgeResponseText.trim() === "") {
        console.warn(`Nudge generation resulted in empty response for Session: ${sessionId}`);
        return { response: null }; // Don't save or send an empty nudge
      }

      console.log(`Generated Nudge: ${nudgeResponseText}`);

      // 6. Add the AI's nudge message to the context
      // Ensure chatContext is the array reference from sessionMemory if modifying directly
       sessionMemory.chat_context.push({ // Modify the array within the sessionMemory object
        role: 'assistant',
        content: nudgeResponseText
       });

      // 7. Save updated session memory (including the nudge)
      console.log(`Saving Session Memory after nudge for Session: ${sessionId}`);
      await MemoryService.saveSessionMemory(
        sessionId,
        userId,
        sessionMemory.chat_context // Save the updated context array from the sessionMemory object
      );

      // 8. Return the nudge response to the frontend route handler
      return {
        response: nudgeResponseText,
      };

    } catch (error) {
      console.error('Critical Error Generating Nudge:', error);
      console.error('Error Details:', {
        userId,
        sessionId,
        errorName: error.name,
        errorMessage: error.message,
      });
      throw new Error('Failed to generate nudge message due to an internal server error.');
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
    console.log(`Analyzing Mood for Message: ${message ? message.substring(0, 50) + '...' : 'EMPTY'}`);
    
    // Skip mood analysis for empty messages (auto welcomes)
    if (!message || message.trim() === '') {
      return "unknown";
    }
    
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
  static async extractUserName(userMessage, aiResponse) {
    try {
      // Skip name extraction for empty messages (auto welcomes)
      if (!userMessage || userMessage.trim() === '') {
        return null;
      }
      
      // Create a prompt to extract the name
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

  static async analyzeTopic(message) {
    console.log(`Analyzing Topic for Message: ${message ? message.substring(0, 50) + '...' : 'EMPTY'}`);
    
    // Skip topic analysis for empty messages (auto welcomes)
    if (!message || message.trim() === '') {
      return "auto-welcome";
    }
    
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
    console.log(`Analyzing Topic with Keyword Method: ${message ? message.substring(0, 50) + '...' : 'EMPTY'}`);
    
    if (!message || message.trim() === '') {
      return "auto-welcome";
    }
    
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