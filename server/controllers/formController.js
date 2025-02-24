const dbService = require('../../services/dbService');

exports.getForm = (req, res) => {
    res.render('form', { 
        formData: null,
        error: null,
        currentRoute: '/form'
    });
};

exports.postForm = async (req, res) => {
    try {
        const formData = req.body;
        await dbService.createOrder(formData);
        
        res.render('form', {
            formData,
            error: null,
            currentRoute: '/form',
            message: 'Form submitted successfully!'
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.render('form', {
            formData: req.body,
            error: 'Error submitting form. Please try again.',
            currentRoute: '/form'
        });
    }
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