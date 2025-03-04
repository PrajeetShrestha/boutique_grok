const dbService = require('../../services/dbService');
const multerService = require('../../services/multerService');
const fs = require('fs');
const path = require('path');
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
    getAddProduct: async (req, res) => {
        try {
            const [colors, fabrics] = await Promise.all([
                dbService.getUniqueColors(),
                dbService.getUniqueFabrics()
            ]);
            
            res.render('admin/add', {
                error: null,
                currentRoute: '/admin/add',
                colors,
                fabrics
            });
        } catch (error) {
            console.error('Error fetching unique values:', error);
            res.render('admin/add', {
                error: null,
                currentRoute: '/admin/add',
                colors: [],
                fabrics: []
            });
        }
    },

    // Handle add product form submission
    postAddProduct: async (req, res) => {
        try {
            const { name, price, color, fabric, description } = req.body;
            
            // Check if primary image was uploaded
            if (!req.files?.primaryImg?.[0]) {
                throw new Error('Primary image is required');
            }

            // Handle primary image
            const primaryImgPath = '/uploads/products/' + req.files.primaryImg[0].filename;
            
            // Handle additional images
            const additionalImages = req.files.images 
                ? req.files.images.map(file => '/uploads/products/' + file.filename)
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
            // Clean up uploaded files if there was an error
            if (req.files) {
                Object.values(req.files).flat().forEach(file => {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (unlinkError) {
                        console.error('Error deleting file:', unlinkError);
                    }
                });
            }
            res.render('admin/add', {
                error: error.message || 'Failed to add product',
                currentRoute: '/admin/add'
            });
        }
    },

    // Show edit product form
    getEditProduct: async (req, res) => {
        try {
            const [product, colors, fabrics] = await Promise.all([
                dbService.getProductById(req.params.id),
                dbService.getUniqueColors(),
                dbService.getUniqueFabrics()
            ]);

            if (!product) {
                return res.status(404).render('404', { currentRoute: '/admin' });
            }
            
            // Parse images JSON string or provide empty array as fallback
            product.images = product.images ? JSON.parse(product.images) : [];
            
            res.render('admin/edit', {
                product,
                error: null,
                currentRoute: '/admin/edit',
                colors,
                fabrics
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
            
            // Get existing product to handle image cleanup
            const existingProduct = await dbService.getProductById(id);
            if (!existingProduct) {
                throw new Error('Product not found');
            }

            // Handle primary image
            let primaryImgPath = existingProduct.primaryImg;
            if (req.files?.primaryImg?.[0]) {
                // Delete old primary image
                const oldPrimaryImgPath = path.join(__dirname, '../../public', existingProduct.primaryImg);
                try {
                    fs.unlinkSync(oldPrimaryImgPath);
                } catch (error) {
                    console.error('Error deleting old primary image:', error);
                }
                primaryImgPath = '/uploads/products/' + req.files.primaryImg[0].filename;
            }

            // Handle additional images
            let additionalImages = existingProduct.images ? JSON.parse(existingProduct.images) : [];
            
            // Handle existing images that were unchecked
            const existingImages = Array.isArray(req.body.existingImages) 
                ? req.body.existingImages 
                : [req.body.existingImages].filter(Boolean);
            
            // Delete unchecked images
            additionalImages.forEach(img => {
                if (!existingImages.includes(img)) {
                    const imgPath = path.join(__dirname, '../../public', img);
                    try {
                        fs.unlinkSync(imgPath);
                    } catch (error) {
                        console.error('Error deleting old image:', error);
                    }
                }
            });

            // Add new images
            if (req.files?.images) {
                const newImages = req.files.images.map(file => '/uploads/products/' + file.filename);
                additionalImages = [...existingImages, ...newImages];
            } else {
                additionalImages = existingImages;
            }

            await dbService.updateProduct(
                id,
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
            console.error('Error updating product:', error);
            // Clean up newly uploaded files if there was an error
            if (req.files) {
                Object.values(req.files).flat().forEach(file => {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (unlinkError) {
                        console.error('Error deleting file:', unlinkError);
                    }
                });
            }
            res.render('admin/edit', {
                product: { ...req.body, id: req.params.id },
                error: error.message || 'Failed to update product',
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