import React, { useState } from 'react';
import { FaCalendar, FaUtensils, FaTshirt, FaCoffee, FaInfoCircle, FaCreditCard } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import PaymentModal from './PaymentModal';

const BookingForm = ({ room, onBookingSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    additionalServices: {
      meals: { included: false, mealTypes: [], price: 0 },
      laundry: { included: false, price: 0 },
      tea: { included: false, price: 0 }
    },
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut) return room.rent;
    
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    let total = room.rent * duration;
    
    if (formData.additionalServices.meals.included) {
      total += (formData.additionalServices.meals.price || 0) * duration;
    }
    if (formData.additionalServices.laundry.included) {
      total += formData.additionalServices.laundry.price || 0;
    }
    if (formData.additionalServices.tea.included) {
      total += (formData.additionalServices.tea.price || 0) * duration;
    }
    
    return total;
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [service]: {
          ...prev.additionalServices[service],
          included: !prev.additionalServices[service].included
        }
      }
    }));
  };

  const handleMealTypeToggle = (mealType) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        meals: {
          ...prev.additionalServices.meals,
          mealTypes: prev.additionalServices.meals.mealTypes.includes(mealType)
            ? prev.additionalServices.meals.mealTypes.filter(type => type !== mealType)
            : [...prev.additionalServices.meals.mealTypes, mealType]
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.checkIn || !formData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    
    if (checkOutDate <= checkInDate) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://roomnmeal.onrender.com/api/bookings', {
        roomId: room._id,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        additionalServices: formData.additionalServices,
        specialRequests: formData.specialRequests
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Store booking data and show payment modal
      setBookingData(response.data.booking);
      setShowPaymentModal(true);
      setLoading(false);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const duration = formData.checkIn && formData.checkOut 
    ? Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Room</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.title}</h3>
            <p className="text-gray-600">{room.address?.street}, {room.address?.city}</p>
            <p className="text-2xl font-bold text-primary-600 mt-2">₹{room.rent}/month</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label flex items-center">
                  <FaCalendar className="mr-2" />
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
              <div>
                <label className="form-label flex items-center">
                  <FaCalendar className="mr-2" />
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
            </div>

            {/* Additional Services */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h4>
              
              {/* Meals */}
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FaUtensils className="text-primary-600 mr-2" />
                    <span className="font-medium">Meals</span>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.additionalServices.meals.included}
                      onChange={() => handleServiceToggle('meals')}
                      className="mr-2"
                    />
                    Include meals
                  </label>
                </div>
                
                {formData.additionalServices.meals.included && (
                  <div className="ml-6 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {['Breakfast', 'Lunch', 'Dinner'].map(mealType => (
                        <label key={mealType} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.additionalServices.meals.mealTypes.includes(mealType)}
                            onChange={() => handleMealTypeToggle(mealType)}
                            className="mr-1"
                          />
                          {mealType}
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Price per day:</span>
                      <input
                        type="number"
                        value={formData.additionalServices.meals.price}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          additionalServices: {
                            ...prev.additionalServices,
                            meals: {
                              ...prev.additionalServices.meals,
                              price: Number(e.target.value)
                            }
                          }
                        }))}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">₹</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Laundry */}
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FaTshirt className="text-primary-600 mr-2" />
                    <span className="font-medium">Laundry Service</span>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.additionalServices.laundry.included}
                      onChange={() => handleServiceToggle('laundry')}
                      className="mr-2"
                    />
                    Include laundry
                  </label>
                </div>
                
                {formData.additionalServices.laundry.included && (
                  <div className="ml-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Price:</span>
                      <input
                        type="number"
                        value={formData.additionalServices.laundry.price}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          additionalServices: {
                            ...prev.additionalServices,
                            laundry: {
                              ...prev.additionalServices.laundry,
                              price: Number(e.target.value)
                            }
                          }
                        }))}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">₹</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tea Service */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FaCoffee className="text-primary-600 mr-2" />
                    <span className="font-medium">Tea Service</span>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.additionalServices.tea.included}
                      onChange={() => handleServiceToggle('tea')}
                      className="mr-2"
                    />
                    Include tea service
                  </label>
                </div>
                
                {formData.additionalServices.tea.included && (
                  <div className="ml-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Price per day:</span>
                      <input
                        type="number"
                        value={formData.additionalServices.tea.price}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          additionalServices: {
                            ...prev.additionalServices,
                            tea: {
                              ...prev.additionalServices.tea,
                              price: Number(e.target.value)
                            }
                          }
                        }))}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-600">₹</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="form-label flex items-center">
                <FaInfoCircle className="mr-2" />
                Special Requests (Optional)
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                className="input-field h-24 resize-none"
                placeholder="Any special requests or requirements..."
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Room rent:</span>
                  <span>₹{room.rent * duration}</span>
                </div>
                {formData.additionalServices.meals.included && (
                  <div className="flex justify-between">
                    <span>Meals:</span>
                    <span>₹{formData.additionalServices.meals.price * duration}</span>
                  </div>
                )}
                {formData.additionalServices.laundry.included && (
                  <div className="flex justify-between">
                    <span>Laundry:</span>
                    <span>₹{formData.additionalServices.laundry.price}</span>
                  </div>
                )}
                {formData.additionalServices.tea.included && (
                  <div className="flex justify-between">
                    <span>Tea service:</span>
                    <span>₹{formData.additionalServices.tea.price * duration}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Creating Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      {bookingData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setBookingData(null);
            onClose();
          }}
          amount={calculateTotal()}
          type="room_booking"
          relatedId={bookingData._id}
          description={`Room booking for ${room.title}`}
          onSuccess={(data) => {
            toast.success('Payment successful! Booking confirmed.');
            onBookingSuccess(bookingData);
            setShowPaymentModal(false);
            setBookingData(null);
            onClose();
          }}
          onFailure={(error) => {
            toast.error('Payment failed. Please try again.');
            setShowPaymentModal(false);
            setBookingData(null);
          }}
        />
      )}
    </div>
  );
};

export default BookingForm; 