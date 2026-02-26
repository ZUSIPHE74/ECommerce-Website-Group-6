<template>
  <div class="legal-container">
    <h1>Security & <span>Payments</span></h1>
    <div class="content">
      <section>
        <h3>Accepted Payment Methods</h3>
        <div class="payment-icons">
          <div class="payment-icon">CREDIT/DEBIT CARD</div>
          <div class="payment-icon">PAYPAL</div>
          <div class="payment-icon">INSTANT PAY</div>
          <div class="payment-icon">LAY-BY</div>
        </div>
        <p>We accept all major credit/debit cards, PayPal, Instant Pay, and Lay-by options.</p>
      </section>
      <section>
        <h3>Secure Checkout</h3>
        <p>Your security is our priority. All transactions are encrypted with 256-bit SSL technology. Arc Travel never stores your full credit card information on our servers.</p>
      </section>
      <section>
        <h3>Fraud Protection</h3>
        <p>Our systems monitor for suspicious activity 24/7 to ensure the Arc ecosystem remains a safe space for all travelers.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.legal-container { padding: 60px 0; max-width: 900px; margin: 0 auto; }
h1 { font-size: 2.5rem; margin-bottom: 40px; }
h1 span { color: #00ffff; font-weight: 300; }
.content { line-height: 1.8; color: #aaaaaa; }
section { margin-bottom: 40px; }
h3 { color: white; margin-bottom: 20px; border-left: 3px solid #00ffff; padding-left: 15px; }

.payment-icons { display: flex; gap: 20px; margin-bottom: 20px; }
.payment-icon { padding: 5px 15px; background: #252525; border: 1px solid #333; border-radius: 4px; color: white; font-weight: 800; font-size: 0.8rem; }
</style>
