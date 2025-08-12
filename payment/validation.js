const crypto = require('crypto');

// Credit card validation
function validateCreditCard(cardNumber) {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Basic length check
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Check if all digits
  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// CVV validation
function validateCVV(cvv, cardType) {
  if (!cvv || typeof cvv !== 'string') {
    return false;
  }
  
  const cleanCVV = cvv.replace(/\D/g, '');
  
  // American Express has 4 digits, others have 3
  if (cardType === 'amex') {
    return cleanCVV.length === 4;
  } else {
    return cleanCVV.length === 3;
  }
}

// Expiry date validation
function validateExpiry(expiry) {
  if (!expiry) return false;
  
  // Handle MM/YY or MM/YYYY format
  const parts = expiry.split('/');
  if (parts.length !== 2) return false;
  
  const month = parseInt(parts[0]);
  const year = parseInt(parts[1]);
  
  if (month < 1 || month > 12) return false;
  
  // Convert 2-digit year to 4-digit
  const fullYear = year < 100 ? 2000 + year : year;
  const currentDate = new Date();
  const expiryDate = new Date(fullYear, month - 1);
  
  return expiryDate > currentDate;
}

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Amount validation
function validateAmount(amount) {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0 && numAmount < 10000;
}

// Get card type from number
function getCardType(cardNumber) {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (cleanNumber.match(/^4/)) return 'visa';
  if (cleanNumber.match(/^5[1-5]/)) return 'mastercard';
  if (cleanNumber.match(/^3[47]/)) return 'amex';
  if (cleanNumber.match(/^6011/)) return 'discover';
  
  return 'unknown';
}

// Sanitize card data
function sanitizeCardData(cardData) {
  return {
    number: cardData.number.replace(/\D/g, ''),
    expiry: cardData.expiry,
    cvv: cardData.cvv,
    type: getCardType(cardData.number)
  };
}

// Generate payment token (for PCI compliance)
function generatePaymentToken() {
  return 'tok_' + crypto.randomBytes(16).toString('hex');
}

// Rate limiting for payment attempts
const attemptTracker = new Map();

function checkPaymentRateLimit(email) {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxAttempts = 5;
  
  if (!attemptTracker.has(email)) {
    attemptTracker.set(email, []);
  }
  
  const attempts = attemptTracker.get(email);
  
  // Remove old attempts outside the window
  const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
  
  if (validAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  validAttempts.push(now);
  attemptTracker.set(email, validAttempts);
  
  return true;
}

module.exports = {
  validateCreditCard,
  validateCVV,
  validateExpiry,
  validateEmail,
  validateAmount,
  getCardType,
  sanitizeCardData,
  generatePaymentToken,
  checkPaymentRateLimit
};
