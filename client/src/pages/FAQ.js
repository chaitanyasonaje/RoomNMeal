import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaHome, FaUtensils, FaCreditCard, FaShieldAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const FAQ = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData = [
    {
      category: 'General',
      icon: <FaQuestionCircle className="h-5 w-5" />,
      questions: [
        {
          question: 'What is RoomNMeal?',
          answer: 'RoomNMeal is India\'s leading student accommodation platform that connects students with verified rooms, PGs, hostels, and quality mess services. We operate across multiple cities and ensure all properties meet our quality standards.',
          keywords: ['what is', 'about', 'platform', 'service']
        },
        {
          question: 'How do I get started?',
          answer: 'Getting started is easy! 1) Create your free account 2) Select your city 3) Browse verified rooms and mess services 4) Filter by your preferences 5) Book securely online. The entire process takes just a few minutes!',
          keywords: ['get started', 'begin', 'signup', 'register']
        },
        {
          question: 'Is RoomNMeal free to use?',
          answer: 'RoomNMeal is completely free to browse and create an account. We only charge when you make a booking or subscription. No hidden fees, no membership charges!',
          keywords: ['free', 'cost', 'pricing', 'charges']
        },
        {
          question: 'What cities do you operate in?',
          answer: 'We operate in major cities across India including Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, and many more. Select your city from the dropdown to see local options!',
          keywords: ['cities', 'location', 'where', 'operate']
        }
      ]
    },
    {
      category: 'Rooms & Accommodation',
      icon: <FaHome className="h-5 w-5" />,
      questions: [
        {
          question: 'How do I book a room?',
          answer: 'To book a room: 1) Find your preferred room 2) Select check-in/check-out dates 3) Choose additional services (meals, laundry, etc.) 4) Review booking summary 5) Complete secure payment 6) Get instant confirmation!',
          keywords: ['book room', 'booking', 'how to book', 'reserve']
        },
        {
          question: 'Are all rooms verified?',
          answer: 'Yes, all rooms are personally verified by our team. We check: ✓ Photos match reality ✓ Amenities are functional ✓ Location accuracy ✓ Safety standards ✓ Cleanliness ✓ Host reliability. We guarantee quality!',
          keywords: ['verified', 'verification', 'quality', 'standards']
        },
        {
          question: 'What types of accommodation do you offer?',
          answer: 'We offer: 🏠 Private Rooms (single/double occupancy) 🏢 Shared Rooms (3-4 people) 🏘️ PG Accommodations 🏨 Hostels 🏡 Apartments. All with detailed photos, amenities, and location info.',
          keywords: ['types', 'accommodation', 'room types', 'options']
        },
        {
          question: 'Can I cancel my booking?',
          answer: 'Cancellation policies vary by property. Generally: Free cancellation 24-48 hours before check-in. Partial refund for shorter notice. Check specific terms before booking. We\'ll help with any issues!',
          keywords: ['cancel', 'cancellation', 'refund']
        },
        {
          question: 'What amenities are typically included?',
          answer: 'Common amenities include: WiFi, electricity, water, security, parking, common areas, kitchen access, laundry facilities, and 24/7 support. Check individual listings for specific amenities.',
          keywords: ['amenities', 'facilities', 'included', 'features']
        }
      ]
    },
    {
      category: 'Mess Services',
      icon: <FaUtensils className="h-5 w-5" />,
      questions: [
        {
          question: 'How do mess subscriptions work?',
          answer: 'Mess subscription process: 1) Browse mess providers in your area 2) Choose meal plan (1, 2, or 3 meals) 3) Select cuisine preferences 4) Subscribe monthly 5) Enjoy fresh meals! Modify anytime.',
          keywords: ['mess', 'subscription', 'food', 'meals']
        },
        {
          question: 'What meal plans are available?',
          answer: 'Available meal plans: 🌅 Breakfast Only (₹1500-2000/month) 🍽️ Lunch + Dinner (₹2500-3500/month) 🍴 All 3 Meals (₹3500-4500/month) 🍛 Custom plans available. Prices vary by location and provider.',
          keywords: ['meal plans', 'breakfast', 'lunch', 'dinner']
        },
        {
          question: 'How is food quality ensured?',
          answer: 'Food quality assurance: ✅ Regular kitchen inspections ✅ Hygiene certifications ✅ Fresh ingredients daily ✅ Clean preparation areas ✅ Temperature monitoring ✅ Customer feedback tracking',
          keywords: ['food quality', 'hygiene', 'fresh', 'clean']
        },
        {
          question: 'Can I change my meal plan?',
          answer: 'Yes! You can modify your meal plan anytime through your account dashboard. Changes take effect from the next billing cycle. Contact support for immediate changes.',
          keywords: ['change', 'modify', 'meal plan', 'update']
        }
      ]
    },
    {
      category: 'Payments & Security',
      icon: <FaCreditCard className="h-5 w-5" />,
      questions: [
        {
          question: 'Is payment secure?',
          answer: 'Yes, we use industry-standard encryption and secure payment gateways. Your payment information is never stored on our servers. All transactions are PCI DSS compliant.',
          keywords: ['payment', 'secure', 'safe', 'encryption']
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), net banking, and digital wallets for secure transactions.',
          keywords: ['payment methods', 'cards', 'upi', 'wallet']
        },
        {
          question: 'Do you provide receipts?',
          answer: 'Yes, you\'ll receive detailed receipts for all transactions via email and in your account dashboard. All receipts are stored for your records.',
          keywords: ['receipt', 'invoice', 'bill', 'confirmation']
        },
        {
          question: 'What if my payment fails?',
          answer: 'If payment fails, your booking won\'t be confirmed. Check your card details, internet connection, or try a different payment method. Contact support if issues persist.',
          keywords: ['payment fails', 'failed', 'error', 'problem']
        }
      ]
    },
    {
      category: 'Support & Contact',
      icon: <FaPhone className="h-5 w-5" />,
      questions: [
        {
          question: 'How can I contact support?',
          answer: '24/7 Support available: 📞 Call: +91 98765 43210 📧 Email: support@roomnmeal.com 💬 Live Chat (chatbot) 📍 Office: Shirpur, Maharashtra. Average response time: 2 minutes!',
          keywords: ['contact', 'support', 'help', 'assistance']
        },
        {
          question: 'What are your support hours?',
          answer: 'Our support team is available 24/7 to assist you with any queries or issues. You can reach us anytime via phone, email, or live chat.',
          keywords: ['support hours', 'timing', 'available', '24/7']
        },
        {
          question: 'Where is RoomNMeal located?',
          answer: 'Our office is located in Shirpur, Maharashtra, India, near the Engineering College area. We also have virtual support teams across India to serve you better!',
          keywords: ['location', 'where', 'address', 'office']
        },
        {
          question: 'How quickly do you respond?',
          answer: 'We pride ourselves on quick response times: Live chat: Instant, Email: Within 2 hours, Phone: Immediate, Social media: Within 1 hour.',
          keywords: ['response time', 'quick', 'fast', 'immediate']
        }
      ]
    }
  ];

  const toggleExpanded = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredData = faqData.filter(category => {
    if (selectedCategory !== 'all' && category.category !== selectedCategory) {
      return false;
    }
    
    if (searchTerm) {
      const hasMatchingQuestion = category.questions.some(question =>
        question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return hasMatchingQuestion;
    }
    
    return true;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    ...faqData.map(category => ({ value: category.category, label: category.category }))
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
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
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-primary-50'
    }`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Find answers to common questions about RoomNMeal services, bookings, and support
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`rounded-2xl shadow-lg p-6 mb-8 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {filteredData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <FaQuestionCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className={`text-2xl font-semibold mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                No questions found
              </h3>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Try adjusting your search terms or category filter.
              </p>
            </motion.div>
          ) : (
            filteredData.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                variants={cardVariants}
                className={`rounded-2xl shadow-lg overflow-hidden ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Category Header */}
                <div className={`px-6 py-4 border-b ${
                  isDark 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-700' 
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="text-primary-600">{category.icon}</div>
                    <h2 className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                      {category.category}
                    </h2>
                    <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full font-medium">
                      {category.questions.length} questions
                    </span>
                  </div>
                </div>

                {/* Questions */}
                <div className={`divide-y ${
                  isDark ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {category.questions.map((question, questionIndex) => {
                    const isExpanded = expandedItems[`${categoryIndex}-${questionIndex}`];
                    return (
                      <motion.div
                        key={questionIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: questionIndex * 0.1 }}
                        className="p-6"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleExpanded(categoryIndex, questionIndex)}
                          className="w-full text-left flex items-center justify-between group"
                        >
                          <h3 className={`text-lg font-semibold group-hover:text-primary-600 transition-colors duration-200 pr-4 ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}>
                            {question.question}
                          </h3>
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <FaChevronUp className="h-5 w-5 text-primary-600" />
                            ) : (
                              <FaChevronDown className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
                            )}
                          </div>
                        </motion.button>
                        
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pl-0"
                          >
                            <div className="prose prose-sm max-w-none">
                              <p className={`leading-relaxed whitespace-pre-line ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {question.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Still have questions?</h3>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg">
            Our support team is here to help you 24/7. Get in touch with us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+919876543210"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <FaPhone className="h-5 w-5 mr-2" />
              Call Us Now
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:support@roomnmeal.com"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              <FaEnvelope className="h-5 w-5 mr-2" />
              Email Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
