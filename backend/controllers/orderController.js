const db = require("../config/database.js");
const OrderModel = require("../models/orders.js");

exports.createOrder = async (req, res) => {
  const { userId } = req.body;

  try {
    // Get cart items
    const [cartItems] = await db.query(
      `SELECT c.product_id, c.quantity, p.price_usd
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Get currency + rate
    const [[currency]] = await db.query(
      `SELECT u.currency_code, cr.rate_from_usd
       FROM users u
       JOIN currency_rates cr ON u.currency_code = cr.currency_code
       WHERE u.id = ?`,
      [userId]
    );

    let totalUsd = 0;

    cartItems.forEach(item => {
      totalUsd += item.price_usd * item.quantity;
    });

    const convertedTotal = totalUsd * currency.rate_from_usd;

    // Create order
    const orderId = await OrderModel.createOrder(
      userId,
      convertedTotal,
      currency.currency_code,
      currency.rate_from_usd
    );

    // Insert order items
    for (let item of cartItems) {
      const convertedPrice =
        item.price_usd * item.quantity * currency.rate_from_usd;

      await db.query(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price_usd, converted_price)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.quantity,
          item.price_usd,
          convertedPrice
        ]
      );
    }

    // Clear cart
    await db.query(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);

    res.status(201).json({
      message: "Order created successfully",
      orderId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await OrderModel.getUserOrders(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderDetails = await OrderModel.getOrderDetails(orderId);
    res.json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    await OrderModel.updateOrderStatus(orderId, status);
    res.json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
};
