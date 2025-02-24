const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;
const dbService = require('./services/dbService');
require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure directories exist
const dataDir = path.join(__dirname, 'app/data');
const uploadDir = path.join(__dirname, 'public/uploads');
[dataDir, uploadDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created ${dir}`);
    }
});


// SQLite Database Setup
const dbPath = path.join(__dirname, 'app/data', 'boutique.db');
// Use db from dbService
const db = dbService.db;
dbService.initializeDatabase()
    .then(() => {
        console.log('Database initialized successfully');
    })
    .catch(err => {
        console.error('Failed to initialize database:', err.message);
    });

// Routes
app.get('/', (req, res) => {
    res.render('index', { currentRoute: '/' });
});

app.get('/products', (req, res) => {
    const itemsPerPage = 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * itemsPerPage;
    const searchQuery = req.query.search || '';

    let sql = 'SELECT COUNT(*) as total FROM products';
    let params = [];
    if (searchQuery) {
        sql += ' WHERE name LIKE ? OR description LIKE ?';
        params = [`%${searchQuery}%`, `%${searchQuery}%`];
    }

    db.get(sql, params, (err, row) => {
        if (err) {
            console.error('Error counting products:', err.message);
            return res.status(500).send('Error fetching products');
        }

        const totalProducts = row.total;
        const totalPages = Math.ceil(totalProducts / itemsPerPage);

        sql = 'SELECT * FROM products';
        if (searchQuery) {
            sql += ' WHERE name LIKE ? OR description LIKE ?';
        }
        sql += ' LIMIT ? OFFSET ?';
        params = searchQuery ? [`%${searchQuery}%`, `%${searchQuery}%`, itemsPerPage, offset] : [itemsPerPage, offset];

        db.all(sql, params, (err, products) => {
            if (err) {
                console.error('Error fetching products:', err.message);
                return res.status(500).send('Error fetching products');
            }
            res.render('products', { products, page, totalPages, currentRoute: '/products' });
        });
    });
});

app.get('/blog', (req, res) => {
    res.render('blog', { currentRoute: '/blog' });
});

app.get('/about', (req, res) => {
    res.render('about', { currentRoute: '/about' });
});

app.get('/detail', (req, res) => {
    const productId = parseInt(req.query.id);
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            console.error('Error fetching product:', err.message);
            return res.status(500).send('Error fetching product');
        }
        if (!product) return res.status(404).send('Product not found');
        res.render('detail', { product, currentRoute: '/products' }); // Detail is under Products
    });
});

app.get('/form', (req, res) => {
    res.render('form', { 
        formData: null, 
        currentRoute: '/form'
    });
});

app.post('/form', (req, res) => {
    console.log('Form submission received:', req.body);

    // Use the request body directly as it matches our expected structure
    const formData = {
        customer: req.body.customer,
        blouse: req.body.blouse,
        lehenga: req.body.lehenga,
        unit: req.body.unit,
        orderDate: req.body.orderDate
    };

    // Validation rules
    const validationRules = {
        customer: {
            fullName: (val) => val && val.length >= 2 && val.length <= 100,
            address: (val) => val && val.length >= 5 && val.length <= 200,
            deliveryDate: (val) => val && new Date(val) > new Date()
        },
        measurements: {
            inches: { min: 1, max: 100 },
            cm: { min: 0, max: 254 }
        }
    };

    // Validate customer details
    const customerErrors = [];
    Object.entries(formData.customer).forEach(([field, value]) => {
        if (!validationRules.customer[field](value)) {
            customerErrors.push(`Invalid ${field}`);
        }
    });

    // Validate unit
    if (!['inches', 'cm'].includes(formData.unit)) {
        return res.status(400).json({ message: 'Invalid measurement unit' });
    }

    // Validate measurements
    const { min, max } = validationRules.measurements[formData.unit];
    const measurementErrors = [];

    // Validate blouse measurements
    Object.entries(formData.blouse).forEach(([field, value]) => {
        if (isNaN(value) || value < min || value > max) {
            measurementErrors.push(`Invalid blouse ${field}`);
        }
    });

    // Validate lehenga measurements
    Object.entries(formData.lehenga).forEach(([field, value]) => {
        if (isNaN(value) || value < min || value > max) {
            measurementErrors.push(`Invalid lehenga ${field}`);
        }
    });

    // If there are any validation errors, return them
    if (customerErrors.length > 0 || measurementErrors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: {
                customer: customerErrors,
                measurements: measurementErrors
            }
        });
    }

    // If validation passes, proceed with database insertion
    const sql = `INSERT INTO orders (fullName, address, deliveryDate, unit, blouseLength, chest, waist, frontNeck, backNeck, shoulder, sleevesLength, sleevesRound, armHole, lehengaLength, lehengaWaist, orderDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        formData.customer.fullName,
        formData.customer.address,
        formData.customer.deliveryDate,
        formData.unit,
        formData.blouse.length,
        formData.blouse.chest,
        formData.blouse.waist,
        formData.blouse.frontNeck,
        formData.blouse.backNeck,
        formData.blouse.shoulder,
        formData.blouse.sleevesLength,
        formData.blouse.sleevesRound,
        formData.blouse.armHole,
        formData.lehenga.length,
        formData.lehenga.waist,
        formData.orderDate
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: `Error saving order: ${err.message}` });
        }
        console.log('Order saved successfully with ID:', this.lastID);
        res.redirect(`/order-confirmation?id=${this.lastID}`);
    });
});

