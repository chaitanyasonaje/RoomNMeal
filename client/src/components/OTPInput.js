import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaRedo } from 'react-icons/fa';

const OTPInput = ({ 
  length = 6, 
  onComplete, 
  onResend, 
  loading = false,
  disabled = false,
  autoFocus = true 
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index, value) => {
    if (disabled) return;

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === length) {
      onComplete && onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus on the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, length - 1);
      setActiveIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();

      // Check if OTP is complete
      if (newOtp.every(digit => digit !== '') && newOtp.join('').length === length) {
        onComplete && onComplete(newOtp.join(''));
      }
    }
  };

  const clearOtp = () => {
    setOtp(new Array(length).fill(''));
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="space-y-6">
      {/* OTP Input Fields */}
      <div className="flex justify-center space-x-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            disabled={disabled}
            className={`
              w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg
              transition-all duration-200 focus:outline-none
              ${activeIndex === index 
                ? 'border-primary-500 ring-2 ring-primary-200' 
                : 'border-gray-300'
              }
              ${disabled 
                ? 'bg-gray-100 cursor-not-allowed' 
                : 'bg-white hover:border-gray-400'
              }
              ${digit ? 'border-primary-500 bg-primary-50' : ''}
            `}
            maxLength={1}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={clearOtp}
          disabled={disabled || loading}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span>Clear</span>
        </button>

        {onResend && (
          <button
            type="button"
            onClick={onResend}
            disabled={disabled || loading}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaRedo className="h-4 w-4" />
            <span>Resend OTP</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span>Verifying...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPInput;
