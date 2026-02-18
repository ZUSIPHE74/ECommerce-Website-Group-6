<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Recovery</h1>
      <p class="subtitle">Enter your email to reset password</p>
      
      <form @submit.prevent="handleReset">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="email" required placeholder="Enter your email" />
        </div>

        <button type="submit" class="btn block">Send Reset Link</button>
      </form>

      <p v-if="message" class="success-msg">{{ message }}</p>
      <p v-if="error" class="error-msg">{{ error }}</p>

      <p class="switch-auth">
        Remembered it? <router-link to="/login">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      message: '',
      error: ''
    }
  },
  methods: {
    async handleReset() {
      try {
        this.message = '';
        this.error = '';
        
        const response = await fetch('http://localhost:5050/api/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to send reset link');
        }

        this.message = data.message;
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
  background-color: #fff;
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
  color: #000;
}

.success-msg {
  color: green;
  margin-top: 1rem;
  text-align: center;
}

.error-msg {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
