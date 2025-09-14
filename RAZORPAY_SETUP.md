# Razorpay Payment Integration Setup Guide

## 🔧 **Environment Variables Setup**

Add the following environment variables to your `.env` file in the server directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

## 🚀 **Getting Started with Razorpay**

### 1. Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a new account or log in
3. Complete the KYC process

### 2. Get API Keys
1. Go to **Settings** → **API Keys**
2. Generate **Test Keys** for development
3. Generate **Live Keys** for production
4. Copy the **Key ID** and **Key Secret**

### 3. Set Up Webhooks
1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
   - `refund.created`
   - `refund.processed`
4. Copy the **Webhook Secret**

### 4. Frontend Configuration
Add the Razorpay Key ID to your React app's environment variables:

```env
# In client/.env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 📋 **Payment Flow**

### 1. Create Payment Order
```javascript
// Frontend calls /api/payments/create-order
const response = await fetch('/api/payments/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    itemType: 'room_booking',
    itemId: 'room_id',
    amount: 5000, // Amount in rupees
    customerDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210'
    }
  })
});
```

### 2. Process Payment
```javascript
// Razorpay checkout opens with order details
const options = {
  key: process.env.REACT_APP_RAZORPAY_KEY_ID,
  amount: orderData.amount,
  currency: orderData.currency,
  name: 'RoomNMeal',
  order_id: orderData.orderId,
  handler: async (response) => {
    // Verify payment on backend
    const verifyResponse = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature
      })
    });
  }
};
```

## 🛡️ **Security Features**

### 1. Server-Side Verification
- All payments are verified on the server using Razorpay signatures
- Webhook signatures are validated to prevent tampering
- Payment status is updated only after successful verification

### 2. Input Validation
- All payment data is validated using express-validator
- Amount validation ensures minimum payment amounts
- Customer details are sanitized and validated

### 3. Authentication
- All payment endpoints require valid JWT tokens
- Admin endpoints require admin role verification
- User can only access their own payment history

## 📊 **Database Schema**

### Payment Model
```javascript
{
  userId: ObjectId,           // Reference to User
  orderId: String,            // Razorpay order ID
  paymentId: String,          // Razorpay payment ID
  signature: String,          // Payment signature
  amount: Number,             // Amount in paise
  currency: String,           // Currency code (INR)
  itemType: String,           // mess_plan, room_booking, service
  itemId: ObjectId,           // Reference to item
  itemName: String,           // Item name for display
  status: String,             // pending, completed, failed, cancelled, refunded
  receipt: String,            // Receipt number
  customerDetails: Object,    // Customer information
  billingAddress: Object,     // Billing address
  paidAt: Date,              // Payment completion time
  createdAt: Date,           // Order creation time
  updatedAt: Date            // Last update time
}
```

## 🔄 **Webhook Events**

### Payment Captured
- Updates payment status to 'completed'
- Creates related booking/subscription
- Sends confirmation notification

### Payment Failed
- Updates payment status to 'failed'
- Releases any reserved inventory
- Sends failure notification

### Refund Created/Processed
- Updates payment status to 'refunded'
- Updates related booking/subscription status
- Sends refund notification

## 📱 **Frontend Components**

### 1. PaymentModal
- Handles payment initiation
- Shows payment status
- Downloads receipts

### 2. RazorpayCheckout
- Integrates with Razorpay SDK
- Handles payment verification
- Shows payment methods

### 3. PaymentHistory
- Displays user payment history
- Filters and pagination
- Receipt download

### 4. Admin PaymentManagement
- Admin payment overview
- Payment statistics
- Export functionality

## 🧪 **Testing**

### Test Cards (Test Mode)
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test UPI IDs
- `success@razorpay`
- `failure@razorpay`

## 🚀 **Deployment**

### 1. Environment Variables
Set the following in your production environment:
- `RAZORPAY_KEY_ID` (Live Key ID)
- `RAZORPAY_KEY_SECRET` (Live Key Secret)
- `RAZORPAY_WEBHOOK_SECRET` (Webhook Secret)

### 2. Webhook URL
Update webhook URL to your production domain:
`https://yourdomain.com/api/webhooks/razorpay`

### 3. Frontend Build
Ensure `REACT_APP_RAZORPAY_KEY_ID` is set in your build environment.

## 📞 **Support**

For Razorpay-related issues:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)
- [Razorpay Status](https://status.razorpay.com/)

## 🔍 **Troubleshooting**

### Common Issues

1. **Payment Verification Failed**
   - Check webhook secret configuration
   - Verify signature generation logic
   - Ensure proper order ID format

2. **Webhook Not Receiving Events**
   - Verify webhook URL is accessible
   - Check webhook secret configuration
   - Ensure proper event selection

3. **Frontend Integration Issues**
   - Verify Razorpay script loading
   - Check API key configuration
   - Ensure proper error handling

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=razorpay:*
```

## 📈 **Analytics**

The system provides comprehensive payment analytics:
- Total revenue tracking
- Payment success rates
- Popular payment methods
- User payment patterns
- Refund analytics

Access analytics through the admin dashboard at `/admin/payments`.
