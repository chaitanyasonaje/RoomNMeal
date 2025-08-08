import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaBed, FaBath, FaWifi, FaParking, FaHeart, FaShare } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import BookingForm from '../components/BookingForm';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://roomnmeal.onrender.com/api/rooms/${id}`);
      setRoom(response.data.room);
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast.error('Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can book rooms');
      return;
    }

    if (room.availability?.availableRooms <= 0) {
      toast.error('No rooms available for booking');
      return;
    }

    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking) => {
    toast.success('Booking created successfully!');
    setShowBookingForm(false);
    // Optionally redirect to dashboard or booking details
    navigate('/dashboard');
  };

  const handleContactHost = () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact the host');
      navigate('/login');
      return;
    }
    
    // Navigate to chat with host
    navigate(`/chat?userId=${room.host._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Room not found</h2>
          <p className="text-gray-600">The room you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Room Images */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="relative h-96 bg-gray-200 rounded-t-lg">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaBed className="h-16 w-16" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <FaHeart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <FaShare className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{room.title}</h1>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">₹{room.rent}</div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{room.description}</p>

              {/* Location */}
              <div className="flex items-center text-gray-500 mb-4">
                <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                <span>{room.address?.street}, {room.address?.city}, {room.address?.state}</span>
              </div>

              {/* Room Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <FaBed className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Room Type</p>
                  <p className="font-semibold">{room.roomType}</p>
                </div>
                <div className="text-center">
                  <FaBath className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Property Type</p>
                  <p className="font-semibold">{room.propertyType}</p>
                </div>
                <div className="text-center">
                  <FaWifi className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="font-semibold">{room.availability?.availableRooms || 0}</p>
                </div>
                <div className="text-center">
                  <FaParking className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Security</p>
                  <p className="font-semibold">₹{room.securityDeposit}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(room.ratings?.average || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">
                  {room.ratings?.average?.toFixed(1) || 0} ({room.ratings?.count || 0} reviews)
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {room.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Services */}
            {(room.mealOptions?.hasMeals || room.additionalServices?.laundry?.available || room.additionalServices?.tea?.available) && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Services</h2>
                <div className="space-y-4">
                  {room.mealOptions?.hasMeals && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <h3 className="font-medium">Meals Available</h3>
                        <p className="text-sm text-gray-600">
                          {room.mealOptions.mealTypes?.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{room.mealOptions.mealPrice?.breakfast || 0}/day</p>
                      </div>
                    </div>
                  )}
                  
                  {room.additionalServices?.laundry?.available && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <h3 className="font-medium">Laundry Service</h3>
                        <p className="text-sm text-gray-600">Weekly laundry service</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{room.additionalServices.laundry.price}/week</p>
                      </div>
                    </div>
                  )}
                  
                  {room.additionalServices?.tea?.available && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <h3 className="font-medium">Tea Service</h3>
                        <p className="text-sm text-gray-600">Morning and evening tea</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{room.additionalServices.tea.price}/day</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              {room.reviews && room.reviews.length > 0 ? (
                <div className="space-y-4">
                  {room.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">₹{room.rent}</div>
                <div className="text-gray-600">per month</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-semibold">₹{room.securityDeposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Rooms</span>
                  <span className={`font-semibold ${room.availability?.availableRooms > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {room.availability?.availableRooms || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-semibold">{room.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type</span>
                  <span className="font-semibold">{room.roomType}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleBookNow}
                  disabled={room.availability?.availableRooms <= 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    room.availability?.availableRooms > 0
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {room.availability?.availableRooms > 0 ? 'Book Now' : 'No Rooms Available'}
                </button>

                <button 
                  onClick={handleContactHost}
                  className="w-full btn-outline"
                >
                  Contact Host
                </button>
              </div>

              {/* Host Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Host Information</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {room.host?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{room.host?.name}</p>
                    <p className="text-sm text-gray-600">{room.host?.phone}</p>
                    <p className="text-sm text-gray-600">{room.host?.email}</p>
                  </div>
                </div>
              </div>

              {/* Verification Badge */}
              {room.isVerified && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center">
                    <FaStar className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Verified Property</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    This property has been verified by our team
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          room={room}
          onBookingSuccess={handleBookingSuccess}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default RoomDetail; 