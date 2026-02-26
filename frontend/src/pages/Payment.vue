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
        <h3 class="bank-title">Instant EFT Details</h3>
        <input class="eft-field" v-model="eftAuto.accountHolder" type="text" placeholder="Account Holder Name" required />
        <input class="eft-field" v-model="eftAuto.accountNumber" type="text" placeholder="Account Number" required />
        <input class="eft-field" v-model="eftAuto.phoneNumber" type="tel" placeholder="Cell Phone (+country code)" required />
        <input
          v-if="showEftOtp"
          class="eft-field"
          v-model="eftAuto.otp"
          type="text"
          maxlength="6"
          placeholder="One-Time PIN (6 digits)"
          required
        />
        <div v-if="showEftOtp" class="otp-row">
          <span v-if="!canResendOtp" class="otp-timer">Didn't get OTP? Resend in {{ otpCountdown }}s</span>
          <button
            v-else
            type="button"
            class="otp-resend-btn"
            @click="resendOtp"
          >
            Resend OTP
          </button>
        </div>
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
          <h4>Auto-Debit Details</h4>
          <input v-model="laybyBank.accountHolder" type="text" placeholder="Account Holder Name" required />
          <input v-model="laybyBank.accountNumber" type="text" placeholder="Account Number" required />
          <input v-model="laybyBank.phoneNumber" type="tel" placeholder="Cell Phone (+country code)" required />
         </div>

      </div>

      <!-- BUTTON -->
      <button class="pay-btn" :disabled="eftProcessing" @click="completePayment">
        {{ paymentButtonLabel }}
      </button>

      <div v-if="showOtpPopup" class="otp-popup-overlay" @click="closeOtpPopup">
        <div class="otp-popup" @click.stop>
          <h4>Invalid OTP</h4>
          <p>{{ otpPopupMessage }}</p>
          <button type="button" class="otp-popup-btn" @click="closeOtpPopup">OK</button>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch, onBeforeUnmount } from 'vue'
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
  accountHolder: '',
  accountNumber: '',
  phoneNumber: '',
  otp: ''
})
const eftProcessing = ref(false)
const otpCountdown = ref(15)
const showOtpPopup = ref(false)
const otpPopupMessage = ref('')
let otpTimer = null

