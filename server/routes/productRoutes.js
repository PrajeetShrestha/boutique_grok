const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getHome);
router.get('/products', productController.getProducts);
router.get('/detail', productController.getProductDetail);

module.exports = router; 