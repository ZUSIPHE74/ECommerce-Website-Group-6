<template>
  <section class="checkout">
    <h2>Checkout</h2>

    <p v-if="cart.length === 0" class="empty">
      Your cart is empty.
    </p>

    <div v-else>

      <div
        v-for="items in cart"
        :key="items.id"
        class="checkout-item"
      >
        <p>{{ items.name }} x {{ items.quantity }}</p>
        <p>{{ formatMoney(Number(items.price) * Number(items.quantity)) }}</p>
      </div>

      <div class="checkout-summary">
        <p>Subtotal: {{ formatMoney(Number(cartTotal)) }}</p>
        <p>Shipping: {{ formatMoney(shippingCost) }}</p>
        <p>Import Charges: {{ formatMoney(customsCharges) }}</p>
        <p><strong>Total: {{ formatMoney(totalWithShipping) }}</strong></p>
      </div>

      <div class="checkout-form">
        <h3>Shipping Info</h3>
        <input v-model="shipping.name" type="text" placeholder="Full Name" />
        <input v-model="shipping.address" type="text" placeholder="Address" />
        <input v-model="shipping.email" type="email" placeholder="Email" />
        <input v-model="shipping.phone" type="tel" placeholder="Phone Number" />
      </div>

      <h3>Payment Method</h3>
      <select v-model="paymentMethod">
        <option value="">Select Payment</option>
        <option value="card">Credit/Debit Card</option>
        <option value="paypal">PayPal</option>
        <option value="eft">EFT</option>
      </select>

      <button @click="placeOrder" class="place-order-btn">
        Place Order
      </button>

    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import router from '@/router'
import { useStore } from 'vuex'
import { formatMoney } from '../utils/currency'

const store = useStore()

function getCurrentUserId() {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser?.id) return Number(parsedUser.id)
    } catch (error) {
      console.error('Failed to parse stored user:', error)
    }
  }
  return Number(localStorage.getItem('userId')) || 1
}

const cart = computed(() => store.state.Cart || [])
const cartTotal = computed(() => store.getters.cartTotal)
const shippingCost = computed(() => store.getters.shippingCost)
const customsCharges = computed(() => store.getters.customsCharges)
const totalWithShipping = computed(() => store.getters.totalWithShipping)

onMounted(() => {
  store.dispatch('fetchCart', getCurrentUserId())
})

const shipping = reactive({
  name: '',
  address: '',
  email: '',
  phone: ''
})

const paymentMethod = ref('')

async function placeOrder() {
  if (!cart.value.length) {
    alert('Your cart is empty.')
    return
  }
  if (!shipping.name || !shipping.address || !shipping.email || !shipping.phone) {
    alert('Please fill in all shipping information.')
    return
  }
  if (!paymentMethod.value) {
    alert('Please select a payment method.')
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    alert('Please login to place an order.')
    router.push('/login')
    return
  }

  try {
    const res = await fetch('http://localhost:5050/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        shipping,
        paymentMethod: paymentMethod.value
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Payment failed')
    }

    if (data.url) {
      window.location.href = data.url
    }
  } catch (error) {
    alert(error.message || 'Payment failed.')
  }
}
</script>

<style scoped>
.checkout {
  max-width: 700px;
  margin: 32px auto;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #010912;
}

.checkout h2 {
  text-align: center;
  margin-bottom: 16px;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #4b6e98;
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
  border: 1px solid #010913;
}

.place-order-btn {
  margin-top: 16px;
  padding: 10px 16px;
  background-color: #159a9a;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.place-order-btn:hover {
  background-color: #5071cb;
}

.empty {
  text-align: center;
  color: #64748b;
  font-style: italic;
}
</style>