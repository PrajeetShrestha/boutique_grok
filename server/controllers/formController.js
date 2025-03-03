const dbService = require('../../services/dbService');
const multerService = require('../../services/multerService');

exports.getForm = (req, res) => {
    res.render('form', { 
        formData: null,
        error: null,
        currentRoute: '/form'
    });
};

exports.postForm = [multerService.referenceImagesUpload.array('reference-images'), async (req, res) => {
    console.log('Form submission received:', req.body);
    let data = req.body;
// Check if data is a string and parse it if necessary
if (typeof data === 'string') {
    data = JSON.parse(data);
} else if (typeof data === 'object' && data.data) {
    // Handle case where data is sent as a nested JSON string
    data = JSON.parse(data.data);
}
    try {
        // Parse form data
        const formData = {
            customer: {
                fullName: data.customer.fullName,
                address: data.customer.address,
                deliveryDate: data.customer.deliveryDate
            },
            blouse: data.blouse,
            lehenga: data.lehenga,
            unit: data.unit,
            orderDate: data.orderDate
        };

        // Validate order data
        const validation = dbService.validateOrderData(formData);
        if (!validation.isValid) {
            return res.status(400).json(validation.errors);
        }

        // Create order in database
        const orderId = await dbService.createOrder(formData);

        // Handle reference images if any
        if (req.files && req.files.length > 0) {
            const imagePaths = multerService.moveFilesToOrderDirectory(req.files, orderId);
            await dbService.updateOrderImages(orderId, imagePaths);
        }
        console.log('Order created successfully:', orderId);
        // Return success response with redirect URL
        res.json({
            success: true,
            message: 'Order created successfully',
            redirectUrl: `/order-confirmation?id=${orderId}`
        });

        // Log success message
       
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}];

exports.getOrderConfirmation = (req, res) => {
    const orderId = parseInt(req.query.id);
    const db = dbService.db;
    db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
        if (err || !order) {
            return res.status(404).send('Order not found');
        }
        res.render('order-confirmation', { order, currentRoute: '/orders' });
    });
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await dbService.getAllOrders();
        res.render('orders', { 
            orders,
            currentRoute: '/orders'
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).render('404', {
            currentRoute: '/orders'
        });
    }
}; 