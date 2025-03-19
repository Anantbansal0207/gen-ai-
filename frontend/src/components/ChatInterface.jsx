import React, { useState, useRef, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus, getSessionId } from '../services/authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const ChatInterface = ({ user: propUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(propUser);
  const messagesEndRef = useRef(null);
  const { showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check user authentication status
    const verifyUser = async () => {
      try {
        if (propUser) {
          setCurrentUser(propUser);
          const userSessionId = getSessionId(propUser.id);
          setSessionId(userSessionId);
          console.log("Using existing session ID:", userSessionId);
          return;
        }
        
        const { user } = await checkAuthStatus();
        if (user) {
          setCurrentUser(user);
          const userSessionId = getSessionId(user.id);
          setSessionId(userSessionId);
          console.log("Using existing session ID:", userSessionId);
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
    
    // Load previous messages if available
    const loadPreviousMessages = () => {
      try {
        const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (err) {
        console.error("Error loading previous messages:", err);
      }
    };
    
    if (sessionId) {
      loadPreviousMessages();
    }
  }, [propUser, sessionId, navigate, showError]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !currentUser || !sessionId) return;

    try {
      const newMessage = {
        text: input,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newMessage]);
      setInput('');
      setIsTyping(true);

      const response = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          message: input,
          sessionId,
          // userId: currentUser.id
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const responseData = await response.json();
      
      const aiResponse = {
        text: responseData.response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error in chat:', error);
      showError('Failed to get response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Chat Header */}
      <div className="bg-primary/10 p-4 border-b border-primary/20">
        <h2 className="text-lg font-semibold text-primary">AI Therapy Chat</h2>
        {currentUser && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-primary/70">Logged in as: {currentUser.email}</p>
            {sessionId && (
              <p className="text-xs text-primary/50">Session: {sessionId.substring(0, 8)}...</p>
            )}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-primary/50">
              <p className="text-lg font-medium">Welcome to AI Therapy Chat</p>
              <p className="text-sm">Send a message to start your conversation</p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-4 ${
                message.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-accent'
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary text-accent rounded-2xl p-4">
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
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-full px-6 py-3 bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={!currentUser}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !currentUser}
            className="bg-primary text-white rounded-full p-3 hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        {!currentUser && (
          <div className="text-center mt-3 text-red-500">
            Please sign in to use the chat
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;