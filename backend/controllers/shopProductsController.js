import pool from '../config/database.js';

function formatProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price),
    oldPrice: null,
    onSale: false,
    category: product.category_name ? product.category_name.toLowerCase() : 'uncategorized',
    rating: Math.round(Number(product.average_rating) || 0),
    reviews: Number(product.review_count) || 0,
    image: '',
    stock: product.stock
  };
}

const baseProductSelect = `
  SELECT
    p.product_id AS id,
    p.name,
    p.description,
    p.price,
    p.stock,
    p.created_at,
    c.category_id AS category_id,
    c.name AS category_name,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    COUNT(DISTINCT r.id) AS review_count
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.category_id
  LEFT JOIN reviews r ON p.product_id = r.product_id
`;

const baseGroupBy = `
  GROUP BY
    p.product_id, p.name, p.description, p.price, p.stock, p.created_at,
    c.category_id, c.name
`;

export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      ${baseProductSelect}
      ${baseGroupBy}
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      data: rows.map(formatProduct)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      ${baseProductSelect}
      WHERE p.product_id = ?
      ${baseGroupBy}
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: formatProduct(rows[0])
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const [rows] = await pool.query(`
      ${baseProductSelect}
      WHERE LOWER(c.name) = LOWER(?)
      ${baseGroupBy}
      ORDER BY p.created_at DESC
    `, [category]);

    res.json({
      success: true,
      data: rows.map(formatProduct)
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const [rows] = await pool.query(`
      ${baseProductSelect}
      WHERE p.name LIKE ? OR p.description LIKE ?
      ${baseGroupBy}
      ORDER BY p.created_at DESC
    `, [`%${q}%`, `%${q}%`]);

    res.json({
      success: true,
      data: rows.map(formatProduct)
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, stock } = req.body;

    if (!name || !description || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category_id, stock) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category_id, stock || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: result.insertId,
        name,
        description,
        price,
        category_id,
        stock: stock || 0
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, stock } = req.body;

    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, stock = ? WHERE product_id = ?',
      [name, description, price, category_id, stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM products WHERE product_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};
