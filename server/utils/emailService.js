const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.log('Email service configuration error:', error);
        } else {
          console.log('Email service is ready to send messages');
        }
      });
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  async sendEmail(to, subject, html, text = '') {
    if (!this.transporter) {
      console.error('Email service not initialized');
      return { success: false, error: 'Email service not initialized' };
    }

    try {
      const mailOptions = {
        from: `"RoomNMeal" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }

  // Email templates
  getWelcomeEmailTemplate(userName) {
    return {
      subject: 'Welcome to RoomNMeal! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; margin: 0;">Welcome to RoomNMeal!</h1>
            <p style="color: #6B7280; margin: 10px 0 0 0;">Your student accommodation journey starts here</p>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1F2937; margin: 0 0 15px 0;">Hi ${userName}! 👋</h2>
            <p style="color: #4B5563; margin: 0 0 15px 0;">
              Thank you for joining RoomNMeal! We're excited to help you find the perfect accommodation and services for your student life.
            </p>
            <p style="color: #4B5563; margin: 0;">
              Your account has been successfully created and you can now start exploring our platform.
            </p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #1F2937; margin: 0 0 15px 0;">What you can do now:</h3>
            <ul style="color: #4B5563; margin: 0; padding-left: 20px;">
              <li>Browse and book verified rooms and PGs</li>
              <li>Subscribe to quality mess services</li>
              <li>Access essential services like laundry and cleaning</li>
              <li>Chat with hosts and service providers</li>
              <li>Manage your bookings and payments</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Get Started
            </a>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              Need help? Contact us at support@roomnmeal.com
            </p>
          </div>
        </div>
      `,
      text: `Welcome to RoomNMeal! Hi ${userName}, thank you for joining us. Your account has been successfully created. Visit ${process.env.CLIENT_URL || 'http://localhost:3000'} to get started.`
    };
  }

  getBookingConfirmationTemplate(booking) {
    return {
      subject: 'Booking Confirmed! ✅',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0;">Booking Confirmed! ✅</h1>
            <p style="color: #6B7280; margin: 10px 0 0 0;">Your booking has been successfully confirmed</p>
          </div>
          
          <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #059669;">
            <h2 style="color: #1F2937; margin: 0 0 15px 0;">Booking Details</h2>
            <div style="color: #4B5563;">
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking._id}</p>
              <p style="margin: 5px 0;"><strong>Property:</strong> ${booking.room?.title || 'Service'}</p>
              <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${booking.totalAmount || booking.amount}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${booking.status}</p>
              ${booking.checkIn ? `<p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>` : ''}
              ${booking.checkOut ? `<p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>` : ''}
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/bookings" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Booking
            </a>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              Questions? Contact us at support@roomnmeal.com
            </p>
          </div>
        </div>
      `,
      text: `Booking Confirmed! Booking ID: ${booking._id}, Property: ${booking.room?.title || 'Service'}, Amount: ₹${booking.totalAmount || booking.amount}, Status: ${booking.status}`
    };
  }

  getServiceOrderConfirmationTemplate(order) {
    return {
      subject: 'Service Order Confirmed! 🛠️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; margin: 0;">Service Order Confirmed! 🛠️</h1>
            <p style="color: #6B7280; margin: 10px 0 0 0;">Your service order has been successfully placed</p>
          </div>
          
          <div style="background: #FAF5FF; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #7C3AED;">
            <h2 style="color: #1F2937; margin: 0 0 15px 0;">Order Details</h2>
            <div style="color: #4B5563;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order._id}</p>
              <p style="margin: 5px 0;"><strong>Service:</strong> ${order.service?.name}</p>
              <p style="margin: 5px 0;"><strong>Provider:</strong> ${order.provider?.name}</p>
              <p style="margin: 5px 0;"><strong>Quantity:</strong> ${order.orderDetails?.quantity} ${order.orderDetails?.unit}</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.pricing?.total}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${order.status}</p>
              ${order.orderDetails?.scheduledDate ? `<p style="margin: 5px 0;"><strong>Scheduled Date:</strong> ${new Date(order.orderDetails.scheduledDate).toLocaleDateString()}</p>` : ''}
              ${order.orderDetails?.scheduledTime ? `<p style="margin: 5px 0;"><strong>Scheduled Time:</strong> ${order.orderDetails.scheduledTime}</p>` : ''}
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/service-orders" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Order
            </a>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              Questions? Contact us at support@roomnmeal.com
            </p>
          </div>
        </div>
      `,
      text: `Service Order Confirmed! Order ID: ${order._id}, Service: ${order.service?.name}, Provider: ${order.provider?.name}, Amount: ₹${order.pricing?.total}`
    };
  }

  getPasswordResetTemplate(userName, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    return {
      subject: 'Password Reset Request 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #DC2626; margin: 0;">Password Reset Request 🔐</h1>
            <p style="color: #6B7280; margin: 10px 0 0 0;">Reset your RoomNMeal password</p>
          </div>
          
          <div style="background: #FEF2F2; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #DC2626;">
            <h2 style="color: #1F2937; margin: 0 0 15px 0;">Hi ${userName}!</h2>
            <p style="color: #4B5563; margin: 0 0 15px 0;">
              We received a request to reset your password. Click the button below to reset your password:
            </p>
            <p style="color: #4B5563; margin: 0;">
              This link will expire in 1 hour for security reasons.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <div style="background: #F9FAFB; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              <strong>Security Note:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              Need help? Contact us at support@roomnmeal.com
            </p>
          </div>
        </div>
      `,
      text: `Password Reset Request for ${userName}. Click here to reset: ${resetUrl}`
    };
  }

  getNotificationEmailTemplate(notification) {
    return {
      subject: notification.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6; margin: 0;">${notification.title}</h1>
            <p style="color: #6B7280; margin: 10px 0 0 0;">RoomNMeal Notification</p>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #4B5563; margin: 0 0 15px 0;">${notification.message}</p>
            ${notification.actionUrl ? `
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}${notification.actionUrl}" 
                   style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  ${notification.actionText || 'View Details'}
                </a>
              </div>
            ` : ''}
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              Manage notifications in your <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/profile" style="color: #3B82F6;">profile settings</a>
            </p>
          </div>
        </div>
      `,
      text: `${notification.title}\n\n${notification.message}${notification.actionUrl ? `\n\nView details: ${process.env.CLIENT_URL || 'http://localhost:3000'}${notification.actionUrl}` : ''}`
    };
  }

  // Send specific email types
  async sendWelcomeEmail(userEmail, userName) {
    const template = this.getWelcomeEmailTemplate(userName);
    return await this.sendEmail(userEmail, template.subject, template.html, template.text);
  }

  async sendBookingConfirmation(userEmail, booking) {
    const template = this.getBookingConfirmationTemplate(booking);
    return await this.sendEmail(userEmail, template.subject, template.html, template.text);
  }

  async sendServiceOrderConfirmation(userEmail, order) {
    const template = this.getServiceOrderConfirmationTemplate(order);
    return await this.sendEmail(userEmail, template.subject, template.html, template.text);
  }

  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const template = this.getPasswordResetTemplate(userName, resetToken);
    return await this.sendEmail(userEmail, template.subject, template.html, template.text);
  }

  async sendNotificationEmail(userEmail, notification) {
    const template = this.getNotificationEmailTemplate(notification);
    return await this.sendEmail(userEmail, template.subject, template.html, template.text);
  }
}

module.exports = new EmailService();
