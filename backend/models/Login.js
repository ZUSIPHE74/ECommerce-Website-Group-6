import pool from '../config/database.js';

const User = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
          u.user_id, 
          u.user_id AS id, 
          u.full_name, 
          u.email, 
          u.password, 
          u.role, 
          u.country_id, 
          u.currency_code, 
          u.gender, 
          u.referral_source,
          u.security_question,
          u.security_answer_hash,
          u.created_at,
          c.country_name,
          c.country_code,
          cur.currency_symbol,
          cur.currency_name
        FROM users u 
        LEFT JOIN countries c ON u.country_id = c.country_id
        LEFT JOIN currencies cur ON u.currency_code = cur.currency_code
        WHERE u.email = ?`,
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  },

  // Create new user
  create: async (userData) => {
    const { 
      full_name, 
      email, 
      password, 
      role = 'user', 
      country_id, 
      currency_code, 
      gender, 
      referral_source, 
      security_question, 
      security_answer_hash 
    } = userData;

    try {
      const [result] = await pool.query(
        `INSERT INTO users 
         (full_name, email, password, role, country_id, currency_code, gender, referral_source, security_question, security_answer_hash) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          full_name, 
          email, 
          password, 
          role, 
          country_id || null, 
          currency_code || null, 
          gender || null, 
          referral_source || null, 
          security_question || null, 
          security_answer_hash || null
        ]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error in create:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('User with this email already exists');
      }
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new Error('Invalid country_id or currency_code reference');
      }
      
      throw error;
    }
  },

  // Find user by ID - FIXED JOIN CONDITION
  findById: async (id) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
          u.user_id, 
          u.user_id AS id, 
          u.full_name, 
          u.email, 
          u.role, 
          u.created_at, 
          u.country_id, 
          u.currency_code, 
          u.gender, 
          u.referral_source,
          u.security_question,
          c.country_name,
          c.country_code,
          cur.currency_symbol,
          cur.currency_name
        FROM users u 
        LEFT JOIN countries c ON u.country_id = c.country_id
        LEFT JOIN currencies cur ON u.currency_code = cur.currency_code
        WHERE u.user_id = ?`,
        [id]
      );
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    const { 
      full_name, 
      email, 
      country_id, 
      currency_code, 
      gender,
      referral_source
    } = userData;

    try {
      const [result] = await pool.query(
        `UPDATE users 
         SET full_name = ?, 
             email = ?, 
             country_id = ?, 
             currency_code = ?, 
             gender = ?,
             referral_source = ?
         WHERE user_id = ?`,
        [
          full_name, 
          email, 
          country_id || null, 
          currency_code || null, 
          gender || null,
          referral_source || null,
          id
        ]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in update:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new Error('Invalid country_id or currency_code reference');
      }
      
      throw error;
    }
  },

  // Update password only
  updatePassword: async (userId, hashedPassword) => {
    try {
      const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in updatePassword:', error);
      throw error;
    }
  },

  // Update security question and answer
  updateSecurityQuestion: async (userId, security_question, security_answer_hash) => {
    try {
      const [result] = await pool.query(
        'UPDATE users SET security_question = ?, security_answer_hash = ? WHERE user_id = ?',
        [security_question, security_answer_hash, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in updateSecurityQuestion:', error);
      throw error;
    }
  },

  // Verify security answer
  verifySecurityAnswer: async (userId) => {
    try {
      const [rows] = await pool.query(
        'SELECT security_answer_hash FROM users WHERE user_id = ?',
        [userId]
      );
      
      if (rows.length === 0 || !rows[0].security_answer_hash) {
        return null;
      }
      
      return rows[0].security_answer_hash;
    } catch (error) {
      console.error('Error in verifySecurityAnswer:', error);
      throw error;
    }
  },

  // Get user with security question (for password reset)
  findByEmailWithSecurity: async (email) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
          user_id, 
          email, 
          security_question,
          security_answer_hash
        FROM users 
        WHERE email = ?`,
        [email]
      );
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findByEmailWithSecurity:', error);
      throw error;
    }
  },

  // Check if user exists
  exists: async (email) => {
    try {
      const [rows] = await pool.query(
        'SELECT 1 FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      
      return rows.length > 0;
    } catch (error) {
      console.error('Error in exists:', error);
      throw error;
    }
  },

  // Get all users (admin only)
  findAll: async () => {
    try {
      const [rows] = await pool.query(
        `SELECT 
          user_id, 
          full_name, 
          email, 
          role, 
          country_id, 
          currency_code, 
          gender, 
          referral_source,
          created_at 
        FROM users 
        ORDER BY created_at DESC`
      );
      
      return rows;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  },

  // Delete user (admin only)
  delete: async (userId) => {
    try {
      const [result] = await pool.query(
        'DELETE FROM users WHERE user_id = ?',
        [userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
};

export default User;