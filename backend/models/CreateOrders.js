import pool from '../config/database.js';

class CreateOrders {
  static async createOrder(userId, shipping, paymentMethod) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

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

      const total = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      );

      const [orderResult] = await connection.query(
        `
          INSERT INTO orders (user_id, total_price, status)
          VALUES (?, ?, 'pending')
        `,
        [userId, total]
      );

      const orderId = orderResult.insertId;

      for (const item of cartItems) {
        await connection.query(
          `
            INSERT INTO order_items (order_id, product_id, quantity, price_usd)
            VALUES (?, ?, ?, ?)
          `,
          [orderId, item.product_id, item.quantity, item.price]
        );
      }

      await connection.query(
        `
          INSERT INTO payments (order_id, payment_method, payment_status)
          VALUES (?, ?, ?)
        `,
        [orderId, paymentMethod || null, 'pending']
      );

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
}

export default CreateOrders;