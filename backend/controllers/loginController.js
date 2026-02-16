import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/Login.js';
import pool from '../config/database.js';

const loginController = {
    registerUser: async (req, res) => {
        try {
            const { full_name, email, password, country_id, currency_code, gender, referral_source } = req.body;

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const userId = await User.create({
                full_name,
                email,
                password: hashedPassword,
                country_id,
                currency_code,
                gender,
                referral_source
            });

            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secretkey', {
                expiresIn: '1h'
            });

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: { id: userId, full_name, email }
            });
        } catch (error) {
            console.error('Register Error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secretkey', {
                expiresIn: '1h'
            });

            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, full_name: user.full_name, email: user.email }
            });
        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getUserProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Profile Error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getCountries: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM countries ORDER BY country_name ASC');
            res.json(rows);
        } catch (error) {
            console.error('Countries Error:', error);
            res.status(500).json({ message: 'Server error fetching countries', error: error.message });
        }
    },

    getCurrencies: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM currencies');
            res.json(rows);
        } catch (error) {
            console.error('Currencies Error:', error);
            res.status(500).json({ message: 'Server error fetching currencies', error: error.message });
        }
    },

    updateUserProfile: async (req, res) => {
        try {
            const { full_name, email, country_id, currency_code, gender } = req.body;
            const updated = await User.update(req.user.id, { full_name, email, country_id, currency_code, gender });
            if (updated) {
                res.json({ message: 'Profile updated successfully' });
            } else {
                res.status(400).json({ message: 'Update failed' });
            }
        } catch (error) {
            console.error('Update Profile Error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'Password reset link sent to your email.' });
        } catch (error) {
            console.error('Forgot Password Error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

export default loginController;
