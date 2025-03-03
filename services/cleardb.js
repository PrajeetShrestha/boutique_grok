const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to your SQLite database
const dbPath = path.join(__dirname, '..', 'app/data', 'boutique.db');

// Function to delete all data from a specified table
function deleteAllDataFromTable(tableName) {
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
        db.run(`DELETE FROM ${tableName}`, function(err) {
            if (err) {
                console.error(`Error deleting data from ${tableName}:`, err.message);
            } else {
                console.log(`All data deleted from ${tableName}`);
            }
        });

        // Optionally, reset the auto-increment counter
        db.run(`DELETE FROM sqlite_sequence WHERE name='${tableName}'`, function(err) {
            if (err) {
                console.error(`Error resetting auto-increment counter for ${tableName}:`, err.message);
            } else {
                console.log(`Auto-increment counter reset for ${tableName}`);
            }
        });
    });

    db.close();
}

// Specify the table name you want to delete data from
const tableName = 'orders'; // Change this to your table name

deleteAllDataFromTable(tableName);