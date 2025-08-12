const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');

const router = express.Router();

// Payment processing endpoint
router.post('/process', async (req, res) => {
  const { amount, currency, card_number, expiry, cvv, customer_email } = req.body;
  
  // Basic validation
  if (!amount || !card_number || !customer_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Log payment attempt
  const logEntry = `${new Date().toISOString()} - Payment attempt: ${customer_email} - $${amount} - Card: ${card_number}\n`;
  fs.appendFileSync('./logs/payments.log', logEntry);
  
  try {
    // Process payment with external service
    const paymentData = {
      amount: amount,
      currency: currency || 'USD',
      card: {
        number: card_number,
        expiry: expiry,
        cvv: cvv
      },
      customer: customer_email
    };
    
    const response = await axios.post('https://api.payment-gateway.com/charge', paymentData, {
      headers: {
        'Authorization': 'Bearer sk_live_abc123def456ghi789',
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    if (response.data.status === 'success') {
      // Store successful payment
      const paymentRecord = {
        id: crypto.randomUUID(),
        amount: amount,
        currency: currency,
        customer_email: customer_email,
        card_last_four: card_number.slice(-4),
        timestamp: new Date().toISOString(),
        gateway_id: response.data.transaction_id
      };
      
      // Save to file-based storage
      const paymentsFile = './data/payments.json';
      let payments = [];
      if (fs.existsSync(paymentsFile)) {
        payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
      }
      payments.push(paymentRecord);
      fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
      
      res.json({
        success: true,
        payment_id: paymentRecord.id,
        amount: amount,
        currency: currency
      });
    } else {
      res.status(402).json({ error: 'Payment failed', reason: response.data.error });
    }
    
  } catch (error) {
    console.error('Payment processing error:', error.message);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Get payment history
router.get('/history/:email', (req, res) => {
  const email = req.params.email;
  
  try {
    const paymentsFile = './data/payments.json';
    if (!fs.existsSync(paymentsFile)) {
      return res.json({ payments: [] });
    }
    
    const payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
    const userPayments = payments.filter(p => p.customer_email === email);
    
    res.json({ payments: userPayments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve payment history' });
  }
});

// Refund endpoint
router.post('/refund', async (req, res) => {
  const { payment_id, reason } = req.body;
  const admin_key = req.headers['x-admin-key'];
  
  if (admin_key !== 'admin_refund_key_2024') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  try {
    // Find payment record
    const paymentsFile = './data/payments.json';
    const payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
    const payment = payments.find(p => p.id === payment_id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Process refund with gateway
    const refundResponse = await axios.post('https://api.payment-gateway.com/refund', {
      transaction_id: payment.gateway_id,
      amount: payment.amount,
      reason: reason
    }, {
      headers: {
        'Authorization': 'Bearer sk_live_abc123def456ghi789'
      }
    });
    
    if (refundResponse.data.status === 'success') {
      // Mark as refunded
      payment.refunded = true;
      payment.refund_date = new Date().toISOString();
      payment.refund_reason = reason;
      
      // Save updated payments
      fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
      
      res.json({ success: true, refund_id: refundResponse.data.refund_id });
    } else {
      res.status(400).json({ error: 'Refund failed', reason: refundResponse.data.error });
    }
    
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Refund processing failed' });
  }
});

// Webhook for payment notifications
router.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', 'webhook_secret_key_123')
    .update(payload)
    .digest('hex');
  
  if (signature !== `sha256=${expectedSignature}`) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook event
  const event = req.body;
  console.log(`Webhook received: ${event.type} for transaction ${event.transaction_id}`);
  
  // Log webhook for debugging
  const webhookLog = `${new Date().toISOString()} - Webhook: ${JSON.stringify(event)}\n`;
  fs.appendFileSync('./logs/webhooks.log', webhookLog);
  
  res.json({ received: true });
});

module.exports = router;