app.get('/order-confirmation', (req, res) => {
    const orderId = parseInt(req.query.id);
    db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
        if (err || !order) {
            return res.status(404).send('Order not found');
        }
        res.render('order-confirmation', { order, currentRoute: '/orders' });
    });
});

app.get('/orders', (req, res) => {
    db.all('SELECT * FROM orders ORDER BY orderDate DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err.message);
            return res.status(500).send('Error fetching orders');
        }
        res.render('orders', { orders: rows, currentRoute: '/orders' });
    });
});

// API endpoint for product details
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            console.error('Error fetching product:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    });
});

// Admin Routes
app.get('/admin', (req, res) => {
    db.all('SELECT * FROM products', [], (err, products) => {
        if (err) return res.status(500).send('Error fetching products');
        products.forEach(p => p.images = JSON.parse(p.images));
        res.render('admin/index', { products });
    });
});

app.get('/admin/add', (req, res) => res.render('admin/add', { error: null }));

app.post('/admin/add', upload.fields([{ name: 'primaryImg', maxCount: 1 }, { name: 'images', maxCount: 3 }]), (req, res) => {
    const { name, price, color, fabric, description } = req.body;
    if (!name || !price || !color || !fabric || !description || !req.files.primaryImg) {
        return res.render('admin/add', { error: 'All fields and primary image are required' });
    }
    const primaryImg = `/uploads/${req.files.primaryImg[0].filename}`;
    const images = req.files.images ? req.files.images.map(file => `/uploads/${file.filename}`) : [];
    const sql = `INSERT INTO products (name, price, primaryImg, images, color, fabric, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [name, parseFloat(price), primaryImg, JSON.stringify(images), color, fabric, description], function(err) {
        if (err) return res.render('admin/add', { error: 'Error adding product: ' + err.message });
        res.redirect('/admin');
    });
});

app.get('/admin/edit/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) return res.status(404).send('Product not found');
        product.images = JSON.parse(product.images);
        res.render('admin/edit', { product, error: null });
    });
});

app.post('/admin/edit/:id', upload.fields([{ name: 'primaryImg', maxCount: 1 }, { name: 'images', maxCount: 3 }]), (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price, color, fabric, description, existingImages } = req.body;
    if (!name || !price || !color || !fabric || !description) {
        return res.render('admin/edit', { product: { id: productId, name, price, color, fabric, description }, error: 'All fields are required' });
    }
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) return res.status(404).send('Product not found');
        const primaryImg = req.files.primaryImg ? `/uploads/${req.files.primaryImg[0].filename}` : product.primaryImg;
        const newImages = req.files.images ? req.files.images.map(file => `/uploads/${file.filename}`) : [];
        const images = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]).concat(newImages) : newImages;
        const sql = `UPDATE products SET name = ?, price = ?, primaryImg = ?, images = ?, color = ?, fabric = ?, description = ? WHERE id = ?`;
        db.run(sql, [name, parseFloat(price), primaryImg, JSON.stringify(images), color, fabric, description, productId], (err) => {
            if (err) return res.render('admin/edit', { product: { id: productId, name, price, primaryImg, images, color, fabric, description }, error: 'Error updating product: ' + err.message });
            res.redirect('/admin');
        });
    });
});

app.post('/admin/delete/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    db.run('DELETE FROM products WHERE id = ?', [productId], (err) => {
        if (err) return res.status(500).send('Error deleting product');
        res.redirect('/admin');
    });
});

// 404 Error Handler - Must be after all other routes
app.use((req, res) => {
    res.status(404);
    // Check if the request accepts HTML
    if (req.accepts('html')) {
        res.render('404', { currentRoute: req.path });
    } else {
        // For API requests, send JSON
        res.json({ error: 'Not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});