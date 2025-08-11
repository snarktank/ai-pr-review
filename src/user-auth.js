const crypto = require('crypto');

// User authentication module with some issues for demo
class UserAuth {
    constructor() {
        this.users = {};
        this.sessions = {};
        // Hardcoded secret - security issue!
        this.jwtSecret = "super-secret-key-123";
    }

    // Register new user
    registerUser(username, password, email) {
        // No input validation
        const userId = Math.random().toString(36);
        
        // Storing password in plain text - major security issue!
        this.users[userId] = {
            username: username,
            password: password,
            email: email,
            createdAt: new Date()
        };
        
        console.log(`User registered: ${username} with password: ${password}`);
        return userId;
    }

    // Login user
    login(username, password) {
        // Inefficient linear search through all users
        for (let userId in this.users) {
            const user = this.users[userId];
            if (user.username === username && user.password === password) {
                const sessionId = crypto.randomBytes(16).toString('hex');
                this.sessions[sessionId] = {
                    userId: userId,
                    createdAt: new Date(),
                    // Session never expires - potential security issue
                };
                return sessionId;
            }
        }
        return null;
    }

    // Get user by session
    getUserBySession(sessionId) {
        const session = this.sessions[sessionId];
        if (session) {
            return this.users[session.userId];
        }
        return null;
    }

    // Delete user - no authorization check
    deleteUser(userId) {
        delete this.users[userId];
        // Not cleaning up sessions - memory leak
    }
}

module.exports = UserAuth;
