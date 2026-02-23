import fetch from 'node-fetch';

const API_URL = 'http://localhost:5050/api';

async function testAuth() {
    const email = `test_${Date.now()}@example.com`;
    console.log(`Testing with email: ${email}`);

    try {
        // 1. Test Registration
        const regResponse = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: 'Test User',
                email: email,
                password: 'password123',
                country_id: 1, // South Africa
                currency_code: 'ZAR',
                gender: 'Male',
                referral_source: 'Friend'
            })
        });

        const regData = await regResponse.json();
        console.log('Registration Response:', JSON.stringify(regData, null, 2));

        if (!regResponse.ok) throw new Error('Registration failed');
        if (!regData.user.country_id || regData.user.id === undefined) throw new Error('Missing user data in reg response');

        // 2. Test Login
        const loginResponse = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: 'password123'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Login Response:', JSON.stringify(loginData, null, 2));

        if (!loginResponse.ok) throw new Error('Login failed');
        if (loginData.user.id === undefined && loginData.user.user_id === undefined) {
            throw new Error('Missing ID in login response');
        }
        if (loginData.user.country_id === undefined) {
            throw new Error('Missing country_id in login response');
        }

        console.log('✅ API verification successful!');
    } catch (error) {
        console.error('❌ API verification failed:', error.message);
    }
}

testAuth();
