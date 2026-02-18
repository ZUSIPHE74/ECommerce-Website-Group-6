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
        const data = await res.json();
        commit('SET_CART', data);
    },

    async addToCart({ dispatch }, payload) {
        await fetch('http://localhost:5050/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        dispatch('fetchCart', payload.user_Id);
    },

    async updateQuantity({ dispatch }, payload) {
        await fetch('http://localhost:5050/cart', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        dispatch('fetchCart', payload.user_Id);
    },
    
    async removeFromCart({ dispatch }, payload) {
        await fetch('http://localhost:5050/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }) 
        dispatch('fetchCart', payload.user_Id);
    },

    clearCart({ commit }) {
        commit('CLEAR_CART');
    }
}
})
