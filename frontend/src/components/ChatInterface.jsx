import React, { useState, useRef, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { supabase } from '../utils/supabase1';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const ChatInterface = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(user);
  const messagesEndRef = useRef(null);
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Generate a unique session ID when component mounts
    setSessionId(crypto.randomUUID());
    
    // Check for user on component mount
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // First check if user was passed as prop
      if (user) {
        console.log("User provided via props:", user);
        setCurrentUser(user);
        return;
      }
      
      // // If no user prop, try to get from supabase
      // const { data, error } = await supabase.auth.getUser();
      // console.log("Supabase getUser result:", { data, error });
      
      if (error) {
        console.error("Error getting user:", error);
        return;
      }
      
      if (data?.user) {
        console.log("Found authenticated user:", data.user);
        setCurrentUser(data.user);
      } else {
        console.log("No authenticated user found");
        // Optional: Show a toast notification that user needs to sign in
        showError("Please sign in to use the chat.");
        // Redirect to auth page
        navigate('/auth', { state: { from: '/chat' } });
      }
    } catch (err) {
      console.error("Error in checkUser:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      // Check if we have a current user
      if (!currentUser) {
        console.log("No current user found, trying to get from supabase");
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          console.error("Auth error:", error);
          showError('Please sign in to continue the chat');
          navigate('/auth', { state: { from: '/chat' } });
          return;
        }
        
        setCurrentUser(data.user);
      }

      

      const newMessage = {
        text: input,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newMessage]);
      setInput('');
      setIsTyping(true);

      // Log the request details for debugging
      console.log("Sending chat request:", {
        message: input,
        sessionId,
        userId: currentUser.id,
        
      });

      const response = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({
          message: input,
          sessionId,
          userId: currentUser.id
        })
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to get response: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API response data:", responseData);
      
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

  // If no user is authenticated and we're not in the process of checking, redirect
  useEffect(() => {
    if (currentUser === null) {
      // We're still loading or checking
      return;
    }
  }, [currentUser, navigate]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Chat Header */}
      <div className="bg-primary/10 p-4 border-b border-primary/20">
        <h2 className="text-lg font-semibold text-primary">AI Therapy Chat</h2>
        {currentUser && (
          <p className="text-sm text-primary/70">Logged in as: {currentUser.email}</p>
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