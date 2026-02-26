import fs from 'fs';
import pool from './config/database.js';

// Simple backup function
async function backupDatabase() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup-${timestamp}.sql`;
    
    try {
        // Get all tables
        const [tables] = await pool.query('SHOW TABLES');
        
        let sql = '';
        
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            
            // Get create table statement
            const [create] = await pool.query(`SHOW CREATE TABLE ${tableName}`);
            sql += `${Object.values(create[0])[1]};\n\n`;
            
            // Get data
            const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
            for (const row of rows) {
                const values = Object.values(row).map(v => 
                    v === null ? 'NULL' : `'${String(v).replace(/'/g, "\\'")}'`
                ).join(', ');
                sql += `INSERT INTO ${tableName} VALUES (${values});\n`;
            }
            sql += '\n';
        }
        
        fs.writeFileSync(backupFile, sql);
        console.log(` Backup created: ${backupFile}`);
        return backupFile;
    } catch (error) {
        console.error(' Backup failed:', error);
    }
}

// Auto backup every 6 hours if server is running
if (process.env.NODE_ENV === 'production') {
    setInterval(backupDatabase, 6 * 60 * 60 * 1000);
}

export { backupDatabase };