import React, { useState } from 'react';
import { FaCog, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import PaymentModal from './PaymentModal';
import { useTheme } from '../../context/ThemeContext';

const ServicePayment = ({ service, onSuccess, onClose }) => {
  const { isDark } = useTheme();
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePaymentSuccess = (data) => {
    onSuccess && onSuccess(data);
    setShowPayment(false);
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
  };

  const handleClose = () => {
    setShowPayment(false);
    onClose && onClose();
  };

  if (!service) return null;

  return (
    <>
      <Card className="max-w-md mx-auto">
        <Card.Body>
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaCog className="h-8 w-8 text-blue-600" />
            </div>
            <Typography variant="heading-3" className="mb-2">
              {service.name}
            </Typography>
            <Typography variant="body" className="text-gray-600">
              {service.description}
            </Typography>
          </div>

          {/* Service Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Typography variant="body-sm" className="text-gray-600">
                  Category
                </Typography>
                <Typography variant="body-sm" className="font-medium">
                  {service.category}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body-sm" className="text-gray-600">
                  Duration
                </Typography>
                <Typography variant="body-sm" className="font-medium">
                  {service.duration || 'As needed'}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body-sm" className="text-gray-600">
                  Provider
                </Typography>
                <Typography variant="body-sm" className="font-medium">
                  {service.provider}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body-sm" className="text-gray-600">
                  Location
                </Typography>
                <Typography variant="body-sm" className="font-medium">
                  {service.location}
                </Typography>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <Typography variant="heading-2" className="text-primary-600 mb-2">
              ₹{service.price.toLocaleString('en-IN')}
            </Typography>
            <Typography variant="body-sm" className="text-gray-500">
              {service.priceType === 'per_hour' ? 'per hour' : 
               service.priceType === 'per_day' ? 'per day' : 
               service.priceType === 'per_month' ? 'per month' : 'one-time'}
            </Typography>
          </div>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div className="mb-6">
              <Typography variant="heading-4" className="mb-3">
                Service includes
              </Typography>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <FaCheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <Typography variant="body-sm" className="text-gray-600">
                      {feature}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={() => setShowPayment(true)}
            >
              Book Service
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={handleClose}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        amount={service.price}
        type="service"
        relatedId={service._id}
        description={`Service booking for ${service.name}`}
        itemName={service.name}
      />
    </>
  );
};

export default ServicePayment;
