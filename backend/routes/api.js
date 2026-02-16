const express = require('express');
const router = express.Router();

// Import controllers (using require since your api.js uses CommonJS)
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/shopProductController.js');

// Product routes
router.get('/products', getAllProducts);
router.get('/products/search', searchProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);
router.post('/products', createProduct); // Admin only - add auth middleware
router.put('/products/:id', updateProduct); // Admin only - add auth middleware
router.delete('/products/:id', deleteProduct); // Admin only - add auth middleware

// 1st PAGE - Home/Welcome
router.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to the E-commerce API",
    endpoints: {
      products: "/api/products",
      categories: "/api/products/category/:category",
      search: "/api/products/search?q=query"
    }
  });
});

// 2nd PAGE - Products page
router.get('/products-page', (req, res) => {
  res.json({ 
    message: "Products page data",
    availableRoutes: {
      getAllProducts: "/api/products",
      getByCategory: "/api/products/category/electronics",
      search: "/api/products/search?q=headphones"
    }
  });
});

// 3rd PAGE - Categories
router.get('/categories', async (req, res) => {
  try {
    const pool = require('../config/database.js').default;
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching categories",
      error: error.message 
    });
  }
});

// 4th PAGE - Featured products
router.get('/featured', async (req, res) => {
  try {
    const pool = require('../config/database.js').default;
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
      LIMIT 6
    `);
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching featured products",
      error: error.message 
    });
  }
});

module.exports = router;