<template>
  <div class="app-wrapper">
    <header class="navbar">
      <h2 class="logo">ARC<span>TRAVEL</span></h2>

      <nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/shop">Shop</RouterLink>
        <RouterLink to="/cart">Cart</RouterLink>
        <RouterLink to="/checkout">Checkout</RouterLink>
        <RouterLink v-if="!isLoggedIn" to="/login" class="auth-link">Login</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/account/profile" class="auth-link">Your Account</RouterLink>

        <button
          v-if="isLoggedIn"
          @click="logout"
          class="logout-btn"
        >
          Logout
        </button>
      </nav>
    </header>

    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()

const isLoggedIn = ref(!!localStorage.getItem('token'))

// Watch localStorage changes when route changes
watch(
  () => router.currentRoute.value.path,
  () => {
    isLoggedIn.value = !!localStorage.getItem('token')
  }
)

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  router.push('/login')
}
</script>

<style scoped>
/* 1. The Stealth Background */
.app-wrapper {
  background-color: #121212; /* Stealth Deep Grey */
  min-height: 100vh;
  color: #f5f5f5;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background: #1a1a1a; /* Slightly lighter than background for depth */
  border-bottom: 1px solid #2a2a2a; /* Subtle carbon-style divider */
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* 2. Logo Styling */
.logo {
  font-family: 'Inter', sans-serif;
  letter-spacing: 4px;
  font-weight: 800;
  color: #ffffff;
  font-size: 1.4rem;
}

.logo span {
  color: #00ffff; /* Signature Electric Cyan */
  font-weight: 300;
}

/* 3. Navigation Links (White In-Box Text Style) */
nav a {
  color: #ffffff;
  margin-left: 25px;
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

/* Hover State: The Arc Glow */
nav a:hover {
  color: #00ffff;
  background: rgba(0, 255, 255, 0.05); /* Very subtle cyan tint */
  border: 1px solid #00ffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

/* Active Link State */
nav a.router-link-exact-active {
  color: #121212;
  background: #ffffff; /* White in-box text effect */
  font-weight: bold;
}

/* 4. Special Auth Styling */
.auth-link {
  border: 1px solid #00ffff;
  color: #00ffff !important;
}

.logout-btn {
  margin-left: 20px;
  padding: 8px 18px;
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.3s;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
}

/* 5. Main Container Styling */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>