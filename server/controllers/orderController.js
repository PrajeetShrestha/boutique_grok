const dbService = require('../../services/dbService');

exports.getOrders = async (req, res) => {
    try {
        const orders = await dbService.getAllOrders();
        res.render('orders', { orders, currentRoute: '/orders' });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getOrderConfirmation = (req, res) => {
    const order = req.session.formData || null;
    res.render('order-confirmation', { order, currentRoute: '/order-confirmation' });
}; 