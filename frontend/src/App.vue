<template>
  <div id="app">
    <nav class="navbar">
      <div class="logo">GROUP 6</div>
      <ul class="nav-links">
        <li v-if="isLoggedIn"><router-link to="/dashboard">Dashboard</router-link></li>
        <!-- Only show Login button if NOT logged in AND NOT on login/register pages -->
        <li v-if="!isLoggedIn && !isAuthPage"><router-link to="/login" class="btn-sm">Login</router-link></li>
        <li v-if="isLoggedIn"><button @click="logout" class="btn-sm">Logout</button></li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: !!localStorage.getItem('token'),
      currentPath: this.$route.path
    }
  },
  computed: {
    isAuthPage() {
      return ['/login', '/register', '/forgot-password'].includes(this.currentPath);
    }
  },
  watch: {
    $route(to) {
      this.isLoggedIn = !!localStorage.getItem('token');
      this.currentPath = to.path;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  }
}
</script>

<style>
/* Global Styles moved from style.css */
:root {
    --primary-color: #000000;
    --secondary-color: #ffffff;
    --text-color: #333333;
    --background-color: #ffffff;
    --accent-color: #e5e5e5;
    --font-family: 'Inter', sans-serif;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

#app { animation: fadeIn 0.5s ease-out; }

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: var(--font-family);
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 { color: var(--primary-color); font-weight: 700; }

a { text-decoration: none; color: inherit; transition: 0.3s ease; }

.btn {
    display: inline-block;
    padding: 12px 24px;
    border: 2px solid var(--primary-color);
    background-color: var(--primary-color);
    color: var(--secondary-color);
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn:hover { background-color: var(--secondary-color); color: var(--primary-color); }

.btn-outline { background-color: transparent; color: var(--primary-color); }
.btn-outline:hover { background-color: var(--primary-color); color: var(--secondary-color); }

input {
    width: 100%;
    padding: 12px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

input:focus { outline: none; border-color: var(--primary-color); }

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.text-center { text-align: center; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
</style>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 2px solid #000;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #000;
}

.nav-links a:hover {
  text-decoration: underline;
}

.nav-links a.router-link-active {
  font-weight: 800;
}

.btn-sm {
  background: #000;
  color: #fff !important;
  padding: 8px 16px;
  text-decoration: none !important;
  transition: 0.3s;
}

.btn-sm:hover {
  background: #333;
}
</style>
