import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.USER || 'root',
  password: process.env.PASSWORD || '',
  multipleStatements: true
};

async function initDB() {
  try {
    console.log(`Connecting to MySQL on ${dbConfig.host}:${dbConfig.port}...`);
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL.');

    const sqlPath = path.join(__dirname, 'Dump.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing Dump.sql...');
    await connection.query(sql);
    console.log('Dump.sql executed successfully.');

    await connection.end();
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
}

initDB();
