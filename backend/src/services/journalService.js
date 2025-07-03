import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, initializeConfig } from '../config/index.js';

// Ensure the configuration is loaded before using it
await initializeConfig();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export class JournalService {
    /**
     * Get personalized initial prompt based on user's history
     */
    static async getInitialPrompt(supabaseClient, userId) {
        try {
            console.log(`[getInitialPrompt] Starting prompt generation for user: ${userId}`);

            // Get recent entries to personalize the prompt
            const { data: recentEntries } = await supabaseClient
                .from('journal_entries')
                .select('mood, patterns, ai_insight, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);

            console.log(`[getInitialPrompt] Found ${recentEntries?.length || 0} recent entries for user ${userId}`);
            if (recentEntries && recentEntries.length > 0) {
                console.log('[getInitialPrompt] Recent entries data:', JSON.stringify(recentEntries, null, 2));
            }

            const fallbackPrompts = [
                "Welcome back to your journal. What's been on your mind today?",
                "Hello! How are you feeling right now? What would you like to explore today?",
                "Good to see you again. What experiences or thoughts would you like to reflect on today?",
                "Welcome to your personal space. What's happening in your world that you'd like to write about?",
                "Hi there! What emotions or experiences are you carrying with you today?",
            ];

            // If user has recent entries, try to generate AI-powered prompt
            if (recentEntries && recentEntries.length > 0) {
                console.log('[getInitialPrompt] User has recent entries, attempting AI prompt generation');

                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                    // Calculate days since last entry
                    const lastEntry = recentEntries[0];
                    const daysSinceLastEntry = Math.floor(
                        (new Date() - new Date(lastEntry.created_at)) / (1000 * 60 * 60 * 24)
                    );

                    console.log(`[getInitialPrompt] Days since last entry: ${daysSinceLastEntry}`);

                    // Prepare context from recent entries
                    const entriesContext = recentEntries.map(entry => ({
                        mood: entry.mood,
                        patterns: entry.patterns,
                        ai_insight: entry.ai_insight,
                        daysSince: Math.floor(
                            (new Date() - new Date(entry.created_at)) / (1000 * 60 * 60 * 24)
                        )
                    }));

                    console.log('[getInitialPrompt] Prepared entries context:', JSON.stringify(entriesContext, null, 2));

                    const systemPrompt = `
You are a compassionate AI assistant helping generate personalized journal prompts. 
Based on the user's recent journal entries, create a warm, encouraging prompt that:
1. Acknowledges their recent journaling patterns
2. References relevant themes from their past entries (if any)
3. Encourages continued self-reflection
4. Is supportive and non-judgmental
5. Is 1-2 sentences long
6. Feels personal but not intrusive

Recent entries context:
${JSON.stringify(entriesContext, null, 2)}

Days since last entry: ${daysSinceLastEntry}

Guidelines:
- If it's been 0 days: acknowledge they're journaling frequently
- If it's been 1-3 days: welcome them back warmly
- If it's been 4-7 days: gently acknowledge the gap
- If it's been >7 days: warmly welcome them back after time away
- Reference mood patterns or insights if they show clear themes
- Keep it encouraging and forward-looking
- Don't mention specific personal details from their entries
- Don't be overly clinical or therapeutic

Generate only the prompt text, nothing else.`;

                    console.log('[getInitialPrompt] Generated system prompt for AI');
                    console.log('[getInitialPrompt] System prompt length:', systemPrompt.length);

                    console.log('[getInitialPrompt] Calling Gemini AI for prompt generation...');
                    const result = await model.generateContent(systemPrompt);
                    const response = await result.response;
                    const aiPrompt = response.text().trim();

                    console.log('[getInitialPrompt] AI generated prompt:', aiPrompt);
                    console.log('[getInitialPrompt] AI prompt length:', aiPrompt.length);

                    // Validate the generated prompt
                    if (aiPrompt && aiPrompt.length > 10 && aiPrompt.length < 300) {
                        console.log('[getInitialPrompt] AI prompt passed validation, returning AI-generated prompt');
                        return aiPrompt;
                    } else {
                        console.log('[getInitialPrompt] AI prompt failed validation (length check), falling back to random prompt');
                    }
                } catch (aiError) {
                    console.error('[getInitialPrompt] AI prompt generation failed:', aiError);
                    console.log('[getInitialPrompt] Error details:', {
                        message: aiError.message,
                        stack: aiError.stack
                    });
                    console.log('[getInitialPrompt] Falling back to random prompt due to AI error');
                }
            } else {
                console.log('[getInitialPrompt] No recent entries found, using fallback prompt');
            }

            // Return a random fallback prompt for new users or when AI fails
            const selectedPrompt = fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
            console.log('[getInitialPrompt] Selected fallback prompt:', selectedPrompt);
            return selectedPrompt;
        } catch (error) {
            console.error('[getInitialPrompt] Error getting initial prompt:', error);
            console.log('[getInitialPrompt] Error details:', {
                message: error.message,
                stack: error.stack,
                userId: userId
            });
            const fallbackPrompt = "Welcome to your personal journal space. What's on your mind today?";
            console.log('[getInitialPrompt] Returning emergency fallback prompt:', fallbackPrompt);
            return fallbackPrompt;
        }
    }

    /**
     * Process journal entry with AI response and conversation context
     */
    static async processEntry(supabaseClient, userId, entry, conversationContext = [], sessionDate = null) {
        try {
            // Analyze the entry for mood and patterns
            const analysis = await this.analyzeEntry(entry, conversationContext);

            // Generate AI response and next prompt
            const aiResponse = await this.generateAIResponse(entry, conversationContext, analysis);

            // Save the journal entry to database
            const savedEntry = await this.saveEntry(supabaseClient, userId, entry, analysis, sessionDate);

            return {
                response: aiResponse.response,
                nextPrompt: aiResponse.nextPrompt,
                entryId: savedEntry.id,
                analysis: analysis
            };
        } catch (error) {
            console.error('Error processing journal entry:', error);
            throw new Error('Failed to process journal entry');
        }
    }

    /**
     * Analyze journal entry for mood, emotions, and patterns using Gemini
     */
    static async analyzeEntry(entry, conversationContext = []) {
        try {
            console.log('[analyzeEntry] Starting entry analysis');
            console.log('[analyzeEntry] Entry content:', entry);
            console.log('[analyzeEntry] Conversation context length:', conversationContext.length);

            if (conversationContext.length > 0) {
                console.log('[analyzeEntry] Conversation context:', JSON.stringify(conversationContext, null, 2));
            }

            // Create context from conversation history
            const contextText = conversationContext
                .map(msg => `${msg.role}: ${msg.content}`)
                .join('\n');

            console.log('[analyzeEntry] Formatted context text:', contextText);

            const analysisPrompt = `
    Analyze this journal entry and conversation context for emotional content, mood, and patterns.
    
    Conversation Context:
    ${contextText}
    
    Current Entry: "${entry}"
    
    Please provide analysis in the following JSON format:
    {
      "mood": "positive|negative|neutral|mixed",
      "moodScore": <number between -10 and 10>,
      "emotions": ["emotion1", "emotion2", ...],
      "themes": ["theme1", "theme2", ...],
      "patterns": ["pattern1", "pattern2", ...],
      "insight": "Brief insight about the user's emotional state or patterns",
      "keyWords": ["word1", "word2", ...]
    }
    
    Focus on being empathetic and constructive in your analysis.
  `;

            console.log('[analyzeEntry] Generated analysis prompt');
            console.log('[analyzeEntry] Analysis prompt length:', analysisPrompt.length);

            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const chat = model.startChat({
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 1024,
                },
                systemInstruction: {
                    role: "system",
                    parts: [{ text: "You are an empathetic AI therapist analyzing journal entries. Provide helpful, non-judgmental insights." }]
                }
            });

            console.log('[analyzeEntry] Initialized Gemini model and chat');
            console.log('[analyzeEntry] Sending message to AI...');

            const result = await chat.sendMessage(analysisPrompt);
            const response = await result.response;
            const responseText = response.text();

            console.log('[analyzeEntry] Received AI response');
            console.log('[analyzeEntry] Raw AI response:', responseText);
            console.log('[analyzeEntry] AI response length:', responseText.length);

            // Clean the response to extract JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : responseText;

            console.log('[analyzeEntry] Extracted JSON string:', jsonString);

            const analysis = JSON.parse(jsonString);
            console.log('[analyzeEntry] Parsed analysis object:', JSON.stringify(analysis, null, 2));

            const finalAnalysis = {
                mood: analysis.mood || 'neutral',
                moodScore: Math.max(-10, Math.min(10, analysis.moodScore || 0)),
                emotions: analysis.emotions || [],
                themes: analysis.themes || [],
                patterns: analysis.patterns || [],
                insight: analysis.insight || '',
                keyWords: analysis.keyWords || []
            };

            console.log('[analyzeEntry] Final processed analysis:', JSON.stringify(finalAnalysis, null, 2));
            console.log('[analyzeEntry] Analysis completed successfully');

            return finalAnalysis;
        } catch (error) {
            console.error('[analyzeEntry] Error analyzing entry:', error);
            console.log('[analyzeEntry] Error details:', {
                message: error.message,
                stack: error.stack,
                entryContent: entry,
                contextLength: conversationContext.length
            });

            // Return default analysis if AI analysis fails
            const defaultAnalysis = {
                mood: 'neutral',
                moodScore: 0,
                emotions: [],
                themes: [],
                patterns: [],
                insight: 'Thank you for sharing your thoughts.',
                keyWords: []
            };

            console.log('[analyzeEntry] Returning default analysis due to error:', JSON.stringify(defaultAnalysis, null, 2));
            return defaultAnalysis;
        }
    }

    /**
     * Generate AI response and next prompt using Gemini
     */
    static async generateAIResponse(entry, conversationContext = [], analysis) {
        try {
            const systemPrompt = `You are a compassionate AI therapist and journaling companion. Your role is to:
      1. Provide supportive, empathetic responses to journal entries
      2. Ask thoughtful follow-up questions
      3. Help users explore their thoughts and feelings
      4. Offer gentle insights when appropriate
      5. Maintain a warm, non-judgmental tone
      
      Current mood analysis: ${analysis.mood} (score: ${analysis.moodScore})
      Key emotions: ${analysis.emotions.join(', ')}
      Insight: ${analysis.insight}
      
      Keep responses conversational, supportive, and around 2-3 sentences.`;

            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            // Format conversation history for Gemini
            const formattedHistory = conversationContext.length > 0 ?
                conversationContext.map(msg => ({
                    role: msg.role === "assistant" ? "model" : msg.role,
                    parts: [{ text: msg.content }]
                })) : [];

            const chat = model.startChat({
                history: formattedHistory,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200,
                },
                systemInstruction: {
                    role: "system",
                    parts: [{ text: systemPrompt }]
                }
            });

            const result = await chat.sendMessage(entry);
            const response = await result.response;
            const aiResponse = response.text();

            // Generate next prompt
            const nextPrompt = await this.generateNextPrompt(analysis, conversationContext);

            return {
                response: aiResponse,
                nextPrompt: nextPrompt
            };
        } catch (error) {
            console.error('Error generating AI response:', error);
            return {
                response: "Thank you for sharing that with me. Your thoughts and feelings are valid and important.",
                nextPrompt: "What else would you like to explore or reflect on today?"
            };
        }
    }

    /**
     * Generate contextual next prompt
     */
    static async generateNextPrompt(analysis, conversationContext = []) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            // Get the last few messages for context
            const recentContext = conversationContext.slice(-4).map(msg =>
                `${msg.role}: ${msg.content}`
            ).join('\n');

            const prompt = `Based on the user's current emotional state and conversation, generate a thoughtful follow-up question for journaling. 

Current mood analysis:
- Mood: ${analysis.mood}
- Mood Score: ${analysis.moodScore}
- Key emotions: ${analysis.emotions.join(', ')}
- Insight: ${analysis.insight}

Recent conversation context:
${recentContext}

Generate a single, compassionate follow-up question that:
- Is empathetic and supportive
- Encourages deeper reflection
- Matches the user's current emotional state
- Is conversational and warm
- Avoids being generic or repetitive
- Is 1-2 sentences maximum

Return only the question, nothing else.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const aiPrompt = response.text().trim();

            return aiPrompt;

        } catch (error) {
            console.error('Error generating AI prompt:', error);

            // Fallback prompts based on mood
            const fallbackPrompts = {
                positive: "That sounds wonderful! What else is bringing you joy today?",
                negative: "I hear that you're going through a difficult time. Would you like to explore what might help you feel better?",
                mixed: "It sounds like you're experiencing some complex emotions. Which feeling stands out most to you right now?",
                neutral: "Thank you for sharing. What else is on your mind that you'd like to explore?"
            };

            return fallbackPrompts[analysis.mood] || fallbackPrompts.neutral;
        }
    }

    /**
     * Save journal entry to database
     */
    static async saveEntry(supabaseClient, userId, content, analysis, sessionDate = null) {
        try {
            const { data, error } = await supabaseClient
                .from('journal_entries')
                .insert([{
                    user_id: userId,
                    title: this.generateTitle(content),
                    content: content.trim(),
                    mood: analysis.mood,
                    mood_score: analysis.moodScore,
                    prompt_used: '', // Can be populated if you track specific prompts
                    image_url: null,
                    voice_url: null,
                    tags: analysis.themes, // Using themes as tags
                    ai_insight: analysis.insight,
                    patterns: analysis.patterns,
                    word_count: content.trim().split(/\s+/).length,
                    session_date: sessionDate || new Date().toISOString().split('T')[0]
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error saving journal entry:', error);
            throw new Error('Failed to save journal entry');
        }
    }

    /**
     * Generate a title from content
     */
    static async generateTitle(content) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `Generate a concise, meaningful title for this journal entry. The title should:
