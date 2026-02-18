<template>
    <section class="checkout">
      <h2>Checkout</h2>

      <!-- Show if cart is empty -->
      <p v-if="cart.length === 0" class="empty">Your cart is empty.</p>

      <div v-else>
        <!-- Display cart items in checkout -->
         <div v-for="items in cart" :key="items.id" class="checkout-item">
            <p>{{ items.name }} x {{ items.quantity }}</p>
            <p>${{ (Number(items.price) * Number(items.quantity)).toFixed(2) }}</p>
         </div>

        <!-- Total summary -->
        <div class="checkout-summary">
            <p>Subtotal: ${{ Number(cartTotal).toFixed(2) }}</p>
            <p>Shipping: ${{ shippingCost.toFixed(2) }}</p>
            <p>Import Charges: ${{ customsCharges.toFixed(2) }}</p>
            <p><strong>Total: ${{ totalWithShipping.toFixed(2) }}</strong></p>
        </div>

            <!-- Shipping info -->
             <div class="checkout-form">
                <h3>Shipping Info</h3>
                <input v-model="shipping.name" type="text" placeholder="Full Name" required />
                <input v-model="shipping.address" type="text" placeholder="Address" required />
                <input v-model="shipping.email" type="email" placeholder="Email" required />
                <input v-model="shipping.phone" type="tel" placeholder="Phone Number" required />
             </div>

            <!-- Payment method -->
             <h3>Payment Method</h3>
             <select v-model="paymentMethod" required>
                <option value="">Select Payment</option>
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="eft">EFT</option>
             </select>

             <!-- Place Order-->
              <button @click="placeOrder" class="place-order-btn">
                Place Order
              </button>
      </div>
    </section>
</template>

<script setup>
import router from '@/router'
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex' 

const store = useStore()
const userId = Number(localStorage.getItem('userId')) || 1

// Cart data from Vuex
const cart = computed(() => store.state.Cart || [])
const cartTotal = computed(() => store.getters.cartTotal)
const shippingCost = computed(() => store.getters.shippingCost)
const customsCharges = computed(() => store.getters.customsCharges)
const totalWithShipping = computed(() => store.getters.totalWithShipping)

onMounted(() => {
  store.dispatch('fetchCart', userId)
})

// Shipping info form
const shipping = reactive({
  name: '',
  address: '',
  email: '',
  phone: ''
})

// Payment method
const paymentMethod = ref('')

// Place order function
function placeOrder() {
    if (!cart.value.length) return alert('Your cart is empty.')
    if (!shipping.name || !shipping.address || !shipping.email || !shipping.phone) 
        return alert('Please fill in all shipping information.')
    if (!paymentMethod.value) return alert('Please select a payment method.')

    alert('Order placed successfully!')

    // Clear local checkout state and redirect.
    store.dispatch('clearCart')
    router.push('/order-confirmation')
}
</script>

<style scoped>
.checkout {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f9fafb;
}

.checkout h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #cbd5e1;
}

.checkout-summary {
  margin-top: 12px;
  font-weight: 600;
  text-align: right;
}

.checkout-form {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}

.checkout-form input,
.checkout-form select {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

.place-order-btn {
  margin-top: 16px;
  padding: 10px 16px;
  background-color: #1e40af;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.place-order-btn:hover {
  background-color: #1e3a8a;
}

.empty {
  text-align: center;
  color: #64748b;
  font-style: italic;
}
</style>
