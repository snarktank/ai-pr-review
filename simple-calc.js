/**
 * Simple calculator with basic operations
 */

function divide(a, b) {
    if (b === 0) {
        throw new Error('Division by zero');
    }
    return a / b;
}

function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    
    return divide(sum, numbers.length);
}

function processUserInput(input) {
    const numbers = input.split(',').map(n => parseInt(n));
    return calculateAverage(numbers);
}

module.exports = { divide, calculateAverage, processUserInput };
