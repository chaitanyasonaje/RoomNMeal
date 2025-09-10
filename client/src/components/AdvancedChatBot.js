import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaTimes, FaPaperPlane, FaQuestionCircle, FaHome, FaUtensils, FaCreditCard, FaShieldAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLightbulb, FaBookOpen } from 'react-icons/fa';

const AdvancedChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Enhanced FAQ Data with more detailed responses
  const faqData = {
    general: [
      {
        keywords: ['what is roomnmeal', 'about roomnmeal', 'platform'],
        answer: 'RoomNMeal is India\'s leading student accommodation platform that connects students with verified rooms, PGs, hostels, and quality mess services. We operate across multiple cities and ensure all properties meet our quality standards.',
        followUp: ['How do I get started?', 'What cities do you operate in?', 'Is it free to use?']
      },
      {
        keywords: ['get started', 'how to start', 'begin', 'signup'],
        answer: 'Getting started is easy! 1) Create your free account 2) Select your city 3) Browse verified rooms and mess services 4) Filter by your preferences 5) Book securely online. The entire process takes just a few minutes!',
        followUp: ['How do I create an account?', 'What information do I need?', 'Is my data secure?']
      },
      {
        keywords: ['free', 'cost', 'pricing', 'charges'],
        answer: 'RoomNMeal is completely free to browse and create an account. We only charge when you make a booking or subscription. No hidden fees, no membership charges!',
        followUp: ['What are the booking fees?', 'How do payments work?', 'Are there any discounts?']
      }
    ],
    rooms: [
      {
        keywords: ['book room', 'room booking', 'how to book'],
        answer: 'To book a room: 1) Find your preferred room 2) Select check-in/check-out dates 3) Choose additional services (meals, laundry, etc.) 4) Review booking summary 5) Complete secure payment 6) Get instant confirmation!',
        followUp: ['What documents do I need?', 'Can I cancel my booking?', 'What if I have issues?']
      },
      {
        keywords: ['verified', 'verification', 'quality', 'standards'],
        answer: 'All rooms are personally verified by our team. We check: ✓ Photos match reality ✓ Amenities are functional ✓ Location accuracy ✓ Safety standards ✓ Cleanliness ✓ Host reliability. We guarantee quality!',
        followUp: ['What if the room doesn\'t match?', 'How do you verify rooms?', 'Can I report issues?']
      },
      {
        keywords: ['types', 'accommodation', 'room types', 'options'],
        answer: 'We offer: 🏠 Private Rooms (single/double occupancy) 🏢 Shared Rooms (3-4 people) 🏘️ PG Accommodations 🏨 Hostels 🏡 Apartments. All with detailed photos, amenities, and location info.',
        followUp: ['What amenities are included?', 'How do I choose the right type?', 'Are there female-only options?']
      },
      {
        keywords: ['cancel', 'cancellation', 'refund'],
        answer: 'Cancellation policies vary by property. Generally: Free cancellation 24-48 hours before check-in. Partial refund for shorter notice. Check specific terms before booking. We\'ll help with any issues!',
        followUp: ['How do I cancel?', 'When will I get my refund?', 'What if it\'s an emergency?']
      }
    ],
    mess: [
      {
        keywords: ['mess', 'food', 'meals', 'mess service'],
        answer: 'Our mess services offer: 🍽️ Fresh, hygienic meals 🕐 Flexible meal plans (breakfast, lunch, dinner) 🏪 Multiple verified providers 🍛 Regional cuisine options 💳 Easy monthly subscriptions',
        followUp: ['How do I subscribe?', 'What meal plans are available?', 'How is food quality ensured?']
      },
      {
        keywords: ['subscribe', 'subscription', 'mess plan'],
        answer: 'Mess subscription process: 1) Browse mess providers in your area 2) Choose meal plan (1, 2, or 3 meals) 3) Select cuisine preferences 4) Subscribe monthly 5) Enjoy fresh meals! Modify anytime.',
        followUp: ['Can I change my plan?', 'What if I don\'t like the food?', 'How do I cancel?']
      },
      {
        keywords: ['meal plans', 'breakfast', 'lunch', 'dinner'],
        answer: 'Available meal plans: 🌅 Breakfast Only (₹1500-2000/month) 🍽️ Lunch + Dinner (₹2500-3500/month) 🍴 All 3 Meals (₹3500-4500/month) 🍛 Custom plans available. Prices vary by location and provider.',
        followUp: ['What\'s included in each meal?', 'Can I get a trial?', 'Are there vegetarian options?']
      },
      {
        keywords: ['food quality', 'hygiene', 'fresh', 'clean'],
        answer: 'Food quality assurance: ✅ Regular kitchen inspections ✅ Hygiene certifications ✅ Fresh ingredients daily ✅ Clean preparation areas ✅ Temperature monitoring ✅ Customer feedback tracking',
        followUp: ['What if I find issues?', 'How do you monitor quality?', 'Can I see the kitchen?']
      }
    ],
    payment: [
      {
        keywords: ['payment', 'pay', 'secure', 'payment method'],
        answer: 'Secure payment options: 💳 Credit/Debit Cards 🏦 Net Banking 📱 UPI (Google Pay, PhonePe, Paytm) 💰 Digital Wallets 🔒 256-bit SSL encryption. Your payment data is never stored!',
        followUp: ['Is my payment secure?', 'What if payment fails?', 'Do you store card details?']
      },
      {
        keywords: ['receipt', 'invoice', 'bill', 'confirmation'],
        answer: 'You\'ll receive: 📧 Email receipt immediately 📱 SMS confirmation 💳 Payment gateway receipt 📄 Detailed invoice in your account. All receipts are stored in your dashboard.',
        followUp: ['Where can I find receipts?', 'Can I download invoices?', 'What if I don\'t receive receipt?']
      }
    ],
    support: [
      {
        keywords: ['contact', 'support', 'help', 'assistance'],
        answer: '24/7 Support available: 📞 Call: +91 98765 43210 📧 Email: support@roomnmeal.com 💬 Live Chat (this bot!) 📍 Office: Shirpur, Maharashtra. Average response time: 2 minutes!',
        followUp: ['What are your hours?', 'How quickly do you respond?', 'Can I visit your office?']
      },
      {
        keywords: ['location', 'where', 'address', 'office'],
        answer: 'Our office is located in Shirpur, Maharashtra, India, near the Engineering College area. We also have virtual support teams across India to serve you better!',
        followUp: ['Can I visit in person?', 'Do you have other offices?', 'How do I reach there?']
      }
    ]
  };

  const quickActions = [
    { text: 'Find Rooms', icon: <FaHome />, action: 'How do I find and book rooms?' },
    { text: 'Mess Services', icon: <FaUtensils />, action: 'Tell me about mess services and subscriptions' },
    { text: 'Payment Help', icon: <FaCreditCard />, action: 'How do payments and refunds work?' },
    { text: 'Contact Support', icon: <FaPhone />, action: 'How can I contact customer support?' },
    { text: 'View FAQ', icon: <FaBookOpen />, action: 'faq' },
    { text: 'Tips', icon: <FaLightbulb />, action: 'Give me tips for finding the best accommodation' }
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

  const findBestAnswer = (question) => {
    const lowerQuestion = question.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    // Search through all categories
    Object.values(faqData).forEach(category => {
      category.forEach(item => {
        let score = 0;
        item.keywords.forEach(keyword => {
          if (lowerQuestion.includes(keyword)) {
            score += keyword.length; // Longer keywords get higher scores
          }
        });
        
        if (score > maxScore) {
          maxScore = score;
          bestMatch = item;
        }
      });
    });

    if (bestMatch) {
      setSuggestedQuestions(bestMatch.followUp || []);
      return bestMatch.answer;
    }

    // Fallback responses
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
      setSuggestedQuestions(['How do I get started?', 'What services do you offer?', 'How do I contact support?']);
      return 'Hello! 👋 Welcome to RoomNMeal! I\'m your personal assistant here to help you find the perfect student accommodation and mess services. What would you like to know?';
    }
    
    if (lowerQuestion.includes('thank')) {
      setSuggestedQuestions(['How do I book a room?', 'Tell me about mess services', 'What are your payment options?']);
      return 'You\'re very welcome! 😊 I\'m here whenever you need help. Is there anything else I can assist you with?';
    }

    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('expensive')) {
      setSuggestedQuestions(['What\'s included in the price?', 'Are there any hidden fees?', 'Do you offer discounts?']);
      return 'Room prices vary by location, type, and amenities (₹3000-15000/month). Mess services range from ₹1500-4500/month. You can filter by budget on our platform. No hidden fees!';
    }

    if (lowerQuestion.includes('location') || lowerQuestion.includes('where') || lowerQuestion.includes('city')) {
      setSuggestedQuestions(['What cities do you operate in?', 'How do I change my city?', 'Do you have rooms near my college?']);
      return 'We operate in major cities across India including Mumbai, Delhi, Bangalore, Pune, Hyderabad, and many more. Select your city from the dropdown to see local options!';
    }

    if (lowerQuestion.includes('tips') || lowerQuestion.includes('advice') || lowerQuestion.includes('suggest')) {
      setSuggestedQuestions(['How do I choose the right room?', 'What should I look for in a mess?', 'How do I avoid scams?']);
      return '💡 Pro Tips: 1) Check photos carefully 2) Read reviews 3) Visit if possible 4) Ask about amenities 5) Understand cancellation policy 6) Keep receipts safe 7) Report any issues immediately!';
    }

    if (lowerQuestion.includes('faq') || lowerQuestion.includes('frequently asked')) {
      setSuggestedQuestions(['How do I book a room?', 'What are your payment methods?', 'How do I contact support?']);
      return 'You can find comprehensive answers to frequently asked questions on our FAQ page. Would you like me to help you navigate there or answer a specific question?';
    }

    setSuggestedQuestions(['How do I get started?', 'What services do you offer?', 'Contact support']);
    return 'I\'m not sure I understand that question. Could you rephrase it or try one of the suggested questions below? I\'m here to help with rooms, mess services, payments, and support!';
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

    // Simulate realistic typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: findBestAnswer(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleQuickAction = (action) => {
    if (action === 'faq') {
      // Open FAQ page in new tab
      window.open('/faq', '_blank');
      return;
    }
    setInputValue(action);
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
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
        text: 'Hello! 👋 I\'m your RoomNMeal assistant! I can help you with:\n\n🏠 Finding and booking rooms\n🍽️ Mess services and subscriptions\n💳 Payment and billing questions\n📞 Support and contact info\n\nWhat would you like to know?',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setSuggestedQuestions(['How do I get started?', 'What services do you offer?', 'How do I contact support?']);
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
          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
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
                <p className="text-xs text-primary-100 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Online now
                </p>
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
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
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

            {/* Suggested Questions */}
            {suggestedQuestions.length > 0 && !isTyping && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Suggested questions:</p>
                <div className="space-y-1">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-left p-2 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200 text-sm text-primary-700 border border-primary-200"
                    >
                      {question}
                    </button>
                  ))}
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

export default AdvancedChatBot;
