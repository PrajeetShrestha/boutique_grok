const dbService = require('../../services/dbService');

exports.getHome = (req, res) => {
    res.render('index', { currentRoute: '/' });
};

exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const offset = (page - 1) * limit;

        const { products, totalCount } = await dbService.getProductsWithPagination(limit, offset);
        
        const totalPages = Math.ceil(totalCount / limit);

        res.render('products', {
            products,
            currentPage: page,
            totalPages: totalPages,
            currentRoute: '/products'
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        // Use the 404 page instead of error page
        res.status(500).render('404', { 
            currentRoute: '/products'
        });
    }
};

exports.getProductDetail = async (req, res) => {
    try {
        const productId = req.query.id;
        const product = await dbService.getProductById(productId);
        
        if (!product) {
            return res.status(404).render('404', { currentRoute: '/detail' });
        }
        
        res.render('detail', { product, currentRoute: '/detail' });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).render('404', { currentRoute: '/detail' });
    }
}; 