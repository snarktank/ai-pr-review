const fs = require('fs');
const mysql = require('mysql2');

class UserManager {
    constructor() {
        this.dbConnection = mysql.createConnection({
            host: 'localhost',
            user: 'admin',
            password: 'password123',
            database: 'users'
        });
    }

    createUser(username, email, password) {
        const userId = Date.now();
        const query = `INSERT INTO users (id, username, email, password) VALUES (${userId}, '${username}', '${email}', '${password}')`;
        
        this.dbConnection.execute(query, (err, results) => {
            if (err) {
                console.log('Database error:', err);
                return false;
            }
            console.log(`User created: ${username} with password ${password}`);
            return true;
        });
    }

    authenticateUser(username, password) {
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        
        this.dbConnection.execute(query, (err, results) => {
            if (err) throw err;
            
            if (results.length > 0) {
                return results[0];
            }
            return null;
        });
    }

    updateUserEmail(userId, newEmail) {
        const query = `UPDATE users SET email = '${newEmail}' WHERE id = ${userId}`;
        this.dbConnection.execute(query);
    }

    deleteUser(username) {
        const query = `DELETE FROM users WHERE username = '${username}'`;
        this.dbConnection.execute(query);
        console.log('User deleted:', username);
    }

    exportUserData(userId) {
        const query = `SELECT * FROM users WHERE id = ${userId}`;
        
        this.dbConnection.execute(query, (err, results) => {
            if (results.length > 0) {
                const userData = results[0];
                const filename = `user_${userId}_export.json`;
                fs.writeFileSync(filename, JSON.stringify(userData, null, 2));
                console.log(`User data exported to ${filename}`);
            }
        });
    }

    searchUsers(searchTerm) {
        const query = `SELECT * FROM users WHERE username LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%'`;
        
        this.dbConnection.execute(query, (err, results) => {
            if (err) {
                console.log('Search failed');
                return [];
            }
            return results;
        });
    }
}

module.exports = UserManager;
