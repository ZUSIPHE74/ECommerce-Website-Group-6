<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Welcome Back</h1>
      <p class="subtitle">Sign in to continue shopping</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group input-row user-row">
          <div class="icon-badge left" aria-hidden="true"></div>
          <input
            type="email"
            v-model="email"
            required
            placeholder="Username"
            autocomplete="username"
          />
        </div>

        <div class="form-group input-row pass-row">
          <input
            type="password"
            v-model="password"
            required
            placeholder="Password"
            autocomplete="current-password"
          />
          <div class="icon-badge right lock" aria-hidden="true"></div>
        </div>

        <label class="remember-row">
          <input type="checkbox" v-model="rememberMe" />
          <span>Remember me</span>
        </label>

        <button type="submit" class="btn block">Sign In</button>
      </form>

      <p class="switch-auth">
        <router-link to="/forgot-password" class="forgot-link">Forget your password?</router-link>
      </p>

      <p class="switch-auth">
        Don't have account? <router-link to="/register">Register</router-link>
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
      rememberMe: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('/api/login', {
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
        localStorage.setItem('rememberMe', this.rememberMe ? '1' : '0');

        this.$router.push('/profile');
      } catch (err) {
        this.error = err?.message || 'Unable to reach server. Please try again.';
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
  background:
    linear-gradient(120deg, rgba(0, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0) 35%),
    radial-gradient(circle at 8% 20%, rgba(0, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0) 45%),
    #2b2b2b;
  position: relative;
  overflow: hidden;
}

.auth-box {
  width: 100%;
  max-width: 520px;
  padding: 36px 28px 28px;
  background: transparent;
  border: none;
  box-shadow: none;
  position: relative;
}

h1 {
  font-size: 48px;
  margin-bottom: 12.8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  color: #f5f5f5;
}

.subtitle {
  color: #b7b7b7;
  margin-bottom: 35.2px;
  text-align: center;
}

.block {
  width: 60%;
  margin: 28.8px auto 0;
  display: block;
  border-radius: 999px;
  background: #00ffff;
  border: none;
  color: #0b0b0b;
  font-weight: 700;
  padding: 14.4px 19.2px;
  font-size: 16.8px;
  letter-spacing: 0.3px;
}

.form-group.input-row {
  position: relative;
  margin-bottom: 20px;
}

.form-group.input-row input {
  width: 100%;
  height: 56px;
  border: 2px solid #00ffff;
  border-radius: 999px;
  background: transparent;
  color: #e7e7e7;
  font-size: 19.2px;
  outline: none;
}

.form-group.input-row input::placeholder {
  color: #a2a2a2;
}

.user-row input {
  padding: 0 16px 0 51.2px;
}

.pass-row input {
  padding: 0 51.2px 0 16px;
}

.icon-badge {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 0;
  background: transparent;
  border: none;
}

.icon-badge.left {
  left: 16px;
}

.icon-badge.right {
  right: 16px;
}

.icon-badge.left::before,
.icon-badge.left::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid #7f7f7f;
}

.icon-badge.left::before {
  top: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.icon-badge.left::after {
  top: 10px;
  width: 14px;
  height: 8px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: none;
}

.icon-badge.right::before,
.icon-badge.right::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.icon-badge.right.lock::before {
  top: 0;
  width: 10px;
  height: 8px;
  border: 2px solid #7f7f7f;
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.icon-badge.right.lock::after {
  top: 8px;
  width: 14px;
  height: 10px;
  border: 2px solid #7f7f7f;
  border-radius: 2px;
}

.switch-auth {
  margin-top: 25.6px;
  text-align: center;
  font-size: 16px;
  color: #d6d6d6;
}

.switch-auth a {
  font-weight: bold;
  text-decoration: none;
  color: #00ffff;
}

.forgot-link {
  color: #d6d6d6;
  text-decoration: none !important;
  font-size: 16px;
}

.forgot-link:hover {
  text-decoration: underline !important;
}

.error-msg {
  color: #ff6b6b;
  margin-top: 16px;
  text-align: center;
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 9.6px;
  margin: 9.6px 0 16px;
  font-size: 16px;
  color: #a9a9a9;
  justify-content: center;
}

.remember-row input {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #00ffff;
  background: transparent;
}

.remember-row input:checked {
  background: #00ffff;
}
</style>

