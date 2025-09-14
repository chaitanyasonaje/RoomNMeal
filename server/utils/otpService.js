const nodemailer = require('nodemailer');
const emailService = require('./emailService');

const otpService = {
  // Send OTP via email
  sendEmailOTP: async (email, otp, purpose = 'verification') => {
    try {
      const subject = purpose === 'verification' 
        ? 'Email Verification - RoomNMeal' 
        : purpose === 'reset' 
        ? 'Password Reset - RoomNMeal'
        : 'OTP Verification - RoomNMeal';
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">RoomNMeal</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your trusted accommodation partner</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px; text-align: center;">
              ${purpose === 'verification' ? 'Verify Your Email Address' : 'Reset Your Password'}
            </h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              ${purpose === 'verification' 
                ? 'Thank you for registering with RoomNMeal! To complete your registration, please verify your email address using the OTP below:'
                : 'You requested to reset your password. Use the OTP below to reset your password:'
              }
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 18px;">Your Verification Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
              This code will expire in <strong>5 minutes</strong>. If you didn't request this, please ignore this email.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px;">
                © 2024 RoomNMeal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `;

      await emailService.sendEmail(email, subject, html);
      return { success: true };
    } catch (error) {
      console.error('Error sending email OTP:', error);
      return { success: false, error: error.message };
    }
  },

  // Send OTP via SMS (placeholder - would need actual SMS service integration)
  sendSMSOTP: async (phone, otp, purpose = 'verification') => {
    try {
      // This is a placeholder implementation
      // In production, you would integrate with services like:
      // - Twilio
      // - AWS SNS
      // - MessageBird
      // - TextLocal (for India)
      
      console.log(`SMS OTP for ${phone}: ${otp} (Purpose: ${purpose})`);
      
      // For now, we'll just log it to console
      // In production, replace this with actual SMS service
      return { success: true, message: 'SMS OTP sent successfully' };
    } catch (error) {
      console.error('Error sending SMS OTP:', error);
      return { success: false, error: error.message };
    }
  },

  // Generate secure OTP
  generateOTP: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Validate OTP format
  validateOTPFormat: (otp) => {
    return /^\d{6}$/.test(otp);
  }
};

module.exports = otpService;
