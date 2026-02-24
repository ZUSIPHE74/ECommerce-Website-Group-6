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
          <p>{{ formatMoney(item.price) }} x {{ item.quantity }}</p>
        </div>

        <div class="item-actions">
          <strong>
            {{ formatMoney(Number(item.price) * Number(item.quantity)) }}
          </strong>

          <button 
            class="remove-btn"
            @click="removeItem(item.product_id)"
          >
            Remove
          </button>
        </div>
      </article>

      <div class="summary">
        <!-- Totals -->
        <p>Items: {{ cartCount }}</p>
        <p>Total: {{ formatMoney(Number(cartTotal)) }}</p>

        <!-- Checkout button -->
        <button 
          v-if="cart.length > 0" 
          @click="goToCheckout" 
          class="checkout-btn"
        >
          Proceed to Checkout
        </button>

        <button
          v-if="cart.length > 0"
          @click="openClearConfirm"
          class="clear-cart-btn"
        >
          Remove All
        </button>
      </div>
    </div>

    <!-- Clear cart confirmation modal -->
    <div v-if="showClearConfirm" class="modal-overlay">
      <div class="modal">
        <h3>Remove all items?</h3>
        <p>Are you sure want to remove all items?</p>
        <div class="modal-actions">
          <button class="modal-cancel" @click="closeClearConfirm">Cancel</button>
          <button class="modal-confirm" @click="clearCart">Yes, Remove All</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { formatMoney } from '../utils/currency'

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
const showClearConfirm = ref(false)

// Fetch cart on load
onMounted(() => {
  const resolvedUserId = Number(props.userId || localStorage.getItem('userId')) || 1
  store.dispatch('fetchCart', resolvedUserId)
})

// Remove item from cart
function removeItem(productId) {
  const resolvedUserId = Number(props.userId || localStorage.getItem('userId')) || 1

  store.dispatch('removeFromCart', {
    user_Id: resolvedUserId,
    product_Id: productId
  })
}

// Go to checkout
function goToCheckout() {
  router.push('/checkout')
}

// Open clear cart confirmation modal
function openClearConfirm() {
  showClearConfirm.value = true
}

// Close clear cart confirmation modal
function closeClearConfirm() {
  showClearConfirm.value = false
}

// Clear cart (if needed)
function clearCart() {
  const resolvedUserId = Number(props.userId || localStorage.getItem('userId')) || 1
  store.dispatch('clearCart', resolvedUserId)
  closeClearConfirm()
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

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.remove-btn {
  background: transparent;
  border: 1px solid #dc2626;
  color: #dc2626;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.remove-btn:hover {
  background: #dc2626;
  color: white;
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

.clear-cart-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.clear-cart-btn:hover {
  background-color: #b91c1c;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}

.modal {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.modal p {
  margin: 0;
  color: #475569;
}

.modal-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-cancel,
.modal-confirm {
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
}

.modal-cancel {
  background: #e2e8f0;
  color: #0f172a;
}

.modal-confirm {
  background: #dc2626;
  color: #ffffff;
}
</style>
