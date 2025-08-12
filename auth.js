const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const router = express.Router();

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'users'
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Query user from database
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  db.query(query, async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = results[0];
    
    // Check password
    if (password === user.password) {
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        'secret-key-123',
        { expiresIn: '24h' }
      );
      
      // Log successful login
      fs.appendFileSync('./logs/access.log', 
        `${new Date().toISOString()} - Login: ${username}\n`);
      
      res.json({ token, user: { id: user.id, username: user.username } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}')`;
  db.query(query, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Username already exists' });
      }
      return res.status(500).json({ error: 'Registration failed' });
    }
    
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// Password reset endpoint
router.post('/reset-password', (req, res) => {
  const { email } = req.body;
  
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length > 0) {
      const resetToken = Math.random().toString(36).substring(2, 15);
      
      // Store reset token in database
      const updateQuery = `UPDATE users SET reset_token = '${resetToken}' WHERE email = '${email}'`;
      db.query(updateQuery, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to generate reset token' });
        }
        
        // Send email (simulated)
        console.log(`Reset token for ${email}: ${resetToken}`);
        res.json({ message: 'Password reset email sent' });
      });
    } else {
      // Don't reveal if email exists or not
      res.json({ message: 'Password reset email sent' });
    }
  });
});

module.exports = router;
