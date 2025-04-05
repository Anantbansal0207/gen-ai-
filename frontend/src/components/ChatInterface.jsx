import React from 'react';
import { useToast } from '../hooks/useToast';
import { useSession } from '../hooks/useSession';
import { useMessages } from '../hooks/useMessages';
import { useNudge } from '../hooks/useNudge';
import { useMoodTracker } from '../hooks/useMoodTracker';
import LoadingDots from './LoadingDots';
import FloatingLeaf from './FloatingLeaf';

const ChatInterface = ({ user: propUser }) => {
  const { showSuccess, showError } = useToast();
  
  // Session management
  const { 
    sessionId, 
    currentUser, 
    hasInitialized, 
    setHasInitialized, 
    handleRefreshSession 
  } = useSession(propUser, showError, showSuccess);
  
  // Mood tracking
  const { selectedMood, trackMood } = useMoodTracker(sessionId, currentUser?.id);
  
  // Messages handling
  const {
    messages,
    setMessages,
    isTyping,
    input,
    messagesEndRef,
    handleSend,
    handleInputChange,
    clearMessages
  } = useMessages(sessionId, currentUser, hasInitialized, setHasInitialized, () => {}, showError);
  
  // Nudge functionality
  const { isSendingNudge, startInactivityTimer, clearInactivityTimer } = useNudge(
    sessionId,
    currentUser,
    isTyping,
    input,
    messages,
    setMessages
  );
  
  // Link the clearInactivityTimer to messages handling
  React.useEffect(() => {
    if (!sessionId) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      if (lastMessage.sender === 'ai' && lastMessage.type !== 'nudge') {
        if (!isSendingNudge) {
          startInactivityTimer();
        } else {
          clearInactivityTimer();
        }
      } else if (lastMessage.sender === 'user') {
        clearInactivityTimer();
      } else if (lastMessage.sender === 'ai' && lastMessage.type === 'nudge') {
        clearInactivityTimer();
      }
    } else {
      clearInactivityTimer();
    }
    
    return () => {
      clearInactivityTimer();
    };
  }, [messages, sessionId, isSendingNudge, startInactivityTimer, clearInactivityTimer]);
  
  // Handle refresh session - needs to clear messages too
  const handleFullRefresh = async () => {
    if (await handleRefreshSession()) {
      clearMessages();
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-cyan-100 to-blue-100">
      {/* Add FloatingLeaf components */}
      <FloatingLeaf className="text-teal-400/40" />
      <FloatingLeaf className="text-teal-500/40" />
      <FloatingLeaf className="text-teal-600/40" />
      
      {/* Left Sidebar - Mood Tracker */}
      <div className="w-64 p-6 backdrop-blur-md bg-white/30 border-r border-white/20 hidden md:block">
        <div className="space-y-8">
          {/* Tree Logo */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-2">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L4 15h16L12 3z" stroke="currentColor" strokeWidth="2" className="text-green-600"/>
                <rect x="11" y="14" width="2" height="7" fill="currentColor" className="text-green-600"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Mood & Sentiment Tracker</h3>
          </div>

          {/* Mood Selection */}
          <div className="flex justify-around">
            <button
              onClick={() => trackMood('positive')}
              className={`p-3 rounded-full transition-all ${
                selectedMood === 'positive' 
                  ? 'bg-white/50 scale-110' 
                  : 'bg-white/30 hover:bg-white/40'
              }`}
            >
              <span className="text-2xl">😊</span>
            </button>
            <button
              onClick={() => trackMood('neutral')}
              className={`p-3 rounded-full transition-all ${
                selectedMood === 'neutral' 
                  ? 'bg-white/50 scale-110' 
                  : 'bg-white/30 hover:bg-white/40'
              }`}
            >
              <span className="text-2xl">😐</span>
            </button>
            <button
              onClick={() => trackMood('negative')}
              className={`p-3 rounded-full transition-all ${
                selectedMood === 'negative' 
                  ? 'bg-white/50 scale-110' 
                  : 'bg-white/30 hover:bg-white/40'
              }`}
            >
              <span className="text-2xl">😔</span>
            </button>
          </div>

          {/* Calming Quote */}
          <div className="bg-white/20 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Calming Quote of Day</h4>
            <p className="text-gray-700 italic">
              "Peace comes from within. Do not seek it without."
            </p>
          </div>

          {/* Session History */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">SESSION HISTORY</h4>
            <div className="space-y-2">
              {['Today', 'Yesterday', 'Last Week'].map((period, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 rounded-lg bg-white/20 text-gray-600 hover:bg-white/30 transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          {/* New Session Button */}
          <div>
            <button
              onClick={handleFullRefresh}
              disabled={!currentUser || !sessionId}
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-gray-700 hover:bg-white/40 transition-colors disabled:opacity-50"
            >
              New Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md p-4 border-b border-white/20">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Mindful Chat</h2>
            <button
              onClick={handleFullRefresh}
              className="px-4 py-2 text-sm bg-white/30 text-gray-700 rounded-lg hover:bg-white/40 transition-colors md:hidden"
              disabled={!currentUser || !sessionId}
            >
              New Session
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${message.timestamp}-${index}`}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-white/40 ml-12'
                    : 'bg-white/20 mr-12'
                }`}
              >
                <p className="text-gray-700 whitespace-pre-wrap">{message.text}</p>
                <span className="text-xs text-gray-500 mt-1 block text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/20 rounded-2xl p-4">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Buttons */}
        {!messages.length ? (
          <div className="px-6 py-3 flex gap-2 justify-center">
            {['I\'m feeling anxious', 'I need someone to talk to'].map((text, index) => (
              <button
                key={index}
                onClick={() => handleSend(text)}
                className="px-4 py-2 rounded-full bg-white/30 text-gray-700 hover:bg-white/40 transition-all"
              >
                {text}
              </button>
            ))}
          </div>
        ) : (
          <div className="px-6 py-3 flex gap-2 justify-center">
            {['Sure', "I'm feeling good", 'Can you help me?', "What's new?"].map((text, index) => (
              <button
                key={index}
                onClick={() => handleSend(text)}
                className="px-4 py-2 rounded-full bg-white/30 text-gray-700 hover:bg-white/40 transition-all"
              >
                {text}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 bg-white/10">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && !isSendingNudge && handleSend()}
              placeholder="Message..."
              className="flex-1 px-6 py-3 rounded-full bg-white/30 placeholder-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50"
              disabled={!currentUser || !sessionId || isTyping || isSendingNudge}
            />
            <button
              onClick={() => handleSend()}
              disabled={isTyping || !currentUser || !sessionId || !input.trim() || isSendingNudge}
              className="p-3 rounded-full bg-white/30 text-gray-700 hover:bg-white/40 transition-all disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;