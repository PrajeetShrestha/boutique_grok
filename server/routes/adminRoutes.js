const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multerService = require('../../services/multerService');

// Admin routes
router.get('/', adminController.getAdminDashboard);
router.get('/add', adminController.getAddProduct);
router.get('/edit/:id', adminController.getEditProduct);
router.get('/orders', adminController.getOrders);

router.post('/add', 
    multerService.productImagesUpload,
    adminController.postAddProduct
);

router.post('/edit/:id', 
    multerService.productImagesUpload,
    adminController.postEditProduct
);

router.post('/delete/:id', adminController.deleteProduct);
router.post('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;