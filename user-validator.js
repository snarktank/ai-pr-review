/**
 * User input validation utilities
 */

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    if (password.length >= 8) {
        return true;
    }
    return false;
}

function validateAge(age) {
    return age > 0 && age < 150;
}

function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

module.exports = {
    validateEmail,
    validatePassword,
    validateAge,
    sanitizeInput
};
