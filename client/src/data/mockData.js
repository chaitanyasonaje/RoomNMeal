// Mock Data for RoomNMeal Platform

export const mockUsers = [
  {
    _id: 'user1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    city: 'Mumbai',
    college: 'IIT Bombay',
    course: 'Computer Science',
    year: '3rd Year',
    preferences: {
      budget: { min: 8000, max: 15000 },
      amenities: ['wifi', 'ac', 'laundry', 'parking'],
      foodPreference: 'vegetarian'
    },
    joinedDate: '2023-08-15',
    isVerified: true
  },
  {
    _id: 'user2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43211',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    city: 'Delhi',
    college: 'Delhi University',
    course: 'Business Administration',
    year: '2nd Year',
    preferences: {
      budget: { min: 6000, max: 12000 },
      amenities: ['wifi', 'security', 'common_area'],
      foodPreference: 'non-vegetarian'
    },
    joinedDate: '2023-09-01',
    isVerified: true
  },
  {
    _id: 'host1',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 98765 43212',
    role: 'host',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    city: 'Mumbai',
    businessName: 'Patel Properties',
    experience: '5 years',
    totalProperties: 12,
    rating: 4.8,
    joinedDate: '2020-03-15',
    isVerified: true
  },
  {
    _id: 'mess1',
    name: 'Sunita Devi',
    email: 'sunita.devi@email.com',
    phone: '+91 98765 43213',
    role: 'messProvider',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    city: 'Mumbai',
    businessName: 'Sunita\'s Kitchen',
    experience: '8 years',
    totalSubscribers: 45,
    rating: 4.9,
    joinedDate: '2019-01-10',
    isVerified: true
  }
];

export const mockRooms = [
  {
    _id: 'room1',
    title: 'Cozy Single Room with AC',
    description: 'A comfortable single occupancy room with modern amenities. Perfect for students who prefer privacy and quiet study environment.',
    host: {
      _id: 'host1',
      name: 'Amit Patel',
      phone: '+91 98765 43212',
      rating: 4.8
    },
    address: {
      street: '123 Marine Drive',
      area: 'Marine Lines',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400020',
      coordinates: { lat: 19.0176, lng: 72.8562 }
    },
    rent: 12000,
    deposit: 24000,
    propertyType: 'PG',
    roomType: 'Single',
    gender: 'Male',
    availableFrom: '2024-01-15',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    ],
    amenities: [
      { name: 'WiFi', icon: 'wifi', included: true },
      { name: 'Air Conditioning', icon: 'ac', included: true },
      { name: 'Laundry Service', icon: 'laundry', included: true, price: 500 },
      { name: 'Parking', icon: 'parking', included: true },
      { name: 'Security', icon: 'security', included: true },
      { name: 'Common Area', icon: 'common', included: true },
      { name: 'Kitchen Access', icon: 'kitchen', included: true },
      { name: 'Housekeeping', icon: 'cleaning', included: true, price: 300 }
    ],
    rules: [
      'No smoking inside the room',
      'No pets allowed',
      'Visitors allowed till 10 PM',
      'Maintain cleanliness'
    ],
    nearbyPlaces: [
      { name: 'IIT Bombay', distance: '2.5 km', type: 'college' },
      { name: 'Marine Drive Metro', distance: '500 m', type: 'metro' },
      { name: 'Apollo Pharmacy', distance: '200 m', type: 'pharmacy' },
      { name: 'Domino\'s Pizza', distance: '300 m', type: 'restaurant' }
    ],
    rating: 4.7,
    totalReviews: 23,
    isAvailable: true,
    createdAt: '2023-12-01',
    updatedAt: '2024-01-10'
  },
  {
    _id: 'room2',
    title: 'Shared Room for Girls - Near College',
    description: 'Spacious shared room perfect for female students. Located in a safe neighborhood with easy access to public transport.',
    host: {
      _id: 'host2',
      name: 'Kavita Singh',
      phone: '+91 98765 43214',
      rating: 4.6
    },
    address: {
      street: '456 Linking Road',
      area: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      coordinates: { lat: 19.0544, lng: 72.8406 }
    },
    rent: 8000,
    deposit: 16000,
    propertyType: 'Hostel',
    roomType: 'Shared (2 people)',
    gender: 'Female',
    availableFrom: '2024-02-01',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0ef8c7b9b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
    ],
    amenities: [
      { name: 'WiFi', icon: 'wifi', included: true },
      { name: 'Air Conditioning', icon: 'ac', included: true },
      { name: 'Laundry Service', icon: 'laundry', included: true, price: 400 },
      { name: 'Security', icon: 'security', included: true },
      { name: 'Common Area', icon: 'common', included: true },
      { name: 'Study Room', icon: 'study', included: true },
      { name: 'Housekeeping', icon: 'cleaning', included: true, price: 200 }
    ],
    rules: [
      'Female only accommodation',
      'No male visitors allowed',
      'Maintain room cleanliness',
      'Follow hostel timings'
    ],
    nearbyPlaces: [
      { name: 'Mithibai College', distance: '1.2 km', type: 'college' },
      { name: 'Bandra Station', distance: '800 m', type: 'railway' },
      { name: 'Fortis Hospital', distance: '1.5 km', type: 'hospital' },
      { name: 'McDonald\'s', distance: '400 m', type: 'restaurant' }
    ],
    rating: 4.5,
    totalReviews: 18,
    isAvailable: true,
    createdAt: '2023-11-15',
    updatedAt: '2024-01-08'
  },
  {
    _id: 'room3',
    title: 'Premium Studio Apartment',
    description: 'Fully furnished studio apartment with private bathroom and kitchenette. Ideal for students who want complete independence.',
    host: {
      _id: 'host3',
      name: 'Ravi Mehta',
      phone: '+91 98765 43215',
      rating: 4.9
    },
    address: {
      street: '789 Powai Lake Road',
      area: 'Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      coordinates: { lat: 19.1197, lng: 72.9064 }
    },
    rent: 18000,
    deposit: 36000,
    propertyType: 'Apartment',
    roomType: 'Studio',
    gender: 'Any',
    availableFrom: '2024-01-20',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
    ],
    amenities: [
      { name: 'WiFi', icon: 'wifi', included: true },
      { name: 'Air Conditioning', icon: 'ac', included: true },
      { name: 'Private Bathroom', icon: 'bathroom', included: true },
      { name: 'Kitchenette', icon: 'kitchen', included: true },
      { name: 'Parking', icon: 'parking', included: true },
      { name: 'Security', icon: 'security', included: true },
      { name: 'Gym Access', icon: 'gym', included: true },
      { name: 'Swimming Pool', icon: 'pool', included: true }
    ],
    rules: [
      'No smoking',
      'No pets',
      'Maintain property condition',
      'Follow society rules'
    ],
    nearbyPlaces: [
      { name: 'IIT Bombay', distance: '1.8 km', type: 'college' },
      { name: 'Powai Lake', distance: '500 m', type: 'lake' },
      { name: 'Hiranandani Gardens', distance: '1 km', type: 'shopping' },
      { name: 'Phoenix MarketCity', distance: '2 km', type: 'mall' }
    ],
    rating: 4.8,
    totalReviews: 31,
    isAvailable: true,
    createdAt: '2023-10-20',
    updatedAt: '2024-01-12'
  }
];

