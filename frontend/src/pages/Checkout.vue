<template>
  <section class="checkout">
    <h2>Checkout</h2>

    <!-- Show if cart is empty -->
    <p v-if="cart.length === 0" class="empty">Your cart is empty.</p>

    <div v-else>
      <!-- Display cart items -->
      <div v-for="items in cart" :key="items.id" class="checkout-item">
        <p>{{ items.name }} x {{ items.quantity }}</p>
        <p>{{ formatMoney(Number(items.price) * Number(items.quantity)) }}</p>
      </div>

      <!-- ================= SHIPPING INFO ================= -->
      <div class="checkout-form">
        <h3>Shipping Info</h3>
        <input v-model="shipping.name" type="text" placeholder="Full Name" required />
        <input v-model="shipping.address" type="text" placeholder="Address" required />
        <input v-model="shipping.email" type="email" placeholder="Email" required />
        <input v-model="shipping.phone" type="tel" placeholder="Phone Number" required />
      </div>

      <!-- ================= PAYMENT METHODS ================= -->
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

        <!-- LAYBY OPTION (Only for expensive orders ≥ 2000) -->
        <label 
          v-if="Number(totalWithShipping) >= 2000"
          class="payment-option"
        >
          <input type="radio" v-model="paymentMethod" value="layby" />
          <span>Layby (Pay Over Time)</span>
        </label>

      </div>

      <!-- ================= LAYBY SECTION ================= -->
      <div v-if="paymentMethod === 'layby'" class="layby-terms">

        <!-- How Layby Works Box -->
        <div class="layby-info">
          <h4>How Layby Works</h4>
          <ul>
            <li>A 20% deposit is required to secure your order.</li>
            <li>The remaining balance must be paid within 3 months.</li>
            <li>No delivery will be made until full payment is received.</li>
            <li>If payments are missed, the order may be cancelled.</li>
            <li>Cancellation may result in a 10% admin fee deduction.</li>
          </ul>
        </div>

        <!-- Terms & Conditions Checkbox -->
        <div class="layby-checkbox">
          <input type="checkbox" v-model="acceptedTerms" />
          <label>
            I have read and agree to the Layby Terms & Conditions
          </label>
        </div>

        <!-- Error Message -->
        <p v-if="laybyError" class="error-msg">
          Have you read the Terms & Conditions? Please confirm before continuing.
        </p>

      </div>

      <!-- ================= ORDER SUMMARY ================= -->
      <div class="checkout-summary payment-summary">
        <p>Subtotal: {{ formatMoney(Number(cartTotal)) }}</p>
        <p>Shipping: {{ formatMoney(shippingCost) }}</p>
        <p>Import Charges: {{ formatMoney(customsCharges) }}</p>
        <p><strong>Total: {{ formatMoney(totalWithShipping) }}</strong></p>
      </div>

      <!-- ================= PLACE ORDER BUTTON ================= -->
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

// ================= CART DATA =================
const cart = computed(() => store.state.Cart || [])
const cartTotal = computed(() => store.getters.cartTotal)
const shippingCost = computed(() => store.getters.shippingCost)
const customsCharges = computed(() => store.getters.customsCharges)
const totalWithShipping = computed(() => store.getters.totalWithShipping)

onMounted(() => {
  store.dispatch('fetchCart', userId)
})

// ================= SHIPPING FORM =================
const shipping = reactive({
  name: '',
  address: '',
  email: '',
  phone: ''
})

// ================= PAYMENT METHOD =================
const paymentMethod = ref('')

// ================= LAYBY STATE =================
const acceptedTerms = ref(false)
const laybyError = ref(false)

// ================= PLACE ORDER FUNCTION =================
function placeOrder() {

  if (!cart.value.length) 
    return alert('Your cart is empty.')

  if (!shipping.name || !shipping.address || !shipping.email || !shipping.phone) 
    return alert('Please fill in all shipping information.')

  if (!paymentMethod.value) 
    return alert('Please select a payment method.')

  // Layby validation (must accept terms)
  if (paymentMethod.value === 'layby' && !acceptedTerms.value) {
    laybyError.value = true
    return
  }

  laybyError.value = false

  const checkoutPayload = {
    shipping: { ...shipping },
    paymentMethod: paymentMethod.value,
    acceptedTerms: acceptedTerms.value,
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

/* Checkout page wrapper */
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
}

/* Cart items */
.checkout-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #2a2a2a;
}

/* Shipping form */
.checkout-form {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
}

.checkout-form input {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #3b3b3b;
  background: #1a1a1a;
  color: #f5f5f5;
}

.checkout-form input:focus {
  outline: none;
  border-color: #00ffff;
}

/* Payment options */
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

/* Layby section */
.layby-terms {
  margin: 12px 0;
  padding: 12px;
  border: 1px solid #3b3b3b;
  border-radius: 6px;
  background: #1a1a1a;
}

/* Layby info box */
.layby-info {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #00ffff;
  border-radius: 6px;
  background: rgba(0, 255, 255, 0.05);
}

.layby-info h4 {
  margin-bottom: 6px;
  color: #00ffff;
}

.layby-info ul {
  padding-left: 18px;
  font-size: 14px;
  color: #cbd5e1;
}

.layby-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.error-msg {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 6px;
}

/* Summary */
.checkout-summary {
  margin-top: 8px;
  font-weight: 600;
  text-align: right;
}

/* Button */
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
