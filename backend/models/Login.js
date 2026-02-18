import pool from '../config/database.js';

const User = {
  findByEmail: async (email) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  create: async (userData) => {
    const { full_name, email, password, role = 'user', country_id, currency_code, gender, referral_source } = userData;
    try {
      const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password, role, country_id, currency_code, gender, referral_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [full_name, email, password, role, country_id || null, currency_code || null, gender || null, referral_source || null]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT id, full_name, email, role, created_at, country_id, currency_code, gender, referral_source FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  update: async (id, userData) => {
    try {
      const { full_name, email, country_id, currency_code, gender } = userData;
      await pool.query(
        'UPDATE users SET full_name = ?, email = ?, country_id = ?, currency_code = ?, gender = ? WHERE id = ?',
        [full_name, email, country_id, currency_code, gender, id]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default User;
