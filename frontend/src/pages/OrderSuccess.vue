<template>
  <section class="success">
    <div class="card">
      <h2>Order Placed Successfully</h2>
      <p class="status-line">
        <strong>Status:</strong> {{ paymentStatus }}
      </p>
      <p v-if="paymentMethod" class="status-line">
        <strong>Method:</strong> {{ paymentMethod }}
      </p>
      <p>Your payment was successful.</p>

      <div class="actions">
        <button class="btn secondary" @click="goToCart">Return to Cart</button>
        <button class="btn primary" @click="goToShop">Continue Shopping</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const paymentStatus = ref(sessionStorage.getItem('orderPaymentStatus') || 'Payment Received')
const paymentMethod = ref(sessionStorage.getItem('orderPaymentMethod') || '')

function goToCart() {
  router.push('/cart')
}

function goToShop() {
  router.push('/shop')
}
</script>

<style scoped>
.success {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 640px;
  border: 1px solid #00ffff;
  border-radius: 10px;
  background: #121212;
  color: #f5f5f5;
  padding: 24px;
  text-align: center;
}

.card h2 {
  margin: 0 0 10px;
}

.card p {
  margin: 0 0 18px;
  color: #cbd5e1;
}

.status-line {
  margin: 0 0 8px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn.primary {
  background: #1e40af;
  color: #fff;
}

.btn.primary:hover {
  background: #1e3a8a;
}

.btn.secondary {
  background: transparent;
  color: #00ffff;
  border: 1px solid #00ffff;
}

.btn.secondary:hover {
  background: rgba(0, 255, 255, 0.12);
}
</style>
