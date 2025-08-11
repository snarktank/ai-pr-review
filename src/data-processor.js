// Data processing utility with performance and style issues

function processLargeDataset(data) {
    // Synchronous processing of large dataset - blocks event loop
    var results = [];
    
    for (var i = 0; i < data.length; i++) {
        // Inefficient string concatenation in loop
        var processed = "";
        for (var j = 0; j < data[i].length; j++) {
            processed += data[i][j].toUpperCase() + " ";
        }
        
        // Creating new objects in tight loop
        results.push({
            id: i,
            processed: processed,
            timestamp: new Date(),
            metadata: {
                length: data[i].length,
                checksum: calculateChecksum(processed)
            }
        });
    }
    
    return results;
}

function calculateChecksum(str) {
    // Inefficient checksum calculation
    var sum = 0;
    for (var i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }
    return sum;
}

// No error handling for invalid input
function validateData(input) {
    if (input.length > 0) {
        return true;
    }
}

// Unused function
function oldLegacyFunction() {
    console.log("This function is no longer used");
}

module.exports = {
    processLargeDataset,
    validateData
};
