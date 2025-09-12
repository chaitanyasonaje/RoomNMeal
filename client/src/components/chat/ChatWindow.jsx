import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaSmile, 
  FaPaperclip, 
  FaPhone, 
  FaVideo, 
  FaEllipsisV,
  FaCheck,
  FaCheckDouble,
  FaClock
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const ChatWindow = ({ 
  messages = [], 
  onSendMessage = () => {},
  onTyping = () => {},
  isTyping = false,
  currentUser = null,
  recipient = null,
  isOnline = false
}) => {
  const { isDark } = useTheme();
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = (message) => {
    if (message.status === 'sent') return <FaCheck className="h-3 w-3 text-gray-400" />;
    if (message.status === 'delivered') return <FaCheckDouble className="h-3 w-3 text-gray-400" />;
    if (message.status === 'read') return <FaCheckDouble className="h-3 w-3 text-blue-500" />;
    return <FaClock className="h-3 w-3 text-gray-400" />;
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const typingVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold`}>
              {recipient?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 border-2 border-white dark:border-gray-800 rounded-full" />
            )}
          </div>
          <div>
            <h3 className={`font-heading font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {recipient?.name || 'Unknown User'}
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } transition-colors duration-200`}
            aria-label="Voice call"
          >
            <FaPhone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } transition-colors duration-200`}
            aria-label="Video call"
          >
            <FaVideo className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } transition-colors duration-200`}
            aria-label="More options"
          >
            <FaEllipsisV className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-xs lg:max-w-md ${message.senderId === currentUser?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {message.senderId !== currentUser?.id && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 flex items-center justify-center text-white text-sm font-semibold">
                      {message.sender?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex flex-col ${message.senderId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`px-4 py-2 rounded-2xl ${
                      message.senderId === currentUser?.id
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : isDark
                        ? 'bg-gray-700 text-white rounded-bl-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </motion.div>
                  
                  {/* Message Info */}
                  <div className={`flex items-center space-x-1 mt-1 ${
                    message.senderId === currentUser?.id ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <span className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                    {message.senderId === currentUser?.id && (
                      <div className="flex items-center">
                        {getMessageStatus(message)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              variants={typingVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex justify-start"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 flex items-center justify-center text-white text-sm font-semibold">
                  {recipient?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className={`px-4 py-2 rounded-2xl ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={`p-4 border-t ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          {/* Attachment Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } transition-colors duration-200`}
            aria-label="Attach file"
          >
            <FaPaperclip className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                onTyping(e.target.value.length > 0);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className={`w-full px-4 py-3 pr-12 rounded-2xl border-0 resize-none focus:ring-2 focus:ring-primary-500 ${
                isDark 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white text-gray-900 placeholder-gray-500'
              }`}
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            
            {/* Emoji Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
              aria-label="Add emoji"
            >
              <FaSmile className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <FaPaperPlane className="h-4 w-4" />
          </motion.button>
        </form>

        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute bottom-20 left-4 right-4 p-4 rounded-2xl shadow-2xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="grid grid-cols-8 gap-2">
                {['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💯'].map(emoji => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setNewMessage(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatWindow;
