import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Keep if you use it elsewhere, otherwise remove
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus, getSessionId } from '../services/authService';
import { sendChatMessage, refreshChatSession, sendNudgeMessage } from '../services/chatService';
import LoadingDots from './LoadingDots';

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
  const splitPointMs = MIN_INACTIVITY_TIMEOUT_MS + range * (1 - UPPER_RANGE_PROBABILITY); // 15000 + 20000 * 0.25 = 20000ms

  let timeout;
  if (Math.random() < UPPER_RANGE_PROBABILITY) {
    timeout = Math.floor(Math.random() * (MAX_INACTIVITY_TIMEOUT_MS - splitPointMs + 1)) + splitPointMs;
  } else {
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
  const [isSendingNudge, setIsSendingNudge] = useState(false); // State indicating nudge API call in progress
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const isSendingNudgeRef = useRef(isSendingNudge);
  useEffect(() => {
    isSendingNudgeRef.current = isSendingNudge;
  }, [isSendingNudge]);


  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
      // console.log('Inactivity timer cleared');
    }
  }, []);

  // --- Modified handleSendNudge ---
  const handleSendNudge = useCallback(async () => {
    const currentMessages = messagesRef.current;
    const lastMessage = currentMessages[currentMessages.length - 1];

    // Guard clauses
    if (isTyping || input.trim() !== '' || isSendingNudgeRef.current || !sessionId || !currentUser) {
      // console.log('Nudge condition not met (typing/input/sending/session).');
      return;
    }
    if (lastMessage && lastMessage.sender === 'ai') {
      const timeSinceLastMessage = Date.now() - new Date(lastMessage.timestamp).getTime();
      if (timeSinceLastMessage < NUDGE_BUFFER_MS) {
        // console.log(`Nudge skipped: Last AI message too recent (${timeSinceLastMessage}ms ago).`);
        return;
      }
    }

    console.log('User inactive, attempting to send nudge...');
    setIsSendingNudge(true); // Set state immediately

    try {
      const nudgeData = await sendNudgeMessage(sessionId);
      if (nudgeData && nudgeData.response) {
        const nudgeMessage = {
          text: nudgeData.response,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'nudge', // <-- ADDED MARKER FOR NUDGE MESSAGES
        };
        setMessages(prev => [...prev, nudgeMessage]);
      } else {
        console.warn("Nudge response was empty or invalid.");
      }
    } catch (error) {
      console.error('Failed to send nudge:', error);
      // showError('A small issue occurred while checking in.'); // Optional
    } finally {
      setIsSendingNudge(false); // Reset state after API call
    }
  }, [sessionId, currentUser, isTyping, input, clearInactivityTimer, showError]);


  const startInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    if (currentUser && sessionId && !isSendingNudgeRef.current) {
      const randomTimeout = getRandomizedTimeout();
      // console.log(`Starting inactivity timer with ${randomTimeout}ms`);
      inactivityTimerRef.current = setTimeout(handleSendNudge, randomTimeout);
    } else {
        // console.log("Timer start skipped (no user/session or nudge in progress)");
    }
  }, [clearInactivityTimer, handleSendNudge, currentUser, sessionId]);


  const sendAutoWelcomeMessage = useCallback(async () => {
    if (!sessionId || !currentUser || isTyping || isSendingNudgeRef.current) return;

    console.log('Sending auto-welcome message...');
    setIsTyping(true);

    try {
      const responseData = await sendChatMessage("", sessionId);
      if (responseData && responseData.response) {
        const welcomeMessage = {
          text: responseData.response,
          sender: 'ai', // Standard AI message, not a nudge
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, welcomeMessage]);
      } else {
        console.warn("Auto-welcome response was empty or invalid.");
      }
    } catch (error) {
      console.error('Failed to get auto-welcome message:', error);
    } finally {
      setIsTyping(false);
      setHasInitialized(true);
    }
  }, [sessionId, currentUser, isTyping]);


  useEffect(() => {
    const verifyUser = async () => {
       // --- Auth Logic ---
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
          if (userSessionId) {
             setSessionId(userSessionId);
             console.log("Using session ID:", userSessionId);
          } else {
              console.error("Could not generate session ID for user:", userToSet);
              showError("Could not establish a chat session. Please try again.");
          }
        } else {
          showError("Please sign in to use the chat.");
          navigate('/auth', { state: { from: '/chat' } });
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        showError("Authentication error. Please sign in again.");
        navigate('/auth', { state: { from: '/chat' } });
      }
      // --- End Auth Logic ---
    };

    verifyUser();
    return () => { clearInactivityTimer(); };
  }, [propUser, navigate, showError, clearInactivityTimer]);


  // --- Main useEffect for messages, storage, and timer control ---
  useEffect(() => {
    // console.log("Messages/Session Effect Triggered");
    if (!sessionId) return;

    // --- Load messages ---
    if (messages.length === 0 && !hasInitialized) {
        try {
            const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
            if (savedMessages) {
                const loadedMessages = JSON.parse(savedMessages);
                // console.log(`Loaded ${loadedMessages.length} messages from storage.`);
                setMessages(loadedMessages);
                setHasInitialized(true);
            }
        } catch (err) {
            console.error("Error loading previous messages:", err);
            localStorage.removeItem(`chat_messages_${sessionId}`);
        }
    }

    // --- Save messages ---
    if (messages.length > 0) {
        try {
            // console.log(`Saving ${messages.length} messages to storage.`);
            localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
        } catch (err) {
            console.error("Error saving messages:", err);
            showError("Could not save chat history.");
        }
    }

    // --- Inactivity Timer Logic ---
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      // Start timer ONLY if the last message was from AI AND it was NOT a nudge
      if (lastMessage.sender === 'ai' && lastMessage.type !== 'nudge') { // <--- MODIFIED CONDITION
        if (!isSendingNudgeRef.current) {
          // console.log("Starting inactivity timer: Last message AI (standard response), not sending nudge.");
          startInactivityTimer();
        } else {
          // console.log("Skipping timer start: Nudge currently being sent/processed.");
          clearInactivityTimer(); // Ensure timer is clear if nudge is processing
        }
      }
      // Clear timer if the last message was from the user
      else if (lastMessage.sender === 'user') {
        // console.log("Clearing inactivity timer: Last message User.");
        clearInactivityTimer();
      }
      // Clear timer explicitly if the last message WAS a nudge
      else if (lastMessage.sender === 'ai' && lastMessage.type === 'nudge') { // <--- ADDED EXPLICIT CHECK
        // console.log("Clearing inactivity timer: Last message was an AI nudge.");
        clearInactivityTimer();
      }
    } else {
      // No messages yet
      // console.log("No messages, ensuring timer is clear.");
      clearInactivityTimer();
    }

    // Scroll to bottom
    scrollToBottom();

    // Cleanup timer
    return () => {
      // console.log("Cleaning up timer in messages/session effect.");
      clearInactivityTimer();
    };
  }, [messages, sessionId, hasInitialized, startInactivityTimer, clearInactivityTimer, showError]);


  // Effect to trigger auto-welcome message
  useEffect(() => {
    if (sessionId && currentUser && !isTyping && !isSendingNudgeRef.current && !hasInitialized) {
      const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
      if (!savedMessages || JSON.parse(savedMessages).length === 0) {
        console.log("No messages found and not initialized, triggering auto-welcome message");
        sendAutoWelcomeMessage();
      } else {
        // console.log("Messages found in storage, ensuring initialized state is set.");
        setHasInitialized(true);
      }
    }
  }, [sessionId, currentUser, isTyping, hasInitialized, sendAutoWelcomeMessage]);


  const scrollToBottom = () => {
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleRefreshSession = async () => {
    if (!sessionId || !currentUser) return;
    clearInactivityTimer();
    setIsSendingNudge(false);
    setIsTyping(false);
    try {
      await refreshChatSession(sessionId);
      setMessages([]);
      localStorage.removeItem(`chat_messages_${sessionId}`);
      setHasInitialized(false); // Will trigger auto-welcome
      showSuccess('Chat session refreshed successfully');
    } catch (error) {
      console.error('Error refreshing session:', error);
      showError('Failed to refresh chat session');
    }
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || !currentUser || !sessionId || isTyping || isSendingNudgeRef.current) return;

    clearInactivityTimer();

    const newMessage = {
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const responseData = await sendChatMessage(trimmedInput, sessionId);

      if (responseData && responseData.response) {
          const aiResponse = {
            text: responseData.response,
            sender: 'ai', // Standard AI response
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, aiResponse]);
      } else {
          console.error('Invalid response from server:', responseData);
          showError('Received an unexpected response from the AI.');
           setMessages(prev => prev.filter(msg => msg.timestamp !== newMessage.timestamp));
      }
    } catch (error) {
      console.error('Error in chat:', error);
      showError('Failed to get response. Please try again.');
      setMessages(prev => prev.filter(msg => msg.timestamp !== newMessage.timestamp));
    } finally {
      setIsTyping(false);
    }
  };


  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.trim() !== '') {
      clearInactivityTimer();
    }
  };


  // Effect for tab visibility
  useEffect(() => {
     const handleVisibilityChange = () => {
      if (!sessionId || !currentUser) return;

      if (document.hidden) {
        // console.log("Tab hidden, clearing timer.");
        clearInactivityTimer();
      } else {
        // Tab became visible again
        const currentMessages = messagesRef.current;
        const lastMessage = currentMessages[currentMessages.length - 1];
        // Restart timer ONLY if the last message was from AI, was NOT a nudge, AND a nudge isn't currently being sent
        if (lastMessage &&
            lastMessage.sender === 'ai' &&
            lastMessage.type !== 'nudge' && // <--- ADDED CHECK
            !isSendingNudgeRef.current)
        {
           // console.log("Tab visible, last message AI (standard), not sending nudge, restarting timer.");
           startInactivityTimer();
        } else {
            // console.log("Tab visible, no timer restart needed (last msg user, nudge, or nudge in progress).");
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInactivityTimer();
    };
  }, [sessionId, currentUser, startInactivityTimer, clearInactivityTimer]);

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
        {/* Initializing/Welcome Message States */}
        {messages.length === 0 && !isTyping && !hasInitialized && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-primary/50">
              <p className="text-lg font-medium">Welcome!</p>
              <p className="text-sm">Connecting to your session...</p>
            </div>
          </div>
        )}
         {messages.length === 0 && !isTyping && hasInitialized && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-primary/50">
              <p className="text-lg font-medium">Session started.</p>
              <p className="text-sm">Type a message to begin.</p>
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((message, index) => (
          <div
            key={`${message.sender}-${message.timestamp}-${index}`} // Use specific key
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] md:max-w-[70%] rounded-2xl p-3 md:p-4 shadow-md break-words ${
                message.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-secondary text-accent rounded-bl-none'
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block text-right">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary text-accent rounded-2xl p-3 md:p-4 rounded-bl-none shadow-md flex items-center">
              <LoadingDots />
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
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && !isSendingNudge && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-full px-5 py-3 bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary text-accent placeholder-accent/60"
            disabled={!currentUser || !sessionId || isTyping || isSendingNudge}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !currentUser || !sessionId || !input.trim() || isSendingNudge}
            className="bg-primary text-white rounded-full p-3 hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
        {/* Status messages */}
        {!currentUser && (
          <div className="text-center mt-3 text-red-500 text-sm">
            Please sign in to use the chat.
          </div>
        )}
         {currentUser && !sessionId && (
          <div className="text-center mt-3 text-orange-500 text-sm">
            Establishing chat session...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;