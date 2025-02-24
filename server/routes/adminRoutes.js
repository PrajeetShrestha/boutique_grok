const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

router.get('/', adminController.getAdminDashboard);
router.get('/add', adminController.getAddProduct);
router.post('/add', upload.fields([{ name: 'primaryImg', maxCount: 1 }, { name: 'images', maxCount: 3 }]), adminController.postAddProduct);
router.get('/edit/:id', adminController.getEditProduct);
router.post('/edit/:id', upload.fields([{ name: 'primaryImg', maxCount: 1 }, { name: 'images', maxCount: 3 }]), adminController.postEditProduct);
router.post('/delete/:id', adminController.postDeleteProduct);

module.exports = router; 