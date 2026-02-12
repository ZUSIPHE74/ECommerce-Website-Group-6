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
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/account/profile">Your Account</RouterLink>
      </nav>
    </header>

    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
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
</style>
