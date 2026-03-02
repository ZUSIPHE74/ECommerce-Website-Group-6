// frontend/src/store/index.js

import { createStore } from 'vuex'

export default createStore({
    state: {
        Cart: []
    },

    getters: {
        cartCount(state) {
            return state.Cart.reduce((total, item) => total + item.quantity, 0);
        },
        cartTotal(state) {
            return state.Cart.reduce((total, item) => total + item.price * item.quantity, 0);
        },

        // Shipping (free over R1000)
        shippingCost(state, getters) {
            return getters.cartTotal > 1000 ? 0 : 500
        },

        // Customs / import charges (10% of total)
        customsCharges(state, getters) {
            return getters.cartTotal * 0.10 // 10% import charge
        },

        // Total with shipping and customs charges
        totalWithShipping(state, getters) {
            return getters.cartTotal + getters.shippingCost + getters.customsCharges
        }
    },

    mutations: {
        SET_CART(state, data) {
            state.Cart = data;
        },
        CLEAR_CART(state) {
            state.Cart = [];
        }
    },

    actions: {
        async fetchCart({ commit }, userId) {
            try {
                const res = await fetch(`http://localhost:5050/api/cart/${userId}`)
                if (!res.ok) throw new Error(`Failed to fetch cart (${res.status})`)
                const data = await res.json();
                console.log('Cart data received:', data); // Debug log
                commit('SET_CART', data);
            } catch (error) {
                console.error('Error fetching cart:', error);
                throw error;
            }
        },

        async addToCart({ dispatch }, payload) {
            try {
                console.log('Adding to cart:', payload); // Debug log
                
                const res = await fetch('http://localhost:5050/api/cart/add', { // Changed from /api/cart to /api/cart/add
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Add to cart error response:', errorData);
                    throw new Error(errorData.message || `Failed to add to cart (${res.status})`);
                }
                
                const data = await res.json();
                console.log('Add to cart response:', data); // Debug log
                
                await dispatch('fetchCart', payload.user_Id);
            } catch (error) {
                console.error('Error in addToCart action:', error);
                throw error;
            }
        },

        async updateQuantity({ dispatch }, payload) {
            try {
                console.log('Updating quantity:', payload); // Debug log
                
                const res = await fetch('http://localhost:5050/api/cart/update', { // Changed from /api/cart to /api/cart/update
                    method: 'PUT', // Note: it's PUT, not PATCH
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Update quantity error response:', errorData);
                    throw new Error(errorData.message || `Failed to update quantity (${res.status})`);
                }
                
                const data = await res.json();
                console.log('Update quantity response:', data); // Debug log
                
                await dispatch('fetchCart', payload.user_Id);
            } catch (error) {
                console.error('Error in updateQuantity action:', error);
                throw error;
            }
        },

        async removeFromCart({ dispatch }, payload) {
            try {
                console.log('Removing from cart:', payload); // Debug log
                
                const res = await fetch('http://localhost:5050/api/cart/remove', { // Changed from /api/cart to /api/cart/remove
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Remove from cart error response:', errorData);
                    throw new Error(errorData.message || `Failed to remove from cart (${res.status})`);
                }
                
                const data = await res.json();
                console.log('Remove from cart response:', data); // Debug log
                
                await dispatch('fetchCart', payload.user_Id);
            } catch (error) {
                console.error('Error in removeFromCart action:', error);
                throw error;
            }
        },

        async clearCart({ commit, dispatch }, userId) {
            try {
                console.log('Clearing cart for user:', userId); // Debug log
                
                const res = await fetch(`http://localhost:5050/api/cart/clear`, { // Changed from /api/cart/${userId} to /api/cart/clear
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_Id: userId })
                });
                
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Clear cart error response:', errorData);
                    throw new Error(errorData.message || `Failed to clear cart (${res.status})`);
                }
                
                const data = await res.json();
                console.log('Clear cart response:', data); // Debug log
                
                commit('CLEAR_CART');
                await dispatch('fetchCart', userId);
            } catch (error) {
                console.error('Error in clearCart action:', error);
                throw error;
            }
        }
    }
})