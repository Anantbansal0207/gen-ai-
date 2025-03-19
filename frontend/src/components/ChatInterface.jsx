import React, { useState, useRef, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { supabase } from '../utils/supabase1';
import { useToast } from '../hooks/useToast';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const { showError } = useToast();

  useEffect(() => {
    // Generate a unique session ID when component mounts
    setSessionId(crypto.randomUUID());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      // The getUser() method returns { data: { user }, error }
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        showError('Please sign in to continue the chat');
        return;
      }

      // Get the session which contains the access token
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        showError('Your session has expired. Please sign in again.');
        return;
      }

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
          'Authorization': `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({
          message: input,
          sessionId,
          userId: data.user.id
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

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
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          />
          <button
            onClick={handleSend}
            disabled={isTyping}
            className="bg-primary text-white rounded-full p-3 hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;