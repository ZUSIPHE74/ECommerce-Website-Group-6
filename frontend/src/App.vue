<template>
  <div class="app-wrapper">
    <header class="navbar">
      <RouterLink to="/" class="logo-link">
        <h2 class="logo">ARC<span>TRAVEL</span></h2>
      </RouterLink>

      <nav class="nav-icons">
        <RouterLink to="/shop">
          <ShoppingBag size="20" />
        </RouterLink>

        <RouterLink to="/cart">
          <ShoppingCart size="20" />
        </RouterLink>

      <div class="currency-wrapper" @click.stop="toggleDropdown">
        <Globe size="20" />
  
      <div v-if="showDropdown" class="currency-dropdown">
        <div 
          v-for="country in countries" 
          :key="country.id"
          class="currency-item"
          @click="selectCurrency(country)"
        >
      {{ country.country_name }} — {{ country.currency_code }}
    </div>
  </div>
</div>

        <RouterLink v-if="!isLoggedIn" to="/login">
          <User size="20" />
        </RouterLink>

        <RouterLink v-if="isLoggedIn" to="/account/profile">
          <User size="20" />
        </RouterLink>

        <button v-if="isLoggedIn" @click="logout" class="logout-btn">
          Logout
        </button>
      </nav>
    </header>

    <main class="container">
      <RouterView />
    </main>

    <!-- Bottom Section -->
    <footer class="footer">
      <RouterLink to="/about">About Us</RouterLink>
      <RouterLink to="/contact">Contact Us</RouterLink>
    </footer>
  </div>
</template>
<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { ShoppingCart, User, Globe , ShoppingBag } from 'lucide-vue-next'
import countries from './utils/countries.js'

const router = useRouter()

const isLoggedIn = ref(!!localStorage.getItem('token'))
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectCurrency = (country) => {
  localStorage.setItem('currency_code', country.currency_code)
  showDropdown.value = false
  window.location.reload() // quick way to refresh prices
}

onMounted(() => {
  document.addEventListener('click', () => {
    showDropdown.value = false
  })
})

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
.logo-link {
  text-decoration: none;
}

.logo-link:hover .logo {
  color: #00ffff;
  transition: 0.3s;
}
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
.currency-wrapper {
  position: relative;
  cursor: pointer;
}

.currency-dropdown {
  position: absolute;
  right: 0;
  top: 35px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  width: 240px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 6px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  z-index: 2000;
}

.currency-item {
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.currency-item:hover {
  background: #00ffff20;
  color: #00ffff;
}
/* 2. Logo Styling */
.logo {
  font-family: 'Inter', sans-serif;
  letter-spacing: 4px;
  font-weight: 800;
  color: #ffffff;
  font-size: 22.4px;
}

.logo span {
  color: #00ffff; /* Signature Electric Cyan */
  font-weight: 300;
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-icons a {
  color: #ffffff;
  transition: 0.3s ease;
}

.nav-icons a:hover {
  color: #00ffff;
  transform: scale(1.1);
}

.footer {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 30px 0;
  background: #1a1a1a;
  border-top: 1px solid #2a2a2a;
}

.footer a {
  color: #aaaaaa;
  text-decoration: none;
  font-size: 14px;
  transition: 0.3s;
}

.footer a:hover {
  color: #00ffff;
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
  font-size: 12.8px;
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
