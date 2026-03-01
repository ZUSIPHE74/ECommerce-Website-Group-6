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

        <RouterLink v-if="isLoggedIn" to="/dashboard">
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

    <!-- Footer Section -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-column">
          <h4 class="footer-title">Company</h4>
          <ul class="footer-links">
            <li><RouterLink to="/about">About Us</RouterLink></li>
            <li><RouterLink to="/blog">Blog</RouterLink></li>
            <li><RouterLink to="/careers">Careers</RouterLink></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-title">Customer Service</h4>
          <ul class="footer-links">
            <li><RouterLink to="/contact">Contact Us</RouterLink></li>
            <li><RouterLink to="/faq">FAQ</RouterLink></li>
            <li><RouterLink to="/shipping-policy">Shipping Policy</RouterLink></li>
            <li><RouterLink to="/returns-policy">Returns & Refund</RouterLink></li>
            <li><RouterLink to="/track-order">Track Order</RouterLink></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-title">Shop & Account</h4>
          <ul class="footer-links">
            <li><RouterLink to="/shop">Browse Store</RouterLink></li>
            <li><RouterLink to="/account/profile">My Account</RouterLink></li>
            <li><RouterLink to="/login">Login / Register</RouterLink></li>
            <li><RouterLink to="/cart">Shopping Cart</RouterLink></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-title">Legal</h4>
          <ul class="footer-links">
            <li><RouterLink to="/privacy-policy">Privacy Policy</RouterLink></li>
            <li><RouterLink to="/terms-conditions">Terms & Conditions</RouterLink></li>
            <li><RouterLink to="/cookie-policy">Cookie Policy</RouterLink></li>
            <li><RouterLink to="/disclaimer">Disclaimer</RouterLink></li>
          </ul>
        </div>

        <div class="footer-column newsletter">
          <h4 class="footer-title">Stay Connected</h4>
          <p>Join the Arc Travel community for updates and gear drops.</p>
          <div class="social-icons">
            <a href="https://x.com/arctravel" target="_blank" class="social-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
            <a href="https://facebook.com/arctravel" target="_blank" class="social-icon"><Facebook size="20" /></a>
            <a href="https://instagram.com/arctravel" target="_blank" class="social-icon"><Instagram size="20" /></a>
            <a href="https://youtube.com/@arctravel" target="_blank" class="social-icon"><Youtube size="20" /></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 ARC TRAVEL. All rights reserved.</p>
        <div class="trust-icons">
          <RouterLink to="/security-payment"><span>🔒 Secure Payment</span></RouterLink>
          <span>⚡ Fast Delivery</span>
        </div>
      </div>
    </footer>
  </div>
</template>
<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { ShoppingCart, User, Globe , ShoppingBag, Facebook, Instagram, Youtube } from 'lucide-vue-next'
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
  localStorage.removeItem('userId')
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
  background: #1a1a1a;
  border-top: 1px solid #2a2a2a;
  padding: 60px 0 30px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(4, 1fr) 1.5fr;
  gap: 40px;
}

.footer-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 25px;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 30px;
  height: 2px;
  background: #00ffff;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #aaaaaa;
  text-decoration: none;
  font-size: 14px;
  transition: 0.3s;
}

.footer-links a:hover {
  color: #00ffff;
  padding-left: 5px;
}

.newsletter p {
  font-size: 14px;
  color: #aaaaaa;
  margin-bottom: 20px;
  line-height: 1.6;
}

.newsletter-input {
  display: flex;
  gap: 10px;
}

.newsletter-input input {
  flex: 1;
  background: #252525;
  border: 1px solid #333333;
  padding: 10px 15px;
  border-radius: 4px;
  color: white;
}

.newsletter-input input:focus {
  outline: none;
  border-color: #00ffff;
}

.join-btn {
  background: #00ffff;
  color: #000000;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.join-btn:hover {
  background: #ffffff;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #252525;
  border: 1px solid #333;
  border-radius: 50%;
  color: #aaaaaa !important;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-icon:hover {
  background: #00ffff;
  color: #000000 !important;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
}

.footer-bottom {
  max-width: 1400px;
  margin: 60px auto 0;
  padding: 30px 40px 0;
  border-top: 1px solid #2a2a2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666666;
  font-size: 12px;
}

.trust-icons {
  display: flex;
  gap: 30px;
}

.trust-icons span {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
  .newsletter {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  .newsletter {
    grid-column: span 1;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 20px;
  }
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
