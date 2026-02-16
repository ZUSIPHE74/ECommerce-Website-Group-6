import express from 'express';
import loginController from '../controllers/loginController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', loginController.registerUser);
router.post('/login', loginController.loginUser);

router.get('/user/profile', authMiddleware, loginController.getUserProfile);
router.put('/user/profile', authMiddleware, loginController.updateUserProfile);
router.post('/forgot-password', loginController.forgotPassword);

router.get('/countries', loginController.getCountries);
router.get('/currencies', loginController.getCurrencies);

export default router;