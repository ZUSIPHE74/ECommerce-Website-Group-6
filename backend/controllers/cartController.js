import Cart from '../models/Cart.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const cartItems = await Cart.getCart(userId);

    res.json({
      success: true,
      data: cartItems
    });

  } catch (error) {
    console.error('Error in getCart controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart

export const addToCart = async (req, res) => {
  try {
    const { user_Id, product_Id } = req.body;
    
    console.log('Add to cart request:', { user_Id, product_Id });

    if (!user_Id || !product_Id) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Product ID are required'
      });
    }

    // Use the correct database column names (user_id, product_id)
    const result = await Cart.addItem(user_Id, product_Id);

    res.json({
      success: true,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Error in addToCart controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { user_Id, product_Id } = req.body;

    if (!user_Id || !product_Id) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Product ID are required'
      });
    }

    const removed = await Cart.removeItem(user_Id, product_Id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Error in removeFromCart controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Update item quantity
export const updateQuantity = async (req, res) => {
  try {
    const { user_Id, product_Id, quantity } = req.body;

    if (!user_Id || !product_Id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'User ID, Product ID, and quantity are required'
      });
    }

    if (quantity < 0 || quantity > 20) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be between 0 and 20'
      });
    }

    await Cart.updateQuantity(user_Id, product_Id, quantity);

    res.json({
      success: true,
      message: 'Cart updated successfully'
    });

  } catch (error) {
    console.error('Error in updateQuantity controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const { user_Id } = req.body;

    if (!user_Id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    await Cart.clearCart(user_Id);

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Error in clearCart controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Get cart total
export const getCartTotal = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const total = await Cart.getCartTotal(userId);

    res.json({
      success: true,
      total
    });

  } catch (error) {
    console.error('Error in getCartTotal controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart total',
      error: error.message
    });
  }
};

// Merge guest cart with user cart (for after login)
export const mergeCart = async (req, res) => {
  try {
    const { user_Id, guestCart } = req.body;

    if (!user_Id || !guestCart) {
      return res.status(400).json({
        success: false,
        message: 'User ID and guest cart are required'
      });
    }

    if (!Array.isArray(guestCart)) {
      return res.status(400).json({
        success: false,
        message: 'Guest cart must be an array'
      });
    }

    await Cart.mergeCart(user_Id, guestCart);

    res.json({
      success: true,
      message: 'Cart merged successfully'
    });

  } catch (error) {
    console.error('Error in mergeCart controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error merging cart',
      error: error.message
    });
  }
};
