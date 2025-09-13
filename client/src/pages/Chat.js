import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/chat/ChatWindow';
import { FaSearch, FaPlus, FaEllipsisV } from 'react-icons/fa';

const Chat = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chat data
  const [chats] = useState([
    {
      id: 1,
      name: "Room Owner - Rajesh Kumar",
      lastMessage: "The room is available for viewing tomorrow",
      timestamp: "2 min ago",
      unreadCount: 2,
      isOnline: true,
      avatar: "R"
    },
    {
      id: 2,
      name: "Mess Provider - Priya's Kitchen",
      lastMessage: "Your meal plan has been confirmed",
      timestamp: "1 hour ago",
      unreadCount: 0,
      isOnline: false,
      avatar: "P"
    },
    {
      id: 3,
      name: "Service Provider - CleanPro",
      lastMessage: "Your laundry will be ready by 6 PM",
      timestamp: "3 hours ago",
      unreadCount: 1,
      isOnline: true,
      avatar: "C"
    },
    {
      id: 4,
      name: "Support Team",
      lastMessage: "Thank you for your feedback",
      timestamp: "1 day ago",
      unreadCount: 0,
      isOnline: false,
      avatar: "S"
    }
  ]);

  // Mock messages for selected chat
  const mockMessages = {
    1: [
      {
        id: 1,
        text: "Hi! I'm interested in the room you listed. Is it still available?",
        senderId: user?.id,
        sender: { name: user?.name },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'read'
      },
      {
        id: 2,
        text: "Yes, the room is still available. Would you like to schedule a viewing?",
        senderId: 'other',
        sender: { name: "Rajesh Kumar" },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'delivered'
      },
      {
        id: 3,
        text: "That would be great! What time works for you?",
        senderId: user?.id,
        sender: { name: user?.name },
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'read'
      },
      {
        id: 4,
        text: "The room is available for viewing tomorrow between 2-4 PM. Does that work for you?",
        senderId: 'other',
        sender: { name: "Rajesh Kumar" },
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        status: 'delivered'
      }
    ],
    2: [
      {
        id: 1,
        text: "Hello! I'd like to subscribe to your monthly meal plan",
        senderId: user?.id,
        sender: { name: user?.name },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'read'
      },
      {
        id: 2,
        text: "Great! Your meal plan has been confirmed. You'll receive breakfast, lunch, and dinner starting tomorrow.",
        senderId: 'other',
        sender: { name: "Priya's Kitchen" },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'delivered'
      }
    ]
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages[selectedChat.id] || []);
    }
  }, [selectedChat]);

  const handleSendMessage = (messageText) => {
    const newMessage = {
      id: Date.now(),
      text: messageText,
      senderId: user?.id,
      sender: { name: user?.name },
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responseMessage = {
          id: Date.now() + 1,
          text: "Thank you for your message. I'll get back to you soon!",
          senderId: 'other',
          sender: { name: chats.find(chat => chat.id === selectedChat.id)?.name },
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }, 1000);
  };

  const handleTyping = (isTyping) => {
    // Handle typing indicator
    console.log('User is typing:', isTyping);
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Chat List Sidebar */}
      <div className={`w-80 border-r ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
          {/* Header */}
        <div className={`p-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-xl font-heading font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Messages
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors duration-200`}
              aria-label="New message"
            >
              <FaPlus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
          
          {/* Search */}
            <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                isDark 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              }`}
              />
            </div>
          </div>

        {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1 p-2"
          >
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedChat?.id === chat.id
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : isDark
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      chat.isOnline ? 'bg-primary-600' : 'bg-gray-500'
                    }`}>
                      {chat.avatar}
                      </div>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 border-2 border-white dark:border-gray-800 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {chat.name}
                      </h3>
                      <span className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full">
                        {chat.unreadCount}
                      </span>
                      </div>
                      )}
                    </div>
              </motion.div>
            ))}
          </motion.div>
                  </div>
                </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            isTyping={isTyping}
            currentUser={user}
            recipient={selectedChat}
            isOnline={selectedChat.isOnline}
                        />
                      ) : (
          <div className={`flex-1 flex items-center justify-center ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className={`text-6xl mb-4 ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              }`}>
                💬
                    </div>
              <h3 className={`text-xl font-heading font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Select a conversation
              </h3>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Choose a chat from the sidebar to start messaging
              </p>
            </motion.div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Chat; 