// Simple recovery system
let isDBHealthy = true;
let lastCheck = Date.now();

export async function healthCheck(req, res, next) {
    // Check every 5 minutes
    if (Date.now() - lastCheck > 300000) {
        try {
            await pool.query('SELECT 1');
            isDBHealthy = true;
        } catch (err) {
            isDBHealthy = false;
            console.error('⚠️ Database issue detected');
        }
        lastCheck = Date.now();
    }
    
    if (!isDBHealthy) {
        return res.status(503).json({ 
            message: 'System under maintenance, please try again in a few minutes',
            retryAfter: 30 
        });
    }
    
    next();
}

// Use in your routes
// router.use(healthCheck);