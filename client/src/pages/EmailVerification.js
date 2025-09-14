import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import OTPInput from '../components/OTPInput';
import Button from '../components/ui/Button';
import Typography from '../components/ui/Typography';
import Card from '../components/ui/Card';
import Layout from '../components/ui/Layout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EmailVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      navigate('/register');
      return;
    }

    // Start countdown for resend
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, email, navigate]);

  const handleOTPComplete = async (otpValue) => {
    setOtp(otpValue);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://roomnmeal.onrender.com/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          otp: otpValue
        })
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        toast.success('Email verified successfully!');
        
        // Auto login after verification
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setVerificationStatus('error');
        setError(data.message || 'Verification failed');
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('https://roomnmeal.onrender.com/api/auth/resend-email-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification email sent successfully!');
        setCountdown(60);
        
        // Start countdown again
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.message || 'Failed to resend email');
        toast.error(data.message || 'Failed to resend email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12">
        <Layout.Container size="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <Typography variant="heading-1" className="mb-4 text-green-600">
              Email Verified!
            </Typography>
            <Typography variant="body" className="text-gray-600 mb-8">
              Your email has been successfully verified. Redirecting to dashboard...
            </Typography>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          </motion.div>
        </Layout.Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12">
      <Layout.Container size="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-6">
            <FaEnvelope className="h-8 w-8 text-primary-600" />
          </div>
          <Typography variant="heading-1" className="mb-2">
            Verify Your Email
          </Typography>
          <Typography variant="body" className="text-gray-600">
            We've sent a 6-digit verification code to
          </Typography>
          <Typography variant="body" className="font-semibold text-primary-600">
            {email}
          </Typography>
        </motion.div>

        <Card className="max-w-md mx-auto">
          <Card.Body>
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  <FaExclamationTriangle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* OTP Input */}
              <div className="space-y-4">
                <Typography variant="body" className="text-center text-gray-600">
                  Enter the verification code below:
                </Typography>
                
                <OTPInput
                  onComplete={handleOTPComplete}
                  onResend={countdown === 0 ? handleResendOTP : null}
                  loading={loading}
                  disabled={loading}
                />

                {/* Resend Timer */}
                {countdown > 0 && (
                  <div className="text-center text-sm text-gray-500">
                    Resend code in {countdown} seconds
                  </div>
                )}
              </div>

              {/* Resend Button */}
              {countdown === 0 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={handleResendOTP}
                    loading={resendLoading}
                    disabled={resendLoading}
                    className="w-full"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Verification Code'}
                  </Button>
                </div>
              )}

              {/* Back to Register */}
              <div className="text-center">
                <button
                  onClick={() => navigate('/register')}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back to Registration
                </button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Layout.Container>
    </div>
  );
};

export default EmailVerification;
