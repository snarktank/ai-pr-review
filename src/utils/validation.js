const crypto = require('crypto');

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate user ID format
function isValidUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  
  // Allow alphanumeric and basic special characters
  const userIdRegex = /^[a-zA-Z0-9_-]+$/;
  return userIdRegex.test(userId) && userId.length >= 3 && userId.length <= 50;
}

// Generate secure token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Hash sensitive data
function hashData(data, salt) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  
  const hash = crypto.createHmac('sha256', salt);
  hash.update(data);
  return {
    hash: hash.digest('hex'),
    salt: salt
  };
}

// Sanitize user input for database queries
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Basic sanitization - remove potentially dangerous characters
  return input.replace(/['"\\;]/g, '');
}

// Validate date format
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

// Rate limiting helper
const rateLimitStore = new Map();

function checkRateLimit(identifier, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }
  
  const requests = rateLimitStore.get(identifier);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (validRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  validRequests.push(now);
  rateLimitStore.set(identifier, validRequests);
  
  return true; // Within rate limit
}

module.exports = {
  isValidEmail,
  isValidUserId,
  generateSecureToken,
  hashData,
  sanitizeInput,
  isValidDate,
  checkRateLimit
};
