const sqlite3 = require('sqlite3')
const path = require('path');

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
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Orders table created or already exists');
            }
            db.close();
        });
    }
});