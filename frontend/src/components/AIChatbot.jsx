import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your SkillNova AI Assistant. How can I help you today? 👋' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\n/g, '<br/>');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
        history: messages
      });

      setMessages([...newMessages, { role: 'ai', text: response.data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorText = 'Sorry, I am having trouble connecting right now.';
      if (error.response?.data?.message) {
        errorText = error.response.data.message;
      }
      setMessages([...newMessages, { role: 'ai', text: errorText, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end animate-fadeIn">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] mb-4 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold">SkillNova AI</h3>
                <p className="text-xs text-indigo-100">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 custom-scrollbar">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-sm shadow-sm' 
                      : msg.isError
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-bl-sm border border-red-200'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-600'
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-600 flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-full focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white placeholder-slate-400 outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-indigo-500/50 transition-all duration-300 relative group"
        >
          <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {/* Notification Dot */}
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        </button>
      )}
    </div>
  );
};

export default AIChatbot;
