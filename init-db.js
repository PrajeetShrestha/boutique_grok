const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'app/data', 'boutique.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        
        // Create orders table
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
            if (err) {
                console.error('Error creating orders table:', err.message);
                return;
            }
            console.log('Orders table created or already exists');

            // Create products table
            db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                img TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Error creating products table:', err.message);
                    return;
                }
                console.log('Products table created or already exists');

                // Insert seed data for products
                const products = [
                    { name: "Silk Lehenga", category: "dresses", price: 299.99, img: "images/lehenga1.jpg" },
                    { name: "Designer Blouse", category: "tops", price: 89.99, img: "images/blouse1.jpg" },
                    { name: "Bridal Lehenga", category: "dresses", price: 599.99, img: "images/lehenga2.jpg" },
                    { name: "Embroidered Blouse", category: "tops", price: 129.99, img: "images/blouse2.jpg" },
                    { name: "Traditional Lehenga", category: "dresses", price: 349.99, img: "images/lehenga3.jpg" },
                    { name: "Party Wear Blouse", category: "tops", price: 149.99, img: "images/blouse3.jpg" }
                ];

                // Clear existing products
                db.run('DELETE FROM products', [], (err) => {
                    if (err) {
                        console.error('Error clearing products table:', err.message);
                        return;
                    }

                    // Insert new products
                    const stmt = db.prepare('INSERT INTO products (name, category, price, img) VALUES (?, ?, ?, ?)');
                    products.forEach(product => {
                        stmt.run([product.name, product.category, product.price, product.img], (err) => {
                            if (err) console.error('Error inserting product:', err.message);
                        });
                    });
                    stmt.finalize();
                    console.log('Seed data inserted successfully');
                    db.close();
                });
            });
        });
    }
});