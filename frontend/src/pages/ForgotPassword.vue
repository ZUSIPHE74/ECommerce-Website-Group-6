<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Recovery</h1>
      <p class="subtitle">Answer your security question to reset your password</p>
      
      <form @submit.prevent="handleVerify">
        <div class="form-group">
          <label>Security Question</label>
          <select v-model="security_question" required>
            <option value="" disabled>Select your question</option>
            <option value="childhood_street">What was the name of the street you grew up on?</option>
            <option value="first_pet">What was the name of your first pet?</option>
            <option value="first_boss">What was the first name of your first boss?</option>
            <option value="family_birth_city">In what city was your oldest sibling born?</option>
            <option value="first_car_model">What was the model of your first car?</option>
            <option value="favorite_teacher">What was the last name of your favorite teacher?</option>
            <option value="childhood_best_friend">What was the first name of your childhood best friend?</option>
            <option value="first_job_title">What was your first job title?</option>
            <option value="first_concert">What was the first concert you attended?</option>
          </select>
        </div>

        <div class="form-group">
          <label>Security Answer</label>
          <input type="text" v-model="security_answer" required placeholder="Type the exact answer" />
        </div>

        <button type="submit" class="btn block">Verify Answer</button>
      </form>

      <form v-if="verified" class="reset-form" @submit.prevent="handleSecurityReset">
        <div class="form-group">
          <label>New Password</label>
          <input type="password" v-model="new_password" required placeholder="Create a new password" />
        </div>

        <div class="form-group">
          <label>Confirm New Password</label>
          <input type="password" v-model="confirm_password" required placeholder="Repeat new password" />
        </div>

        <button type="submit" class="btn block">Reset Password</button>
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
      security_question: '',
      security_answer: '',
      new_password: '',
      confirm_password: '',
      verified: false,
      message: '',
      error: ''
    }
  },
  methods: {
    async handleVerify() {
      try {
        this.message = '';
        this.error = '';

        const response = await fetch('/api/verify-security-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            security_question: this.security_question,
            security_answer: this.security_answer
          })
        });

        let data = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          if (text) {
            data = { message: text };
          }
        }

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to verify answer');
        }

        this.verified = true;
        this.message = data?.message || 'Answer verified. You can reset your password now.';
      } catch (err) {
        this.error = err?.message || 'Unable to reach server. Please try again.';
      }
    },
    async handleSecurityReset() {
      try {
        this.message = '';
        this.error = '';

        if (this.new_password !== this.confirm_password) {
          this.error = 'Passwords do not match.';
          return;
        }

        const response = await fetch('/api/reset-password-security', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            security_question: this.security_question,
            security_answer: this.security_answer,
            new_password: this.new_password
          })
        });

        let data = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          if (text) {
            data = { message: text };
          }
        }

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to reset password');
        }

        this.message = data?.message || 'Password reset successfully.';
      } catch (err) {
        this.error = err?.message || 'Unable to reach server. Please try again.';
      }
    },
    
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: radial-gradient(circle at 15% 20%, rgba(0, 255, 255, 0.12), rgba(0, 0, 0, 0) 45%), #2b2b2b;
}

.auth-box {
  width: 100%;
  max-width: 520px;
  padding: 40px 24px 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  color: #e6e6e6;
}

h1 {
  font-size: 32px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: -1px;
  text-align: center;
  color: #f5f5f5;
}

.subtitle {
  color: #b7b7b7;
  margin-bottom: 32px;
  text-align: center;
}

.block {
  width: 100%;
  margin-top: 16px;
  padding: 14px 18px;
  background: #00ffff;
  color: #0b0b0b;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  height: 52px;
  font-size: 16px;
  letter-spacing: 0.3px;
}

.form-group {
  margin-bottom: 17.6px;
}

.form-group input {
  width: 100%;
  height: 54px;
  padding: 16px 16px;
  margin-bottom: 16px;
  border: 2px solid #00ffff;
  border-radius: 999px;
  font-size: 16px;
  background: transparent;
  color: #e6e6e6;
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: #a9a9a9;
}

.switch-auth {
  margin-top: 24px;
  text-align: center;
  font-size: 14.4px;
  color: #d6d6d6;
}

.switch-auth a {
  font-weight: bold;
  text-decoration: none;
  color: #00ffff;
}

.success-msg {
  color: #00ffff;
  margin-top: 16px;
  text-align: center;
}

.error-msg {
  color: #ff6b6b;
  margin-top: 16px;
  text-align: center;
}

.helper-text {
  color: #666;
  margin-top: 12.8px;
  text-align: center;
  font-size: 13.6px;
}

.hint {
  color: #b40000;
  font-size: 12.8px;
  margin: 3.2px 0 6.4px;
}

select {
  width: 100%;
  height: 54px;
  padding: 16px 16px;
  margin-bottom: 16px;
  border: 2px solid #00ffff;
  border-radius: 999px;
  font-size: 16px;
  transition: border-color 0.3s;
  background-color: transparent;
  color: #e6e6e6;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2300ffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 44px;
}

select option {
  background-color: #2b2b2b;
  color: #e6e6e6;
}

select:focus {
  outline: none;
  border-color: #00ffff;
}

.reset-form {
  margin-top: 16px;
}
</style>

