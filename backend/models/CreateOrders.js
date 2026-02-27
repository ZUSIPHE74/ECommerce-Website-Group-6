import pool from '../config/database.js';

class CreateOrders {
  static async createOrder(userId, shipping, paymentMethod) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Get cart items from database
      const [cartItems] = await connection.query(
        `
          SELECT c.product_id, c.quantity, p.price
          FROM cart_items c
          JOIN products p ON c.product_id = p.product_id
          WHERE c.user_id = ?
        `,
        [userId]
      );

      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Calculate total
      const total = cartItems.reduce(
        (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
        0
      );

      // Get user's currency preference
      const [user] = await connection.query(
        'SELECT currency_code FROM users WHERE user_id = ?',
        [userId]
      );

      const currencyCode = user[0]?.currency_code || 'USD';
      
      // Get exchange rate if needed
      let exchangeRate = 1.000000;
      if (currencyCode !== 'USD') {
        const [rate] = await connection.query(
          'SELECT rate_from_usd FROM currency_rates WHERE currency_code = ?',
          [currencyCode]
        );
        exchangeRate = rate[0]?.rate_from_usd || 1.000000;
      }

      // Create order
      const [orderResult] = await connection.query(
        `
          INSERT INTO orders (user_id, total_price, currency_code, exchange_rate_used, status)
          VALUES (?, ?, ?, ?, 'pending')
        `,
        [userId, total, currencyCode, exchangeRate]
      );

      const orderId = orderResult.insertId;

      // Add order items
      for (const item of cartItems) {
        const convertedPrice = item.price * exchangeRate;
        
        await connection.query(
          `
            INSERT INTO order_items (order_id, product_id, quantity, price_usd, converted_price)
            VALUES (?, ?, ?, ?, ?)
          `,
          [orderId, item.product_id, item.quantity, item.price, convertedPrice]
        );
      }

      // Add payment record
      await connection.query(
        `
          INSERT INTO payments (order_id, payment_method, payment_status)
          VALUES (?, ?, 'pending')
        `,
        [orderId, paymentMethod]
      );

      // Clear the cart
      await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

      await connection.commit();
      return orderId;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateOrderStatus(orderId, status) {
    await pool.query(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, orderId]
    );
  }

  static async getUserOrders(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getOrderDetails(orderId) {
    const [rows] = await pool.query(
      `SELECT oi.*, p.name, p.description
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  }
}

export default CreateOrders;