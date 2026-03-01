import pool from '../config/database.js';  // Add this import at the top
import User from '../models/Login.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register user
const registerUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      country_id,
      currency_code,
      gender,
      referral_source,
      security_question,
      security_answer
    } = req.body;

    // Validate required fields
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email and password are required'
      });
    }

    // Check if user already exists using the model
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Hash security answer if provided
    let hashedAnswer = null;
    if (security_answer) {
      hashedAnswer = await bcrypt.hash(security_answer, 10);
    }

    // Log the data being saved (for debugging)
    console.log('Registering user with country_id:', country_id);
    console.log('Registering user with currency_code:', currency_code);

    // Create user using the model
    const userId = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: 'user',
      country_id: country_id ? Number(country_id) : null, // Ensure it's a number
      currency_code: currency_code || null,
      gender: gender || null,
      referral_source: referral_source || null,
      security_question: security_question || null,
      security_answer_hash: hashedAnswer
    });

    // Get the created user using the model
    const newUser = await User.findById(userId);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.user_id,
        email: newUser.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove sensitive data
    delete newUser.password;
    delete newUser.security_answer_hash;

    console.log('User registered successfully with country:', newUser.country_name);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error messages from the model
    if (error.message === 'User with this email already exists') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('Invalid country_id') || error.message.includes('Invalid currency_code')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email using the model
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove sensitive data
    delete user.password;
    delete user.security_answer_hash;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware

    // Get user by ID using the model
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      full_name,
      email,
      gender,
      country_id,
      currency_code,
      referral_source
    } = req.body;

    // Update user using the model
    const updated = await User.update(userId, {
      full_name,
      email,
      country_id,
      currency_code,
      gender,
      referral_source
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found or no changes made'
      });
    }

    // Get updated user
    const updatedUser = await User.findById(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.message === 'Email already exists') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('Invalid country_id') || error.message.includes('Invalid currency_code')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Forgot password - step 1: verify email and get security question
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user with security question using the model
    const user = await User.findByEmailWithSecurity(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    res.json({
      success: true,
      message: 'User found',
      userId: user.user_id,
      security_question: user.security_question
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message
    });
  }
};

// Verify security answer
const verifySecurityAnswer = async (req, res) => {
  try {
    const { userId, security_answer } = req.body;

    if (!userId || !security_answer) {
      return res.status(400).json({
        success: false,
        message: 'User ID and security answer are required'
      });
    }

    // Get security answer hash using the model
    const securityHash = await User.verifySecurityAnswer(userId);
    
    if (!securityHash) {
      return res.status(400).json({
        success: false,
        message: 'No security question set for this user'
      });
    }

    // Verify security answer
    const isValidAnswer = await bcrypt.compare(security_answer, securityHash);
    
    if (!isValidAnswer) {
      return res.status(401).json({
        success: false,
        message: 'Security answer is incorrect'
      });
    }

    // Generate temporary token for password reset
    const resetToken = jwt.sign(
      { userId, purpose: 'password-reset' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      message: 'Security answer verified',
      resetToken
    });

  } catch (error) {
    console.error('Verify security answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying security answer',
      error: error.message
    });
  }
};

// Reset password with security answer
const resetPasswordSecurity = async (req, res) => {
  try {
    const { resetToken, new_password } = req.body;

    if (!resetToken || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    if (decoded.purpose !== 'password-reset') {
      return res.status(401).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password using the model
    const updated = await User.updatePassword(decoded.userId, hashedPassword);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

// Get countries - FIXED with pool import
const getCountries = async (req, res) => {
  try {
    // pool is now defined because we imported it at the top
    const [rows] = await pool.query(
      'SELECT country_id as id, country_name, country_code, currency_code FROM countries ORDER BY country_name'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching countries',
      error: error.message
    });
  }
};

// Get currencies - FIXED with pool import
const getCurrencies = async (req, res) => {
  try {
    // pool is now defined because we imported it at the top
    const [rows] = await pool.query(
      'SELECT currency_code, currency_name, currency_symbol FROM currencies ORDER BY currency_name'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching currencies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching currencies',
      error: error.message
    });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin (you'll need to add this check)
    const users = await User.findAll();
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Admin: Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deleted = await User.delete(userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPasswordSecurity,
  verifySecurityAnswer,
  getCountries,
  getCurrencies,
  getAllUsers,
  deleteUser
};