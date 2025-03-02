const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const dbService = require('../services/dbService');

const BASE_URL = 'http://localhost:3000';

// Test data generator
function generateValidOrderData() {
    return {
        customer: {
            fullName: "John Doe",
            address: "123 Main Street, City",
            deliveryDate: "2024-12-31"
        },
        unit: "inches",
        blouse: {
            length: 24,
            chest: 36,
            waist: 28,
            frontNeck: 6,
            backNeck: 7,
            shoulder: 14,
            sleevesLength: 22,
            sleevesRound: 12,
            armHole: 16
        },
        lehenga: {
            length: 42,
            waist: 28
        }
    };
}

// Test cases
function runTests() {
    console.log('Starting form validation tests...\n');

    // Test 1: Valid data
    console.log('Test 1: Valid order data');
    const validData = generateValidOrderData();
    const validResult = dbService.validateOrderData(validData);
    console.log('Result:', validResult.isValid ? 'PASS ✓' : 'FAIL ✗');
    if (!validResult.isValid) {
        console.log('Errors:', validResult.errors);
    }
    console.log();

    // Test 2: Invalid customer data
    console.log('Test 2: Invalid customer data');
    const invalidCustomerData = generateValidOrderData();
    invalidCustomerData.customer.fullName = "A"; // Too short
    const customerResult = dbService.validateOrderData(invalidCustomerData);
    console.log('Result:', !customerResult.isValid ? 'PASS ✓' : 'FAIL ✗');
    console.log('Errors:', customerResult.errors);
    console.log();

    // Test 3: Invalid measurement unit
    console.log('Test 3: Invalid measurement unit');
    const invalidUnitData = generateValidOrderData();
    invalidUnitData.unit = "meters";
    const unitResult = dbService.validateOrderData(invalidUnitData);
    console.log('Result:', !unitResult.isValid ? 'PASS ✓' : 'FAIL ✗');
    console.log('Errors:', unitResult.errors);
    console.log();

    // Test 4: Invalid blouse measurements
    console.log('Test 4: Invalid blouse measurements');
    const invalidBlouseData = generateValidOrderData();
    invalidBlouseData.blouse.length = 0; // Too small
    invalidBlouseData.blouse.chest = 100; // Too large
    const blouseResult = dbService.validateOrderData(invalidBlouseData);
    console.log('Result:', !blouseResult.isValid ? 'PASS ✓' : 'FAIL ✗');
    console.log('Errors:', blouseResult.errors);
    console.log();

    // Test 5: Invalid lehenga measurements
    console.log('Test 5: Invalid lehenga measurements');
    const invalidLehengaData = generateValidOrderData();
    invalidLehengaData.lehenga.length = -1; // Negative value
    const lehengaResult = dbService.validateOrderData(invalidLehengaData);
    console.log('Result:', !lehengaResult.isValid ? 'PASS ✓' : 'FAIL ✗');
    console.log('Errors:', lehengaResult.errors);
    console.log();

    // Test 6: Missing required fields
    console.log('Test 6: Missing required fields');
    const missingFieldsData = generateValidOrderData();
    delete missingFieldsData.blouse.armHole;
    const missingResult = dbService.validateOrderData(missingFieldsData);
    console.log('Result:', !missingResult.isValid ? 'PASS ✓' : 'FAIL ✗');
    console.log('Errors:', missingResult.errors);
    console.log();

    // Test 7: Centimeter measurements
    console.log('Test 7: Valid centimeter measurements');
    const cmData = generateValidOrderData();
    cmData.unit = 'cm';
    // Convert inches to cm
    Object.keys(cmData.blouse).forEach(key => {
        cmData.blouse[key] = Math.round(cmData.blouse[key] * 2.54 * 10) / 10;
    });
    Object.keys(cmData.lehenga).forEach(key => {
        cmData.lehenga[key] = Math.round(cmData.lehenga[key] * 2.54 * 10) / 10;
    });
    const cmResult = dbService.validateOrderData(cmData);
    console.log('Result:', cmResult.isValid ? 'PASS ✓' : 'FAIL ✗');
    if (!cmResult.isValid) {
        console.log('Errors:', cmResult.errors);
    }
    console.log();
}

// Run the tests
runTests();

// Create test-data directory and test image if they don't exist
const testDataDir = path.join(__dirname, 'test-data');
if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir);
}

const testImagePath = path.join(testDataDir, 'test-image.jpg');
if (!fs.existsSync(testImagePath)) {
    // Create a simple test image
    const testImageData = Buffer.from(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABYSURBVFhH7Y9BCsAwCEPR/X9bW4QQRmxPFi2MtwS5UcKxM5ZMAJtx5szZgM0Yc+bsATBmzhn8z4AxY84BHMbMOQOYMedwJ8CcmXPGnAFj5pzD/QFj5pzxA+0fWdkK7qCDYgAAAABJRU5ErkJggg==',
        'base64'
    );
    fs.writeFileSync(testImagePath, testImageData);
}

// Run the tests
console.log('Make sure your server is running on http://localhost:3000\n');
runTests(); 