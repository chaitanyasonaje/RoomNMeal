import React, { useState } from 'react';
import { FaUtensils, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import PaymentModal from './PaymentModal';
import { useTheme } from '../../context/ThemeContext';

const MessPlanPayment = ({ messPlan, onSuccess, onClose }) => {
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

  if (!messPlan) return null;

  return (
    <>
      <Card className="max-w-md mx-auto">
        <Card.Body>
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <FaUtensils className="h-8 w-8 text-orange-600" />
            </div>
            <Typography variant="heading-3" className="mb-2">
              {messPlan.name}
            </Typography>
            <Typography variant="body" className="text-gray-600">
              {messPlan.description}
            </Typography>
          </div>

          {/* Plan Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Typography variant="body-sm" className="text-gray-600">
                  Duration
                </Typography>
                <Typography variant="body-sm" className="font-medium">
                  {messPlan.duration} days
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body-sm" className="text-gray-600">
                  Meals per day
                </Typography>
                <Typography variant="body-sm" className="font-medium">
                  {messPlan.mealsPerDay}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body-sm" className="text-gray-600">
                  Cuisine
                </Typography>
                <Typography variant="body-sm" className="font-medium">
                  {messPlan.cuisine}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body-sm" className="text-gray-600">
                  Location
                </Typography>
                <Typography variant="body-sm" className="font-medium">
                  {messPlan.location}
                </Typography>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <Typography variant="heading-2" className="text-primary-600 mb-2">
              ₹{messPlan.price.toLocaleString('en-IN')}
            </Typography>
            <Typography variant="body-sm" className="text-gray-500">
              per month
            </Typography>
          </div>

          {/* Features */}
          {messPlan.features && messPlan.features.length > 0 && (
            <div className="mb-6">
              <Typography variant="heading-4" className="mb-3">
                What's included
              </Typography>
              <ul className="space-y-2">
                {messPlan.features.map((feature, index) => (
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
              Subscribe Now
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
        amount={messPlan.price}
        type="mess_plan"
        relatedId={messPlan._id}
        description={`Mess plan subscription for ${messPlan.name}`}
        itemName={messPlan.name}
      />
    </>
  );
};

export default MessPlanPayment;
