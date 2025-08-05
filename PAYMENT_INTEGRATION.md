# 💳 Payment Integration Guide - RoomNMeal

This guide covers the complete payment integration setup and usage for the RoomNMeal platform.

## 🔧 Payment Methods Supported

### 1. Razorpay (Primary)
- **Online Payments**: Credit/Debit cards, UPI, Net Banking
- **Features**: Secure, PCI compliant, instant settlements
- **Integration**: Complete API integration with webhook support

### 2. Wallet System (Internal)
- **Digital Wallet**: Internal balance management
- **Features**: Instant transactions, no processing fees
- **Usage**: Recharges, refunds, partial payments

### 3. Cash Payments
- **Offline Payments**: Direct cash transactions
- **Features**: Manual verification, admin approval
- **Usage**: Local payments, emergency situations

## 🚀 Setup Instructions

### 1. Razorpay Configuration

#### Environment Variables
```env
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

#### Razorpay Account Setup
1. **Create Account**: Sign up at [razorpay.com](https://razorpay.com)
2. **Get API Keys**: 
   - Go to Settings → API Keys
   - Generate new key pair
   - Copy Key ID and Key Secret
3. **Webhook Setup**:
   - Go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payments/webhook`
   - Events to subscribe: `payment.captured`, `payment.failed`

### 2. Database Setup

#### Transaction Model Features
```javascript
// Transaction Types
- room_booking: Room booking payments
- mess_subscription: Mess plan subscriptions
- laundry_service: Laundry service payments
- tea_service: Tea service payments
- wallet_recharge: Wallet top-ups
- refund: Payment refunds

// Payment Methods
- razorpay: Online payments
- wallet: Internal wallet
- cash: Offline payments

// Status Tracking
- pending: Payment initiated
- completed: Payment successful
- failed: Payment failed
- refunded: Payment refunded
```

## 💰 Payment Flow

### 1. Room Booking Payment

```javascript
// Frontend: Create payment order
const response = await axios.post('/api/payments/create-order', {
  amount: 5000,
  currency: 'INR',
  receipt: 'booking_123',
  type: 'room_booking',
  relatedId: bookingId
});

// Process payment with Razorpay
const options = {
  key: RAZORPAY_KEY_ID,
  amount: response.data.order.amount,
  currency: response.data.order.currency,
  order_id: response.data.order.id,
  handler: async (response) => {
    // Verify payment
    await axios.post('/api/payments/verify', {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      transactionId: response.data.transactionId
    });
  }
};
```

### 2. Wallet Recharge

```javascript
// Recharge wallet
const response = await axios.post('/api/payments/wallet/recharge', {
  amount: 1000,
  paymentMethod: 'razorpay' // or 'cash'
});

// Check wallet balance
const balance = await axios.get('/api/payments/wallet/balance');
```

### 3. Mess Subscription Payment

```javascript
// Subscribe to mess plan
const response = await axios.post('/api/payments/create-order', {
  amount: 3000,
  currency: 'INR',
  receipt: 'mess_sub_456',
  type: 'mess_subscription',
  relatedId: subscriptionId
});
```

## 🔄 Refund Processing

### Automatic Refund Calculation

```javascript
// Booking refund calculation
bookingSchema.methods.calculateRefundAmount = function() {
  if (this.status === 'cancelled') {
    const daysUntilCheckIn = Math.ceil((checkIn - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilCheckIn > 7) {
      return this.paidAmount * 0.8; // 80% refund
    } else if (daysUntilCheckIn > 3) {
      return this.paidAmount * 0.5; // 50% refund
    } else {
      return 0; // No refund
    }
  }
  return 0;
};
```

### Process Refund

```javascript
// Process refund
const response = await axios.post('/api/payments/refund', {
  transactionId: 'transaction_id',
  amount: 1000,
  reason: 'Cancellation',
  refundToWallet: true
});
```

## 📊 Transaction Management

### Get Transaction History

```javascript
// Get user transactions with pagination
const transactions = await axios.get('/api/payments/transactions', {
  params: {
    page: 1,
    limit: 10,
    type: 'room_booking',
    status: 'completed'
  }
});
```

### Transaction Types and Features

