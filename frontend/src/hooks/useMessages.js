import { useState, useEffect, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/chatService';

export const useMessages = (sessionId, currentUser, hasInitialized, setHasInitialized, clearInactivityTimer, showError) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Load saved messages
  useEffect(() => {
    if (!sessionId || hasInitialized) return;

    try {
      const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
        setHasInitialized(true);
      }
    } catch (err) {
      console.error("Error loading previous messages:", err);
      localStorage.removeItem(`chat_messages_${sessionId}`);
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
    if (!sessionId || !currentUser || isTyping) return;

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
      }
    } catch (error) {
      console.error('Failed to get auto-welcome message:', error);
    } finally {
      setIsTyping(false);
      setHasInitialized(true);
    }
  }, [sessionId, currentUser, isTyping, setHasInitialized]);

  // Check if auto welcome should be sent
  useEffect(() => {
    if (sessionId && currentUser && !isTyping && !hasInitialized) {
      const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
      if (!savedMessages || JSON.parse(savedMessages).length === 0) {
        sendAutoWelcomeMessage();
      } else {
        setHasInitialized(true);
      }
    }
  }, [sessionId, currentUser, isTyping, hasInitialized, sendAutoWelcomeMessage, setHasInitialized]);

  // Handle sending a message
  const handleSend = useCallback(async (messageText = input.trim()) => {
    const trimmedInput = typeof messageText === 'string' ? messageText.trim() : input.trim();
    if (!trimmedInput || !currentUser || !sessionId || isTyping) return;

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
  }, [input, currentUser, sessionId, isTyping, clearInactivityTimer, showError]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
    if (e.target.value.trim() !== '') {
      clearInactivityTimer();
    }
  }, [clearInactivityTimer]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    if (sessionId) {
      localStorage.removeItem(`chat_messages_${sessionId}`);
    }
  }, [sessionId]);

  return {
    messages,
    setMessages,
    isTyping,
    input,
    setInput,
    messagesEndRef,
    handleSend,
    handleInputChange,
    clearMessages
  };
};