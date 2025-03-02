const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const dbService = require('../services/dbService');
require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const formRoutes = require('./routes/formRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/admin', adminRoutes);
app.use('/form', formRoutes);
app.use('/orders', orderRoutes);
app.use('/', productRoutes);

// 404 Error Handler
app.use((req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.render('404', { currentRoute: req.path });
    } else {
        res.json({ error: 'Not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
}); 