const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Test data
const validOrderData = {
    customer: {
        fullName: "John Doe",
        address: "123 Test Street, City",
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    },
    blouse: {
        length: 25,
        chest: 36,
        waist: 32,
        frontNeck: 6,
        backNeck: 7,
        shoulder: 14,
        sleevesLength: 22,
        sleevesRound: 12,
        armHole: 16
    },
    lehenga: {
        length: 42,
        waist: 32
    },
    unit: "inches",
    orderDate: new Date().toISOString()
};

const invalidOrderData = {
    customer: {
        fullName: "J", // Too short
        address: "123", // Too short
        deliveryDate: new Date().toISOString().split('T')[0] // Today (should be future date)
    },
    blouse: {
        length: 0, // Invalid measurement
        chest: 200, // Too large
        waist: 32,
        frontNeck: 6,
        backNeck: 7,
        shoulder: 14,
        sleevesLength: 22,
        sleevesRound: 12,
        armHole: 16
    },
    lehenga: {
        length: -1, // Invalid measurement
        waist: 32
    },
    unit: "invalid_unit", // Invalid unit
    orderDate: new Date().toISOString()
};

async function testFormSubmission() {
    try {
        console.log('Starting form submission tests...\n');

        // Test 1: Valid order without images
        console.log('Test 1: Valid order without images');
        try {
            const response = await axios.post(`${BASE_URL}/form`, validOrderData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('✅ Success:', response.data);
        } catch (error) {
            console.error('❌ Error:', error.response?.data || error.message);
        }
        console.log('\n-------------------\n');

        // Test 2: Invalid order data
        console.log('Test 2: Invalid order data');
        try {
            const response = await axios.post(`${BASE_URL}/form`, invalidOrderData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.log('✅ Expected validation error:', error.response?.data);
        }
        console.log('\n-------------------\n');

        // Test 3: Valid order with images
        console.log('Test 3: Valid order with images');
        try {
            const formData = new FormData();
            
            // Add order data
            formData.append('customer[fullName]', validOrderData.customer.fullName);
            formData.append('customer[address]', validOrderData.customer.address);
            formData.append('customer[deliveryDate]', validOrderData.customer.deliveryDate);
            
            Object.entries(validOrderData.blouse).forEach(([key, value]) => {
                formData.append(`blouse[${key}]`, value);
            });
            
            Object.entries(validOrderData.lehenga).forEach(([key, value]) => {
                formData.append(`lehenga[${key}]`, value);
            });
            
            formData.append('unit', validOrderData.unit);
            formData.append('orderDate', validOrderData.orderDate);

            // Add test images
            const testImagePath = path.join(__dirname, 'test-data', 'test-image.jpg');
            if (fs.existsSync(testImagePath)) {
                formData.append('reference-images', fs.createReadStream(testImagePath));
                formData.append('reference-images', fs.createReadStream(testImagePath));
            }

            const response = await axios.post(`${BASE_URL}/form`, formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });
            console.log('✅ Success:', response.data);
        } catch (error) {
            console.error('❌ Error:', error.response?.data || error.message);
        }
        console.log('\n-------------------\n');

        // Test 4: Missing required fields
        console.log('Test 4: Missing required fields');
        try {
            const incompleteData = {
                customer: {
                    fullName: "John Doe"
                    // Missing address and deliveryDate
                },
                // Missing other required fields
                unit: "inches"
            };
            
            const response = await axios.post(`${BASE_URL}/form`, incompleteData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.log('✅ Expected validation error:', error.response?.data);
        }

    } catch (error) {
        console.error('Test execution error:', error);
    }
}

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
testFormSubmission(); 