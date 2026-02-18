import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/shopProductsController.js';
import loginController from '../controllers/loginController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Product routes
router.get('/products', getAllProducts);
router.get('/products/search', searchProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// POST LOGIN
router.post('/register', loginController.registerUser);
router.post('/login', loginController.loginUser);
// GET, POST , PATCH FOR MIDDLEWARE
router.get('/user/profile', authMiddleware, loginController.getUserProfile);
router.put('/user/profile', authMiddleware, loginController.updateUserProfile);
router.post('/forgot-password', loginController.forgotPassword);
// GET LOGIN
router.get('/countries', loginController.getCountries);
router.get('/currencies', loginController.getCurrencies);

// Test route
router.get('/', (req, res) => {
  res.json({ message: "Welcome to the E-commerce API" });
});

export default router;
