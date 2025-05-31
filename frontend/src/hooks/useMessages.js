import { useState, useEffect, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/chatService';

export const useMessages = (sessionId, currentUser, hasInitialized, setHasInitialized, clearInactivityTimer, showError) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState(null);
  const [typingMessage, setTypingMessage] = useState(''); // Current message being typed
  const [isAnimatingTyping, setIsAnimatingTyping] = useState(false); // Whether we're in typing animation
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const bufferTimeoutRef = useRef(null);

  // Typing animation configuration
  const TYPING_CONFIG = {
    bufferTime: 0, // Time to show loading dots before typing starts (ms)
    charactersPerSecond: 60, // Constant typing speed (characters per second)
    punctuationDelay: 60, // Extra delay after punctuation (ms)
  };

  // Replace the calculateTypingSpeed function:
  const calculateTypingSpeed = useCallback(() => {
    return 1000 / TYPING_CONFIG.charactersPerSecond; // Convert to milliseconds per character
  }, []);

  // Updated simulateTyping function with dynamic buffer time
  const simulateTyping = useCallback(async (fullMessage, messageId, requestStartTime = null, isBlockingMessage = false) => {
    const characters = fullMessage.split('');
    const millisecondsPerCharacter = calculateTypingSpeed();
    
    setIsAnimatingTyping(true);
    setTypingMessage('');
    
    // Calculate dynamic buffer time based on backend response time
    let actualBufferTime = TYPING_CONFIG.bufferTime; // Default 1500ms
    
    if (requestStartTime) {
      const backendResponseTime = Date.now() - requestStartTime;
      
      // If backend took longer than buffer time, skip buffer entirely
      if (backendResponseTime >= TYPING_CONFIG.bufferTime) {
        actualBufferTime = 0;
      } else {
        // Reduce buffer time by the backend response time
        actualBufferTime = TYPING_CONFIG.bufferTime - backendResponseTime;
      }
      
      console.log(`Backend response time: ${backendResponseTime}ms, Adjusted buffer: ${actualBufferTime}ms`);
    }
    
    // Show buffer/loading dots for the calculated time
    if (actualBufferTime > 0) {
      await new Promise(resolve => {
        bufferTimeoutRef.current = setTimeout(resolve, actualBufferTime);
      });
    }
    
    // Then animate typing character by character
    for (let i = 0; i < characters.length; i++) {
      // Check if component is still mounted and this is still the current message
      if (!sessionId) break;
      
      const currentText = characters.slice(0, i + 1).join('');
      setTypingMessage(currentText);
      
      // Calculate delay for this character
      let delay = millisecondsPerCharacter;
      
      // Add extra delay after punctuation
      const currentChar = characters[i];
      if (currentChar && /[.!?;:]/.test(currentChar)) {
        delay += TYPING_CONFIG.punctuationDelay;
      }
      
      // Don't wait after the last character
      if (i < characters.length - 1) {
        await new Promise(resolve => {
          typingTimeoutRef.current = setTimeout(resolve, delay);
        });
      }
    }
    
    // Animation complete - add the final message to messages array
    setIsAnimatingTyping(false);
    setTypingMessage('');
    setIsTyping(false);
    
    const finalMessage = {
      text: fullMessage,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      id: messageId,
      type: isBlockingMessage ? 'blocking' : 'normal' // Add type to identify blocking messages
    };
    
    setMessages(prev => [...prev, finalMessage]);
    
    // Return a promise that resolves when the message is fully displayed
    // This allows the caller to wait for the message to be shown before blocking
    return new Promise(resolve => setTimeout(resolve, 100));
  }, [sessionId, calculateTypingSpeed]);

  // Cleanup timeouts
  const clearTypingTimeouts = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (bufferTimeoutRef.current) {
      clearTimeout(bufferTimeoutRef.current);
      bufferTimeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTypingTimeouts();
    };
  }, [clearTypingTimeouts]);

  // Load saved messages and block status
  useEffect(() => {
    if (!sessionId || hasInitialized) return;

    try {
      const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
      const savedBlockStatus = localStorage.getItem(`user_blocked_${sessionId}`);
      
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      
      if (savedBlockStatus) {
        const blockData = JSON.parse(savedBlockStatus);
        // Check if block has expired
        if (blockData.blockExpiresAt && new Date() < new Date(blockData.blockExpiresAt)) {
          setIsUserBlocked(true);
          setBlockInfo(blockData);
        } else {
          // Block has expired, clear it
          localStorage.removeItem(`user_blocked_${sessionId}`);
        }
      }
      
      setHasInitialized(true);
    } catch (err) {
      console.error("Error loading previous messages:", err);
      localStorage.removeItem(`chat_messages_${sessionId}`);
      localStorage.removeItem(`user_blocked_${sessionId}`);
    }
  }, [sessionId, hasInitialized, setHasInitialized]);

  // Save messages to local storage
  useEffect(() => {
    if (!sessionId || messages.length === 0) return;

    try {
      localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
    } catch (err) {
      console.error("Error saving messages:", err);
      showError("Could not save chat history.");
    }
  }, [messages, sessionId, showError]);

  // Save block status to local storage
  useEffect(() => {
    if (!sessionId) return;

    try {
      if (isUserBlocked && blockInfo) {
        localStorage.setItem(`user_blocked_${sessionId}`, JSON.stringify(blockInfo));
      } else {
        localStorage.removeItem(`user_blocked_${sessionId}`);
      }
    } catch (err) {
      console.error("Error saving block status:", err);
    }
  }, [isUserBlocked, blockInfo, sessionId]);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage, scrollToBottom]);

  // Send auto welcome message with timing tracking
  const sendAutoWelcomeMessage = useCallback(async () => {
    if (!sessionId || !currentUser || isTyping || isUserBlocked) return;

    setIsTyping(true);

    // Track when the request starts
    const requestStartTime = Date.now();

    try {
      const responseData = await sendChatMessage("", sessionId);
      if (responseData && responseData.response) {
        const messageId = Date.now().toString();
        
        // Handle potential blocking from welcome message
        if (responseData.userBlocked) {
          // First, display the blocking message as a chat message
          await simulateTyping(responseData.response, messageId, requestStartTime, true);
          
          // Then set the block status
          setIsUserBlocked(true);
          setBlockInfo({
            blockReason: responseData.blockReason,
            blockExpiresAt: responseData.blockExpiresAt,
            crisisInfo: responseData.crisisInfo,
            autoUnblockIn: responseData.autoUnblockIn
          });
        } else {
          // Start typing animation with request start time
          await simulateTyping(responseData.response, messageId, requestStartTime);
        }
      }
    } catch (error) {
      console.error('Failed to get auto-welcome message:', error);
      setIsTyping(false);
    } finally {
      setHasInitialized(true);
    }
  }, [sessionId, currentUser, isTyping, isUserBlocked, setHasInitialized, simulateTyping]);

  // Check if auto welcome should be sent
  useEffect(() => {
    if (sessionId && currentUser && !isTyping && !hasInitialized && !isUserBlocked) {
      const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
      if (!savedMessages || JSON.parse(savedMessages).length === 0) {
        sendAutoWelcomeMessage();
      } else {
        setHasInitialized(true);
      }
    }
  }, [sessionId, currentUser, isTyping, hasInitialized, isUserBlocked, sendAutoWelcomeMessage, setHasInitialized]);

  // Handle sending a message with timing tracking
  const handleSend = useCallback(async (messageText = input.trim()) => {
    const trimmedInput = typeof messageText === 'string' ? messageText.trim() : input.trim();
    if (!trimmedInput || !currentUser || !sessionId || isTyping || isUserBlocked) return;

    clearInactivityTimer();
    clearTypingTimeouts(); // Clear any ongoing typing animation

    const newMessage = {
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);
    setIsAnimatingTyping(false);
    setTypingMessage('');

    // Track when the request starts
    const requestStartTime = Date.now();

    try {
      const responseData = await sendChatMessage(trimmedInput, sessionId);

      if (responseData && responseData.response) {
        const messageId = (Date.now() + 1).toString();
        
        // Handle user blocking
        if (responseData.userBlocked) {
          // First, display the blocking message as a chat message
          await simulateTyping(responseData.response, messageId, requestStartTime, true);
          
          // Then set the block status
          setIsUserBlocked(true);
          setBlockInfo({
            blockReason: responseData.blockReason,
            blockExpiresAt: responseData.blockExpiresAt,
            crisisInfo: responseData.crisisInfo,
            autoUnblockIn: responseData.autoUnblockIn,
            timeRemaining: responseData.timeRemaining
          });
          
          // Show error message (optional - you might want to remove this since the message is now in chat)
          showError(`Access temporarily restricted. ${responseData.autoUnblockIn ? `Will be restored in ${responseData.autoUnblockIn}.` : 'Please contact support if this continues.'}`);
        } else {
          // Start typing animation for AI response with request start time
          await simulateTyping(responseData.response, messageId, requestStartTime);
        }
      } else {
        console.error('Invalid response from server:', responseData);
        showError('Received an unexpected response from the AI.');
        setMessages(prev => prev.filter(msg => msg.timestamp !== newMessage.timestamp));
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      showError('Failed to get response. Please try again.');
      setMessages(prev => prev.filter(msg => msg.timestamp !== newMessage.timestamp));
      setIsTyping(false);
    }
  }, [input, currentUser, sessionId, isTyping, isUserBlocked, clearInactivityTimer, showError, simulateTyping, clearTypingTimeouts]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    if (isUserBlocked) return; // Prevent input changes when blocked
    
    setInput(e.target.value);
    if (e.target.value.trim() !== '') {
      clearInactivityTimer();
    }
  }, [isUserBlocked, clearInactivityTimer]);

  // Clear messages and block status
  const clearMessages = useCallback(() => {
    clearTypingTimeouts();
    setMessages([]);
    setIsUserBlocked(false);
    setBlockInfo(null);
    setTypingMessage('');
    setIsAnimatingTyping(false);
    setIsTyping(false);
    if (sessionId) {
      localStorage.removeItem(`chat_messages_${sessionId}`);
      localStorage.removeItem(`user_blocked_${sessionId}`);
    }
  }, [sessionId, clearTypingTimeouts]);

  // Manual function to check and clear expired blocks
  const checkBlockExpiry = useCallback(() => {
    if (isUserBlocked && blockInfo?.blockExpiresAt) {
      if (new Date() >= new Date(blockInfo.blockExpiresAt)) {
        setIsUserBlocked(false);
        setBlockInfo(null);
        localStorage.removeItem(`user_blocked_${sessionId}`);
        return true; // Block was cleared
      }
    }
    return false; // Block still active or no block
  }, [isUserBlocked, blockInfo, sessionId]);

  return {
    messages,
    setMessages,
    isTyping,
    input,
    setInput,
    messagesEndRef,
    handleSend,
    handleInputChange,
    clearMessages,
    isUserBlocked,
    blockInfo,
    checkBlockExpiry,
    // New properties for typing animation
    typingMessage,
    isAnimatingTyping
  };
};