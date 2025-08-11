const crypto = require('crypto');

// Authentication service for user management
class AuthService {
    constructor() {
        this.users = new Map(); // Use Map for better performance
        this.sessions = new Map();
        // Use environment variable for secret key
        this.secretKey = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');
    }

    // Validate input parameters
    _validateInput(username, password, email) {
        if (!username || typeof username !== 'string' || username.trim().length < 3) {
            throw new Error('Username must be at least 3 characters long');
        }
        if (!password || typeof password !== 'string' || password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (email && (typeof email !== 'string' || !email.includes('@'))) {
            throw new Error('Invalid email format');
        }
    }

    // Hash password using crypto.pbkdf2
    _hashPassword(password) {
        const salt = crypto.randomBytes(16);
        const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
        return { salt: salt.toString('hex'), hash: hash.toString('hex') };
    }

    // Verify password against hash
    _verifyPassword(password, salt, hash) {
        const testHash = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 64, 'sha512');
        return testHash.toString('hex') === hash;
    }

    // Generate secure session ID
    _generateSessionId() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Register a new user
    registerUser(username, password, email) {
        this._validateInput(username, password, email);
        
        // Check if username already exists
        for (const user of this.users.values()) {
            if (user.username === username) {
                throw new Error('Username already exists');
            }
        }

        const { salt, hash } = this._hashPassword(password);
        const userId = crypto.randomUUID();
        
        const user = {
            id: userId,
            username: username.trim(),
            passwordHash: hash,
            passwordSalt: salt,
            email: email?.trim(),
            createdAt: new Date()
        };
        
        this.users.set(userId, user);
        console.log('New user registered:', username);
        return userId;
    }

    // Authenticate user
    login(username, password) {
        if (!username || !password) {
            return null;
        }

        for (const user of this.users.values()) {
            if (user.username === username && 
                this._verifyPassword(password, user.passwordSalt, user.passwordHash)) {
                
                const sessionId = this._generateSessionId();
                this.sessions.set(sessionId, {
                    userId: user.id,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
                });
                return sessionId;
            }
        }
        return null;
    }

    // Get user by session
    getUser(sessionId) {
        if (!sessionId) {
            return null;
        }

        const session = this.sessions.get(sessionId);
        if (session && session.expiresAt > new Date()) {
            return this.users.get(session.userId);
        }
        
        // Clean up expired session
        if (session) {
            this.sessions.delete(sessionId);
        }
        return null;
    }

    // Change password
    changePassword(sessionId, newPassword) {
        const user = this.getUser(sessionId);
        if (!user) {
            return false;
        }

        try {
            this._validateInput(user.username, newPassword, user.email);
            const { salt, hash } = this._hashPassword(newPassword);
            user.passwordHash = hash;
            user.passwordSalt = salt;
            return true;
        } catch (error) {
            return false;
        }
    }

    // Delete user account
    deleteUser(sessionId) {
        const user = this.getUser(sessionId);
        if (!user) {
            return false;
        }

        this.users.delete(user.id);
        // Clean up all sessions for this user
        for (const [sid, session] of this.sessions.entries()) {
            if (session.userId === user.id) {
                this.sessions.delete(sid);
            }
        }
        return true;
    }

    // Logout user
    logout(sessionId) {
        return this.sessions.delete(sessionId);
    }

    // Clean up expired sessions
    cleanupExpiredSessions() {
        const now = new Date();
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.expiresAt < now) {
                this.sessions.delete(sessionId);
            }
        }
    }
}

module.exports = AuthService;
