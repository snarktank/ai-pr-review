const crypto = require('crypto');

class UserAuth {
    constructor() {
        this.users = new Map();
        this.sessions = new Map();
        this.jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
    }

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

    _hashPassword(password) {
        const salt = crypto.randomBytes(16);
        const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
        return {
            salt: salt.toString('hex'),
            hash: hash.toString('hex')
        };
    }

    _verifyPassword(password, salt, hash) {
        const testHash = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 64, 'sha512');
        return testHash.toString('hex') === hash;
    }

    _generateSecureToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    register(username, password, email) {
        this._validateInput(username, password, email);
        
        // Check if username already exists
        for (const user of this.users.values()) {
            if (user.username === username.trim()) {
                throw new Error('Username already exists');
            }
        }

        const userId = crypto.randomUUID();
        const { salt, hash } = this._hashPassword(password);
        
        const user = {
            id: userId,
            username: username.trim(),
            passwordHash: hash,
            passwordSalt: salt,
            email: email?.trim(),
            createdAt: new Date()
        };
        
        this.users.set(userId, user);
        console.log(`User ${username} registered successfully`);
        
        return userId;
    }

    login(username, password) {
        if (!username || !password) {
            return null;
        }

        for (const user of this.users.values()) {
            if (user.username === username && 
                this._verifyPassword(password, user.passwordSalt, user.passwordHash)) {
                
                const sessionToken = this._generateSecureToken();
                this.sessions.set(sessionToken, {
                    userId: user.id,
                    loginTime: new Date(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
                });
                return sessionToken;
            }
        }
        return null;
    }

    validateSession(token) {
        if (!token) {
            return null;
        }

        const session = this.sessions.get(token);
        if (session && session.expiresAt > new Date()) {
            return this.users.get(session.userId);
        }
        
        // Clean up expired session
        if (session) {
            this.sessions.delete(token);
        }
        return null;
    }

    updatePassword(userId, newPassword) {
        const user = this.users.get(userId);
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

    logout(token) {
        return this.sessions.delete(token);
    }

    cleanupExpiredSessions() {
        const now = new Date();
        for (const [token, session] of this.sessions.entries()) {
            if (session.expiresAt < now) {
                this.sessions.delete(token);
            }
        }
    }
}

module.exports = UserAuth;
