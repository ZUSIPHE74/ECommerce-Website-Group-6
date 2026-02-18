import pool from './config/database.js';

(async () => {
    try {
        console.log('Checking Users Table...');
        const [usersFromDesc] = await pool.query('DESCRIBE users');
        const columns = usersFromDesc.map(col => col.Field);
        console.log('User Columns:', columns);

        console.log('Checking Countries...');
        const [countries] = await pool.query('SELECT * FROM countries LIMIT 1');
        console.log('First Country:', countries[0]);

        console.log('Checking Currencies...');
        const [currencies] = await pool.query('SELECT * FROM currencies LIMIT 1');
        console.log('First Currency:', currencies[0]);

        process.exit(0);
    } catch (e) {
        console.error('DB Check Failed:', e);
        process.exit(1);
    }
})();
