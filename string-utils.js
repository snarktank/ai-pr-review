/**
 * String manipulation utilities
 */

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function reverse(str) {
    return str.split('').reverse().join('');
}

function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === reverse(cleaned);
}

function truncate(str, length) {
    if (str.length > length) {
        return str.substring(0, length) + '...';
    }
    return str;
}

function wordCount(str) {
    return str.split(' ').length;
}

module.exports = {
    capitalize,
    reverse,
    isPalindrome,
    truncate,
    wordCount
};