export const mockMessPlans = [
  {
    _id: 'mess1',
    name: 'Sunita\'s Kitchen',
    description: 'Home-style cooking with fresh ingredients and traditional recipes. Vegetarian and non-vegetarian options available.',
    provider: {
      _id: 'mess1',
      name: 'Sunita Devi',
      phone: '+91 98765 43213',
      rating: 4.9,
      experience: '8 years'
    },
    address: {
      street: '321 Andheri West',
      area: 'Andheri',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
      coordinates: { lat: 19.1136, lng: 72.8697 }
    },
    mealPlans: [
      {
        name: 'Breakfast Only',
        price: 1500,
        description: 'Fresh breakfast with tea/coffee',
        meals: ['Breakfast'],
        timing: '7:00 AM - 9:00 AM'
      },
      {
        name: 'Lunch + Dinner',
        price: 3000,
        description: 'Complete lunch and dinner with rice, dal, vegetables, and roti',
        meals: ['Lunch', 'Dinner'],
        timing: '12:00 PM - 2:00 PM, 7:00 PM - 9:00 PM'
      },
      {
        name: 'All 3 Meals',
        price: 4000,
        description: 'Complete meal plan with breakfast, lunch, and dinner',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        timing: '7:00 AM - 9:00 AM, 12:00 PM - 2:00 PM, 7:00 PM - 9:00 PM'
      }
    ],
    cuisine: ['North Indian', 'South Indian', 'Gujarati'],
    specialities: ['Fresh vegetables', 'Homemade spices', 'Traditional recipes'],
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop'
    ],
    rating: 4.9,
    totalReviews: 67,
    totalSubscribers: 45,
    deliveryRadius: '5 km',
    isAvailable: true,
    createdAt: '2023-09-01',
    updatedAt: '2024-01-15'
  },
  {
    _id: 'mess2',
    name: 'Spice Garden Mess',
    description: 'Modern mess with diverse menu options. Special focus on healthy and nutritious meals for students.',
    provider: {
      _id: 'mess2',
      name: 'Rajesh Gupta',
      phone: '+91 98765 43216',
      rating: 4.7,
      experience: '6 years'
    },
    address: {
      street: '654 Vile Parle East',
      area: 'Vile Parle',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400057',
      coordinates: { lat: 19.0994, lng: 72.8424 }
    },
    mealPlans: [
      {
        name: 'Lunch Only',
        price: 2000,
        description: 'Hearty lunch with multiple options',
        meals: ['Lunch'],
        timing: '12:00 PM - 2:00 PM'
      },
      {
        name: 'Dinner Only',
        price: 1800,
        description: 'Light and healthy dinner',
        meals: ['Dinner'],
        timing: '7:00 PM - 9:00 PM'
      },
      {
        name: 'Lunch + Dinner',
        price: 3200,
        description: 'Complete lunch and dinner package',
        meals: ['Lunch', 'Dinner'],
        timing: '12:00 PM - 2:00 PM, 7:00 PM - 9:00 PM'
      }
    ],
    cuisine: ['North Indian', 'Chinese', 'Continental'],
    specialities: ['Healthy options', 'Low oil cooking', 'Fresh salads'],
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop'
    ],
    rating: 4.7,
    totalReviews: 42,
    totalSubscribers: 28,
    deliveryRadius: '3 km',
    isAvailable: true,
    createdAt: '2023-10-15',
    updatedAt: '2024-01-10'
  }
];

