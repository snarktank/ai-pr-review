const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const paymentRoutes = require('./processor');
const { validateEmail, checkPaymentRateLimit } = require('./validation');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Rate limiting middleware
app.use('/api/payment/process', (req, res, next) => {
  const { customer_email } = req.body;
  
  if (!customer_email || !validateEmail(customer_email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  
  if (!checkPaymentRateLimit(customer_email)) {
    return res.status(429).json({ error: 'Too many payment attempts. Please try again later.' });
  }
  
  next();
});

// Routes
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'payment-processor',
    version: '1.0.0'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Payment processor server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