| Transaction Type | Description | Payment Methods | Refund Policy |
|------------------|-------------|-----------------|---------------|
| `room_booking` | Room booking payments | Razorpay, Wallet, Cash | Based on cancellation time |
| `mess_subscription` | Mess plan subscriptions | Razorpay, Wallet, Cash | Pro-rated refund |
| `wallet_recharge` | Wallet top-ups | Razorpay, Cash | No refund |
| `laundry_service` | Laundry service payments | Wallet, Cash | No refund |
| `tea_service` | Tea service payments | Wallet, Cash | No refund |
| `refund` | Payment refunds | Wallet | N/A |

## 🛡️ Security Features

### 1. Payment Verification
```javascript
// Verify Razorpay signature
const sign = razorpay_order_id + '|' + razorpay_payment_id;
const expectedSign = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(sign.toString())
  .digest('hex');

if (razorpay_signature === expectedSign) {
  // Payment verified
} else {
  // Invalid signature
}
```

### 2. Transaction Tracking
- **Unique Transaction IDs**: Each payment has a unique identifier
- **Status Tracking**: Real-time status updates
- **Audit Trail**: Complete transaction history
- **Failure Handling**: Proper error handling and logging

### 3. Wallet Security
- **Balance Validation**: Prevent negative balances
- **Transaction Limits**: Configurable limits
- **Fraud Detection**: Suspicious activity monitoring

## 📈 Analytics and Reporting

### Admin Dashboard Features
- **Revenue Analytics**: Total revenue, monthly trends
- **Payment Methods**: Distribution of payment methods
- **Transaction Status**: Success/failure rates
- **Refund Tracking**: Refund amounts and reasons

### API Endpoints for Analytics

```javascript
// Get payment statistics
GET /api/admin/payments/stats

// Get transaction reports
GET /api/admin/payments/reports

// Get refund analytics
GET /api/admin/payments/refunds
```

## 🔧 Configuration Options

### Environment Variables
```env
# Payment Configuration
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
PAYMENT_WEBHOOK_SECRET=your-webhook-secret

# Wallet Configuration
WALLET_MAX_BALANCE=50000
WALLET_MIN_RECHARGE=100
WALLET_MAX_RECHARGE=10000

# Refund Configuration
REFUND_PROCESSING_DAYS=3
AUTO_REFUND_ENABLED=true
```

### Database Indexes
```javascript
// Optimized indexes for payment queries
await Transaction.collection.createIndex({ user: 1 });
await Transaction.collection.createIndex({ type: 1 });
await Transaction.collection.createIndex({ status: 1 });
await Transaction.collection.createIndex({ createdAt: -1 });
await Transaction.collection.createIndex({ 
  razorpayOrderId: 1 
}, { sparse: true });
```

## 🚨 Error Handling

### Common Payment Errors
1. **Insufficient Balance**: Wallet balance too low
2. **Payment Failed**: Razorpay payment failure
3. **Invalid Signature**: Payment verification failed
4. **Transaction Timeout**: Payment session expired

### Error Response Format
```javascript
{
  "error": "PAYMENT_FAILED",
  "message": "Payment processing failed",
  "details": {
    "transactionId": "txn_123",
    "failureReason": "Insufficient funds",
    "suggestedAction": "Try with different payment method"
  }
}
```

## 📱 Frontend Integration

### Payment Components
- **Payment Modal**: Razorpay payment interface
- **Wallet Balance**: Real-time balance display
- **Transaction History**: Paginated transaction list
- **Payment Status**: Real-time status updates

### React Components Example
```javascript
// Payment Modal Component
const PaymentModal = ({ amount, onSuccess, onFailure }) => {
  const handlePayment = async () => {
    try {
      const order = await createPaymentOrder(amount);
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: onSuccess,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      onFailure(error);
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay ₹{amount}
    </button>
  );
};
```

## 🎯 Testing

### Test Cards (Razorpay)
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **Timeout**: 4000 0000 0000 0003

### Test Scenarios
1. **Successful Payment**: Complete payment flow
2. **Failed Payment**: Handle payment failure
3. **Partial Payment**: Multiple payment attempts
4. **Refund Processing**: Complete refund flow
5. **Wallet Operations**: Recharge and usage

## 📞 Support

### Payment Issues
- **Razorpay Support**: [support@razorpay.com](mailto:support@razorpay.com)
- **Technical Issues**: Check server logs and transaction status
- **User Issues**: Verify payment details and account status

### Monitoring
- **Transaction Logs**: Real-time transaction monitoring
- **Error Alerts**: Automated error notifications
- **Performance Metrics**: Payment success rates and response times

---

**The RoomNMeal payment system is now fully integrated and production-ready!** 🎉 