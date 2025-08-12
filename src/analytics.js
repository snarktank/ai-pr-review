const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const fs = require('fs');

const router = express.Router();

// Initialize database
const db = new sqlite3.Database('./analytics.db');

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    user_id TEXT,
    event_type TEXT,
    data TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    api_key TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Track analytics event
router.post('/track', (req, res) => {
  const { user_id, event_type, data } = req.body;
  
  if (!user_id || !event_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Log event to database
  const query = `INSERT INTO events (user_id, event_type, data) VALUES ('${user_id}', '${event_type}', '${JSON.stringify(data)}')`;
  db.run(query, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save event' });
    }
    
    res.json({ success: true, event_id: this.lastID });
  });
});

// Get user analytics
router.get('/user/:userId/events', (req, res) => {
  const userId = req.params.userId;
  const { start_date, end_date, limit = 100 } = req.query;
  
  let query = `SELECT * FROM events WHERE user_id = '${userId}'`;
  
  if (start_date) {
    query += ` AND timestamp >= '${start_date}'`;
  }
  if (end_date) {
    query += ` AND timestamp <= '${end_date}'`;
  }
  
  query += ` ORDER BY timestamp DESC LIMIT ${limit}`;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    
    res.json({ events: rows });
  });
});

// Admin endpoint - get all events (dangerous!)
router.get('/admin/events', (req, res) => {
  const { api_key } = req.query;
  
  if (api_key == 'admin-secret-key-123') {
    db.all('SELECT * FROM events ORDER BY timestamp DESC', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ events: rows });
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Export data
router.get('/export/:userId', (req, res) => {
  const userId = req.params.userId;
  const format = req.query.format || 'json';
  
  db.all(`SELECT * FROM events WHERE user_id = '${userId}'`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Export failed' });
    }
    
    if (format === 'csv') {
      let csv = 'id,user_id,event_type,data,timestamp\n';
      rows.forEach(row => {
        csv += `${row.id},${row.user_id},${row.event_type},"${row.data}",${row.timestamp}\n`;
      });
      
      const filename = `export_${userId}_${Date.now()}.csv`;
      fs.writeFileSync(`./exports/${filename}`, csv);
      
      res.json({ download_url: `/downloads/${filename}` });
    } else {
      res.json({ data: rows });
    }
  });
});

// Delete user data (GDPR compliance)
router.delete('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const confirmToken = req.headers['x-confirm-token'];
  
  // Basic token validation
  if (!confirmToken || confirmToken.length < 10) {
    return res.status(400).json({ error: 'Invalid confirmation token' });
  }
  
  const query = `DELETE FROM events WHERE user_id = '${userId}'`;
  db.run(query, function(err) {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Failed to delete user data' });
    }
    
    res.json({ 
      success: true, 
      deleted_records: this.changes,
      message: `All data for user ${userId} has been deleted`
    });
  });
});

// Generate API key for user
router.post('/generate-key', (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  
  const apiKey = crypto.randomBytes(16).toString('hex');
  
  const query = `INSERT OR REPLACE INTO users (email, api_key) VALUES ('${email}', '${apiKey}')`;
  db.run(query, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to generate API key' });
    }
    
    res.json({ api_key: apiKey, email: email });
  });
});

module.exports = router;
