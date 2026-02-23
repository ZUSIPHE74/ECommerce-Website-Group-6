import pool from '../config/database.js';

const formatProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: parseFloat(product.price),
  oldPrice: null,
  onSale: false,
  category: product.category_name ? product.category_name.toLowerCase() : 'uncategorized',
  rating: Math.round(Number(product.average_rating) || 0),
  reviews: Number(product.review_count) || 0,
  image: product.image_url || '',
  stock: product.stock
});

const baseSelect = `
  SELECT
    p.id,
    p.name,
    p.description,
    p.price_usd AS price,
    p.image_url,
    p.stock,
    p.created_at,
    c.id AS category_id,
    c.name AS category_name,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    COUNT(DISTINCT r.id) AS review_count
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN reviews r ON p.id = r.product_id
`;

const groupBy = `
  GROUP BY
    p.id, p.name, p.description, p.price_usd, p.image_url, p.stock, p.created_at,
    c.id, c.name
`;

export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      ${baseSelect}
      ${groupBy}
      ORDER BY p.created_at DESC
    `);

    res.json({ success: true, data: rows.map(formatProduct) });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      ${baseSelect}
      WHERE p.id = ?
      ${groupBy}
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: formatProduct(rows[0]) });
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching product' });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const [rows] = await pool.query(`
      ${baseSelect}
      WHERE LOWER(c.name) = LOWER(?)
      ${groupBy}
      ORDER BY p.created_at DESC
    `, [category]);

    res.json({ success: true, data: rows.map(formatProduct) });
  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching products by category' });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const [rows] = await pool.query(`
      ${baseSelect}
      WHERE p.name LIKE ? OR p.description LIKE ?
      ${groupBy}
      ORDER BY p.created_at DESC
    `, [`%${q}%`, `%${q}%`]);

    res.json({ success: true, data: rows.map(formatProduct) });
  } catch (error) {
    console.error('Error searching products:', error.message);
    res.status(500).json({ success: false, message: 'Error searching products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, stock } = req.body;

    if (!name || !description || !price || !category_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, description, price_usd, category_id, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category_id, image_url || '', stock || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: result.insertId, name, description, price, category_id, image_url: image_url || '', stock: stock || 0 }
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ success: false, message: 'Error creating product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, stock } = req.body;

    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price_usd = ?, category_id = ?, image_url = ?, stock = ? WHERE id = ?',
      [name, description, price, category_id, image_url || '', stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ success: false, message: 'Error updating product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
};
