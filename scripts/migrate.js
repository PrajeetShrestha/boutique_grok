const dbService = require('../services/dbService');

async function runMigration() {
    try {
        await dbService.migrateDatabase();
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration(); 