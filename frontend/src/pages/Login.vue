<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Welcome Back</h1>
      <p class="subtitle">Sign in to continue shopping</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="email" required placeholder="Enter your email" />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" required placeholder="Enter your password" />
        </div>

        <button type="submit" class="btn block">Sign In</button>
      </form>

      <p class="switch-auth">
        <router-link to="/forgot-password" class="forgot-link">Forgot Password?</router-link>
      </p>

      <p class="switch-auth">
        Don't have an account? <router-link to="/register">Sign Up</router-link>
      </p>

      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:5050/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        this.$router.push('/profile');
      } catch (err) {
        this.error = err.message;
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: var(--background-color);
}

.auth-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border: 1px solid #000;
  background: #fff;
  box-shadow: 10px 10px 0px #000;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.block {
  width: 100%;
  margin-top: 1rem;
}

.switch-auth {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.switch-auth a {
  font-weight: bold;
  text-decoration: underline;
}

.forgot-link {
  color: #666;
  text-decoration: none !important;
  font-size: 0.85rem;
}

.forgot-link:hover {
  text-decoration: underline !important;
  color: #000;
}

.error-msg {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
