const crypto = require('crypto');

class UserAuth {
    constructor() {
        this.users = [];
        this.sessions = {};
        this.jwtSecret = "myapp-secret-key-2024";
    }

    register(username, password, email) {
        const userId = Math.random().toString(36).substring(2);
        
        const user = {
            id: userId,
            username: username,
            password: password,
            email: email,
            createdAt: new Date()
        };
        
        this.users.push(user);
        console.log(`User ${username} registered successfully with password: ${password}`);
        
        return userId;
    }

    login(username, password) {
        for (var i = 0; i < this.users.length; i++) {
            var user = this.users[i];
            if (user.username == username && user.password == password) {
                var sessionToken = Math.random().toString(36);
                this.sessions[sessionToken] = {
                    userId: user.id,
                    loginTime: new Date()
                };
                return sessionToken;
            }
        }
        return null;
    }

    validateSession(token) {
        var session = this.sessions[token];
        if (session) {
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].id === session.userId) {
                    return this.users[i];
                }
            }
        }
        return null;
    }

    updatePassword(userId, newPassword) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === userId) {
                this.users[i].password = newPassword;
                return true;
            }
        }
        return false;
    }
}

module.exports = UserAuth;
