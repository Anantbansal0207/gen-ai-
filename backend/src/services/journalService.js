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
            // Get recent entries to personalize the prompt
            const { data: recentEntries } = await supabaseClient
                .from('journal_entries')
                .select('mood, patterns, ai_insight, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);

            const fallbackPrompts = [
                "Welcome back to your journal. What's been on your mind today?",
                "Hello! How are you feeling right now? What would you like to explore today?",
                "Good to see you again. What experiences or thoughts would you like to reflect on today?",
                "Welcome to your personal space. What's happening in your world that you'd like to write about?",
                "Hi there! What emotions or experiences are you carrying with you today?",
            ];

            // If user has recent entries, try to generate AI-powered prompt
            if (recentEntries && recentEntries.length > 0) {
                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                    // Calculate days since last entry
                    const lastEntry = recentEntries[0];
                    const daysSinceLastEntry = Math.floor(
                        (new Date() - new Date(lastEntry.created_at)) / (1000 * 60 * 60 * 24)
                    );

                    // Prepare context from recent entries
                    const entriesContext = recentEntries.map(entry => ({
                        mood: entry.mood,
                        patterns: entry.patterns,
                        ai_insight: entry.ai_insight,
                        daysSince: Math.floor(
                            (new Date() - new Date(entry.created_at)) / (1000 * 60 * 60 * 24)
                        )
                    }));

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

                    const result = await model.generateContent(systemPrompt);
                    const response = await result.response;
                    const aiPrompt = response.text().trim();

                    // Validate the generated prompt
                    if (aiPrompt && aiPrompt.length > 10 && aiPrompt.length < 300) {
                        return aiPrompt;
                    }
                } catch (aiError) {
                    console.error('AI prompt generation failed, using fallback:', aiError);
                }
            }

            // Return a random fallback prompt for new users or when AI fails
            return fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
        } catch (error) {
            console.error('Error getting initial prompt:', error);
            return "Welcome to your personal journal space. What's on your mind today?";
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
            // Create context from conversation history
            const contextText = conversationContext
                .map(msg => `${msg.role}: ${msg.content}`)
                .join('\n');

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

            const result = await chat.sendMessage(analysisPrompt);
            const response = await result.response;
            const responseText = response.text();

            // Clean the response to extract JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : responseText;

            const analysis = JSON.parse(jsonString);

            return {
                mood: analysis.mood || 'neutral',
                moodScore: Math.max(-10, Math.min(10, analysis.moodScore || 0)),
                emotions: analysis.emotions || [],
                themes: analysis.themes || [],
                patterns: analysis.patterns || [],
                insight: analysis.insight || '',
                keyWords: analysis.keyWords || []
            };
        } catch (error) {
            console.error('Error analyzing entry:', error);
            // Return default analysis if AI analysis fails
            return {
                mood: 'neutral',
                moodScore: 0,
                emotions: [],
                themes: [],
                patterns: [],
                insight: 'Thank you for sharing your thoughts.',
                keyWords: []
            };
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
        const prompts = {
            positive: [
                "That sounds wonderful! What else is bringing you joy today?",
                "I'm glad you're feeling good. What do you think contributed to this positive mood?",
                "It's great to hear you're doing well. Is there anything else you'd like to celebrate or reflect on?"
            ],
            negative: [
                "I hear that you're going through a difficult time. Would you like to explore what might help you feel better?",
                "Thank you for sharing something difficult. What support do you have around you right now?",
                "It takes courage to express these feelings. What would you tell a friend in a similar situation?"
            ],
            mixed: [
                "It sounds like you're experiencing some complex emotions. Which feeling stands out most to you right now?",
                "Life can be complicated with mixed feelings. What's most important for you to focus on today?",
                "I appreciate you sharing these different emotions. What would help bring you more clarity?"
            ],
            neutral: [
                "Thank you for sharing. What else is on your mind that you'd like to explore?",
                "Is there anything specific you'd like to dive deeper into?",
                "What other thoughts or experiences have been with you today?"
            ]
        };

        const moodPrompts = prompts[analysis.mood] || prompts.neutral;
        return moodPrompts[Math.floor(Math.random() * moodPrompts.length)];
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
    static generateTitle(content) {
        const words = content.trim().split(/\s+/);
        if (words.length <= 5) return content;

        const title = words.slice(0, 5).join(' ');
        return title.length > 50 ? title.substring(0, 47) + '...' : title + '...';
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