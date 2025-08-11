const crypto = require('crypto');

// Authentication service with security vulnerabilities for demo
class AuthService {
    constructor() {
        this.users = [];
        this.sessions = {};
        // SECURITY ISSUE: Hardcoded secret key
        this.secretKey = "my-super-secret-key-123";
    }

    // Register a new user
    registerUser(username, password, email) {
        // SECURITY ISSUE: No input validation
        const user = {
            id: Date.now(), // POOR PRACTICE: Using timestamp as ID
            username: username,
            password: password, // SECURITY ISSUE: Storing plain text password
            email: email,
            createdAt: new Date()
        };
        
        this.users.push(user);
        
        // SECURITY ISSUE: Logging sensitive information
        console.log('New user registered:', username, 'with password:', password);
        
        return user.id;
    }

    // Authenticate user
    login(username, password) {
        // PERFORMANCE ISSUE: Inefficient linear search
        for (var i = 0; i < this.users.length; i++) {
            var user = this.users[i];
            if (user.username == username && user.password == password) {
                var sessionId = Math.random().toString(36); // SECURITY ISSUE: Weak session ID
                this.sessions[sessionId] = {
                    userId: user.id,
                    createdAt: new Date()
                    // SECURITY ISSUE: No session expiration
                };
                return sessionId;
            }
        }
        return null;
    }

    // Get user by session
    getUser(sessionId) {
        var session = this.sessions[sessionId];
        if (session) {
            // PERFORMANCE ISSUE: Another linear search
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].id === session.userId) {
                    return this.users[i];
                }
            }
        }
        return null;
    }

    // Change password
    changePassword(sessionId, newPassword) {
        var user = this.getUser(sessionId);
        if (user) {
            user.password = newPassword; // SECURITY ISSUE: No validation, still plain text
            return true;
        }
        return false;
    }
}

module.exports = AuthService;
