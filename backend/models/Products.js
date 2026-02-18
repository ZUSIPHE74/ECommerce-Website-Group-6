import pool from '../config/database.js';

class Product {
  // Get all products
  static async findAll() {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    return rows;
  }

  // Find product by ID
  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  // Create new product
  static async create(productData) {
    const { name, description, price_usd, category_id, image_url, stock } = productData;
    
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price_usd, category_id, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price_usd, category_id, image_url || null, stock || 0]
    );
    
    return result.insertId;
  }

  // Update product
  static async update(id, productData) {
    const { name, description, price_usd, category_id, image_url, stock } = productData;
    
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price_usd = ?, category_id = ?, image_url = ?, stock = ? WHERE id = ?',
      [name, description, price_usd, category_id, image_url, stock, id]
    );
    
    return result.affectedRows > 0;
  }

  // Delete product
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get products by category
  static async findByCategory(categoryId) {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
      ORDER BY p.created_at DESC
    `, [categoryId]);
    return rows;
  }

  // Search products
  static async search(query) {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name LIKE ? OR p.description LIKE ?
      ORDER BY p.created_at DESC
    `, [`%${query}%`, `%${query}%`]);
    return rows;
  }

  // Get products with reviews
  static async findWithReviews() {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id, c.id, c.name
      ORDER BY p.created_at DESC
    `);
    return rows;
  }

  // Check if product is in stock
  static async checkStock(productId, quantity = 1) {
    const [rows] = await pool.query(
      'SELECT stock FROM products WHERE id = ?',
      [productId]
    );
    
    if (rows.length === 0) return false;
    return rows[0].stock >= quantity;
  }

  // Update stock after purchase
  static async updateStock(productId, quantity) {
    const [result] = await pool.query(
      'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
      [quantity, productId, quantity]
    );
    
    return result.affectedRows > 0;
  }

  // Get low stock products
  static async findLowStock(threshold = 10) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE stock <= ? ORDER BY stock ASC',
      [threshold]
    );
    return rows;
  }

  // Get featured products (newest or highest rated)
  static async findFeatured(limit = 6) {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC, average_rating DESC
      LIMIT ?
    `, [limit]);
    return rows;
  }
}

export default Product;