import pool from './config/database.js';
import axios from 'axios'; 

const BASE_URL = 'http://localhost:5050/api';

async function checkDatabase() {
    console.log('1. Checking Database Connection & Users Table...');
    try {
        const [rows] = await pool.query('DESCRIBE users');
        const fields = rows.map(r => r.Field);
        console.log('   Users table columns:', fields.join(', '));

        const required = ['email', 'password', 'full_name', 'country_id', 'gender'];
        const missing = required.filter(r => !fields.includes(r));

        if (missing.length > 0) {
            console.error('   ❌ MISSING COLUMNS:', missing.join(', '));
            return false;
        }
        console.log('   ✅ Users table structure is correct.');
        return true;
    } catch (err) {
        console.error('   ❌ Database Error:', err.message);
        console.error('   (Check your .env PASSWORD!)');
        return false;
    }
}

async function checkAPI() {
    console.log('\n2. Checking API Endpoints...');

    // Register
    const testUser = {
        full_name: 'Test Verification',
        email: `verify_${Date.now()}@example.com`,
        password: 'password123',
        gender: 'Male',
        country_id: 1, // Assuming US exists from seed
        currency_code: 'USD'
    };

    let token = '';

    try {
        // 2a. Register
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();

        if (regRes.ok) {
            console.log('   ✅ Register Route: Working');
            token = regData.token;
        } else {
            console.error('   ❌ Register Failed:', regData.message);
        }

        // 2b. Login
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });

        if (loginRes.ok) {
            console.log('   ✅ Login Route: Working');
            const loginData = await loginRes.json();
            token = loginData.token; // Update token
        } else {
            console.error('   ❌ Login Failed');
        }

        // 2c. Profile (Protect Middleware)
        if (token) {
            const profileRes = await fetch(`${BASE_URL}/user/profile`, {
                headers: { 'x-auth-token': token }
            });
            if (profileRes.ok) {
                console.log('   ✅ Protected Route & Middleware: Working');
            } else {
                console.error('   ❌ Profile Fetch Failed:', await profileRes.text());
            }

            // 2d. Profile Update
            const updateRes = await fetch(`${BASE_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ ...testUser, full_name: 'Updated Name' })
            });
            if (updateRes.ok) {
                console.log('   ✅ Profile Update: Working');
            } else {
                console.error('   ❌ Profile Update Failed');
            }
        }

        // 2e. Forgot Password
        const forgotRes = await fetch(`${BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email })
        });
        if (forgotRes.ok) {
            console.log('   ✅ Forgot Password Route: Working');
        } else {
            console.error('   ❌ Forgot Password Failed');
        }

    } catch (err) {
        console.error('   ❌ API verification failed. Is the server running?');
        console.error('   Error:', err.message);
    }
}

(async () => {
    console.log('--- STARTING SYSTEM VERIFICATION ---');
    const dbOk = await checkDatabase();
    if (dbOk) {
        await checkAPI();
    }
    console.log('--- END VERIFICATION ---');
    process.exit(0);
})();
