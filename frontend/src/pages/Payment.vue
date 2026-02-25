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

      <!-- ================= CARD ================= -->
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

      <!-- ================= PAYPAL ================= -->
      <div v-else-if="checkoutData.paymentMethod === 'paypal'" class="form">
        <input v-model="paypal.email" type="email" placeholder="PayPal Email" required />
        <input v-model="paypal.reference" type="text" placeholder="PayPal Reference (optional)" />
      </div>

      <!-- ================= EFT ================= -->
      <div v-else-if="checkoutData.paymentMethod === 'eft'" class="form">
        <p class="hint">
          Instant EFT: choose your bank and continue.
        </p>
        <input v-model="eftAuto.bankName" type="text" placeholder="Bank Name" required />
      </div>

      <!-- ================= LAYBY ================= -->
      <div v-else-if="checkoutData.paymentMethod === 'layby'" class="layby-box">

        <h3>Layby Plan Details</h3>

        <p>
          Deposit (20%): 
          <strong>{{ formatMoney(depositAmount) }}</strong>
        </p>

        <p>
          Remaining Balance: 
          <strong>{{ formatMoney(remainingAmount) }}</strong>
        </p>

        <!-- Choose Contract Duration-->
         <div class="layby-duration">
          <label class="duration-label">Choose Layby Duration:</label>
          <div class="duration-options">
            <label
              class="duration-option"
              :class="{ active: laybyMonths === 12 }"
            >
              <input type="radio" v-model="laybyMonths" :value="12" />
              <span>12 Months</span>
            </label>

            <label
              class="duration-option"
              :class="{ active: laybyMonths === 24 }"
            >
              <input type="radio" v-model="laybyMonths" :value="24" />
              <span>24 Months</span>
            </label>
          </div>
         </div>

         <!-- Monthly Installment -->
        <p>
          Monthly Installment: 
          <strong>{{ formatMoney(monthlyInstallment) }}</strong>
        </p>

        <p class="hint">
          Product will be delivered after full payment is completed.
        </p>

        <!-- Bank Details for Auto-Debit -->
         <div class="layby-bank-details"> 
          <h4>Bank Details for Auto-Debit</h4>
          <input v-model="laybyBank.name" type="text" placeholder="Bank Name" required />
          <input v-model="laybyBank.accountNumber" type="text" placeholder="Account Number" required />
          <input v-model="laybyBank.branchCode" type="text" placeholder="Branch Code" required />
         </div>

      </div>

      <!-- BUTTON -->
      <button class="pay-btn" @click="completePayment">
        {{ checkoutData.paymentMethod === 'layby'
            ? 'Pay Deposit & Start Layby'
            : 'Pay Now'
        }}
      </button>

    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { formatMoney } from '../utils/currency'

const router = useRouter()
const store = useStore()

const raw = sessionStorage.getItem('pendingCheckout')
const checkoutData = raw ? JSON.parse(raw) : null

// ================= FORMS =================
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

const laybyBank = reactive({
  name: '',
  accountNumber: '',
  branchCode: ''
})

// ================= LAYBY CALCULATIONS =================
const depositAmount = computed(() => {
  if (!checkoutData) return 0
  return checkoutData.totals.total * 0.20
})

const remainingAmount = computed(() => {
  if (!checkoutData) return 0
  return checkoutData.totals.total - depositAmount.value
})

// Contract duration in months
const laybyMonths = ref(12)

const monthlyInstallment = computed(() => {
  if (!checkoutData) return 0
  return remainingAmount.value / laybyMonths.value
})

// ================= PAYMENT LABEL =================
const paymentMethodLabel = computed(() => {
  if (!checkoutData) return ''
  if (checkoutData.paymentMethod === 'card') return 'Credit/Debit Card'
  if (checkoutData.paymentMethod === 'paypal') return 'PayPal'
  if (checkoutData.paymentMethod === 'eft') return 'Instant EFT'
  if (checkoutData.paymentMethod === 'layby') return 'Layby (Pay Over Time)'
  return 'Payment'
})

// ================= COMPLETE PAYMENT =================
function completePayment() {
  if (!checkoutData) {
    router.push('/checkout')
    return
  }

  // CARD VALIDATION
  if (checkoutData.paymentMethod === 'card') {
    if (!card.number.trim() || !card.expiry.trim() || !card.cvc.trim()) {
      alert('Field required: card number, expiry date, and CVV.')
      return
    }
  }

  // PAYPAL VALIDATION
  if (checkoutData.paymentMethod === 'paypal') {
    if (!paypal.email.trim()) {
      alert('Field required: PayPal email.')
      return
    }
  }

  // EFT VALIDATION
  if (checkoutData.paymentMethod === 'eft') {
    if (!eftAuto.bankName.trim()) {
      alert('Field required: bank name for Instant EFT.')
      return
    }
  }

  // LAYBY VALIDATION
  if (checkoutData.paymentMethod === 'layby') {
    if (!laybyBank.name.trim() || !laybyBank.accountNumber.trim() || !laybyBank.branchCode.trim()) {
      alert('Field required: bank details for Layby auto-debit.')
      return
    }
  }

    // Store Layby info
    const laybyInfo = {
      depositPaid: depositAmount.value,
      contractMonths: laybyMonths.value,
      monthlyInstallment: monthlyInstallment.value,
      bankDetails: { ...laybyBank },
      remainingBalance: remainingAmount.value
    }

    sessionStorage.setItem('orderPaymentStatus', 'Layby Started - Deposit Paid')
    sessionStorage.setItem('laybyInfo', JSON.stringify(laybyInfo))
    if (checkoutData.paymentMethod !== 'layby') {
    sessionStorage.setItem('orderPaymentStatus', 'Payment Received')
    }

    sessionStorage.setItem('orderPaymentMethod', paymentMethodLabel.value)

    const userId = Number(localStorage.getItem('userId')) || 1
    store.dispatch('clearCart', userId)

  sessionStorage.removeItem('pendingCheckout')
  router.push('/order-success')
}

// Format credit card expiry MM/YY
function formatExpiry(event) {
  let value = event.target.value.replace(/\D/g, '').slice(0, 4)
  if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`
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

.payment-card {
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 14px;
  background: #111827;
}

.layby-box {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #3b3b3b;
  border-radius: 6px;
  background: #1a1a1a;
}

.layby-duration {
  margin: 10px 0;
}

.duration-label {
  display: block;
  margin-bottom: 8px;
}

.duration-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.duration-option {
  border: 1px solid #3b3b3b;
  border-radius: 6px;
  padding: 8px 12px;
  background: #111827;
  cursor: pointer;
}

.duration-option input {
  display: none;
}

.duration-option.active {
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.12);
}

.layby-bank-details {
  box-sizing: border-box;
  margin-top: 14px;
  width: 100%;
  padding: 16px;
  border: 1px solid #2f3b48;
  border-radius: 10px;
  background: #0f172a;
}

.layby-bank-details h4 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #cbd5e1;
}

.layby-bank-details input {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 8px;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #334155;
  border-radius: 6px;
  background: #111827;
  color: #e2e8f0;
}

.layby-bank-details input:last-child {
  margin-bottom: 0;
}

.layby-bank-details input:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.18);
}

@media (min-width: 700px) {
  .layby-bank-details {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    align-items: start;
  }

  .layby-bank-details h4 {
    grid-column: 1 / -1;
    margin-bottom: 2px;
  }

  .layby-bank-details input {
    margin-bottom: 0;
  }
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
