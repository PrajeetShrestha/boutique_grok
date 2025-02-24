const dbService = require('../services/dbService');

async function addStatusColumn() {
    try {
        await new Promise((resolve, reject) => {
            dbService.db.run(`
                ALTER TABLE orders 
                ADD COLUMN status TEXT DEFAULT 'pending'
            `, (err) => {
                if (err) {
                    // Column might already exist
                    console.log('Status column might already exist:', err.message);
                    resolve();
                } else {
                    console.log('Added status column successfully');
                    resolve();
                }
            });
        });

        // Update existing orders to have 'pending' status
        await new Promise((resolve, reject) => {
            dbService.db.run(`
                UPDATE orders 
                SET status = 'pending' 
                WHERE status IS NULL
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

addStatusColumn(); 