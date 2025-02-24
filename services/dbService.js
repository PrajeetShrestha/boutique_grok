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

// Product-related operations
function getAllProducts() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function getProductsWithPagination(limit, offset) {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            const totalCount = row.count;

            db.all('SELECT * FROM products LIMIT ? OFFSET ?', [limit, offset], (err, products) => {
                if (err) reject(err);
                else resolve({ products, totalCount });
            });
        });
    });
}

function getProductById(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function createProduct(name, price, primaryImg, images, color, fabric, description) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO products (name, price, primaryImg, images, color, fabric, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, price, primaryImg, JSON.stringify(images), color, fabric, description],
            function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
}

function updateProduct(id, name, price, primaryImg, images, color, fabric, description) {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE products SET ';
        const params = [];
        const updates = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        if (price) {
            updates.push('price = ?');
            params.push(price);
        }
        if (primaryImg) {
            updates.push('primaryImg = ?');
            params.push(primaryImg);
        }
        if (images) {
            updates.push('images = ?');
            params.push(JSON.stringify(images));
        }
        if (color) {
            updates.push('color = ?');
            params.push(color);
        }
        if (fabric) {
            updates.push('fabric = ?');
            params.push(fabric);
        }
        if (description) {
            updates.push('description = ?');
            params.push(description);
        }

        sql += updates.join(', ') + ' WHERE id = ?';
        params.push(id);

        db.run(sql, params, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// Order-related operations
function getAllOrders() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM orders ORDER BY orderDate DESC', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function createOrder(orderData) {
    return new Promise((resolve, reject) => {
        const { customer, unit, blouse, lehenga, orderDate } = orderData;
        const measurements = JSON.stringify({ blouse, lehenga });
        
        db.run(
            'INSERT INTO orders (fullName, address, deliveryDate, unit, measurements, orderDate) VALUES (?, ?, ?, ?, ?, ?)',
            [customer.fullName, customer.address, customer.deliveryDate, unit, measurements, orderDate],
            function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
}

const dbService = {
    db,
    initializeDatabase,
    getAllProducts,
    getProductsWithPagination,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    createOrder
};

module.exports = dbService;