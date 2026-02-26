import mysql from 'mysql2/promise';

const configs = [
    { host: 'localhost', port: 3306, user: 'root', password: '' },
    { host: '127.0.0.1', port: 3306, user: 'root', password: '' },
    { host: 'localhost', port: 3307, user: 'root', password: '' },
    { host: '127.0.0.1', port: 3307, user: 'root', password: '' },
    { host: 'localhost', port: 3307, user: 'root', password: '8Everly@' },
    { host: '127.0.0.1', port: 3307, user: 'root', password: '8Everly@' },
];

async function testConfigs() {
    for (const config of configs) {
        try {
            console.log(`Trying config: ${JSON.stringify(config)}`);
            const connection = await mysql.createConnection(config);
            console.log('✅ SUCCESS!');
            await connection.end();
            return;
        } catch (error) {
            console.error(`❌ FAILED: ${error.message}`);
        }
    }
}

testConfigs();
