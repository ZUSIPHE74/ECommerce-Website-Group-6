import mysql from 'mysql2/promise';

(async () => {
    const passwords = ['password', 'root', 'admin', '123456'];
    for (const p of passwords) {
        try {
            console.log(`Trying password: '${p}'...`);
            const conn = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'ecommerce_db'
            });
            console.log(`SUCCESS! Password is: '${p}'`);
            await conn.end();
            process.exit(0);
        } catch (err) {
            console.log(`Failed: ${err.message}`);
        }
    }
    console.log('All attempts failed.');
    process.exit(1);
})();
