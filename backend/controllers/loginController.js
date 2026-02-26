import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/Login.js';
import pool from '../config/database.js';
import countries from '../data/countries.js';
const countryById = new Map(countries.map(c => [Number(c.id), c]));
const countryByCurrency = new Map();
for (const c of countries) {
    if (!countryByCurrency.has(c.currency_code)) {
        countryByCurrency.set(c.currency_code, c);
    }
}

async function resolveCountryReference(countryId) {
    const country = countryById.get(Number(countryId));
    if (!country) return null;

    const currencyCode = country.currency_code;
    const currencyName = currencyCode;
    const currencySymbol = currencyCode;

    try {
        await pool.query(
            `INSERT INTO currencies (currency_code, currency_name, currency_symbol)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE currency_code = currency_code`,
            [currencyCode, currencyName, currencySymbol]
        );
    } catch (_) {
        // Continue; DB may already contain this currency or schema may differ.
    }

    try {
        const [rows] = await pool.query(
            'SELECT id FROM countries WHERE country_code = ? LIMIT 1',
            [country.country_code]
        );
        if (rows && rows[0]?.id) {
            return { id: Number(rows[0].id), currency_code: currencyCode };
        }
    } catch (_) {
        // Continue to insert attempt.
    }

    const [insertResult] = await pool.query(
        'INSERT INTO countries (country_name, country_code, currency_code) VALUES (?, ?, ?)',
        [country.country_name, country.country_code, country.currency_code]
    );
    return { id: Number(insertResult.insertId), currency_code: currencyCode };
}

async function ensureSecurityColumns() {
    const addColumn = async (ddl) => {
        try {
            await pool.query(ddl);
        } catch (error) {
            if (error?.code !== 'ER_DUP_FIELDNAME') {
                throw error;
            }
        }
    };

    await addColumn('ALTER TABLE users ADD COLUMN security_question VARCHAR(200) NULL');
    await addColumn('ALTER TABLE users ADD COLUMN security_answer_hash VARCHAR(255) NULL');
}

