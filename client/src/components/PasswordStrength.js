import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PasswordStrength = ({ password, onValidationChange }) => {
  const [strength, setStrength] = useState({
    score: 0,
    strength: 'weak',
    feedback: []
  });

  const [requirements, setRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, strength: 'weak', feedback: [] });
      setRequirements({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false
      });
      onValidationChange && onValidationChange(false, []);
      return;
    }

    const newRequirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };

    setRequirements(newRequirements);

    let score = 0;
    const feedback = [];

    if (newRequirements.length) score += 1;
    else feedback.push('Use at least 8 characters');

    if (newRequirements.lowercase) score += 1;
    else feedback.push('Add lowercase letters');

    if (newRequirements.uppercase) score += 1;
    else feedback.push('Add uppercase letters');

    if (newRequirements.number) score += 1;
    else feedback.push('Add numbers');

    if (newRequirements.special) score += 1;
    else feedback.push('Add special characters');

    if (password.length >= 12) score += 1;

    const strengthLevel = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

    const newStrength = { score, strength: strengthLevel, feedback };
    setStrength(newStrength);

    // Call parent validation callback
    const isValid = Object.values(newRequirements).every(req => req);
    onValidationChange && onValidationChange(isValid, feedback);
  }, [password, onValidationChange]);

  const getStrengthColor = () => {
    switch (strength.strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (strength.strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  };

  const getStrengthTextColor = () => {
    switch (strength.strength) {
      case 'weak': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return 'text-gray-500';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-3">
      {/* Password strength bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Password strength:</span>
          <span className={`font-medium ${getStrengthTextColor()}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength.score / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        <div className="text-sm text-gray-600 mb-2">Password requirements:</div>
        <div className="space-y-1">
          <RequirementItem
            met={requirements.length}
            text="At least 8 characters"
          />
          <RequirementItem
            met={requirements.lowercase}
            text="One lowercase letter"
          />
          <RequirementItem
            met={requirements.uppercase}
            text="One uppercase letter"
          />
          <RequirementItem
            met={requirements.number}
            text="One number"
          />
          <RequirementItem
            met={requirements.special}
            text="One special character (@$!%*?&)"
          />
        </div>
      </div>
    </div>
  );
};

const RequirementItem = ({ met, text }) => (
  <div className="flex items-center space-x-2 text-sm">
    {met ? (
      <FaCheck className="h-3 w-3 text-green-500" />
    ) : (
      <FaTimes className="h-3 w-3 text-gray-400" />
    )}
    <span className={met ? 'text-green-600' : 'text-gray-500'}>
      {text}
    </span>
  </div>
);

export default PasswordStrength;
