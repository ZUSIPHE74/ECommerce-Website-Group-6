<template>
  <section class="cart">
    <h2>Shopping Cart</h2>

    <!-- Show if cart is empty -->
    <p v-if="cart.length === 0" class="empty">Your cart is empty.</p>

    <!-- Show cart items -->
    <div v-else>
      <article v-for="item in cart" :key="item.id" class="item">
        <div>
          <h3>{{ item.name }}</h3>
          <p>${{ Number(item.price).toFixed(2) }} x {{ item.quantity }}</p>
        </div>
        <strong>${{ (Number(item.price) * Number(item.quantity)).toFixed(2) }}</strong>
      </article>

      <div class="summary">
        <!-- Totals -->
        <p>Items: {{ cartCount }}</p>
        <p>Total: ${{ Number(cartTotal).toFixed(2) }}</p>

        <!-- Checkout button -->
        <button 
          v-if="cart.length > 0" 
          @click="goToCheckout" 
          class="checkout-btn"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const props = defineProps({
  userId: {
    type: [Number, String],
    default: null
  }
})

const store = useStore()
const router = useRouter()

// Cart data from Vuex
const cart = computed(() => store.state.Cart || [])
const cartCount = computed(() => store.getters.cartCount || 0)
const cartTotal = computed(() => store.getters.cartTotal || 0)

// Fetch cart for the user
onMounted(() => {
  const resolvedUserId = Number(props.userId || localStorage.getItem('userId')) || 1
  store.dispatch('fetchCart', resolvedUserId)
})

// Go to checkout page
function goToCheckout() {
  router.push('/checkout')
}
</script>

<style scoped>
.cart {
  max-width: 700px;
  margin: 0 auto;
}

.empty {
  color: #475569;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
}

.item h3 {
  margin: 0;
  font-size: 16px;
}

.item p {
  margin: 4px 0 0;
  color: #475569;
}

.summary {
  margin-top: 12px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.checkout-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #1e40af;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.checkout-btn:hover {
  background-color: #1e3a8a;
}
</style>
