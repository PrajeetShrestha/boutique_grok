const dbService = require('../services/dbService');

async function runMigrations() {
    try {
        console.log('Starting database migrations...');
        
        // Migrate orders table
        console.log('Migrating orders table...');
        await dbService.migrateOrdersTable();
        
        // Migrate products table if needed
        if (process.argv.includes('--with-products')) {
            console.log('Migrating products table...');
            await dbService.migrateDatabase();
        }
        
        console.log('All migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigrations(); 