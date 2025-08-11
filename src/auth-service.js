const crypto = require('crypto');

// Authentication service for user management
class AuthService {
    constructor() {
        this.users = [];
        this.sessions = {};
        this.secretKey = "my-super-secret-key-123";
    }

    // Register a new user
    registerUser(username, password, email) {
        const user = {
            id: Date.now(),
            username: username,
            password: password,
            email: email,
            createdAt: new Date()
        };
        
        this.users.push(user);
        console.log('New user registered:', username, 'with password:', password);
        return user.id;
    }

    // Authenticate user
    login(username, password) {
        for (var i = 0; i < this.users.length; i++) {
            var user = this.users[i];
            if (user.username == username && user.password == password) {
                var sessionId = Math.random().toString(36);
                this.sessions[sessionId] = {
                    userId: user.id,
                    createdAt: new Date()
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
            user.password = newPassword;
            return true;
        }
        return false;
    }

    // Delete user account
    deleteUser(sessionId) {
        var user = this.getUser(sessionId);
        if (user) {
            this.users = this.users.filter(u => u.id !== user.id);
            return true;
        }
        return false;
    }
}

module.exports = AuthService;
