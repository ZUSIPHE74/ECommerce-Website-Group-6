import pool from '../config/database.js';

class Cart {
  // Get user's cart items
  static async getCart(userId) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          ci.id,
          ci.quantity,
          p.product_id,
          p.name,
          p.price,
          p.stock,
          p.description
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.user_id = ?
      `, [userId]);
      
      return rows;
    } catch (error) {
      console.error('Error in Cart.getCart:', error);
      throw error;
    }
  }

  // Add item to cart

static async addItem(userId, productId) {  // Note: parameters are userId, productId
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Check if product exists
    const [product] = await connection.query(
      'SELECT product_id, stock FROM products WHERE product_id = ?',
      [productId]  // Use productId parameter
    );

    console.log('Product found:', product);

    if (product.length === 0) {
      throw new Error('Product not found');
    }

    // Check if item already exists in cart
    const [existing] = await connection.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]  // Use userId and productId parameters
    );

    console.log('Existing cart item:', existing);

    if (existing.length > 0) {
      // Update quantity
      await connection.query(
        'UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      console.log('Updated existing cart item quantity');
    } else {
      // Insert new item
      await connection.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)',
        [userId, productId]  // Insert with correct column names
      );
      console.log('Inserted new cart item');
    }

    await connection.commit();
    return { success: true, message: 'Item added to cart' };

  } catch (error) {
    await connection.rollback();
    console.error('Error in Cart.addItem:', error);
    throw error;
  } finally {
    connection.release();
  }
}

  // Remove item from cart
  static async removeItem(userId, productId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in Cart.removeItem:', error);
      throw error;
    }
  }

  // Update item quantity
  static async updateQuantity(userId, productId, quantity) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await connection.query(
          'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
          [userId, productId]
        );
      } else {
        // Check if item exists
        const [existing] = await connection.query(
          'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
          [userId, productId]
        );

        if (existing.length > 0) {
          // Update existing item
          await connection.query(
            'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, userId, productId]
          );
        } else {
          // Insert new item with specified quantity
          await connection.query(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [userId, productId, quantity]
          );
        }
      }

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Clear entire cart
  static async clearCart(userId) {
    try {
      await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
      return true;
    } catch (error) {
      console.error('Error in Cart.clearCart:', error);
      throw error;
    }
  }

  // Get cart item count
  static async getItemCount(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?',
        [userId]
      );
      return rows[0].count;
    } catch (error) {
      console.error('Error in Cart.getItemCount:', error);
      throw error;
    }
  }

  // Get cart total
  static async getCartTotal(userId) {
    try {
      const [rows] = await pool.query(`
        SELECT SUM(p.price * ci.quantity) as total
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.user_id = ?
      `, [userId]);

      return rows[0].total || 0;
    } catch (error) {
      console.error('Error in Cart.getCartTotal:', error);
      throw error;
    }
  }

  // Check if item is in cart
  static async isInCart(userId, productId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Error in Cart.isInCart:', error);
      throw error;
    }
  }

  // Merge guest cart with user cart (for after login)
  static async mergeCart(userId, guestCartItems) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      for (const item of guestCartItems) {
        const productId = item.product_id || item.id;
        const quantity = item.quantity || 1;

        // Check if item already exists in user's cart
        const [existing] = await connection.query(
          'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
          [userId, productId]
        );

        if (existing.length > 0) {
          // Update quantity
          await connection.query(
            'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
            [quantity, userId, productId]
          );
        } else {
          // Insert new item
          await connection.query(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [userId, productId, quantity]
          );
        }
      }

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Cart;