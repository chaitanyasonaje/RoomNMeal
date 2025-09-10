import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaTimes, FaPaperPlane, FaQuestionCircle, FaHome, FaUtensils, FaCreditCard, FaShieldAlt, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // FAQ Data
  const faqData = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is RoomNMeal?',
          answer: 'RoomNMeal is a comprehensive platform that helps students find verified rooms, PGs, and hostels near their colleges, along with quality mess services and additional amenities.'
        },
        {
          question: 'How do I get started?',
          answer: 'Simply create an account, select your city, and start browsing available rooms and mess services. You can filter by location, price, and amenities to find the perfect match.'
        },
        {
          question: 'Is RoomNMeal free to use?',
          answer: 'Yes! Creating an account and browsing rooms is completely free. We only charge when you make a booking or subscription.'
        }
      ]
    },
    {
      category: 'Rooms & Accommodation',
      questions: [
        {
          question: 'How do I book a room?',
          answer: 'Browse available rooms, select your preferred dates, choose additional services if needed, and complete the secure online payment. You\'ll receive instant confirmation.'
        },
        {
          question: 'Are all rooms verified?',
          answer: 'Yes, all rooms on our platform are verified by our team. We check photos, amenities, location, and ensure the property meets our quality standards.'
        },
        {
          question: 'What types of accommodation do you offer?',
          answer: 'We offer private rooms, shared rooms, PGs (Paying Guest), hostels, and apartments. All with detailed photos and amenity lists.'
        },
        {
          question: 'Can I cancel my booking?',
          answer: 'Yes, you can cancel your booking based on our cancellation policy. Check the specific terms for each property before booking.'
        }
      ]
    },
    {
      category: 'Mess Services',
      questions: [
        {
          question: 'How do mess subscriptions work?',
          answer: 'Choose from various mess providers, select your meal plan (breakfast, lunch, dinner), and subscribe monthly. You can modify or cancel anytime.'
        },
        {
          question: 'What meal options are available?',
          answer: 'We offer breakfast, lunch, and dinner options. You can choose individual meals or complete meal plans based on your preferences.'
        },
        {
          question: 'How is food quality ensured?',
          answer: 'All mess providers are verified for hygiene standards, food quality, and preparation methods. We regularly monitor and review their services.'
        }
      ]
    },
    {
      category: 'Payments & Security',
      questions: [
        {
          question: 'Is payment secure?',
          answer: 'Yes, we use industry-standard encryption and secure payment gateways. Your payment information is never stored on our servers.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets for secure transactions.'
        },
        {
          question: 'Do you provide receipts?',
          answer: 'Yes, you\'ll receive detailed receipts for all transactions via email and in your account dashboard.'
        }
      ]
    },
    {
      category: 'Support & Contact',
      questions: [
        {
          question: 'How can I contact support?',
          answer: 'You can reach us via email at support@roomnmeal.com, call us at +91 98765 43210, or use the chat feature for instant help.'
        },
        {
          question: 'What are your support hours?',
          answer: 'Our support team is available 24/7 to assist you with any queries or issues.'
        },
        {
          question: 'Where is RoomNMeal located?',
          answer: 'We are based in Shirpur, Maharashtra, India, near the Engineering College area.'
        }
      ]
    }
  ];

  // Quick action buttons
  const quickActions = [
    { text: 'Find Rooms', icon: <FaHome />, action: 'rooms' },
    { text: 'Mess Services', icon: <FaUtensils />, action: 'mess' },
    { text: 'Payment Help', icon: <FaCreditCard />, action: 'payment' },
    { text: 'Contact Support', icon: <FaPhone />, action: 'contact' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const findAnswer = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    // Direct keyword matching
    for (const category of faqData) {
      for (const item of category.questions) {
        const keywords = item.question.toLowerCase().split(' ');
        if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
          return item.answer;
        }
      }
    }

    // Fallback responses
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
      return 'Hello! I\'m here to help you with any questions about RoomNMeal. How can I assist you today?';
    }
    
    if (lowerQuestion.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }

    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost')) {
      return 'Room prices vary by location, type, and amenities. You can filter rooms by price range on our platform. Mess services typically range from ₹2000-4000 per month depending on the meal plan.';
    }

    if (lowerQuestion.includes('location') || lowerQuestion.includes('where')) {
      return 'We operate in multiple cities across India. You can select your city from the dropdown in the navigation bar to see available options in your area.';
    }

    return 'I understand you\'re looking for information. Could you be more specific? You can also browse our FAQ categories or contact our support team for detailed assistance.';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: findAnswer(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action) => {
    let message = '';
    switch (action) {
      case 'rooms':
        message = 'How do I find and book rooms?';
        break;
      case 'mess':
        message = 'Tell me about mess services';
        break;
      case 'payment':
        message = 'How do payments work?';
        break;
      case 'contact':
        message = 'How can I contact support?';
        break;
      default:
        message = action;
    }
    setInputValue(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: 'Hello! I\'m your RoomNMeal assistant. I can help you with questions about rooms, mess services, payments, and more. How can I assist you today?',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <>
      {/* Chat Bot Toggle Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          aria-label="Open chatbot"
        >
          <FaRobot className="h-6 w-6" />
          <div className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            <FaQuestionCircle className="h-3 w-3" />
          </div>
        </button>
      )}

      {/* Chat Bot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaRobot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">RoomNMeal Assistant</h3>
                <p className="text-xs text-primary-100">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors duration-200 text-sm"
                    >
                      {action.icon}
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about RoomNMeal..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-xl transition-colors duration-200"
              >
                <FaPaperPlane className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
