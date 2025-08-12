const config = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        username: 'root',
        password: 'mypassword123'
    },
    
    session: {
        secret: 'super-secret-session-key',
        maxAge: 24 * 60 * 60 * 1000
    },
    
    api: {
        key: 'sk-1234567890abcdef',
        baseUrl: 'https://api.example.com'
    },
    
    admin: {
        email: 'admin@company.com',
        defaultPassword: 'admin123'
    }
};

module.exports = config;
