import pool from '../config/database.js';

export const getCart = async (req, res) => {
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
        console.error('getCart Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addToCart = async (req, res) => {
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
        console.error('addToCart Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCartItem = async (req, res) => {
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
        console.error('updateCartItem Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = Number(req.body?.user_Id ?? req.query?.user_Id);
        const productId = Number(req.body?.product_Id ?? req.query?.product_Id);
        const cartItemId = Number(req.body?.cart_Item_Id ?? req.query?.cart_Item_Id);

        if (!userId) {
            return res.status(400).json({ message: 'user_Id is required' });
        }

        let result;
        if (cartItemId) {
            [result] = await pool.query(
                'DELETE FROM cart_items WHERE user_id = ? AND id = ?',
                [userId, cartItemId]
            );
        } else if (productId) {
            [result] = await pool.query(
                'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
        } else {
            return res.status(400).json({ message: 'product_Id or cart_Item_Id is required' });
        }

        if (!result?.affectedRows) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.json({ message: 'Item removed', affectedRows: result.affectedRows });
    } catch (error) {
        console.error('removeFromCart Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const [result] = await pool.query(
            'DELETE FROM cart_items WHERE user_id = ?',
            [userId]
        );
        res.json({ message: 'Cart cleared', affectedRows: result.affectedRows });
    } catch (error) {
        console.error('clearCart Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
