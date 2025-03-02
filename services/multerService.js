const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Base storage configuration
const getStorage = (options = {}) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = options.uploadPath || 'public/uploads';
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
};

// Helper methods for file operations
const getOrderDirectory = (orderId) => {
    const orderDir = path.join('public/uploads/orders', orderId.toString());
    fs.mkdirSync(orderDir, { recursive: true });
    return orderDir;
};

const moveFilesToOrderDirectory = (files, orderId) => {
    const orderDir = getOrderDirectory(orderId);
    const imagePaths = [];

    for (const file of files) {
        const newPath = path.join(orderDir, file.filename);
        fs.renameSync(file.path, newPath);
        imagePaths.push(path.join('uploads/orders', orderId.toString(), file.filename));
    }

    return imagePaths;
};

// Base file filter
const fileFilter = (allowedMimeTypes = []) => {
    return (req, file, cb) => {
        if (allowedMimeTypes.length === 0 || allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed types: ' + allowedMimeTypes.join(', ')), false);
        }
    };
};

// General upload configuration
const getUploadConfig = (options = {}) => {
    const config = {
        storage: getStorage(options),
        limits: {
            fileSize: options.maxFileSize || 5 * 1024 * 1024 // Default 5MB
        }
    };

    if (options.allowedMimeTypes) {
        config.fileFilter = fileFilter(options.allowedMimeTypes);
    }

    return config;
};

// Specific upload configurations
const referenceImagesUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const orderDir = path.join('public/uploads/orders', req.body.orderId || 'temp');
            fs.mkdirSync(orderDir, { recursive: true });
            cb(null, orderDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }),
    fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/gif']),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Product images upload configuration
const productImagesUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = 'public/uploads/products';
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }),
    fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/gif']),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Create a custom upload configuration
const createCustomUpload = (options) => {
    return multer(getUploadConfig(options));
};

module.exports = {
    referenceImagesUpload,
    productImagesUpload,
    createCustomUpload,
    getOrderDirectory,
    moveFilesToOrderDirectory
}; 