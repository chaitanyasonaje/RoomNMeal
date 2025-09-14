import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaBed, FaUsers, FaWifi, FaCar, FaUtensils } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import Badge from './ui/Badge';

const RoomCard = ({ 
  room, 
  index = 0,
  onBook = () => {},
  onViewDetails = () => {}
}) => {
  const { isDark } = useTheme();

  const {
    id,
    title,
    description,
    price,
    rating,
    location,
    images,
    amenities = [],
    roomType,
    propertyType,
    isAvailable = true,
    source = 'API'
  } = room;

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': FaWifi,
      'Parking': FaCar,
      'Meals': FaUtensils,
      'AC': FaBed,
    };
    const Icon = iconMap[amenity] || FaBed;
    return <Icon className="h-4 w-4" />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card interactive className="group relative overflow-hidden">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            variants={imageVariants}
            whileHover="hover"
            src={images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop'}
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Source Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant={source === 'API' ? 'success' : 'warning'}>
              {source}
            </Badge>
          </div>
          
          {/* Availability Badge */}
          <div className="absolute top-4 left-16">
            <Badge variant={isAvailable ? 'success' : 'error'}>
              {isAvailable ? 'Available' : 'Occupied'}
            </Badge>
          </div>

          {/* Property Type Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary">
              {propertyType}
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onViewDetails}
              className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg"
              aria-label="View details"
            >
              <FaBed className="h-4 w-4 text-primary-600" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <Card.Body>
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <Typography variant="heading-4" className="mb-1 line-clamp-1">
                {title}
              </Typography>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>
            <div className="text-right">
              <Typography variant="heading-3" className="text-primary-600">
                {formatPrice(price)}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                /month
              </Typography>
            </div>
          </div>

          {/* Description */}
          <Typography variant="body-sm" className="mb-4 line-clamp-2 text-gray-600">
            {description}
          </Typography>

          {/* Room Type & Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FaBed className="h-4 w-4 text-primary-600" />
              <Typography variant="body-sm" className="text-gray-700">
                {roomType}
              </Typography>
            </div>
            <div className="flex items-center space-x-1">
              <FaStar className="h-4 w-4 text-yellow-400" />
              <Typography variant="body-sm" className="text-gray-700">
                {rating || '4.5'}
              </Typography>
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {amenities.slice(0, 3).map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600"
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
                {amenities.length > 3 && (
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-600">
                    <span>+{amenities.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={onViewDetails}
            >
              View Details
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={onBook}
              disabled={!isAvailable}
            >
              {isAvailable ? 'Book Now' : 'Unavailable'}
            </Button>
          </div>
        </Card.Body>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-600/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
};

export default RoomCard;
