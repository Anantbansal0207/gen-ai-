import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus, getSessionId } from '../services/authService';
import { sendChatMessage, refreshChatSession, sendNudgeMessage } from '../services/chatService';

// --- Define Timeout Range ---
const MIN_INACTIVITY_TIMEOUT_MS = 15000; // 15 seconds
const MAX_INACTIVITY_TIMEOUT_MS = 35000; // 35 seconds
const UPPER_RANGE_PROBABILITY = 0.75; // 75% chance to be in the upper part

// --- Adjust Nudge Buffer - Base it on the MINIMUM timeout to be safe ---
// Prevent nudging if last AI message was less than ~90% of the MINIMUM possible timeout ago.
const NUDGE_BUFFER_MS = MIN_INACTIVITY_TIMEOUT_MS * 0.9; // ~13.5 seconds

// --- Helper Function for Randomized Timeout ---
const getRandomizedTimeout = () => {
  const range = MAX_INACTIVITY_TIMEOUT_MS - MIN_INACTIVITY_TIMEOUT_MS; // 20000ms
  // Determine the split point based on the probability for the *lower* range
  const splitPointMs = MIN_INACTIVITY_TIMEOUT_MS + range * (1 - UPPER_RANGE_PROBABILITY); // 15000 + 20000 * 0.25 = 20000ms

  let timeout;
  if (Math.random() < UPPER_RANGE_PROBABILITY) {
    // 75% chance: Generate timeout in the upper range [splitPointMs, MAX_INACTIVITY_TIMEOUT_MS]
    // Range size: MAX_INACTIVITY_TIMEOUT_MS - splitPointMs + 1
    timeout = Math.floor(Math.random() * (MAX_INACTIVITY_TIMEOUT_MS - splitPointMs + 1)) + splitPointMs;
  } else {
    // 25% chance: Generate timeout in the lower range [MIN_INACTIVITY_TIMEOUT_MS, splitPointMs - 1]
    // Range size: splitPointMs - MIN_INACTIVITY_TIMEOUT_MS
    timeout = Math.floor(Math.random() * (splitPointMs - MIN_INACTIVITY_TIMEOUT_MS)) + MIN_INACTIVITY_TIMEOUT_MS;
  }
  // console.log(`Generated timeout: ${timeout}ms`); // For debugging
  return timeout;
};


