const indianCities = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    coordinates: { latitude: 19.0760, longitude: 72.8777 },
    tier: 1,
    colleges: [
      'IIT Bombay',
      'NITIE Mumbai',
      'SPIT Mumbai',
      'VJTI Mumbai',
      'Mumbai University',
      'St. Xavier\'s College',
      'HR College',
      'KC College',
      'Jai Hind College',
      'SIES College'
    ],
    techCompanies: [
      'TCS',
      'Infosys',
      'Wipro',
      'Tech Mahindra',
      'HCL',
      'Cognizant',
      'Accenture',
      'IBM',
      'Amazon',
      'Google',
      'Microsoft',
      'Oracle',
      'SAP',
      'Capgemini'
    ],
    description: 'Financial capital with premier educational institutions and major tech hubs'
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    tier: 1,
    colleges: [
      'IISc Bangalore',
      'IIT Bangalore',
      'NIT Karnataka',
      'BMS College of Engineering',
      'RVCE Bangalore',
      'PES University',
      'Christ University',
      'St. Joseph\'s College',
      'Mount Carmel College',
      'Jain University'
    ],
    techCompanies: [
      'Infosys',
      'Wipro',
      'TCS',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Amazon',
      'Google',
      'Microsoft',
      'Oracle',
      'SAP',
      'Intel',
      'Qualcomm',
      'Adobe',
      'Salesforce',
      'Uber',
      'Ola',
      'Swiggy',
      'Zomato'
    ],
    description: 'Silicon Valley of India with world-class tech companies and universities'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    coordinates: { latitude: 28.7041, longitude: 77.1025 },
    tier: 1,
    colleges: [
      'IIT Delhi',
      'Delhi University',
      'JNU Delhi',
      'DTU Delhi',
      'NSIT Delhi',
      'IGDTUW Delhi',
      'St. Stephen\'s College',
      'Hindu College',
      'SRCC Delhi',
      'Miranda House'
    ],
    techCompanies: [
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Amazon',
      'Google',
      'Microsoft',
      'Oracle',
      'SAP',
      'Capgemini',
      'Paytm',
      'Zomato',
      'Swiggy',
      'Ola'
    ],
    description: 'National capital with premier institutions and growing tech ecosystem'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    coordinates: { latitude: 17.3850, longitude: 78.4867 },
    tier: 1,
    colleges: [
      'IIT Hyderabad',
      'NIT Warangal',
      'BITS Pilani Hyderabad',
      'IIIT Hyderabad',
      'Osmania University',
      'JNTU Hyderabad',
      'CBIT Hyderabad',
      'MVSR Engineering College',
      'GRIET Hyderabad',
      'Vasavi College'
    ],
    techCompanies: [
      'Microsoft',
      'Google',
      'Amazon',
      'Oracle',
      'SAP',
      'IBM',
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'Capgemini',
      'Deloitte',
      'PwC'
    ],
    description: 'Cyberabad - major IT hub with excellent educational institutions'
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    coordinates: { latitude: 18.5204, longitude: 73.8567 },
    tier: 1,
    colleges: [
      'IIT Pune',
      'COEP Pune',
      'PICT Pune',
      'VIT Pune',
      'Symbiosis International University',
      'Pune University',
      'Fergusson College',
      'St. Xavier\'s College Pune',
      'MIT Pune',
      'DYP Pune'
    ],
    techCompanies: [
      'Infosys',
      'TCS',
      'Wipro',
      'Tech Mahindra',
      'HCL',
      'Cognizant',
      'Accenture',
      'IBM',
      'Persistent Systems',
      'KPIT Technologies',
      'Zensar Technologies',
      'Cybage',
      'Amdocs',
      'Sasken'
    ],
    description: 'Oxford of the East with strong IT sector and educational excellence'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
    tier: 1,
    colleges: [
      'IIT Madras',
      'NIT Trichy',
      'Anna University',
      'CEG Chennai',
      'MIT Chennai',
      'SSN College',
      'SRM University',
      'VIT Chennai',
      'Loyola College',
      'Presidency College'
    ],
    techCompanies: [
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Amazon',
      'Google',
      'Microsoft',
      'Oracle',
      'SAP',
      'Capgemini',
      'Zoho',
      'Freshworks'
    ],
    description: 'Gateway to South India with strong automotive and IT sectors'
  },
  {
    id: 'noida',
    name: 'Noida',
    state: 'Uttar Pradesh',
    coordinates: { latitude: 28.5355, longitude: 77.3910 },
    tier: 1,
    colleges: [
      'Amity University',
      'Galgotias University',
      'Sharda University',
      'NIIT University',
      'Jaypee Institute',
      'Greater Noida Institute',
      'IMS Noida',
      'IILM Noida',
      'Noida International University',
      'Maharaja Agrasen Institute'
    ],
    techCompanies: [
      'HCL',
      'TCS',
      'Infosys',
      'Wipro',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Amazon',
      'Google',
      'Microsoft',
      'Oracle',
      'SAP',
      'Capgemini',
      'Paytm',
      'Zomato',
      'Swiggy',
      'Ola'
    ],
    description: 'NCR tech hub with modern infrastructure and growing startup ecosystem'
  },
  {
    id: 'gurgaon',
    name: 'Gurgaon',
    state: 'Haryana',
    coordinates: { latitude: 28.4595, longitude: 77.0266 },
    tier: 1,
    colleges: [
      'Manav Rachna University',
      'GD Goenka University',
      'Amity University Gurgaon',
      'SGT University',
      'Ansal University',
      'IILM Gurgaon',
      'BML Munjal University',
      'World University of Design',
      'K R Mangalam University',
      'Sharda University Gurgaon'
    ],
    techCompanies: [
      'Google',
      'Microsoft',
      'Amazon',
      'Oracle',
      'SAP',
      'IBM',
      'Accenture',
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Capgemini',
      'Paytm',
      'Zomato',
      'Swiggy',
      'Ola',
      'Uber',
      'MakeMyTrip'
    ],
    description: 'Millennium City with major MNCs and modern corporate culture'
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    coordinates: { latitude: 22.5726, longitude: 88.3639 },
    tier: 1,
    colleges: [
      'IIT Kharagpur',
      'Jadavpur University',
      'Presidency University',
      'St. Xavier\'s College Kolkata',
      'Calcutta University',
      'BESU Shibpur',
      'IIEST Shibpur',
      'Heritage Institute',
      'Techno India',
      'NSHM Kolkata'
    ],
    techCompanies: [
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Capgemini',
      'L&T Infotech',
      'Mindtree',
      'Mphasis',
      'Hexaware',
      'Birlasoft'
    ],
    description: 'Cultural capital with strong educational heritage and growing IT sector'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    coordinates: { latitude: 23.0225, longitude: 72.5714 },
    tier: 2,
    colleges: [
      'IIT Gandhinagar',
      'NIRMA University',
      'CEPT University',
      'Gujarat University',
      'LD College of Engineering',
      'CEPT Ahmedabad',
      'St. Xavier\'s College Ahmedabad',
      'GLS University',
      'Ganpat University',
      'PDPU Gandhinagar'
    ],
    techCompanies: [
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Capgemini',
      'L&T Infotech',
      'Mindtree',
      'Mphasis',
      'Hexaware',
      'Birlasoft'
    ],
    description: 'Manchester of India with strong industrial base and educational institutions'
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    coordinates: { latitude: 22.7196, longitude: 75.8577 },
    tier: 2,
    colleges: [
      'IIT Indore',
      'IIM Indore',
      'DAVV Indore',
      'SGSITS Indore',
      'IPS Academy',
      'Acropolis Institute',
      'Medi-Caps University',
      'SVVV Indore',
      'Renaissance University',
      'Symbiosis University'
    ],
    techCompanies: [
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Capgemini',
      'L&T Infotech',
      'Mindtree',
      'Mphasis',
      'Hexaware',
      'Birlasoft'
    ],
    description: 'Cleanest city with growing IT sector and excellent educational facilities'
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    coordinates: { latitude: 21.1458, longitude: 79.0882 },
    tier: 2,
    colleges: [
      'VNIT Nagpur',
      'Rashtrasant Tukadoji Maharaj University',
      'G H Raisoni College',
      'Priyadarshini College',
      'St. Francis De Sales College',
      'Hislop College',
      'Institute of Science',
      'LAD College',
      'Dharampeth College',
      'Morris College'
    ],
    techCompanies: [
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Capgemini',
      'L&T Infotech',
      'Mindtree',
      'Mphasis',
      'Hexaware',
      'Birlasoft'
    ],
    description: 'Orange City with central location and growing educational hub'
  },
  {
    id: 'shirpur',
    name: 'Shirpur',
    state: 'Maharashtra',
    coordinates: { latitude: 21.3484, longitude: 74.8805 },
    tier: 3,
    colleges: [
      'NMIMS Shirpur',
      'R C Patel Institute of Technology',
      'Shirpur Education Society',
      'K K Wagh College',
      'Shirpur Arts College',
      'Shirpur Science College',
      'Shirpur Commerce College',
      'Shirpur Polytechnic',
      'Shirpur ITI',
      'Shirpur Nursing College'
    ],
    accommodations: [
      {
        name: 'NMIMS Shirpur Campus Hostel',
        type: 'Hostel + Mess',
        address: 'Babulde, Bank of Tapi River, NH-3, Shirpur, Savalad, Maharashtra 425405',
        contacts: {
          main: ['02563-295545', '02563-295546', '02563-295547', '02563-295548', '02563-295549'],
          boys_hostel_1: '8806759888',
          boys_hostel_2: '9373985038',
          girls_hostel: '7448243446'
        },
        images: [
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://engineering-shirpur.nmims.edu/contact-us/'
      },
      {
        name: 'R. C. Patel Institute of Technology (RCPIT)',
        type: 'Hostel + Mess',
        address: 'In front of RCPIT college, Shirpur',
        contacts: {},
        capacity: { boys: 430, girls: 600 },
        images: [
          'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://collegedunia.com/college/14640-rc-patel-institute-of-technology-rcpit-shirpur/hostel'
      },
      {
        name: 'Institute of Management Research & Development (IMRD)',
        type: 'Hostel + Mess',
        address: 'On IMRD campus, Shirpur',
        contacts: {
          boys_hostel: ['7840902163', '8177947735', '9922274500'],
          girls_hostel: ['9421676155', '9922828226']
        },
        images: [
          'https://images.unsplash.com/photo-1598965402089-897ce52e8357?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://www.rcpimrd.ac.in/hostel'
      },
      {
        name: 'College of Agriculture (SVKM COA)',
        type: 'Hostel + Mess',
        address: 'Shirpur',
        contacts: {},
        images: [
          'https://images.unsplash.com/photo-1596495578065-8a35f6b4d090?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://svkmcoa.ac.in/hostel/'
      },
      {
        name: 'R. C. Patel Polytechnic Institute',
        type: 'Hostel + Mess',
        address: 'Near Nimazari Naka, Shirpur',
        contacts: {
          phone: '9325054746',
          email: 'rcpatelpolytechnic@gmail.com'
        },
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://www.rcpatelpolytechnic.org/hostel'
      },
      {
        name: 'Abai Hostel',
        type: 'Hostel',
        address: 'Near R. C. Patel Pharmacy College, Karvand Naka, Shirpur',
        contacts: {},
        images: [
          'https://images.unsplash.com/photo-1582582621959-48d0b3f4b5a6?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://www.justdial.com/Shirpur/Abai-Hostel-Near-R-C-Patel-Phamacy-CollegeKarvand-Naka-Shirpur-Dhule/9999P2562-2562-150821125109-M7A7_BZDET'
      },
      {
        name: 'Khodiyar Mess',
        type: 'Mess',
        address: 'Rasiklal Patel Nagar, Nimzari Naka, Shirpur',
        contacts: {},
        images: [
          'https://images.unsplash.com/photo-1551782450-17144c3a09f2?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://www.justdial.com/Shirpur/Mess/nct-10319116'
      },
      {
        name: 'Jogeshwari Mess',
        type: 'Mess',
        address: 'Swami Vivekanand Nagar, Pitreshwer Colony, Shirpur',
        contacts: {},
        images: [
          'https://images.unsplash.com/photo-1541542684-4aee2b0a6a1f?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://www.justdial.com/Shirpur/Mess/nct-10319116'
      },
      {
        name: 'Om Sai Bhojanalay Mess',
        type: 'Mess',
        address: 'Karvand Road, Shirpur',
        contacts: {},
        images: [
          'https://images.unsplash.com/photo-1521017432531-fbd92d1cf00b?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://www.justdial.com/Shirpur/Mess/nct-10319116'
      },
      {
        name: 'Shiv Shakti Mess',
        type: 'Mess',
        address: 'Dadusing Colony, Gajanan Colony, Karvand, Shirpur',
        contacts: {},
        images: [
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://www.justdial.com/Shirpur/Mess/nct-10319116'
      },
      {
        name: 'Shri Ganesh Mess & Tiffin Service',
        type: 'Mess + Tiffin Service',
        address: 'Opp. Hotel Kings Park, Rasiklal Patel Nagar, Shirpur',
        contacts: {},
        images: [
          'https://images.unsplash.com/photo-1593030668930-8130abedb5d6?w=1200&auto=format&fit=crop&q=60'
        ],
        website: 'https://www.justdial.com/Shirpur/Tiffin-Services/nct-10481155'
      }
    ],
    techCompanies: [
      'Local IT Companies',
      'Startups',
      'Digital Agencies',
      'E-commerce Companies',
      'Educational Technology',
      'Healthcare Technology',
      'Agricultural Technology',
      'Manufacturing Technology'
    ],
    description: 'Emerging educational hub with NMIMS campus and growing opportunities'
  },
  {
    id: 'nashik',
    name: 'Nashik',
    state: 'Maharashtra',
    coordinates: { latitude: 19.9975, longitude: 73.7898 },
    tier: 2,
    colleges: [
      'KTHM College',
      'Sandip University',
      'MET Institute',
      'Gokhale Education Society',
      'Nashik District Maratha Vidya Prasarak Samaj',
      'Karmaveer Bhausaheb Hiray College',
      'HPT Arts and RYK Science College',
      'Bharati Vidyapeeth',
      'Yashwantrao Chavan Maharashtra Open University',
      'Maharashtra University of Health Sciences'
    ],
    techCompanies: [
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Capgemini',
      'L&T Infotech',
      'Mindtree',
      'Mphasis',
      'Hexaware',
      'Birlasoft'
    ],
    description: 'Wine capital with growing IT sector and educational institutions'
  },
  {
    id: 'aurangabad',
    name: 'Aurangabad',
    state: 'Maharashtra',
    coordinates: { latitude: 19.8762, longitude: 75.3433 },
    tier: 2,
    colleges: [
      'Dr. Babasaheb Ambedkar Marathwada University',
      'Government College of Engineering',
      'Aurangabad College of Engineering',
      'Jawaharlal Nehru Engineering College',
      'Deogiri Institute of Engineering',
      'Maharashtra Institute of Technology',
      'Maulana Azad College',
      'Milliya Arts College',
      'Aurangabad College of Pharmacy',
      'Aurangabad College of Agriculture'
    ],
    techCompanies: [
      'TCS',
      'Infosys',
      'Wipro',
      'HCL',
      'Tech Mahindra',
      'Cognizant',
      'Accenture',
      'IBM',
      'Capgemini',
      'L&T Infotech',
      'Mindtree',
      'Mphasis',
      'Hexaware',
      'Birlasoft'
    ],
    description: 'Tourist destination with growing educational and IT infrastructure'
  },
  {
    id: 'solapur',
    name: 'Solapur',
    state: 'Maharashtra',
    coordinates: { latitude: 17.6599, longitude: 75.9064 },
    tier: 3,
    colleges: [
      'Solapur University',
      'Government College of Engineering',
      'Walchand Institute of Technology',
      'SVERI College of Engineering',
      'Solapur Education Society',
      'Dayanand College',
      'Solapur Science College',
      'Solapur Arts College',
      'Solapur Commerce College',
      'Solapur Polytechnic'
    ],
    techCompanies: [
      'Local IT Companies',
      'Startups',
      'Digital Agencies',
      'E-commerce Companies',
      'Educational Technology',
      'Healthcare Technology',
      'Agricultural Technology',
      'Manufacturing Technology'
    ],
    description: 'Textile city with growing educational opportunities and IT sector'
  }
];

// Helper functions
const getCityById = (cityId) => {
  return indianCities.find(city => city.id === cityId);
};

const getCitiesByTier = (tier) => {
  return indianCities.filter(city => city.tier === tier);
};

const getCitiesByState = (state) => {
  return indianCities.filter(city => city.state === state);
};

const searchCities = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return indianCities.filter(city => 
    city.name.toLowerCase().includes(lowercaseQuery) ||
    city.state.toLowerCase().includes(lowercaseQuery) ||
    city.colleges.some(college => college.toLowerCase().includes(lowercaseQuery)) ||
    city.techCompanies.some(company => company.toLowerCase().includes(lowercaseQuery))
  );
};

const getPopularCities = () => {
  return indianCities.filter(city => city.tier === 1);
};

const getNearbyCities = (latitude, longitude, radiusKm = 100) => {
  return indianCities.filter(city => {
    const distance = calculateDistance(
      latitude, longitude,
      city.coordinates.latitude, city.coordinates.longitude
    );
    return distance <= radiusKm;
  });
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = {
  indianCities,
  getCityById,
  getCitiesByTier,
  getCitiesByState,
  searchCities,
  getPopularCities,
  getNearbyCities,
  calculateDistance
};
