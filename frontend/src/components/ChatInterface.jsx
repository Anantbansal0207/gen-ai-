import React from 'react';
import { useToast } from '../hooks/useToast';
import { useSession } from '../hooks/useSession';
import { useMessages } from '../hooks/useMessages';
import { useNudge } from '../hooks/useNudge';
import { useMoodTracker } from '../hooks/useMoodTracker';
import LoadingDots from './LoadingDots';
import FloatingLeaf from './FloatingLeaf';
import mountains from '../assets/bg3.jpg';

const ChatInterface = ({ user: propUser }) => {
  const { showSuccess, showError } = useToast();
  
  const { 
    sessionId, 
    currentUser, 
    hasInitialized, 
    setHasInitialized, 
    handleRefreshSession 
  } = useSession(propUser, showError, showSuccess);
  
  const { selectedMood, trackMood } = useMoodTracker(sessionId, currentUser?.id);
  
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
  
  const { isSendingNudge, startInactivityTimer, clearInactivityTimer } = useNudge(
    sessionId,
    currentUser,
    isTyping,
    input,
    messages,
    setMessages
  );
  
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
  
  const handleFullRefresh = async () => {
    if (await handleRefreshSession()) {
      clearMessages();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-cover bg-center overflow-hidden" 
         style={{ backgroundImage: `url(${mountains})` }}>
      <FloatingLeaf className="text-teal-400/40" />
      <FloatingLeaf className="text-teal-500/40" />
      <FloatingLeaf className="text-teal-600/40" />
      
      {/* Main Container - Perfectly Centered */}
      <div className="flex flex-row w-full max-w-7xl h-[75vh] rounded-xl shadow-2xl overflow-hidden mx-4">
        {/* Left Section - Static */}
        <div className="w-64 md:w-72 bg-white/10 backdrop-blur-lg border-r border-white/10 flex-shrink-0">
          <div className="h-full flex flex-col p-2 md:p-3">
            {/* Logo and Title */}
            <div className="flex flex-col items-center mb-3">
              <div className="w-8 h-8 mb-1">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L4 15h16L12 3z" stroke="currentColor" strokeWidth="2" className="text-green-600"/>
                  <rect x="11" y="14" width="2" height="7" fill="currentColor" className="text-green-600"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-700">Mood & Sentiment Tracker</h3>
            </div>

            {/* Mood Selection */}
            <div className="flex justify-around mb-3">
              <button
                onClick={() => trackMood('positive')}
                className={`p-1 rounded-full transition-all ${
                  selectedMood === 'positive' 
                    ? 'bg-white/50 scale-110' 
                    : 'bg-white/30 hover:bg-white/40'
                }`}
              >
                <span className="text-lg">😊</span>
              </button>
              <button
                onClick={() => trackMood('neutral')}
                className={`p-1 rounded-full transition-all ${
                  selectedMood === 'neutral' 
                    ? 'bg-white/50 scale-110' 
                    : 'bg-white/30 hover:bg-white/40'
                }`}
              >
                <span className="text-lg">😐</span>
              </button>
              <button
                onClick={() => trackMood('negative')}
                className={`p-1 rounded-full transition-all ${
                  selectedMood === 'negative' 
                    ? 'bg-white/50 scale-110' 
                    : 'bg-white/30 hover:bg-white/40'
                }`}
              >
                <span className="text-lg">😔</span>
              </button>
            </div>

            {/* Calming Quote */}
            <div className="bg-white/10 rounded-xl p-2 mb-3">
              <h4 className="text-xs font-medium text-gray-600 mb-1">Calming Quote of Day</h4>
              <p className="text-xs text-gray-700 italic">
                "Peace comes from within. Do not seek it without."
              </p>
            </div>

            {/* Session History */}
            <div className="flex-grow overflow-y-auto">
              <h4 className="text-xs font-medium text-gray-600 mb-1">SESSION HISTORY</h4>
              <div className="space-y-1">
                {['Today', 'Yesterday', 'Last Week'].map((period, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-2 py-1 rounded-lg bg-white/10 text-gray-600 hover:bg-white/20 transition-colors text-xs"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* New Session Button */}
            <button
              onClick={handleFullRefresh}
              disabled={!currentUser || !sessionId}
              className="w-full px-2 py-1 rounded-lg bg-white/20 text-gray-700 hover:bg-white/30 transition-colors disabled:opacity-50 mt-2 text-xs"
            >
              New Session
            </button>
          </div>
        </div>

        {/* Chat Section - Scrollable */}
        <div className="flex-1 flex flex-col backdrop-blur-sm min-w-0">
          {/* Chat Header */}
          <div className="bg-white/20 p-2 border-b border-white/20">
            <h2 className="text-base font-semibold text-gray-700">Mindful Chat</h2>
          </div>

          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${message.timestamp}-${index}`}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-2 ${
                    message.sender === 'user'
                      ? 'bg-white/60 ml-4'
                      : 'bg-white/40 mr-4'
                  }`}
                >
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">{message.text}</p>
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
                <div className="bg-white/40 rounded-2xl p-2">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Response Buttons */}
          <div className="bg-white/20 px-2 py-1 flex gap-1 justify-center flex-wrap">
            {!messages.length ? (
              ['I\'m feeling anxious', 'I need someone to talk to'].map((text, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(text)}
                  className="px-2 py-1 rounded-full bg-white/40 text-gray-700 hover:bg-white/50 transition-all text-xs"
                >
                  {text}
                </button>
              ))
            ) : (
              ['Sure', "I'm feeling good", 'Can you help me?', "What's new?"].map((text, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(text)}
                  className="px-2 py-1 rounded-full bg-white/40 text-gray-700 hover:bg-white/50 transition-all text-xs"
                >
                  {text}
                </button>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-2 bg-white/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && !isTyping && !isSendingNudge && handleSend()}
                placeholder="Message..."
                className="flex-1 px-3 py-1 rounded-full bg-white/50 placeholder-gray-500 text-gray-700 focus:outline-none focus:ring-1 focus:ring-white/50 text-sm"
                disabled={!currentUser || !sessionId || isTyping || isSendingNudge}
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !currentUser || !sessionId || !input.trim() || isSendingNudge}
                className="p-1 rounded-full bg-white/50 text-gray-700 hover:bg-white/60 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;