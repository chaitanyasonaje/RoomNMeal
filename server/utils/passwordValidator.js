const passwordValidator = {
  // Password policy validation
  validatePassword: (password) => {
    const errors = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Generate password strength score
  getPasswordStrength: (password) => {
    let score = 0;
    const feedback = [];
    
    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');
    
    if (/\d/.test(password)) score += 1;
    else feedback.push('Add numbers');
    
    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Add special characters');
    
    if (password.length >= 12) score += 1;
    
    const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
    
    return { score, strength, feedback };
  }
};

module.exports = passwordValidator;
