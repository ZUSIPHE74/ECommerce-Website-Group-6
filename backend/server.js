import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

import apiRoutes from './routes/api.js';

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
  const [rows] = await pool.query('SELECT * FROM products');
  res.json(rows);
});

// =================
// CART 
// =================

// Get cart items for a user
app.get('/cart/:userId', async (req, res) => {
  const userId = req.params.userId;

  const [rows] = await pool.query(
    `SELECT c.id, c.quantity, p.name, p.price 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = ?`, 
    [userId]
  );

  res.json(rows);
});

// Add item to cart
app.post('/cart', async (req, res) => {
  const { user_Id, product_Id } = req.body;

  const [existingCart] = await pool.query(
    'SELECT * FROM cart WHERE user_id = ? AND product_id = ?', 
    [user_Id, product_Id]
  );

  if (existingCart.length > 0) {
    await pool.query(
      'UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?', 
      [user_Id, product_Id]
    );
  } else {
    await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)', 
      [user_Id, product_Id]
    );
  }

  res.json({ message: 'Item added'});
});

// Update Quantity (Patch)
app.patch('/cart', async (req, res) => {
  const { user_Id, product_Id, quantity } = req.body;

  await pool.query(
    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', 
    [quantity, user_Id, product_Id]
  );
  res.json({ message: 'Quantity updated' });
});

// Remove item from cart
app.delete('/cart', async (req, res) => {
  const { user_Id, product_Id } = req.body;

  await pool.query(
    'DELETE FROM cart WHERE user_id = ? AND product_id = ?', 
    [user_Id, product_Id]
  );
  res.json({ message: 'Item removed' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
