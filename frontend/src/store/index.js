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
        const res = await fetch(`http://localhost:5050/cart/${userId}`)
        if (!res.ok) throw new Error(`Failed to fetch cart (${res.status})`)
        const data = await res.json();
        commit('SET_CART', data);
    },

    async addToCart({ dispatch }, payload) {
        const res = await fetch('http://localhost:5050/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`Failed to add to cart (${res.status})`)
        await dispatch('fetchCart', payload.user_Id);
    },

    async updateQuantity({ dispatch }, payload) {
        const res = await fetch('http://localhost:5050/cart', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error(`Failed to update quantity (${res.status})`)
        await dispatch('fetchCart', payload.user_Id);
    },
    
    async removeFromCart({ dispatch }, payload) {
        const res = await fetch('http://localhost:5050/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }) 
        if (!res.ok) throw new Error(`Failed to remove from cart (${res.status})`)
        await dispatch('fetchCart', payload.user_Id);
    },

    async clearCart({ commit, dispatch }, userId) {
        const res = await fetch(`http://localhost:5050/cart/${userId}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(`Failed to clear cart (${res.status})`)
        commit('CLEAR_CART');
        await dispatch('fetchCart', userId);
    }
	}
})
