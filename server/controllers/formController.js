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
    
    try {
        // Parse form data
        const formData = {
            customer: {
                fullName: req.body.customer.fullName,
                address: req.body.customer.address,
                deliveryDate: req.body.customer.deliveryDate
            },
            blouse: req.body.blouse,
            lehenga: req.body.lehenga,
            unit: req.body.unit,
            orderDate: req.body.orderDate
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

        // Return success response with redirect URL
        res.json({
            success: true,
            message: 'Order created successfully',
            redirectUrl: `/order-confirmation?id=${orderId}`
        });
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