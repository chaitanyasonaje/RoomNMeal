import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { API_ENDPOINTS } from '../config/api';
import { FaArrowLeft, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
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
        setEmailSent(true);
        toast.success('Password reset email sent!');
      } else {
        toast.error(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${
              isDark ? 'bg-green-600' : 'bg-green-100'
            }`}>
              <FaCheckCircle className={`h-6 w-6 ${
                isDark ? 'text-white' : 'text-green-600'
              }`} />
            </div>
            <h2 className={`mt-6 text-3xl font-extrabold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Check Your Email
            </h2>
            <p className={`mt-2 text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`rounded-2xl p-8 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="space-y-6">
              <div className={`text-center ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p className="mb-4">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                <p className="text-sm">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isDark 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Try Different Email
                </button>

                <Link
                  to="/login"
                  className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isDark 
                      ? 'text-primary-400 hover:text-primary-300' 
                      : 'text-primary-600 hover:text-primary-500'
                  }`}
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${
            isDark ? 'bg-primary-600' : 'bg-primary-100'
          }`}>
            <FaEnvelope className={`h-6 w-6 ${
              isDark ? 'text-white' : 'text-primary-600'
            }`} />
          </div>
          <h2 className={`mt-6 text-3xl font-extrabold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Forgot Password?
          </h2>
          <p className={`mt-2 text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Enter your email address and we'll send you a link to reset your password
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className={`rounded-2xl p-8 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                    isDark 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                } transition-colors duration-200`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending Reset Link...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  to="/login"
                  className={`inline-flex items-center space-x-2 text-sm ${
                    isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'
                  } transition-colors duration-200`}
                >
                  <FaArrowLeft className="h-4 w-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ForgotPassword;
