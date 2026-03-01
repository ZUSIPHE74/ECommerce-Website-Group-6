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
import { createOrder } from '../controllers/orderController.js';
import { submitContact } from '../controllers/contactController.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartTotal,
  mergeCart
} from '../controllers/cartController.js';

const router = express.Router();

// Product routes
router.get('/products', getAllProducts);
router.get('/products/search', searchProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Cart routes (protected)
router.get('/cart/:userId', authMiddleware, getCart);
router.post('/cart/add', authMiddleware, addToCart);
router.delete('/cart/remove', authMiddleware, removeFromCart);
router.put('/cart/update', authMiddleware, updateQuantity);
router.delete('/cart/clear', authMiddleware, clearCart);
router.get('/cart/:userId/total', authMiddleware, getCartTotal);
router.post('/cart/merge', authMiddleware, mergeCart);

// Auth routes
router.post('/register', loginController.registerUser);
router.post('/login', loginController.loginUser);
router.post('/auth/register', loginController.registerUser);
router.post('/auth/login', loginController.loginUser);
router.get('/user/profile', authMiddleware, loginController.getUserProfile);
router.put('/user/profile', authMiddleware, loginController.updateUserProfile);
router.post('/forgot-password', loginController.forgotPassword);
router.post('/reset-password-security', loginController.resetPasswordSecurity);
router.post('/verify-security-answer', loginController.verifySecurityAnswer);
router.get('/countries', loginController.getCountries);
router.get('/currencies', loginController.getCurrencies);

// Order routes
router.post('/orders', authMiddleware, createOrder);

// Contact routes
router.post('/contact', submitContact);

// Test route
router.get('/', (req, res) => {
  res.json({ message: "Welcome to the E-commerce API" });
});

export default router;