export const mockServices = [
  {
    _id: 'service1',
    name: 'Laundry Service',
    description: 'Professional laundry and dry cleaning service for students. Pickup and delivery available.',
    provider: {
      _id: 'service1',
      name: 'Clean & Fresh Laundry',
      phone: '+91 98765 43217',
      rating: 4.6
    },
    price: 50,
    unit: 'per kg',
    category: 'laundry',
    services: [
      'Washing',
      'Drying',
      'Ironing',
      'Dry Cleaning',
      'Pickup & Delivery'
    ],
    timing: '9:00 AM - 7:00 PM',
    deliveryRadius: '10 km',
    rating: 4.6,
    totalReviews: 34,
    isAvailable: true
  },
  {
    _id: 'service2',
    name: 'Room Cleaning Service',
    description: 'Professional housekeeping service for student accommodations. Weekly and monthly packages available.',
    provider: {
      _id: 'service2',
      name: 'Spotless Cleaners',
      phone: '+91 98765 43218',
      rating: 4.8
    },
    price: 300,
    unit: 'per visit',
    category: 'cleaning',
    services: [
      'Room Cleaning',
      'Bathroom Cleaning',
      'Kitchen Cleaning',
      'Dusting',
      'Floor Mopping'
    ],
    timing: '8:00 AM - 6:00 PM',
    deliveryRadius: '15 km',
    rating: 4.8,
    totalReviews: 28,
    isAvailable: true
  },
  {
    _id: 'service3',
    name: 'Tutor Service',
    description: 'Professional tutoring services for various subjects. Experienced tutors available for all courses.',
    provider: {
      _id: 'service3',
      name: 'EduMentor',
      phone: '+91 98765 43219',
      rating: 4.9
    },
    price: 500,
    unit: 'per hour',
    category: 'education',
    services: [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Computer Science',
      'English',
      'Online Classes'
    ],
    timing: '6:00 AM - 10:00 PM',
    deliveryRadius: '20 km',
    rating: 4.9,
    totalReviews: 45,
    isAvailable: true
  }
];

export const mockReviews = [
  {
    _id: 'review1',
    userId: 'user1',
    userName: 'Rajesh Kumar',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    entityId: 'room1',
    entityType: 'room',
    rating: 5,
    title: 'Excellent room and location!',
    comment: 'The room is exactly as shown in photos. Clean, well-maintained, and the location is perfect for college students. Amit sir is very helpful and responsive.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    ],
    createdAt: '2024-01-05',
    helpful: 12
  },
  {
    _id: 'review2',
    userId: 'user2',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    entityId: 'mess1',
    entityType: 'mess',
    rating: 5,
    title: 'Best mess in the area!',
    comment: 'Sunita aunty\'s food is amazing! Fresh, tasty, and homely. The variety is good and the quantity is sufficient. Highly recommended!',
    images: [],
    createdAt: '2024-01-08',
    helpful: 8
  },
  {
    _id: 'review3',
    userId: 'user3',
    userName: 'Arjun Singh',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    entityId: 'room2',
    entityType: 'room',
    rating: 4,
    title: 'Good value for money',
    comment: 'The room is decent and the location is convenient. Some amenities could be better, but overall it\'s a good place to stay.',
    images: [],
    createdAt: '2024-01-03',
    helpful: 5
  }
];

