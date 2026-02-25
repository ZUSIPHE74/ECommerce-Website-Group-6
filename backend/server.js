import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello Group 6!!!');
});

// =================
// PRODUCTS
// =================
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// =================
// CART
// =================

// Get cart items for a specific user
app.get('/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const [rows] = await pool.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price AS price
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add an item to cart (or increase quantity if it already exists)
app.post('/cart', async (req, res) => {
  try {
    const { user_Id, product_Id } = req.body;
    const [existingCart] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [user_Id, product_Id]
    );

    if (existingCart.length > 0) {
      const currentQty = Number(existingCart[0].quantity) || 1;
      const nextQty = Math.min(20, currentQty + 1);
      await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [nextQty, user_Id, product_Id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)',
        [user_Id, product_Id]
      );
    }

    res.json({ message: 'Item added' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
app.patch('/cart', async (req, res) => {
  try {
    const { user_Id, product_Id, quantity } = req.body;
    const parsedQty = Number(quantity);

    if (!Number.isInteger(parsedQty)) {
      return res.status(400).json({ message: 'Quantity must be an integer.' });
    }

    const safeQty = Math.min(10, Math.max(1, parsedQty));
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [safeQty, user_Id, product_Id]
    );
    res.json({ message: 'Quantity updated' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove an item from cart
app.delete('/cart', async (req, res) => {
  try {
    const { user_Id, product_Id } = req.body;
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [user_Id, product_Id]
    );
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear all cart items 
app.delete('/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = ?',
      [userId]
    );
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// =================
// SERVER
// =================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
