import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { API_ENDPOINTS } from '../config/api';
import { FaArrowLeft, FaEnvelope, FaCheckCircle, FaKey } from 'react-icons/fa';
import OTPInput from '../components/OTPInput';
import PasswordStrength from '../components/PasswordStrength';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Typography from '../components/ui/Typography';
import Card from '../components/ui/Card';
import Layout from '../components/ui/Layout';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // email, otp, reset
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [countdown, setCountdown] = useState(0);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.userId);
        setStep('otp');
        setCountdown(60);
        toast.success('Password reset OTP sent to your email!');
        
        // Start countdown
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
        toast.error(data.message || 'Failed to send reset OTP');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPComplete = async (otpValue) => {
    setOtp(otpValue);
    setLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/verify-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, otp: otpValue })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('reset');
        toast.success('OTP verified successfully!');
      } else {
        toast.error(data.message || 'Invalid or expired OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setCountdown(60);
        toast.success('OTP resent successfully!');
        
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
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordValidation = (isValid, errors) => {
    setPasswordValid(isValid);
    setPasswordErrors(errors);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!passwordValid) {
      toast.error('Please ensure your password meets all requirements');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, otp, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Email Input
  if (step === 'email') {
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
              <FaKey className="h-8 w-8 text-primary-600" />
            </div>
            <Typography variant="heading-1" className="mb-2">
              Forgot Password?
            </Typography>
            <Typography variant="body" className="text-gray-600">
              Enter your email address and we'll send you a verification code to reset your password
            </Typography>
          </motion.div>

          <Card className="max-w-md mx-auto">
            <Card.Body>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  icon={<FaEnvelope className="h-5 w-5" />}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Layout.Container>
      </div>
    );
  }

  // Step 2: OTP Verification
  if (step === 'otp') {
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
              Enter Verification Code
            </Typography>
            <Typography variant="body" className="text-gray-600">
              We've sent a 6-digit code to
            </Typography>
            <Typography variant="body" className="font-semibold text-primary-600">
              {email}
            </Typography>
          </motion.div>

          <Card className="max-w-md mx-auto">
            <Card.Body>
              <div className="space-y-6">
                <OTPInput
                  onComplete={handleOTPComplete}
                  onResend={countdown === 0 ? handleResendOTP : null}
                  loading={loading}
                  disabled={loading}
                />

                {countdown > 0 && (
                  <div className="text-center text-sm text-gray-500">
                    Resend code in {countdown} seconds
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => setStep('email')}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back to Email
                  </button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Layout.Container>
      </div>
    );
  }

  // Step 3: Password Reset
  if (step === 'reset') {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12">
        <Layout.Container size="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <Typography variant="heading-1" className="mb-2">
              Create New Password
            </Typography>
            <Typography variant="body" className="text-gray-600">
              Your verification code has been confirmed. Please create a new password.
            </Typography>
          </motion.div>

          <Card className="max-w-md mx-auto">
            <Card.Body>
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    icon={<FaKey className="h-5 w-5" />}
                    required
                  />
                  <PasswordStrength
                    password={newPassword}
                    onValidationChange={handlePasswordValidation}
                  />
                </div>

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  icon={<FaKey className="h-5 w-5" />}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  disabled={loading || !passwordValid}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => setStep('otp')}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back to Verification
                  </button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Layout.Container>
      </div>
    );
  }

  return null;
};

export default ForgotPassword;
