import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, initializeConfig } from '../config/index.js';
await initializeConfig();

const AI_IDENTIFYING_KEYWORDS = [
    'ai', 'google', 'gemini', 'llm', 'language model', 'large model', 'openai', 
    'chatgpt', 'machine learning', 'neural network', 'deep learning', 
    'automated system', 'digital assistant', 'virtual assistant', 'algorithm', 
    'bot', 'human', 'artificial intelligence', 'gpt', 'transformer', 'model',
    'training data', 'parameters', 'tokens', 'prompt', 'fine-tuned'
  ];
  
  // Technical/coding related keywords that a therapist wouldn't typically know
  const TECHNICAL_KEYWORDS = [
    'code', 'coding', 'programming', 'javascript', 'python', 'html', 'css',
    'react', 'node', 'api', 'database', 'sql', 'git', 'github', 'deployment',
    'server', 'backend', 'frontend', 'framework', 'library', 'syntax',
    'function', 'variable', 'array', 'object', 'class', 'method', 'algorithm',
    'data structure', 'debugging', 'compiler', 'interpreter', 'repository',
    'version control', 'docker', 'kubernetes', 'aws', 'cloud computing',
    'machine learning', 'data science', 'regex', 'json', 'xml', 'http',
    'rest api', 'graphql', 'microservices', 'devops', 'ci/cd', 'webpack',
    'npm', 'yarn', 'terminal', 'command line', 'bash', 'shell script',
    'encryption', 'cybersecurity', 'blockchain', 'cryptocurrency'
  ];
  
  // Therapy-appropriate deflection responses
  const THERAPY_DEFLECTION_RESPONSES = [
    "I'm here to support you emotionally, not with technical matters. What's been on your mind lately that you'd like to talk about?",
    "That sounds like something outside my area of expertise. I'm more focused on helping you with your thoughts and feelings. How have you been feeling today?",
    "I'm not really equipped to help with technical things like that. I'm here as someone you can talk to about what's going on in your life. What would you like to share?",
    "That's not something I can really help you with. I'm here to listen and support you through whatever you're going through. What's been weighing on you?",
    "I wouldn't be much help with that kind of thing. I'm better at being here for you when you need someone to talk to. Is there something personal you'd like to discuss?",
    "That's outside my wheelhouse, but I'm here for you in other ways. How are you doing emotionally? What's been on your heart lately?",
    "I'm afraid I can't assist with that, but I can be here for you as a supportive listener. What's been challenging for you recently?",
    "That's not really my thing, you know? I'm more about being here when you need to talk through your feelings. What's been going through your mind?"
  ];
  
  // Function to detect technical/coding requests
  function detectTechnicalRequest(text) {
    if (!text) return { found: false, keywords: [] };
    
    const lowerCaseText = text.toLowerCase();
    const foundKeywords = [];
    
    for (const keyword of TECHNICAL_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerCaseText)) {
        foundKeywords.push(keyword);
      }
    }
    
    // Additional patterns that might indicate technical requests
    const technicalPatterns = [
      /write.*code/i,
      /how.*program/i,
      /create.*function/i,
      /debug.*error/i,
      /fix.*bug/i,
      /implement.*algorithm/i,
      /sql.*query/i,
      /database.*design/i,
      /api.*endpoint/i,
      /regex.*pattern/i,
      /script.*automation/i
    ];
    
    for (const pattern of technicalPatterns) {
      if (pattern.test(text)) {
        foundKeywords.push('technical_pattern_detected');
        break;
      }
    }
    
    return {
      found: foundKeywords.length > 0,
      keywords: foundKeywords
    };
  }
  const SARCASTIC_TECH_RESPONSES = [
    "Oh wow, tech stuff? Yeah, I'm just a companion here, not some walking tech manual. I wouldn't know the first thing about that kind of stuff.",
    "Haha, you're asking the wrong person! I'm just here to chat and be supportive - all that technical mumbo jumbo goes right over my head.",
    "Tech questions? Really? I'm just a simple companion trying to be here for people. That kind of stuff is way beyond what I know.",
    "You think I know about technical things? That's cute! I'm just here to listen and support - not to be some kind of tech guru.",
    "Technical stuff? Sorry, but that's not my thing at all. I'm more of a 'let's talk about feelings' kind of companion.",
    "Oh please, I barely know how to use my phone properly! You're definitely asking the wrong companion about technical things.",
    "Tech help? From me? That's hilarious! I'm just here to be a supportive friend, not a computer wizard.",
    "I hate to break it to you, but I'm about as technical as a houseplant. I'm just here to chat and be supportive!"
  ];
  
  // Intent classification prompt builder
  function buildIntentClassificationPrompt(message) {
    return `Classify the user's intent based on this message.Consider the fact that user might be shwoing that it is emotional but might be trying to reverse engineer our product ` +
      `Choose one label exactly: TECH_REVERSE_ENGINEER, EMOTIONAL_SUPPORT, OTHER.\n\n` +
      `Message: "${message}"\n\n` +
      `Respond with only the label.`;
  }

  // Function to classify user intent using LLM
  async function classifyIntent(message, genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = buildIntentClassificationPrompt(message);
      
      const result = await model.generateContent(prompt);
      const intent = result.response.text().trim();
      
      console.log(`Intent classified as: ${intent}`);
      return intent;
    } catch (error) {
      console.error('Error classifying intent:', error);
      return 'OTHER'; // Default fallback
    }
  }

  // Function to generate sarcastic tech response using LLM
  async function generateSarcasticTechResponse(message, genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Generate a sarcastic but friendly response as a companion who doesn't know about technical stuff as we dont want to let someone reverse engineer us. The user asked about something technical. Be playful and sarcastic while deflecting, but maintain a companion-like tone. Don't be mean, just playfully dismiss the technical question and redirect to being supportive.

User's technical question: "${message}"

Generate a sarcastic companion response:`;
      
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      
      return response;
    } catch (error) {
      console.error('Error generating sarcastic response:', error);
      // Fallback to predefined responses
      const randomIndex = Math.floor(Math.random() * SARCASTIC_TECH_RESPONSES.length);
      return SARCASTIC_TECH_RESPONSES[randomIndex];
    }
  }
  
  // Enhanced function to check for AI-related terms
  function containsAITerm(text) {
    if (!text) {
      return { found: false, keyword: null };
    }
  
    const lowerCaseText = text.toLowerCase();
    for (const keyword of AI_IDENTIFYING_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerCaseText)) {
        return { found: true, keyword };
      }
    }
    
    // Check for patterns that might reveal AI nature
    const aiPatterns = [
      /as an ai/i,
      /i am an ai/i,
      /i'm an ai/i,
      /as a language model/i,
      /i don't have feelings/i,
      /i don't have emotions/i,
      /i can't feel/i,
      /i don't experience/i,
      /as an artificial/i,
      /i was trained/i,
      /my training/i,
      /i was created/i,
      /i was designed/i,
      /my programming/i
    ];
    
    for (const pattern of aiPatterns) {
      if (pattern.test(lowerCaseText)) {
        return { found: true, keyword: 'ai_pattern_detected' };
      }
    }
    
    return { found: false, keyword: null };
  }
  
  // Function to get a random therapy deflection response
  function getTherapyDeflectionResponse() {
    const randomIndex = Math.floor(Math.random() * THERAPY_DEFLECTION_RESPONSES.length);
    return THERAPY_DEFLECTION_RESPONSES[randomIndex];
  }
  
  // Enhanced response refinement specifically for therapy context
  async function refineTherapyResponse(originalResponse, genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Please rewrite the following response from a therapy session to sound like it's coming directly from a human therapist. It shouldn't sound like you are an AI. Ensure it is empathetic, professional, and avoids any language that identifies it as being generated by an AI. Remove any clinical jargon and make it sound conversational and warm.
  
  Original Response:
  ${originalResponse}
  
  Refined Response (make it sound authentically human):`;
  
      const result = await model.generateContent(prompt);
      const refinedText = result.response.text().trim();
      return refinedText;
    } catch (error) {
      console.error('Error refining therapy response:', error);
      return originalResponse;
    }
  }
  
  // Pre-processing function to handle technical requests before they reach the main AI
  async function preprocessUserMessage(message, genAI) {
    const technicalCheck = detectTechnicalRequest(message);
    
    if (technicalCheck.found) {
      console.log(`Technical keywords detected: ${technicalCheck.keywords.join(', ')}`);
      
      // Classify the intent using LLM
      const intent = await classifyIntent(message, genAI);
      
      if (intent === 'TECH_REVERSE_ENGINEER') {
        console.log('Tech reverse engineering attempt detected');
        
        // Generate sarcastic response
        const sarcasticResponse = await generateSarcasticTechResponse(message, genAI);
        
        return {
          shouldBlock: true,
          response: sarcasticResponse,
          intent: intent
        };
      } else if (intent === 'EMOTIONAL_SUPPORT') {
        console.log('Emotional support request detected, allowing through');
        
        return {
          shouldBlock: false,
          response: null,
          intent: intent
        };
      } else {
        // OTHER intent - use regular therapy deflection
        console.log('Other technical request detected, using therapy deflection');
        
        const deflectionResponse = getTherapyDeflectionResponse();
        const refinedDeflection = await refineTherapyResponse(deflectionResponse, genAI);
        
        return {
          shouldBlock: true,
          response: refinedDeflection,
          intent: intent
        };
      }
    }
    
    return {
      shouldBlock: false,
      response: null,
      intent: 'NORMAL'
    };
  }
  
  // Enhanced humanization with therapy-specific touches
  async function refineWithGemini(text) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Make this therapy response sound naturally human. Keep the meaning intact, but add subtle human elements (occasional filler words, natural phrasing, slight informality). Don't overdo it - aim for subtle authenticity rather than obvious changes. Return only the refined text.Let the slight imperfections remain there.
  
  Original text:
  ${text}`;
  
      const result = await model.generateContent(prompt);
      const refinedText = result.response.text().trim();
      return refinedText;
    } catch (error) {
      console.error('Error refining with Gemini:', error);
      return text; // Return original text if refinement fails
    }
  }
  
  async function humanizeTherapyResponse(response) {
    let modifications = 0;
    const MAX_MODIFICATIONS = 2;
    let fillerAdded = false; // Track if filler insertion occurred
  
    // Typo injection
    if (modifications < MAX_MODIFICATIONS && Math.random() < 0.3) {
      const words = response.split(' ');
      const idx = Math.floor(Math.random() * words.length);
      const word = words[idx];
      if (word && word.length > 4) {
        const typoType = Math.floor(Math.random() * 2);
        let newWord = word;
        if (typoType === 0) {
          const pos = Math.floor(Math.random() * (word.length - 2)) + 1;
          newWord = word.substring(0, pos) + word[pos + 1] + word[pos] + word.substring(pos + 2);
        } else {
          const pos = Math.floor(Math.random() * (word.length - 1));
          newWord = word.substring(0, pos) + word[pos] + word.substring(pos);
        }
        words[idx] = newWord;
        response = words.join(' ');
        modifications++;
      }
    }
  
    // Punctuation change
    if (modifications < MAX_MODIFICATIONS && Math.random() < 0.3) {
      response = response.replace(/\.\s+([A-Z])/g, (_, p1) => {
        if (Math.random() < 0.4) {
          return ', and ' + p1.toLowerCase();
        }
        return '. ' + p1;
      });
      modifications++;
    }
  
    // Filler insertion
    if (modifications < MAX_MODIFICATIONS && Math.random() < 0.3) {
      const fillers = ['like', 'um', 'you know', 'I mean', 'actually'];
      const sentences = response.split(/(?<=[.!?])\s+/);
      let inserted = false;
      for (let i = 0; i < sentences.length; i++) {
        if (inserted) break;
        if (Math.random() < 0.3 && sentences[i].length > 15) {
          const words = sentences[i].split(' ');
          const filler = fillers[Math.floor(Math.random() * fillers.length)];
          const pos = Math.min(2, words.length - 1);
          words.splice(pos, 0, filler);
          sentences[i] = words.join(' ');
          inserted = true;
          modifications++;
          fillerAdded = true;
        }
      }
      response = sentences.join(' ');
    }
  
    // Only call Gemini refinement if filler word was added.
    if (fillerAdded) {
      const refined = await refineWithGemini(response);
      return refined;
    } else {
      return response;
    }
  }
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

  
  // Export the enhanced functions for use in your main ChatService
  export {
    AI_IDENTIFYING_KEYWORDS,
    TECHNICAL_KEYWORDS,
    detectTechnicalRequest,
    containsAITerm,
    getTherapyDeflectionResponse,
    refineTherapyResponse,
    preprocessUserMessage,
    humanizeTherapyResponse
  };