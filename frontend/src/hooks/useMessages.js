import { useState, useEffect, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/chatService';

export const useMessages = (sessionId, currentUser, hasInitialized, setHasInitialized, clearInactivityTimer, showError) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState(null);
  const messagesEndRef = useRef(null);

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
  }, [messages, scrollToBottom]);

  // Send auto welcome message
  const sendAutoWelcomeMessage = useCallback(async () => {
    if (!sessionId || !currentUser || isTyping || isUserBlocked) return;

    setIsTyping(true);

    try {
      const responseData = await sendChatMessage("", sessionId);
      if (responseData && responseData.response) {
        const welcomeMessage = {
          text: responseData.response,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, welcomeMessage]);

        // Handle potential blocking from welcome message
        if (responseData.userBlocked) {
          setIsUserBlocked(true);
          setBlockInfo({
            blockReason: responseData.blockReason,
            blockExpiresAt: responseData.blockExpiresAt,
            crisisInfo: responseData.crisisInfo,
            autoUnblockIn: responseData.autoUnblockIn
          });
        }
      }
    } catch (error) {
      console.error('Failed to get auto-welcome message:', error);
    } finally {
      setIsTyping(false);
      setHasInitialized(true);
    }
  }, [sessionId, currentUser, isTyping, isUserBlocked, setHasInitialized]);

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

  // Handle sending a message
  const handleSend = useCallback(async (messageText = input.trim()) => {
    const trimmedInput = typeof messageText === 'string' ? messageText.trim() : input.trim();
    if (!trimmedInput || !currentUser || !sessionId || isTyping || isUserBlocked) return;

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
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiResponse]);

        // Handle user blocking
        if (responseData.userBlocked) {
          setIsUserBlocked(true);
          setBlockInfo({
            blockReason: responseData.blockReason,
            blockExpiresAt: responseData.blockExpiresAt,
            crisisInfo: responseData.crisisInfo,
            autoUnblockIn: responseData.autoUnblockIn,
            timeRemaining: responseData.timeRemaining
          });
          
          // Show error message to user about being blocked
          showError(`Access temporarily restricted. ${responseData.autoUnblockIn ? `Will be restored in ${responseData.autoUnblockIn}.` : 'Please contact support if this continues.'}`);
        }
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
  }, [input, currentUser, sessionId, isTyping, isUserBlocked, clearInactivityTimer, showError]);

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
    setMessages([]);
    setIsUserBlocked(false);
    setBlockInfo(null);
    if (sessionId) {
      localStorage.removeItem(`chat_messages_${sessionId}`);
      localStorage.removeItem(`user_blocked_${sessionId}`);
    }
  }, [sessionId]);

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
    checkBlockExpiry
  };
};