<template>
  <div class="track-container">
    <div class="header-section">
      <h1>Track <span>Order</span></h1>
      <p>Enter your order ID to see the current status of your shipment.</p>
    </div>

    <div class="track-card">
      <div class="input-group">
        <label>Order ID</label>
        <input type="text" v-model="orderId" placeholder="e.g. #ARC-12345" />
      </div>
      <button @click="trackOrder" class="track-btn">Track Now</button>

      <div v-if="status" class="status-display">
        <div class="status-header">Current Status: <span>{{ status }}</span></div>
        <div class="status-steps">
          <div :class="['step', { active: step >= 1 }]">Processing</div>
          <div :class="['step', { active: step >= 2 }]">Shipped</div>
          <div :class="['step', { active: step >= 3 }]">In Transit</div>
          <div :class="['step', { active: step >= 4 }]">Delivered</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const orderId = ref('');
const status = ref('');
const step = ref(0);

const trackOrder = () => {
  if (!orderId.value) return alert('Please enter an order ID');
  status.value = 'In Transit';
  step.value = 3;
};
</script>

<style scoped>
.track-container { padding: 60px 0; max-width: 600px; margin: 0 auto; }
.header-section { text-align: center; margin-bottom: 40px; }
h1 { font-size: 2.5rem; letter-spacing: 4px; }
h1 span { color: #00ffff; font-weight: 300; }

.track-card { background: #1a1a1a; padding: 40px; border-radius: 12px; border: 1px solid #2a2a2a; }
.input-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; color: #aaaaaa; }
input { width: 100%; padding: 12px; background: #252525; border: 1px solid #333; border-radius: 6px; color: white; }
input:focus { outline: none; border-color: #00ffff; }

.track-btn { width: 100%; padding: 15px; background: #00ffff; color: black; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; transition: 0.3s; margin-bottom: 30px; }
.track-btn:hover { background: white; box-shadow: 0 0 20px #00ffff; }

.status-display { border-top: 1px solid #2a2a2a; padding-top: 30px; }
.status-header { margin-bottom: 20px; font-size: 1.1rem; }
.status-header span { color: #00ffff; font-weight: 700; }

.status-steps { display: flex; justify-content: space-between; position: relative; }
.step { font-size: 0.8rem; color: #555; position: relative; }
.step.active { color: #00ffff; }
.step::before { content: ''; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 10px; height: 10px; background: #333; border-radius: 50%; }
.step.active::before { background: #00ffff; box-shadow: 0 0 10px #00ffff; }
</style>