- Be 3-6 words maximum
- Capture the main theme or emotion
- Be descriptive but not too specific
- Avoid generic phrases like "My Day" or "Today's Entry"

Journal entry: "${content}"

Return only the title, nothing else.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const aiTitle = response.text().trim();

            // Clean up the title (remove quotes, extra whitespace)
            const cleanTitle = aiTitle.replace(/['"]/g, '').trim();

            // Fallback to ensure reasonable length
            return cleanTitle.length > 50 ? cleanTitle.substring(0, 47) + '...' : cleanTitle;

        } catch (error) {
            console.error('Error generating AI title:', error);
            // Fallback to original logic if AI fails
            const words = content.trim().split(/\s+/);
            if (words.length <= 5) return content;

            const title = words.slice(0, 5).join(' ');
            return title.length > 50 ? title.substring(0, 47) + '...' : title + '...';
        }
    }

    /**
     * Get journal summary for date range using Gemini
     */
    static async getJournalSummary(supabaseClient, userId, startDate, endDate) {
        try {
            const { data: entries, error } = await supabaseClient
                .from('journal_entries')
                .select('*')
                .eq('user_id', userId)
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!entries || entries.length === 0) {
                return {
                    summary: "No journal entries found for this date range.",
                    entryCount: 0,
                    dateRange: { start: startDate, end: endDate },
                    insights: []
                };
            }

            // Generate AI summary
            const summary = await this.generateSummary(entries);

            return {
                summary: summary.summary,
                entryCount: entries.length,
                dateRange: { start: startDate, end: endDate },
                insights: summary.insights
            };
        } catch (error) {
            console.error('Error getting journal summary:', error);
            throw new Error('Failed to get journal summary');
        }
    }

    /**
     * Generate AI summary of multiple entries using Gemini
     */
    static async generateSummary(entries) {
        try {
            const entriesText = entries.map(entry =>
                `Date: ${new Date(entry.created_at).toLocaleDateString()}\n` +
                `Mood: ${entry.mood} (${entry.mood_score})\n` +
                `Content: ${entry.content}\n` +
                `Insights: ${entry.ai_insight}\n---`
            ).join('\n\n');

            const summaryPrompt = `
        Please provide a thoughtful summary of these journal entries and key insights:
        
        ${entriesText}
        
        Please respond in JSON format:
        {
          "summary": "A comprehensive but concise summary of the entries",
          "insights": ["insight1", "insight2", "insight3"],
          "moodTrend": "improving|declining|stable|mixed",
          "keyThemes": ["theme1", "theme2", "theme3"]
        }
      `;

            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const chat = model.startChat({
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 1024,
                },
                systemInstruction: {
                    role: "system",
                    parts: [{ text: "You are an empathetic AI therapist providing journal summaries. Be constructive and supportive." }]
                }
            });

            const result = await chat.sendMessage(summaryPrompt);
            const response = await result.response;
            const responseText = response.text();

            // Clean the response to extract JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : responseText;

            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error generating summary:', error);
            return {
                summary: "Thank you for journaling consistently. Your reflections show thoughtfulness and self-awareness.",
                insights: ["Continue expressing your thoughts and feelings", "Self-reflection is a valuable practice"]
            };
        }
    }

    /**
     * Get entries for a specific date
     */
    static async getEntriesForDate(supabaseClient, userId, date) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const { data, error } = await supabaseClient
                .from('journal_entries')
                .select('*')
                .eq('user_id', userId)
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString())
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting entries for date:', error);
            throw new Error('Failed to get entries for date');
        }
    }

    /**
     * Delete a journal entry
     */
    static async deleteEntry(supabaseClient, userId, entryId) {
        try {
            const { data, error } = await supabaseClient
                .from('journal_entries')
                .delete()
                .eq('id', entryId)
                .eq('user_id', userId)
                .select();

            if (error) throw error;

            return {
                success: data && data.length > 0
            };
        } catch (error) {
            console.error('Error deleting entry:', error);
            throw new Error('Failed to delete entry');
        }
    }

    /**
     * Get journal statistics
     */
    static async getJournalStats(supabaseClient, userId) {
        try {
            const { data: entries, error } = await supabaseClient
                .from('journal_entries')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!entries || entries.length === 0) {
                return {
                    totalEntries: 0,
                    streak: 0,
                    averageWordsPerEntry: 0,
                    mostActiveDay: null,
                    topEmotions: []
                };
            }

            // Calculate statistics
            const totalEntries = entries.length;
            const totalWords = entries.reduce((sum, entry) => sum + (entry.word_count || 0), 0);
            const averageWordsPerEntry = Math.round(totalWords / totalEntries);

            // Calculate streak
            const streak = this.calculateStreak(entries);

            // Find most active day
            const dayCount = {};
            entries.forEach(entry => {
                const day = new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'long' });
                dayCount[day] = (dayCount[day] || 0) + 1;
            });
            const mostActiveDay = Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b);

            // Get top emotions from tags
            const allTags = entries.flatMap(entry => entry.tags || []);
            const tagCount = {};
            allTags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
            const topEmotions = Object.entries(tagCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([tag]) => tag);

            return {
                totalEntries,
                streak,
                averageWordsPerEntry,
                mostActiveDay,
                topEmotions
            };
        } catch (error) {
            console.error('Error getting journal stats:', error);
            throw new Error('Failed to get journal statistics');
        }
    }

    /**
     * Calculate writing streak
     */
    static calculateStreak(entries) {
        if (!entries || entries.length === 0) return 0;

        const dates = [...new Set(entries.map(entry =>
            new Date(entry.created_at).toDateString()
        ))].sort((a, b) => new Date(b) - new Date(a));

        let streak = 0;
        const today = new Date().toDateString();
        let currentDate = new Date();

        for (let i = 0; i < dates.length; i++) {
            const entryDate = new Date(dates[i]).toDateString();
            const expectedDate = currentDate.toDateString();

            if (entryDate === expectedDate) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }
}