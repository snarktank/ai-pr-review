/**
 * Utility functions for mathematical operations
 */

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function power(base, exponent) {
    let result = 1;
    for (let i = 0; i < exponent; i++) {
        result *= base;
    }
    return result;
}

function factorial(n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
    add,
    subtract,
    multiply,
    divide,
    power,
    factorial,
    isPrime,
    getRandomNumber
};
