import pool from '../config/database.js';
const User = {
  findByEmail: async (email) => {
    try {
      try {
        const [rows] = await pool.query(
          'SELECT user_id AS id, user_id, full_name, email, password, role, country_id, currency_code, gender, referral_source, created_at FROM users WHERE email = ?',
          [email]
        );
        return rows[0];
      } catch (error) {
        if (error?.code !== 'ER_BAD_FIELD_ERROR') {
          throw error;
        }
        const [rows] = await pool.query(
          'SELECT id, id AS user_id, full_name, email, password, role, country_id, currency_code, gender, referral_source, created_at FROM users WHERE email = ?',
          [email]
        );
        return rows[0];
      }
    } catch (error) {
      throw error;
    }
  },

  create: async (userData) => {
    const { full_name, email, password, role = 'user', country_id, currency_code, gender, referral_source, security_question, security_answer_hash } = userData;
    try {
      const tryInsert = async (withSecurity, withCurrency, withCountry) => {
        const safeCountryId = withCountry ? (country_id || null) : null;
        const safeCurrencyCode = withCurrency ? (currency_code || null) : null;
        if (withSecurity) {
          const [result] = await pool.query(
            'INSERT INTO users (full_name, email, password, role, country_id, currency_code, gender, referral_source, security_question, security_answer_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [full_name, email, password, role, safeCountryId, safeCurrencyCode, gender || null, referral_source || null, security_question || null, security_answer_hash || null]
          );
          return result.insertId;
        }
        const [result] = await pool.query(
          'INSERT INTO users (full_name, email, password, role, country_id, currency_code, gender, referral_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [full_name, email, password, role, safeCountryId, safeCurrencyCode, gender || null, referral_source || null]
        );
        return result.insertId;
      };

      try {
        return await tryInsert(true, true, true);
      } catch (error) {
        if (error && error.code === 'ER_NO_SUCH_TABLE') {
          await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
              user_id INT AUTO_INCREMENT PRIMARY KEY,
              full_name VARCHAR(100) NOT NULL,
              email VARCHAR(150) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              role VARCHAR(20) DEFAULT 'user',
              country_id INT,
              currency_code VARCHAR(10),
              gender VARCHAR(20),
              referral_source VARCHAR(50),
              security_question VARCHAR(200),
              security_answer_hash VARCHAR(255),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
          );
          return await tryInsert(true, true, true);
        }
        if (error && error.code === 'ER_BAD_FIELD_ERROR') {
          try {
            return await tryInsert(false, true, true);
          } catch (err2) {
            if (err2 && err2.code === 'ER_NO_REFERENCED_ROW_2') {
              return await tryInsert(false, false, true);
            }
            if (err2 && err2.code === 'ER_NO_SUCH_TABLE') {
              await pool.query(
                `CREATE TABLE IF NOT EXISTS users (
                  user_id INT AUTO_INCREMENT PRIMARY KEY,
                  full_name VARCHAR(100) NOT NULL,
                  email VARCHAR(150) UNIQUE NOT NULL,
                  password VARCHAR(255) NOT NULL,
                  role VARCHAR(20) DEFAULT 'user',
                  country_id INT,
                  currency_code VARCHAR(10),
                  gender VARCHAR(20),
                  referral_source VARCHAR(50),
                  security_question VARCHAR(200),
                  security_answer_hash VARCHAR(255),
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
              );
              return await tryInsert(false, true, true);
            }
            throw err2;
          }
        }
        if (error && error.code === 'ER_NO_REFERENCED_ROW_2') {
          try {
            return await tryInsert(true, false, true);
          } catch (err2) {
            if (err2 && err2.code === 'ER_BAD_FIELD_ERROR') {
              return await tryInsert(false, false, true);
            }
            if (err2 && err2.code === 'ER_NO_SUCH_TABLE') {
              await pool.query(
                `CREATE TABLE IF NOT EXISTS users (
                  user_id INT AUTO_INCREMENT PRIMARY KEY,
                  full_name VARCHAR(100) NOT NULL,
                  email VARCHAR(150) UNIQUE NOT NULL,
                  password VARCHAR(255) NOT NULL,
                  role VARCHAR(20) DEFAULT 'user',
                  country_id INT,
                  currency_code VARCHAR(10),
                  gender VARCHAR(20),
                  referral_source VARCHAR(50),
                  security_question VARCHAR(200),
                  security_answer_hash VARCHAR(255),
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
              );
              return await tryInsert(true, false, true);
            }
            throw err2;
          }
        }
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      let rows;
      try {
        [rows] = await pool.query(
          `SELECT u.user_id AS id, u.user_id, u.full_name, u.email, u.role, u.created_at, u.country_id, u.currency_code, u.gender, u.referral_source,
                  c.country_name
           FROM users u 
           LEFT JOIN countries c ON c.id = u.country_id
           WHERE u.user_id = ?`,
          [id]
        );
      } catch (error) {
        if (error?.code !== 'ER_BAD_FIELD_ERROR') {
          throw error;
        }
        [rows] = await pool.query(
          `SELECT u.id, u.id AS user_id, u.full_name, u.email, u.role, u.created_at, u.country_id, u.currency_code, u.gender, u.referral_source,
                  c.country_name
           FROM users u 
           LEFT JOIN countries c ON c.id = u.country_id
           WHERE u.id = ?`,
          [id]
        );
      }
      if (!rows[0]) return rows[0];
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  update: async (id, userData) => {
    try {
      const { full_name, email, country_id, currency_code, gender } = userData;
      try {
        await pool.query(
          'UPDATE users SET full_name = ?, email = ?, country_id = ?, currency_code = ?, gender = ? WHERE user_id = ?',
          [full_name, email, country_id, currency_code, gender, id]
        );
      } catch (error) {
        if (error?.code !== 'ER_BAD_FIELD_ERROR') {
          if (error?.code === 'ER_NO_REFERENCED_ROW_2') {
            await pool.query(
              'UPDATE users SET full_name = ?, email = ?, country_id = ?, currency_code = NULL, gender = ? WHERE user_id = ?',
              [full_name, email, country_id, gender, id]
            );
            return true;
          }
          throw error;
        }
        try {
          await pool.query(
            'UPDATE users SET full_name = ?, email = ?, country_id = ?, currency_code = ?, gender = ? WHERE id = ?',
            [full_name, email, country_id, currency_code, gender, id]
          );
        } catch (fallbackError) {
          if (fallbackError?.code === 'ER_NO_REFERENCED_ROW_2') {
            await pool.query(
              'UPDATE users SET full_name = ?, email = ?, country_id = ?, currency_code = NULL, gender = ? WHERE id = ?',
              [full_name, email, country_id, gender, id]
            );
            return true;
          }
          throw fallbackError;
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default User;
