import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, initializeConfig } from '../config/index.js';

// Ensure the configuration is loaded before using it
await initializeConfig();

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export const generateChatResponse = async (prompt, context = [], systemPrompt = '') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Ensure history is initialized and starts with a user message
    const formattedHistory = context.length > 0 ? context.map(msg => ({
      role: msg.role === "assistant" ? "model" : msg.role, // Change "assistant" to "model"
      parts: [{ text: msg.content }]
    })) : [{ role: "user", parts: [{ text: prompt }] }]; // Ensure at least one user message

    // Start chat with the full conversation history
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt || "You are an empathetic AI therapist. Provide thoughtful, compassionate responses." }]
      }
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('❌ Error generating chat response:', error);
    throw new Error('Failed to generate chat response.');
  }
};

export const generateTherapyResponse = async (prompt, type) => {
  const contextMap = {
    'dream': 'You are an expert dream interpreter with deep knowledge of Jungian psychology and symbolism. Help interpret dreams with compassion and insight.',
    'mental-health': 'You are a professional mental health counselor creating personalized mental wellness plans. Focus on actionable steps and evidence-based strategies.',
    'life-prediction': 'You are an AI life coach using data and patterns to provide insights about potential future paths. Always maintain ethical boundaries and emphasize personal agency.',
    'relationship': 'You are an experienced relationship counselor offering empathetic guidance on interpersonal dynamics. Focus on healthy communication and boundaries.'
  };

  const systemPrompt = contextMap[type] || '';
  return generateChatResponse(prompt, [], systemPrompt);
};
