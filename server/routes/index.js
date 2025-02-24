const express = require('express');
const router = express.Router();

// Other routes (not admin)
router.get('/', (req, res) => {
    res.render('index', { currentRoute: '/' });
});

// ... other non-admin routes

module.exports = router; 