// Replace the complex registerUser function with this simpler version
registerUser: async (req, res) => {
    try {
        const { full_name, email, password, country_id, gender, referral_source, security_question, security_answer } = req.body;
        
        // Basic validation
        if (!full_name || !email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }

        // Check if user exists
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Simple insert - let the database handle defaults
        const [result] = await pool.query(
            `INSERT INTO users (full_name, email, password, country_id, gender, referral_source, security_question, security_answer_hash) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [full_name, email, hashedPassword, country_id || null, gender || null, referral_source || null, security_question || null, security_answer ? await bcrypt.hash(security_answer, 10) : null]
        );

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET || 'secretkey');
        
        res.json({ 
            message: 'Success', 
            token,
            user: { id: result.insertId, full_name, email }
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: error.message });
    }
},