const dbService = require('../../services/dbService');

const adminController = {
    // Get all products for admin dashboard
    getAdminDashboard: async (req, res) => {
        try {
            const { products, totalCount } = await dbService.getProductsWithPagination(100, 0);
            res.render('admin/index', {
                products,
                currentRoute: '/admin'
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).render('404', { currentRoute: '/admin' });
        }
    },

    // Show add product form
    getAddProduct: (req, res) => {
        res.render('admin/add', {
            error: null,
            currentRoute: '/admin/add'
        });
    },

    // Handle add product form submission
    postAddProduct: async (req, res) => {
        try {
            const { name, price, color, fabric, description } = req.body;
            
            // Check if primary image was uploaded
            if (!req.files?.primaryImg?.[0]) {
                throw new Error('Primary image is required');
            }

            // Ensure paths start with /
            const primaryImg = req.files.primaryImg[0].filename;
            const primaryImgPath = primaryImg.startsWith('/') ? primaryImg : '/uploads/' + primaryImg;
            
            const additionalImages = req.files.images 
                ? req.files.images.map(file => '/uploads/' + file.filename)
                : [];

            await dbService.createProduct(
                name,
                parseFloat(price),
                primaryImgPath,
                additionalImages,
                color,
                fabric,
                description
            );

            res.redirect('/admin');
        } catch (error) {
            console.error('Error adding product:', error);
            res.render('admin/add', {
                error: error.message || 'Failed to add product',
                currentRoute: '/admin/add'
            });
        }
    },

    // Show edit product form
    getEditProduct: async (req, res) => {
        try {
            const product = await dbService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).render('404', { currentRoute: '/admin' });
            }
            
            // Parse images JSON string or provide empty array as fallback
            product.images = product.images ? JSON.parse(product.images) : [];
            
            res.render('admin/edit', {
                product,
                error: null,
                currentRoute: '/admin/edit'
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).render('404', { currentRoute: '/admin' });
        }
    },

    // Handle edit product form submission
    postEditProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, color, fabric, description } = req.body;
            const primaryImg = req.files?.primaryImg?.[0]?.path;
            const additionalImages = req.files?.images?.map(file => file.path);
            const existingImages = Array.isArray(req.body.existingImages) 
                ? req.body.existingImages 
                : [req.body.existingImages].filter(Boolean);

            await dbService.updateProduct(
                id,
                name,
                parseFloat(price),
                primaryImg,
                [...(additionalImages || []), ...(existingImages || [])],
                color,
                fabric,
                description
            );

            res.redirect('/admin');
        } catch (error) {
            console.error('Error updating product:', error);
            res.render('admin/edit', {
                product: { ...req.body, id: req.params.id },
                error: 'Failed to update product',
                currentRoute: '/admin/edit'
            });
        }
    },

    // Handle product deletion
    deleteProduct: async (req, res) => {
        try {
            await dbService.deleteProduct(req.params.id);
            res.redirect('/admin');
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).redirect('/admin');
        }
    },

    // Get orders page
    getOrders: async (req, res) => {
        try {
            const { status } = req.query;
            let orders;

            if (status && status !== 'all') {
                orders = await dbService.getOrdersByStatus(status);
            } else {
                orders = await dbService.getAllOrders();
            }

            res.render('admin/orders', {
                orders,
                currentRoute: '/admin/orders',
                selectedStatus: status || 'all'
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).render('404', { currentRoute: '/admin/orders' });
        }
    },

    // Update order status
    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            // Validate status
            const validStatuses = ['pending', 'in_progress', 'completed', 'archived'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid status' 
                });
            }

            await dbService.updateOrderStatus(id, status);
            
            // Send success response
            res.json({ 
                success: true,
                status: status
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to update order status' 
            });
        }
    }
};

module.exports = adminController; 