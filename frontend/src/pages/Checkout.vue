<template>
    <section class="checkout">
      <h2>Checkout</h2>

      <!-- Show if cart is empty -->
      <p v-if="cart.length === 0" class="empty">Your cart is empty.</p>

      <div v-else>
        <!-- Display cart items in checkout -->
         <div v-for="items in cart" :key="items.id" class="checkout-item">
            <p>{{ items.name }} x {{ items.quantity }}</p>
            <p>{{ formatMoney(Number(items.price) * Number(items.quantity)) }}</p>
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
             <div class="payment-options">
                <label class="payment-option">
                  <input type="radio" v-model="paymentMethod" value="card" />
                  <span>Credit/Debit Card</span>
                </label>
                <label class="payment-option">
                  <input type="radio" v-model="paymentMethod" value="paypal" />
                  <span>PayPal</span>
                </label>
                <label class="payment-option">
                  <input type="radio" v-model="paymentMethod" value="eft" />
                  <span>Instant EFT (Auto)</span>
                </label>
             </div>

             <!-- Total summary -->
             <div class="checkout-summary payment-summary">
                <p>Subtotal: {{ formatMoney(Number(cartTotal)) }}</p>
                <p>Shipping: {{ formatMoney(shippingCost) }}</p>
                <p>Import Charges: {{ formatMoney(customsCharges) }}</p>
                <p><strong>Total: {{ formatMoney(totalWithShipping) }}</strong></p>
             </div>

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
import { formatMoney } from '../utils/currency'

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

    const checkoutPayload = {
      shipping: { ...shipping },
      paymentMethod: paymentMethod.value,
      totals: {
        subtotal: Number(cartTotal.value),
        shipping: Number(shippingCost.value),
        importCharges: Number(customsCharges.value),
        total: Number(totalWithShipping.value)
      }
    }

    sessionStorage.setItem('pendingCheckout', JSON.stringify(checkoutPayload))
    router.push('/payment')
}
</script>

<style scoped>
.checkout {
  max-width: 760px;
  margin: 20px auto;
  padding: 18px;
  border: 1px solid #00ffff;
  border-radius: 8px;
  background-color: #121212;
  color: #f5f5f5;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.08);
}

.checkout h2 {
  text-align: center;
  margin-bottom: 14px;
  color: #ffffff;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #2a2a2a;
}

.checkout-summary {
  margin-top: 8px;
  font-weight: 600;
  text-align: right;
}

.checkout-form {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
}

.checkout-form h3,
.checkout > div > h3 {
  margin: 10px 0 8px;
  color: #ffffff;
}

.checkout-form input,
.checkout select {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #3b3b3b;
  background: #1a1a1a;
  color: #f5f5f5;
}

.checkout-form input:focus,
.checkout select:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.18);
}

.checkout select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, #00ffff 50%),
    linear-gradient(135deg, #00ffff 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(50% - 2px), calc(100% - 12px) calc(50% - 2px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
  padding-right: 34px;
}

.checkout select option {
  background: #121212;
  color: #f5f5f5;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #3b3b3b;
  border-radius: 6px;
  padding: 10px 12px;
  background: #1a1a1a;
  cursor: pointer;
}

.payment-option:hover {
  border-color: #00ffff;
}

.payment-option input {
  accent-color: #00ffff;
}

.payment-summary {
  margin-top: 6px;
  margin-bottom: 4px;
}

.place-order-btn {
  display: block;
  margin: 20px auto 0;
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
  color: #94a3b8;
  font-style: italic;
}
</style>
