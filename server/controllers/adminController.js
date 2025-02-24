const dbService = require('../../services/dbService');

exports.getAdminDashboard = async (req, res) => {
    try {
        const products = await dbService.getAllProducts();
        res.render('admin/index', { products, currentRoute: '/admin' });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAddProduct = (req, res) => {
    res.render('admin/add', { error: null, currentRoute: '/admin/add' });
};

exports.postAddProduct = async (req, res) => {
    try {
        const { name, price, color, fabric, description } = req.body;
        const primaryImg = req.files['primaryImg'][0].filename;
        const images = req.files['images'] ? req.files['images'].map(file => file.filename) : [];

        await dbService.createProduct(name, price, primaryImg, images, color, fabric, description);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error adding product:', err);
        res.render('admin/add', { error: 'Failed to add product. Please try again.', currentRoute: '/admin/add' });
    }
};

exports.getEditProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await dbService.getProductById(productId);
        res.render('admin/edit', { product, error: null, currentRoute: '/admin/edit' });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.postEditProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, color, fabric, description, existingImages } = req.body;
        const primaryImg = req.files['primaryImg'] ? req.files['primaryImg'][0].filename : null;
        const newImages = req.files['images'] ? req.files['images'].map(file => file.filename) : [];
        const imagesToKeep = existingImages ? [].concat(existingImages) : [];
        const images = [...imagesToKeep, ...newImages];

        await dbService.updateProduct(productId, name, price, primaryImg, images, color, fabric, description);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error updating product:', err);
        const product = await dbService.getProductById(req.params.id);
        res.render('admin/edit', { product, error: 'Failed to update product. Please try again.', currentRoute: '/admin/edit' });
    }
};

exports.postDeleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await dbService.deleteProduct(productId);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Internal Server Error');
    }
}; 