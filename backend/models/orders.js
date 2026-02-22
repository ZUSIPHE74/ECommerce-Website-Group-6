const db = require("../config/database.js");

class OrderModel {

  static async createOrder(userId, totalPrice, currencyCode, rate) {
    const [result] = await db.query(
      `INSERT INTO orders 
       (user_id, total_price, currency_code, exchange_rate_used, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [userId, totalPrice, currencyCode, rate]
    );

    return result.insertId;
  }

  static async updateOrderStatus(orderId, status) {
    await db.query(
      `UPDATE orders 
       SET status = ?
       WHERE id = ?`,
      [status, orderId]
    );
  }

  static async getUserOrders(userId) {
    const [rows] = await db.query(
      `SELECT * FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return rows;
  }

  static async getOrderDetails(orderId) {
    const [rows] = await db.query(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return rows;
  }
}

module.exports = OrderModel;
