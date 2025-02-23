const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SQLite Database Setup
const dbPath = path.join(__dirname, 'app/data', 'boutique.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            address TEXT NOT NULL,
            deliveryDate TEXT NOT NULL,
            unit TEXT NOT NULL,
            blouseLength REAL NOT NULL,
            chest REAL NOT NULL,
            waist REAL NOT NULL,
            frontNeck REAL NOT NULL,
            backNeck REAL NOT NULL,
            shoulder REAL NOT NULL,
            sleevesLength REAL NOT NULL,
            sleevesRound REAL NOT NULL,
            armHole REAL NOT NULL,
            lehengaLength REAL NOT NULL,
            lehengaWaist REAL NOT NULL,
            orderDate TEXT NOT NULL
        )`, (err) => {
            if (err) console.error('Error creating table:', err.message);
        });
    }
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/products', (req, res) => {
    const itemsPerPage = 20;
    const page = parseInt(req.query.page) || 1;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = products.slice(start, end);
    const totalPages = Math.ceil(products.length / itemsPerPage);
    res.render('products', { products: paginatedProducts, page, totalPages });
});

app.get('/blog', (req, res) => {
    res.render('blog');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/detail', (req, res) => {
    const productId = parseInt(req.query.id);
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).send('Product not found');
    res.render('detail', { product });
});

app.get('/form', (req, res) => {
    res.render('form', { formData: null });
});

app.post('/form', (req, res) => {
    const orderDate = new Date().toLocaleString();
    const formData = {
        customer: {
            fullName: req.body['full-name'],
            address: req.body.address,
            deliveryDate: req.body['delivery-date']
        },
        blouse: {
            length: parseFloat(req.body['blouse-length']),
            chest: parseFloat(req.body.chest),
            waist: parseFloat(req.body.waist),
            frontNeck: parseFloat(req.body['front-neck']),
            backNeck: parseFloat(req.body['back-neck']),
            shoulder: parseFloat(req.body.shoulder),
            sleevesLength: parseFloat(req.body['sleeves-length']),
            sleevesRound: parseFloat(req.body['sleeves-round']),
            armHole: parseFloat(req.body['arm-hole'])
        },
        lehenga: {
            length: parseFloat(req.body['lehenga-length']),
            waist: parseFloat(req.body['lehenga-waist'])
        },
        unit: req.body.unit,
        orderDate: orderDate
    };

    // Insert into SQLite
    const sql = `INSERT INTO orders (fullName, address, deliveryDate, unit, blouseLength, chest, waist, frontNeck, backNeck, shoulder, sleevesLength, sleevesRound, armHole, lehengaLength, lehengaWaist, orderDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        formData.customer.fullName, formData.customer.address, formData.customer.deliveryDate, formData.unit,
        formData.blouse.length, formData.blouse.chest, formData.blouse.waist, formData.blouse.frontNeck,
        formData.blouse.backNeck, formData.blouse.shoulder, formData.blouse.sleevesLength, formData.blouse.sleevesRound,
        formData.blouse.armHole, formData.lehenga.length, formData.lehenga.waist, formData.orderDate
    ];
    
    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error inserting order:', err.message);
            return res.status(500).send('Error saving order');
        }
        res.render('form', { formData });
    });
});

// New Orders Page Route
app.get('/orders', (req, res) => {
    db.all('SELECT * FROM orders ORDER BY orderDate DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err.message);
            return res.status(500).send('Error fetching orders');
        }
        res.render('orders', { orders: rows });
    });
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});