const loginController = {
    registerUser: async (req, res) => {
        try {
            const body = req.body || {};
            const { full_name, email, password, country_id, currency_code, gender, referral_source, security_question, security_answer } = body;
            const normalizedEmail = String(email || '').trim().toLowerCase();
            const normalizedName = String(full_name || '').trim();
            const resolvedCountry = await resolveCountryReference(country_id);
            const normalizedCountryId = resolvedCountry?.id || null;
            const resolvedCurrencyCode = resolvedCountry?.currency_code || null;

            if (!normalizedName || !normalizedEmail || !password) {
                return res.status(400).json({ message: 'Full name, email, and password are required.' });
            }
            if (!normalizedCountryId) {
                return res.status(400).json({ message: 'Country is required.' });
            }

            const existingUser = await User.findByEmail(normalizedEmail);
            if (existingUser) return res.status(400).json({ message: 'User already exists' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const normalizedQuestion = String(security_question || '').trim();
            const normalizedAnswer = String(security_answer || '').trim();
            const hasRecoveryPair = Boolean(normalizedQuestion && normalizedAnswer);
            if (hasRecoveryPair) {
                await ensureSecurityColumns();
            }
            const answerHash = hasRecoveryPair
                ? await bcrypt.hash(normalizedAnswer, await bcrypt.genSalt(10))
                : null;

            const userId = await User.create({
                full_name: normalizedName,
                email: normalizedEmail,
                password: hashedPassword,
                country_id: normalizedCountryId,
                currency_code: resolvedCurrencyCode,
                gender,
                referral_source,
                security_question: hasRecoveryPair ? normalizedQuestion : null,
                security_answer_hash: answerHash
            });

            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secretkey', {
                expiresIn: '1h'
            });

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: userId,
                    full_name: normalizedName,
                    email: normalizedEmail,
                    country_id: normalizedCountryId,
                    currency_code: resolvedCurrencyCode
                }
            });
        } catch (error) {
            console.error('Register Error:', error);
            if (error?.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ message: 'Country configuration is invalid. Please choose another country.' });
            }
            res.status(500).json({
                message: error?.message || 'Server error',
                code: error?.code || 'UNKNOWN'
            });
        }
    },

    loginUser: async (req, res) => {
        try {
            const body = req.body || {};
            const { email, password } = body;
            const normalizedEmail = String(email || '').trim().toLowerCase();

            if (!normalizedEmail || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

            const user = await User.findByEmail(normalizedEmail);
            if (!user) return res.status(400).json({ message: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const resolvedCountry = countryById.get(Number(user.country_id)) || countryByCurrency.get(user.currency_code) || null;
            const resolvedCountryId = user.country_id ?? (resolvedCountry ? resolvedCountry.id : null);
            const resolvedCurrencyCode = user.currency_code || (resolvedCountry ? resolvedCountry.currency_code : null);

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secretkey', {
                expiresIn: '1h'
            });

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    country_id: resolvedCountryId,
                    currency_code: resolvedCurrencyCode
                }
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
            res.json(countries);
        } catch (error) {
            console.error('Countries Error:', error);
            res.status(200).json(countries);
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
            const resolvedCountry = await resolveCountryReference(country_id);
            const normalizedCountryId = resolvedCountry?.id || null;
            if (!normalizedCountryId) {
                return res.status(400).json({ message: 'Country is required.' });
            }
            const resolvedCurrencyCode = resolvedCountry?.currency_code || null;
            const updated = await User.update(req.user.id, { full_name, email, country_id: normalizedCountryId, currency_code: resolvedCurrencyCode, gender });
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
            const { email } = req.body || {};
            const normalizedEmail = String(email || '').trim().toLowerCase();
            if (!normalizedEmail) {
                return res.status(400).json({ message: 'Email is required' });
            }
            const user = await User.findByEmail(normalizedEmail);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'Password reset link sent to your email.' });
        } catch (error) {
            console.error('Forgot Password Error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    resetPasswordSecurity: async (req, res) => {
        try {
            await ensureSecurityColumns();
            const body = req.body || {};
            const { email, security_question, security_answer, new_password } = body;
            const normalizedEmail = String(email || '').trim().toLowerCase();
            const normalizedQuestion = String(security_question || '').trim();
            const normalizedAnswer = String(security_answer || '').trim();

            if (!normalizedEmail || !normalizedQuestion || !normalizedAnswer || !new_password) {
                return res.status(400).json({ message: 'Email, security question, security answer, and new password are required.' });
            }

            let rows;
            try {
                [rows] = await pool.query(
                    'SELECT user_id, id, security_answer_hash FROM users WHERE email = ? AND security_question = ? LIMIT 1',
                    [normalizedEmail, normalizedQuestion]
                );
            } catch (error) {
                if (error?.code !== 'ER_BAD_FIELD_ERROR') {
                    throw error;
                }
                [rows] = await pool.query(
                    'SELECT id, id AS user_id, security_answer_hash FROM users WHERE email = ? AND security_question = ? LIMIT 1',
                    [normalizedEmail, normalizedQuestion]
                );
            }

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'User not found with provided details.' });
            }

            if (!rows[0].security_answer_hash) {
                return res.status(400).json({ message: 'Security recovery is not configured for this account.' });
            }

            const answerMatch = await bcrypt.compare(normalizedAnswer, rows[0].security_answer_hash);
            if (!answerMatch) {
                return res.status(400).json({ message: 'Security answer is incorrect.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(new_password, salt);

            const userPk = rows[0].user_id ?? rows[0].id;
            try {
                await pool.query(
                    'UPDATE users SET password = ? WHERE user_id = ?',
                    [hashedPassword, userPk]
                );
            } catch (error) {
                if (error?.code !== 'ER_BAD_FIELD_ERROR') {
                    throw error;
                }
                await pool.query(
                    'UPDATE users SET password = ? WHERE id = ?',
                    [hashedPassword, userPk]
                );
            }

            res.json({ message: 'Password reset successfully. You can now sign in.' });
        } catch (error) {
            console.error('Reset Password Security Error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    verifySecurityAnswer: async (req, res) => {
        try {
            await ensureSecurityColumns();
            const body = req.body || {};
            const { email, security_question, security_answer } = body;
            const normalizedEmail = String(email || '').trim().toLowerCase();
            const normalizedQuestion = String(security_question || '').trim();
            const normalizedAnswer = String(security_answer || '').trim();

            if (!normalizedEmail || !normalizedQuestion || !normalizedAnswer) {
                return res.status(400).json({ message: 'Email, security question and security answer are required.' });
            }

            const [rows] = await pool.query(
                'SELECT security_answer_hash FROM users WHERE email = ? AND security_question = ? LIMIT 1',
                [normalizedEmail, normalizedQuestion]
            );

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'User not found with provided details.' });
            }

            if (!rows[0].security_answer_hash) {
                return res.status(400).json({ message: 'Security recovery is not configured for this account.' });
            }

            const answerMatch = await bcrypt.compare(normalizedAnswer, rows[0].security_answer_hash);
            if (!answerMatch) {
                return res.status(400).json({ message: 'Security answer is incorrect.' });
            }

            res.json({ message: 'Answer verified. You can reset your password now.' });
        } catch (error) {
            console.error('Verify Security Answer Error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

export default loginController;
