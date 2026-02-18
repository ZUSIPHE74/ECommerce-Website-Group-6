import pool from './config/database.js';

(async () => {
    try {
        console.log('Adding gender column...');
        await pool.query('ALTER TABLE users ADD COLUMN gender VARCHAR(20)');
        console.log('Gender column added.');
    } catch (e) {
        console.log('Gender column might already exist:', e.message);
    }

    try {
        console.log('Adding referral_source column...');
        await pool.query('ALTER TABLE users ADD COLUMN referral_source VARCHAR(50)');
        console.log('Referral source column added.');
    } catch (e) {
        console.log('Referral source column might already exist:', e.message);
    }

    process.exit(0);
})();
