import pool from '../config/database.js';

// Get all products with category information
export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price_usd,
        p.image_url,
        p.stock,
        p.created_at,
        c.id as category_id,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id, c.id, c.name
      ORDER BY p.created_at DESC
    `);

    // Format the products with additional fields
    const formattedProducts = rows.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price_usd),
      oldPrice: null, // You can add logic for old prices if needed
      onSale: false, // You can add logic for sales if needed
      category: product.category_name ? product.category_name.toLowerCase() : 'uncategorized',
      rating: Math.round(product.average_rating) || 0,
      reviews: product.review_count || 0,
      image: product.image_url || '',
      stock: product.stock
    }));

    res.json({
      success: true,
      data: formattedProducts
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

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price_usd,
        p.image_url,
        p.stock,
        p.created_at,
        c.id as category_id,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id, c.id, c.name
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = rows[0];
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price_usd),
      oldPrice: null,
      onSale: false,
      category: product.category_name ? product.category_name.toLowerCase() : 'uncategorized',
      rating: Math.round(product.average_rating) || 0,
      reviews: product.review_count || 0,
      image: product.image_url || '',
      stock: product.stock
    };

    res.json({
      success: true,
      data: formattedProduct
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

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const [rows] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price_usd,
        p.image_url,
        p.stock,
        p.created_at,
        c.id as category_id,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE LOWER(c.name) = LOWER(?)
      GROUP BY p.id, c.id, c.name
      ORDER BY p.created_at DESC
    `, [category]);

    const formattedProducts = rows.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price_usd),
      oldPrice: null,
      onSale: false,
      category: product.category_name ? product.category_name.toLowerCase() : 'uncategorized',
      rating: Math.round(product.average_rating) || 0,
      reviews: product.review_count || 0,
      image: product.image_url || '',
      stock: product.stock
    }));

    res.json({
      success: true,
      data: formattedProducts
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

// Search products
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
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price_usd,
        p.image_url,
        p.stock,
        p.created_at,
        c.id as category_id,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.name LIKE ? OR p.description LIKE ?
      GROUP BY p.id, c.id, c.name
      ORDER BY p.created_at DESC
    `, [`%${q}%`, `%${q}%`]);

    const formattedProducts = rows.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price_usd),
      oldPrice: null,
      onSale: false,
      category: product.category_name ? product.category_name.toLowerCase() : 'uncategorized',
      rating: Math.round(product.average_rating) || 0,
      reviews: product.review_count || 0,
      image: product.image_url || '',
      stock: product.stock
    }));

    res.json({
      success: true,
      data: formattedProducts
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

// Create a new product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price_usd, category_id, image_url, stock } = req.body;
    
    // Validate required fields
    if (!name || !description || !price_usd || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, description, price_usd, category_id, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price_usd, category_id, image_url || null, stock || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: result.insertId,
        ...req.body
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

// Update a product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price_usd, category_id, image_url, stock } = req.body;
    
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price_usd = ?, category_id = ?, image_url = ?, stock = ? WHERE id = ?',
      [name, description, price_usd, category_id, image_url, stock, id]
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

// Delete a product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

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