<template>
  <div class="home-page">
    <section class="hero">
      <h1>Welcome to MyStore</h1>
      <p>Your one-stop shop for amazing products.</p>
      <button @click="goToShop" class="shop-btn">Shop Products</button>
    </section>

    <section class="features">
      <div class="feature">
        <h2>Quality Products</h2>
        <p>We ensure only the best items are available for you.</p>
      </div>
      <div class="feature">
        <h2>Fast Delivery</h2>
        <p>Receive your orders quickly and safely.</p>
      </div>
      <div class="feature">
        <h2>Easy Returns</h2>
        <p>Hassle-free returns for your peace of mind.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToShop = () => {
  router.push('/shop')
}
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 50px 20px;
}

.hero {
  background: #1e293b;
  color: white;
  padding: 60px 20px;
  border-radius: 12px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.shop-btn {
  background: #f87171;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

.shop-btn:hover {
  background: #ef4444;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.feature {
  background: #f3f4f6;
  padding: 20px;
  width: 250px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.feature h2 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #1e293b;
}

.feature p {
  font-size: 0.95rem;
  color: #334155;
}
</style>
