import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const loginController = {
    registerUser: async (req, res) => {
        try {
            const { full_name, email, password, country_id, currency_code, gender, referral_source, security_question, security_answer } = req.body;

            if (!full_name || !email || !password) {
                return res.status(400).json({ success: false, message: 'All fields required' });
            }

            const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const hashedAnswer = security_answer ? await bcrypt.hash(security_answer, 10) : null;

            const [result] = await pool.query(
                `INSERT INTO users (full_name, email, password, country_id, currency_code, gender, referral_source, security_question, security_answer_hash) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, email, hashedPassword, country_id || null, currency_code || null, gender || null, referral_source || null, security_question || null, hashedAnswer]
            );

            const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET || 'secretkey');

            res.json({
                success: true,
                message: 'Registration successful',
                token,
                user: {
                    id: result.insertId,
                    full_name,
                    email,
                    country_id: country_id || null,
                    currency_code: currency_code || null,
                    gender: gender || null,
                    referral_source: referral_source || null
                }
            });
        } catch (error) {
            console.error('Register Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

            if (users.length === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const user = users[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET || 'secretkey');

            res.json({
                success: true,
                token,
                user: {
                    id: user.user_id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    country_id: user.country_id,
                    currency_code: user.currency_code,
                    gender: user.gender
                }
            });
        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getUserProfile: async (req, res) => {
        try {
            const [users] = await pool.query('SELECT user_id, full_name, email, role, country_id, currency_code, gender FROM users WHERE user_id = ?', [req.user.id]);
            if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
            res.json(users[0]);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateUserProfile: async (req, res) => {
        try {
            const { full_name, email, country_id, gender } = req.body;
            await pool.query(
                'UPDATE users SET full_name = ?, email = ?, country_id = ?, gender = ? WHERE user_id = ?',
                [full_name, email, country_id, gender, req.user.id]
            );
            res.json({ success: true, message: 'Profile updated' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const [users] = await pool.query('SELECT security_question FROM users WHERE email = ?', [email]);
            if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
            res.json({ success: true, security_question: users[0].security_question });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    verifySecurityAnswer: async (req, res) => {
        try {
            const { email, answer } = req.body;
            const [users] = await pool.query('SELECT security_answer_hash FROM users WHERE email = ?', [email]);
            if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

            const isMatch = await bcrypt.compare(answer, users[0].security_answer_hash);
            if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect answer' });

            res.json({ success: true, message: 'Answer verified' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    resetPasswordSecurity: async (req, res) => {
        try {
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
            res.json({ success: true, message: 'Password reset successful' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getCountries: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM countries ORDER BY country_name');
            res.json({ success: true, data: rows });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getCurrencies: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM currencies ORDER BY currency_code');
            res.json({ success: true, data: rows });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

export default loginController;