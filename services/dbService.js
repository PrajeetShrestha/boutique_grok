const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'app/data', 'boutique.db');
const db = new sqlite3.Database(dbPath);

const productsData = [
    { id: 1, name: "Silk Dress", price: 89.99, primaryImg: "https://picsum.photos/id/1/300/533", images: JSON.stringify(["https://picsum.photos/id/2/300/533", "https://picsum.photos/id/3/300/533"]), color: "Red", fabric: "Silk", description: "Elegant silk dress perfect for evening wear." },
    // Add more initial data as needed
];

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Orders table (unchanged)
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
                    reject(err);
                } else {
                    console.log('Orders table created or already exists');
                }
            });

            // Updated Products table with multiple images
            db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                primaryImg TEXT NOT NULL,
                images TEXT NOT NULL, -- JSON array of additional image URLs
                color TEXT NOT NULL,
                fabric TEXT NOT NULL,
                description TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Error creating products table:', err.message);
                    reject(err);
                } else {
                    console.log('Products table created or already exists');
                    seedProducts();
                }
            });
        });
    });
}

function seedProducts() {
    db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
        if (err) {
            console.error('Error checking products count:', err.message);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding products table...');
            const stmt = db.prepare(`INSERT INTO products (id, name, price, primaryImg, images, color, fabric, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
            productsData.forEach(product => {
                stmt.run(
                    product.id,
                    product.name,
                    product.price,
                    product.primaryImg,
                    product.images,
                    product.color,
                    product.fabric,
                    product.description,
                    (err) => {
                        if (err) console.error('Error seeding product:', err.message);
                    }
                );
            });
            stmt.finalize((err) => {
                if (err) console.error('Error finalizing product seeding:', err.message);
                else console.log('Products table seeded with initial items');
            });
        } else {
            console.log('Products table already contains data, skipping seeding');
        }
    });
}

module.exports = {
    db,
    initializeDatabase
};