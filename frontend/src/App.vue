<template>
  <div>
    <header class="navbar">
      <h2 class="logo">MyStore</h2>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/shop">Shop</RouterLink>
        <RouterLink to="/cart">Cart</RouterLink>
        <RouterLink to="/checkout">Checkout</RouterLink>
        <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/account/profile">Your Account</RouterLink>

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
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #1e293b;
}

.logo {
  color: white;
}

nav a {
  color: white;
  margin-left: 20px;
  text-decoration: none;
}

nav a.router-link-exact-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}

.container {
  padding: 30px;
}

.logout-btn {
  margin-left: 15px;
  padding: 6px 12px;
  background: #ef4444;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
</style>
