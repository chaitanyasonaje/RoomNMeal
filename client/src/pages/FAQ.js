import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaHome, FaUtensils, FaCreditCard, FaShieldAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const FAQ = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Find answers to common questions about RoomNMeal services, bookings, and support
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <FaQuestionCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
              <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            filteredData.map((category, categoryIndex) => (
              <div key={category.category} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-primary-600">{category.icon}</div>
                    <h2 className="text-xl font-semibold text-gray-800">{category.category}</h2>
                    <span className="bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded-full">
                      {category.questions.length} questions
                    </span>
                  </div>
                </div>

                {/* Questions */}
                <div className="divide-y divide-gray-200">
                  {category.questions.map((question, questionIndex) => {
                    const isExpanded = expandedItems[`${categoryIndex}-${questionIndex}`];
                    return (
                      <div key={questionIndex} className="p-6">
                        <button
                          onClick={() => toggleExpanded(categoryIndex, questionIndex)}
                          className="w-full text-left flex items-center justify-between group"
                        >
                          <h3 className="text-lg font-medium text-gray-800 group-hover:text-primary-600 transition-colors duration-200 pr-4">
                            {question.question}
                          </h3>
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <FaChevronUp className="h-5 w-5 text-primary-600" />
                            ) : (
                              <FaChevronDown className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
                            )}
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-4 pl-0">
                            <div className="prose prose-sm max-w-none">
                              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {question.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Our support team is here to help you 24/7. Get in touch with us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <FaPhone className="h-5 w-5 mr-2" />
              Call Us Now
            </a>
            <a
              href="mailto:support@roomnmeal.com"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              <FaEnvelope className="h-5 w-5 mr-2" />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
