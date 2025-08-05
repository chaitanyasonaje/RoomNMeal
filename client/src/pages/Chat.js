import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { FaPaperPlane, FaUser, FaSearch, FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useAuth();
  const { socket, isConnected, sendMessage } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await axios.get('/api/chat/conversations');
        setConversations(response.data.conversations);
      } catch (error) {
        console.error('Failed to load conversations:', error);
        toast.error('Failed to load conversations');
      }
    };

    if (user) {
      loadConversations();
    }
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (data) => {
      if (selectedConversation && 
          (data.senderId === selectedConversation._id || data.receiverId === selectedConversation._id)) {
        setMessages(prev => [...prev, data]);
      }
      // Update conversation list
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv._id === data.senderId || conv._id === data.receiverId) {
            return { ...conv, lastMessage: data.message, lastMessageTime: new Date() };
          }
          return conv;
        });
        return updated.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      });
    });

    socket.on('userTyping', (data) => {
      if (selectedConversation && data.userId === selectedConversation._id) {
        setOtherUserTyping(true);
        setTimeout(() => setOtherUserTyping(false), 3000);
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
    };
  }, [socket, selectedConversation]);

  // Load messages for selected conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/chat/messages/${selectedConversation._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
        receiverId: selectedConversation._id,
        message: newMessage.trim(),
        messageType: 'text'
      };

      // Optimistically add message to UI
      const tempMessage = {
        _id: Date.now(),
        senderId: user._id,
        receiverId: selectedConversation._id,
        message: newMessage.trim(),
        messageType: 'text',
        createdAt: new Date(),
        sender: { name: user.name, profileImage: user.profileImage }
      };

      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      // Send via socket
      sendMessage(selectedConversation._id, newMessage.trim());

      // Save to database
      await axios.post('/api/chat/send', messageData);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!selectedConversation) return;

    setTyping(true);
    socket?.emit('typing', { receiverId: selectedConversation._id });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 1000);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Conversations Sidebar */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?._id === conversation._id ? 'bg-primary-50 border-primary-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        {conversation.profileImage ? (
                          <img
                            src={conversation.profileImage}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <FaUser className="h-6 w-6 text-primary-600" />
                        )}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        {conversation.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {selectedConversation.profileImage ? (
                        <img
                          src={selectedConversation.profileImage}
                          alt={selectedConversation.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaUser className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    {selectedConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedConversation.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FaEllipsisV />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user._id
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user._id ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {otherUserTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                          <p className="text-sm italic">Typing...</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows="2"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPaperPlane className="h-4 w-4" />
                  </button>
                </div>
                {!isConnected && (
                  <p className="text-xs text-red-500 mt-2">Connection lost. Trying to reconnect...</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FaUser className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat; 