const laybyBank = reactive({
  accountHolder: '',
  accountNumber: '',
  phoneNumber: ''
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

const paymentButtonLabel = computed(() => {
  if (!checkoutData) return 'Pay Now'
  if (checkoutData.paymentMethod === 'layby') return 'Pay Deposit & Start Layby'
  if (checkoutData.paymentMethod !== 'eft') return 'Pay Now'
  return eftProcessing.value ? 'Processing...' : 'Pay Now'
})

const showEftOtp = computed(() => {
  const digits = (eftAuto.phoneNumber || '').replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 15
})

const canResendOtp = computed(() => showEftOtp.value && otpCountdown.value === 0)

function startOtpCountdown() {
  if (otpTimer) clearInterval(otpTimer)
  otpCountdown.value = 15
  otpTimer = setInterval(() => {
    if (otpCountdown.value > 0) {
      otpCountdown.value -= 1
    } else {
      clearInterval(otpTimer)
      otpTimer = null
    }
  }, 1000)
}

function resendOtp() {
  if (!canResendOtp.value) return
  eftAuto.otp = ''
  startOtpCountdown()
}

function openOtpPopup(message) {
  otpPopupMessage.value = message
  showOtpPopup.value = true
}

function closeOtpPopup() {
  showOtpPopup.value = false
}

watch(showEftOtp, (enabled) => {
  if (enabled) {
    if (!otpTimer && otpCountdown.value === 15) startOtpCountdown()
    return
  }
  if (otpTimer) {
    clearInterval(otpTimer)
    otpTimer = null
  }
  otpCountdown.value = 15
  eftAuto.otp = ''
})

onBeforeUnmount(() => {
  if (otpTimer) clearInterval(otpTimer)
})

// ================= COMPLETE PAYMENT =================
async function completePayment() {
  if (!checkoutData) {
    router.push('/checkout')
    return
  }

  // CARD VALIDATION
  if (checkoutData.paymentMethod === 'card') {
    const cardDigits = (card.number || '').replace(/\D/g, '')
    const cvcDigits = (card.cvc || '').replace(/\D/g, '')
    if (!card.name.trim() || !card.expiry.trim() || !cardDigits) {
      alert('Field required: card holder name, card number, and expiry date.')
      return
    }
    if (cardDigits.length < 12 || cardDigits.length > 19) {
      alert('Enter a valid card number.')
      return
    }
    if (!/^[0-9]{2}\/[0-9]{2}$/.test(card.expiry.trim())) {
      alert('Enter expiry in MM/YY format.')
      return
    }
    if (cvcDigits.length < 3 || cvcDigits.length > 4) {
      alert('Enter a valid card security code.')
      return
    }
  }

  // PAYPAL VALIDATION
  if (checkoutData.paymentMethod === 'paypal') {
    const email = (paypal.email || '').trim()
    if (!email) {
      alert('Field required: PayPal email.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Enter a valid PayPal email address.')
      return
    }
  }

  // EFT VALIDATION
  if (checkoutData.paymentMethod === 'eft') {
    if (!eftAuto.accountHolder.trim() || !eftAuto.accountNumber.trim() || !eftAuto.phoneNumber.trim()) {
      alert('Field required: account holder, account number, and cell phone for Instant EFT.')
      return
    }

    if (!showEftOtp.value) {
      alert('Enter a valid international cell phone number (8-15 digits).')
      return
    }

    if (!/^[0-9]{6}$/.test((eftAuto.otp || '').trim())) {
      openOtpPopup('Enter a valid 6-digit OTP.')
      return
    }

    eftProcessing.value = true
    await new Promise((resolve) => setTimeout(resolve, 1200))
    eftProcessing.value = false
  }

  // LAYBY VALIDATION
  if (checkoutData.paymentMethod === 'layby') {
    const laybyPhoneDigits = (laybyBank.phoneNumber || '').replace(/\D/g, '')
    if (!laybyBank.accountHolder.trim() || !laybyBank.accountNumber.trim() || !laybyBank.phoneNumber.trim()) {
      alert('Field required: account holder, account number, and cell phone for Layby.')
      return
    }
    if (laybyPhoneDigits.length < 8 || laybyPhoneDigits.length > 15) {
      alert('Enter a valid international cell phone number (8-15 digits) for Layby.')
      return
    }
  }

  // Store payment outcome
  if (checkoutData.paymentMethod === 'layby') {
    const laybyInfo = {
      depositPaid: depositAmount.value,
      contractMonths: laybyMonths.value,
      monthlyInstallment: monthlyInstallment.value,
      bankDetails: { ...laybyBank },
      remainingBalance: remainingAmount.value
    }

    sessionStorage.setItem('orderPaymentStatus', 'Layby Started - Deposit Paid')
    sessionStorage.setItem('laybyInfo', JSON.stringify(laybyInfo))
  } else {
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

.summary p {
  font-size: 18px;
  line-height: 1.35;
  margin: 0 0 8px;
}

.hint {
  font-size: 18px;
  line-height: 1.35;
  margin: 10px 0 12px;
}

.bank-title {
  margin: 12px 0 10px;
  font-size: 24px;
}

.eft-field {
  box-sizing: border-box;
  width: 100%;
  min-height: 46px;
  margin-bottom: 10px;
  padding: 10px 12px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #0f172a;
  color: #e2e8f0;
}

.eft-field:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.18);
}

.otp-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: -2px 0 8px;
}

.otp-timer {
  font-size: 13px;
  color: #94a3b8;
}

.otp-resend-btn {
  border: 1px solid #334155;
  border-radius: 6px;
  background: #0f172a;
  color: #e2e8f0;
  padding: 6px 10px;
  cursor: pointer;
}

.otp-resend-btn:hover {
  border-color: #00ffff;
  color: #00ffff;
}

.otp-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  display: grid;
  place-items: center;
  z-index: 999;
}

.otp-popup {
  width: min(420px, calc(100vw - 28px));
  border: 1px solid #00ffff;
  border-radius: 10px;
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
}

.otp-popup h4 {
  margin: 0 0 8px;
  color: #00ffff;
}

.otp-popup p {
  margin: 0 0 12px;
}

.otp-popup-btn {
  display: inline-block;
  border: 1px solid #1e40af;
  border-radius: 6px;
  background: #1e40af;
  color: #fff;
  padding: 8px 14px;
  cursor: pointer;
}

.otp-popup-btn:hover {
  background: #1e3a8a;
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

.pay-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.pay-btn:hover {
  background: #1e3a8a;
}

.empty {
  text-align: center;
  color: #94a3b8;
}
</style>
