const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getOrders);
router.get('/confirmation', orderController.getOrderConfirmation);

module.exports = router; 