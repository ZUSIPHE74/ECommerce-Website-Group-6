<template>
  <section class="payment">
    <h2>Payment</h2>

    <p v-if="!checkoutData" class="empty">
      No checkout details found. Please complete checkout first.
    </p>

    <div v-else class="payment-card">
      <div class="summary">
        <p><strong>Method:</strong> {{ paymentMethodLabel }}</p>
        <p><strong>Total:</strong> {{ formatMoney(checkoutData.totals.total) }}</p>
      </div>

      <div v-if="checkoutData.paymentMethod === 'card'" class="form">
        <input v-model="card.name" type="text" placeholder="Name on Card" required />
        <input v-model="card.number" type="text" placeholder="Card Number" required />
        <div class="row">
          <input
            v-model="card.expiry"
            type="text"
            placeholder="MM/YY"
            maxlength="5"
            @input="formatExpiry"
            required
          />
          <input v-model="card.cvc" type="text" placeholder="CVC" required />
        </div>
      </div>
      <div v-else-if="checkoutData.paymentMethod === 'paypal'" class="form">
        <input v-model="paypal.email" type="email" placeholder="PayPal Email" required />
        <input v-model="paypal.reference" type="text" placeholder="PayPal Reference (optional)" />
      </div>
      <div v-else-if="checkoutData.paymentMethod === 'eft'" class="form">
        <p class="hint">
          Instant EFT: choose your bank and continue. In production this would redirect to a secure bank flow.
        </p>
        <input v-model="eftAuto.bankName" type="text" placeholder="Bank Name" required />
      </div>

      <p v-else class="hint">
        Click Pay Now to complete this {{ paymentMethodLabel }} payment.
      </p>

      <button class="pay-btn" @click="completePayment">Pay Now</button>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { formatMoney } from '../utils/currency'

const router = useRouter()
const store = useStore()

const raw = sessionStorage.getItem('pendingCheckout')
const checkoutData = raw ? JSON.parse(raw) : null

const card = reactive({
  name: '',
  number: '',
  expiry: '',
  cvc: ''
})

const paypal = reactive({
  email: '',
  reference: ''
})

const eftAuto = reactive({
  bankName: ''
})

const paymentMethodLabel = computed(() => {
  if (!checkoutData) return ''
  if (checkoutData.paymentMethod === 'card') return 'Credit/Debit Card'
  if (checkoutData.paymentMethod === 'paypal') return 'PayPal'
  if (checkoutData.paymentMethod === 'eft') return 'Instant EFT'
  return 'Payment'
})

function completePayment() {
  if (!checkoutData) {
    router.push('/checkout')
    return
  }

  if (checkoutData.paymentMethod === 'card') {
    // Demo mode for college project: accept any non-empty test card values.
    if (!card.number.trim() || !card.expiry.trim() || !card.cvc.trim()) {
      alert('Field required: card number, expiry date, and CVV.')
      return
    }
  }

  if (checkoutData.paymentMethod === 'paypal') {
    if (!paypal.email.trim()) {
      alert('Field required: PayPal email.')
      return
    }
  }

  if (checkoutData.paymentMethod === 'eft') {
    if (!eftAuto.bankName.trim()) {
      alert('Field required: bank name for Instant EFT.')
      return
    }
  }

  sessionStorage.setItem('orderPaymentStatus', 'Payment Received')
  sessionStorage.setItem('orderPaymentMethod', paymentMethodLabel.value)

  const userId = Number(localStorage.getItem('userId')) || 1
  store.dispatch('clearCart', userId)
  sessionStorage.removeItem('pendingCheckout')
  router.push('/order-success')
}

function formatExpiry(event) {
  let value = event.target.value.replace(/\D/g, '').slice(0, 4)

  if (value.length >= 3) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`
  }

  card.expiry = value
}
</script>

<style scoped>
.payment {
  max-width: 760px;
  margin: 20px auto;
  padding: 18px;
  border: 1px solid #00ffff;
  border-radius: 8px;
  background: #121212;
  color: #f5f5f5;
}

.payment,
.payment * {
  box-sizing: border-box;
}

.payment h2 {
  text-align: center;
  margin-bottom: 14px;
}

.payment-card {
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 14px;
  background: #111827;
}

.summary p {
  margin: 6px 0;
}

.form {
  margin-top: 12px;
}

.form input {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #3b3b3b;
  background: #1a1a1a;
  color: #f5f5f5;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

@media (max-width: 560px) {
  .row {
    grid-template-columns: 1fr;
  }
}

.hint {
  margin-top: 14px;
  color: #cbd5e1;
}

.pay-btn {
  display: block;
  margin: 14px auto 0;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background: #1e40af;
  color: #fff;
  cursor: pointer;
}

.pay-btn:hover {
  background: #1e3a8a;
}

.empty {
  text-align: center;
  color: #94a3b8;
}
</style>
