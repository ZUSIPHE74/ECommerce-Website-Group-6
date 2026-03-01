import http from 'http';

http.get('http://localhost:5050/api/products', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers, null, 2));
        try {
            const json = JSON.parse(data);
            console.log('Response JSON:', JSON.stringify(json, null, 2).substring(0, 500) + '...');
        } catch (e) {
            console.log('Raw Data:', data);
        }
    });
}).on('error', (err) => {
    console.log('Error:', err.message);
});
