import CreateOrders from '../models/createOrders.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const { shipping, paymentMethod } = req.body;

    if (!shipping || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping information and payment method are required'
      });
    }

    // Create the order using the model
    const orderId = await CreateOrders.createOrder(userId, shipping, paymentMethod);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: orderId
    });

  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error.message === 'Cart is empty') {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const [orders] = await pool.query(
      `SELECT * FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    // Verify order belongs to user
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE order_id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.description 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    res.json({
      success: true,
      order: orders[0],
      items
    });

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
};