const ChatInterface = ({ user: propUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(propUser);
  const [isSendingNudge, setIsSendingNudge] = useState(false);
  const messagesEndRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // --- Use a ref to access the latest messages inside useCallback without adding messages as a dependency ---
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);


  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
      // console.log('Inactivity timer cleared');
    }
  }, []);

  // --- Modified handleSendNudge ---
  const handleSendNudge = useCallback(async () => {
    // Access latest messages via ref
    const currentMessages = messagesRef.current;
    const lastMessage = currentMessages[currentMessages.length - 1];

    // --- Enhanced Guard Clauses ---
    if (isTyping || input.trim() !== '' || isSendingNudge || !sessionId || !currentUser) {
      // console.log('Nudge condition not met (typing/input/sending/session).');
      clearInactivityTimer(); // Clear timer if conditions changed (e.g., user started typing)
      return;
    }

    // --- Check if the last message was AI and recent ---
    if (lastMessage && lastMessage.sender === 'ai') {
      const timeSinceLastMessage = Date.now() - new Date(lastMessage.timestamp).getTime();
      if (timeSinceLastMessage < NUDGE_BUFFER_MS) {
        // console.log(`Nudge skipped: Last AI message too recent (${timeSinceLastMessage}ms ago).`);
        // Don't clear the timer here, let it run out naturally or be cleared by user action
        // Potentially restart the timer *based on the last AI message's timestamp* if needed,
        // but for simplicity, let's just prevent the nudge for now.
        // The main useEffect will handle restarting if needed after user interaction.
        return; // Exit without nudging
      }
    }
    // --- End of Enhanced Guard Clauses ---


    console.log('User inactive, attempting to send nudge...');
    setIsSendingNudge(true);

    try {
      const nudgeData = await sendNudgeMessage(sessionId);
      if (nudgeData && nudgeData.response) {
        const nudgeMessage = {
          text: nudgeData.response,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        // Use functional update to ensure we're working with the latest state
        setMessages(prev => [...prev, nudgeMessage]);
        // Timer will be restarted by the main useEffect watching messages
      } else {
        console.warn("Nudge response was empty or invalid.");
      }
    } catch (error) {
      console.error('Failed to send nudge:', error);
      // showError('A small issue occurred while checking in.');
    } finally {
      setIsSendingNudge(false);
    }
    // Removed dependency on `messages` by using ref
  }, [sessionId, currentUser, isTyping, input, isSendingNudge, clearInactivityTimer, showError]); // Removed messages


  const startInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    if (currentUser && sessionId) {
      const randomTimeout = getRandomizedTimeout(); // Get the randomized timeout value
      // console.log(`Starting inactivity timer with ${randomTimeout}ms`); // Debug log
      inactivityTimerRef.current = setTimeout(handleSendNudge, randomTimeout); // Use the random value
    }
  }, [clearInactivityTimer, handleSendNudge, currentUser, sessionId]); // Dependencies look correct


  useEffect(() => {
    const verifyUser = async () => {
       // ... (auth logic remains the same) ...
       try {
        let userToSet = null;
        let userSessionId = null;

        if (propUser) {
          userToSet = propUser;
        } else {
          const { user } = await checkAuthStatus();
          userToSet = user;
        }

        if (userToSet) {
          setCurrentUser(userToSet);
          userSessionId = getSessionId(userToSet.id);
          setSessionId(userSessionId);
          console.log("Using session ID:", userSessionId);
        } else {
          showError("Please sign in to use the chat.");
          navigate('/auth', { state: { from: '/chat' } });
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        showError("Authentication error. Please sign in again.");
        navigate('/auth', { state: { from: '/chat' } });
      }
    };

    verifyUser();
    return () => { clearInactivityTimer(); };
  }, [propUser, navigate, showError, clearInactivityTimer]);


  // --- Main useEffect for messages, storage, and timer control ---
  useEffect(() => {
    // console.log("Messages/Session Effect Triggered"); // Debug log
    if (!sessionId) return;

    // --- Load messages ---
    let loadedMessages = [];
    if (messages.length === 0) { // Only load initially for this session
        try {
            const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
            if (savedMessages) {
                loadedMessages = JSON.parse(savedMessages);
                // console.log(`Loaded ${loadedMessages.length} messages from storage.`); // Debug log
                setMessages(loadedMessages); // Update state with loaded messages
            }
        } catch (err) {
            console.error("Error loading previous messages:", err);
            localStorage.removeItem(`chat_messages_${sessionId}`);
        }
    }


    // --- Save messages ---
    // Separate effect for saving to prevent potential issues? Maybe not necessary yet.
    if (messages.length > 0) {
        try {
            // console.log(`Saving ${messages.length} messages to storage.`); // Debug log
            localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
        } catch (err) {
            console.error("Error saving messages:", err);
            showError("Could not save chat history.");
        }
    }

    // --- Inactivity Timer Logic ---
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
        // console.log("Last message sender:", lastMessage.sender); // Debug log
        if (lastMessage.sender === 'ai') {
            // console.log("Starting inactivity timer because last message was from AI."); // Debug log
            startInactivityTimer();
        } else {
            // console.log("Clearing inactivity timer because last message was from User."); // Debug log
            clearInactivityTimer();
        }
    } else {
        // No messages, ensure timer is clear
        // console.log("No messages, clearing inactivity timer."); // Debug log
        clearInactivityTimer();
    }

    // Scroll to bottom
    scrollToBottom();

    // Cleanup timer on effect re-run or component unmount
    // The return function of useEffect handles cleanup BEFORE the next run or on unmount
    return () => {
        // console.log("Cleaning up timer in messages/session effect."); // Debug log
        clearInactivityTimer();
    };
    // Dependencies: messages content IS needed here to react to new messages.
    // sessionId ensures we reload/save for the right session.
    // start/clear timer functions need to be stable (ensured by useCallback).
  }, [messages, sessionId, startInactivityTimer, clearInactivityTimer, showError]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRefreshSession = async () => {
    if (!sessionId || !currentUser) return;
    clearInactivityTimer(); // Stop timer
    try {
      await refreshChatSession(sessionId);
      setMessages([]); // Clear messages
      localStorage.removeItem(`chat_messages_${sessionId}`);
      showSuccess('Chat session refreshed successfully');
    } catch (error) {
      console.error('Error refreshing session:', error);
      showError('Failed to refresh chat session');
    }
  };

  const handleSend = async () => {
    // ... (handleSend logic remains the same) ...
    const trimmedInput = input.trim();
    if (!trimmedInput || !currentUser || !sessionId || isTyping || isSendingNudge) return;

    clearInactivityTimer(); // Clear timer when user sends

    const newMessage = {
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]); // Use functional update
    setInput('');
    setIsTyping(true);

    try {
      const responseData = await sendChatMessage(trimmedInput, sessionId);
      const aiResponse = {
        text: responseData.response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]); // Use functional update
    } catch (error) {
      console.error('Error in chat:', error);
      showError('Failed to get response. Please try again.');
      // Revert optimistic update on error
      setMessages(prev => prev.filter(msg => msg.timestamp !== newMessage.timestamp));
    } finally {
      setIsTyping(false);
    }
  };


  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.trim() !== '') {
      clearInactivityTimer(); // Clear timer on typing
    }
  };


  useEffect(() => {
    // ... (visibility effect remains the same) ...
     const handleVisibilityChange = () => {
      if (!sessionId) return;

      if (document.hidden) {
        // console.log("Tab hidden, clearing timer."); // Debug log
        clearInactivityTimer();
      } else {
        // Tab gained focus, re-evaluate if timer should start
        // Access latest messages via ref here as well
        const currentMessages = messagesRef.current;
        const lastMessage = currentMessages[currentMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'ai') {
           // console.log("Tab visible, last message AI, restarting timer."); // Debug log
           startInactivityTimer();
        } else {
            // console.log("Tab visible, no timer restart needed."); // Debug log
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // console.log("Cleaning up visibility listener and timer."); // Debug log
      clearInactivityTimer();
    };
     // Add messagesRef.current to dependencies? No, refs don't go in deps.
     // The functions depending on the ref should be stable.
  }, [sessionId, startInactivityTimer, clearInactivityTimer]); // Dependencies seem correct

  // --- JSX Rendering ---
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-primary/10 p-4 border-b border-primary/20">
         <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary">AI Therapy Chat</h2>
          <button
            onClick={handleRefreshSession}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            disabled={!currentUser || !sessionId}
          >
            Refresh Session
          </button>
        </div>
        {currentUser && (
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-primary/70">Logged in as: {currentUser.email}</p>
            {sessionId && (
              <p className="text-xs text-primary/50">Session: {sessionId.substring(0, 8)}...</p>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message */}
        {messages.length === 0 && !isTyping && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-primary/50">
              <p className="text-lg font-medium">Welcome to AI Therapy Chat</p>
              <p className="text-sm">Send a message to start your conversation</p>
            </div>
          </div>
        )}
        {/* Message List */}
        {messages.map((message, index) => (
          <div
            key={`${message.timestamp}-${index}-${message.sender}`} // More specific key
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-3 md:p-4 shadow-md ${
                message.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-secondary text-accent rounded-bl-none'
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap">{message.text}</p> {/* Added whitespace-pre-wrap */}
              <span className="text-xs opacity-70 mt-1 block text-right">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary text-accent rounded-2xl p-4 rounded-bl-none shadow-md">
              <DotLottieReact
                src="https://lottie.host/b8087c9b-dcaa-43b3-8d0c-8ced0803325a/GqPRB9yLVk.lottie"
                style={{ width: 50, height: 30 }}
                loop
                autoplay
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-primary/20 p-4 bg-background">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-full px-5 py-3 bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary text-accent placeholder-accent/60"
            disabled={!currentUser || isTyping || isSendingNudge}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !currentUser || !input.trim() || isSendingNudge}
            className="bg-primary text-white rounded-full p-3 hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        {!currentUser && (
          <div className="text-center mt-3 text-red-500 text-sm">
            Please sign in to use the chat
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;