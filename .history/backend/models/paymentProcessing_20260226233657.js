
import pool from '../config/database.js';

class PaymentProcessing {

  static async createCheckoutSession(userId) {
    // Get cart items from DB
    const [cartItems] = await pool.query(
      `
        SELECT c.quantity, p.name, p.price
        FROM cart_items c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = ?
      `,
      [userId]
    );

    if (!cartItems.length) {
      throw new Error("Cart is empty");
    }

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(Number(item.price) * 100)
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/order-confirmation",
      cancel_url: "http://localhost:5173/checkout"
    });

    return session.url;
  }
}

export default PaymentProcessing;