export const mockBookings = [
  {
    _id: 'booking1',
    userId: 'user1',
    roomId: 'room1',
    roomTitle: 'Cozy Single Room with AC',
    checkIn: '2024-02-01',
    checkOut: '2024-07-31',
    duration: 180,
    totalAmount: 216000,
    status: 'confirmed',
    paymentStatus: 'paid',
    additionalServices: {
      meals: { included: true, price: 4000, duration: 180 },
      laundry: { included: true, price: 500, duration: 180 },
      cleaning: { included: true, price: 300, duration: 180 }
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    _id: 'booking2',
    userId: 'user2',
    roomId: 'room2',
    roomTitle: 'Shared Room for Girls - Near College',
    checkIn: '2024-02-15',
    checkOut: '2024-06-15',
    duration: 120,
    totalAmount: 96000,
    status: 'pending',
    paymentStatus: 'pending',
    additionalServices: {
      meals: { included: false, price: 0, duration: 0 },
      laundry: { included: true, price: 400, duration: 120 },
      cleaning: { included: false, price: 0, duration: 0 }
    },
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  }
];

export const mockMessSubscriptions = [
  {
    _id: 'subscription1',
    userId: 'user1',
    messId: 'mess1',
    messName: 'Sunita\'s Kitchen',
    plan: 'All 3 Meals',
    price: 4000,
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    status: 'active',
    paymentStatus: 'paid',
    preferences: {
      cuisine: 'North Indian',
      spiceLevel: 'medium',
      specialDiet: 'none'
    },
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    _id: 'subscription2',
    userId: 'user2',
    messId: 'mess2',
    messName: 'Spice Garden Mess',
    plan: 'Lunch + Dinner',
    price: 3200,
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    status: 'active',
    paymentStatus: 'paid',
    preferences: {
      cuisine: 'Mixed',
      spiceLevel: 'low',
      specialDiet: 'vegetarian'
    },
    createdAt: '2024-01-28',
    updatedAt: '2024-01-28'
  }
];

export const mockNotifications = [
  {
    _id: 'notif1',
    userId: 'user1',
    type: 'booking_confirmed',
    title: 'Booking Confirmed!',
    message: 'Your booking for "Cozy Single Room with AC" has been confirmed.',
    data: { bookingId: 'booking1', roomId: 'room1' },
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: 'notif2',
    userId: 'user1',
    type: 'payment_success',
    title: 'Payment Successful',
    message: 'Your payment of ₹216,000 has been processed successfully.',
    data: { bookingId: 'booking1', amount: 216000 },
    isRead: true,
    createdAt: '2024-01-15T10:35:00Z'
  },
  {
    _id: 'notif3',
    userId: 'user1',
    type: 'mess_reminder',
    title: 'Mess Subscription Renewal',
    message: 'Your mess subscription expires in 5 days. Renew now to continue enjoying delicious meals.',
    data: { subscriptionId: 'subscription1', messId: 'mess1' },
    isRead: false,
    createdAt: '2024-01-20T09:00:00Z'
  }
];

export const mockCities = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    description: 'The financial capital of India with numerous colleges and universities.',
    collegesCount: 150,
    techCompaniesCount: 500,
    tier: 1,
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    description: 'The capital city with prestigious educational institutions.',
    collegesCount: 200,
    techCompaniesCount: 300,
    tier: 1,
    coordinates: { lat: 28.7041, lng: 77.1025 }
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    description: 'The Silicon Valley of India with top engineering colleges.',
    collegesCount: 120,
    techCompaniesCount: 800,
    tier: 1,
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    description: 'Educational hub with excellent student accommodation options.',
    collegesCount: 80,
    techCompaniesCount: 200,
    tier: 2,
    coordinates: { lat: 18.5204, lng: 73.8567 }
  }
];

// Helper functions
export const getMockData = {
  rooms: () => mockRooms,
  messPlans: () => mockMessPlans,
  services: () => mockServices,
  users: () => mockUsers,
  reviews: () => mockReviews,
  bookings: () => mockBookings,
  messSubscriptions: () => mockMessSubscriptions,
  notifications: () => mockNotifications,
  cities: () => mockCities,
  
  // Get specific items
  getRoomById: (id) => mockRooms.find(room => room._id === id),
  getMessById: (id) => mockMessPlans.find(mess => mess._id === id),
  getServiceById: (id) => mockServices.find(service => service._id === id),
  getUserById: (id) => mockUsers.find(user => user._id === id),
  
  // Get filtered data
  getRoomsByCity: (city) => mockRooms.filter(room => room.address.city.toLowerCase() === city.toLowerCase()),
  getMessByCity: (city) => mockMessPlans.filter(mess => mess.address.city.toLowerCase() === city.toLowerCase()),
  getReviewsByEntity: (entityId, entityType) => mockReviews.filter(review => review.entityId === entityId && review.entityType === entityType),
  
  // Get user-specific data
  getUserBookings: (userId) => mockBookings.filter(booking => booking.userId === userId),
  getUserSubscriptions: (userId) => mockMessSubscriptions.filter(sub => sub.userId === userId),
  getUserNotifications: (userId) => mockNotifications.filter(notif => notif.userId === userId)
};

