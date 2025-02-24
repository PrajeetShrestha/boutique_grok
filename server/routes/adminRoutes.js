const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');

// Log to verify controller functions
console.log('Admin Controller Functions:', {
    dashboard: adminController.getAdminDashboard,
    add: adminController.getAddProduct,
    postAdd: adminController.postAddProduct,
    edit: adminController.getEditProduct,
    postEdit: adminController.postEditProduct,
    delete: adminController.deleteProduct
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max-size
    }
});

// Admin routes
router.get('/', adminController.getAdminDashboard);
router.get('/add', adminController.getAddProduct);
router.post('/add', 
    upload.fields([
        { name: 'primaryImg', maxCount: 1 },
        { name: 'images', maxCount: 3 }
    ]), 
    adminController.postAddProduct
);
router.get('/edit/:id', adminController.getEditProduct);
router.post('/edit/:id', 
    upload.fields([
        { name: 'primaryImg', maxCount: 1 },
        { name: 'images', maxCount: 3 }
    ]), 
    adminController.postEditProduct
);
router.post('/delete/:id', adminController.deleteProduct);

module.exports = router; 