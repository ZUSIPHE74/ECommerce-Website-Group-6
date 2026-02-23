import pool from '../config/database.js';

class Product {
  // Get all products
  static async findAll() {
    const [rows] = await pool.query(`
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.created_at,
        c.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.created_at DESC
    `);
    return rows;
  }

  // Find product by ID
  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.created_at,
        c.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [id]);
    return rows[0];
  }

  // Create new product
  static async create(productData) {
    const { name, description, price, category_id, stock } = productData;
    
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category_id, stock) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category_id, stock || 0]
    );
    
    return result.insertId;
  }

  // Update product
  static async update(id, productData) {
    const { name, description, price, category_id, stock } = productData;
    
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, stock = ? WHERE product_id = ?',
      [name, description, price, category_id, stock, id]
    );
    
    return result.affectedRows > 0;
  }

  // Delete product
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE product_id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get products by category ID
  static async findByCategoryId(categoryId) {
    const [rows] = await pool.query(`
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.created_at,
        c.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.category_id = ?
      ORDER BY p.created_at DESC
    `, [categoryId]);
    return rows;
  }

  // Get products by category name
  static async findByCategoryName(categoryName) {
    const [rows] = await pool.query(`
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.created_at,
        c.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE LOWER(c.name) = LOWER(?)
      ORDER BY p.created_at DESC
    `, [categoryName]);
    return rows;
  }

  // Search products
  static async search(query) {
    const [rows] = await pool.query(`
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.created_at,
        c.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.name LIKE ? OR p.description LIKE ?
      ORDER BY p.created_at DESC
    `, [`%${query}%`, `%${query}%`]);
    return rows;
  }

  // Check if product is in stock
  static async checkStock(productId, quantity = 1) {
    const [rows] = await pool.query(
      'SELECT stock FROM products WHERE product_id = ?',
      [productId]
    );
    
    if (rows.length === 0) return false;
    return rows[0].stock >= quantity;
  }

  // Update stock after purchase
  static async updateStock(productId, quantity) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [rows] = await connection.query(
        'SELECT stock FROM products WHERE product_id = ? FOR UPDATE',
        [productId]
      );
      
      if (rows.length === 0 || rows[0].stock < quantity) {
        await connection.rollback();
        return false;
      }
      
      const [result] = await connection.query(
        'UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?',
        [quantity, productId, quantity]
      );
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get low stock products
  static async findLowStock(threshold = 10) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE stock <= ? ORDER BY stock ASC',
      [threshold]
    );
    return rows;
  }

  // Get featured products
  static async findFeatured(limit = 6) {
    const [rows] = await pool.query(`
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.created_at,
        c.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.created_at DESC
      LIMIT ?
    `, [limit]);
    return rows;
  }

  // Get all categories
  static async getAllCategories() {
    const [rows] = await pool.query('SELECT category_id, name FROM categories ORDER BY name');
    return rows;
  }
}

export default Product;