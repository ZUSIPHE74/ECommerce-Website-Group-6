<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Create Account</h1>
      <p class="subtitle">Join our exclusive community</p>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="full_name" required placeholder="John Doe" />
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="email" required placeholder="Enter your email" />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" required placeholder="Create a password" />
        </div>

        <div class="form-group">
          <label>Gender</label>
          <select v-model="gender" required>
            <option value="" disabled selected>Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div class="form-group">
          <label>Country</label>
          <div v-if="countriesError" class="country-error">
            Countries unavailable.
            <button type="button" class="retry-btn" @click="loadCountries">Retry</button>
          </div>
          <select v-model="country_id" @change="onCountryChange" required>
            <option value="" disabled selected>Select your country</option>
            <option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.country_name }}
            </option>
          </select>
        </div>


        <div class="form-group">
          <label>How did you hear about us?</label>
          <select v-model="referral_source">
            <option value="" disabled selected>Select an option</option>
            <option value="Social Media">Social Media</option>
            <option value="Friend/Family">Friend/Family</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Search Engine">Search Engine</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label>Security Question</label>
          <select v-model="security_question" required>
            <option value="" disabled selected>Select a question</option>
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
          <p class="helper-text">For account recovery.</p>
        </div>

        <div class="form-group">
          <label>Security Answer (keep it private)</label>
          <input type="text" v-model="security_answer" required placeholder="Type the exact answer" />
        </div>

        <button type="submit" class="btn block">Sign Up</button>
      </form>

      <p class="switch-auth">
        Already have an account? <router-link to="/login">Sign In</router-link>
      </p>
      
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import countriesFallback from '../utils/countries'
import { postWithFallback } from '../utils/apiRequest'
export default {
  data() {
    return {
      full_name: '',
      email: '',
      password: '',
      country_id: '',
      currency_code: '',
      gender: '',
      referral_source: '',
      security_question: '',
      security_answer: '',
      countries: [],
      error: '',
      countriesError: false
    }
  },
  async mounted() {
    await this.loadCountries();
  },
  methods: {
    async loadCountries() {
      this.countriesError = false;
      try {
        const response = await fetch('/api/countries');
        if (!response.ok) {
          throw new Error(`Countries request failed: ${response.status}`);
        }

        const countries = await response.json();
        this.countries = Array.isArray(countries) ? countries : [];
        if (this.countries.length === 0) {
          throw new Error('Countries response is empty');
        }
        this.countries.sort((a, b) => a.country_name.localeCompare(b.country_name));
      } catch (err) {
        this.countries = [...countriesFallback].sort((a, b) => a.country_name.localeCompare(b.country_name));
        this.countriesError = this.countries.length === 0;
      }
    },
    onCountryChange() {
      const selectedCountry = this.countries.find(c => c.id == this.country_id);
      if (selectedCountry) {
        this.currency_code = selectedCountry.currency_code;
      }
    },
    async handleRegister() {
  try {
    this.error = '';
    
    if (!this.country_id) {
      this.error = 'Please select your country.';
      return;
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    const data = await postWithFallback('/api/auth/register', {
      full_name: this.full_name,
      email: this.email,
      password: this.password,
      country_id: this.country_id ? Number(this.country_id) : null,
      currency_code: this.currency_code,
      gender: this.gender,
      referral_source: this.referral_source,
      security_question: this.security_question,
      security_answer: this.security_answer
    });

    if (!data?.token || !data?.user) {
      throw new Error('Registration succeeded but response was incomplete.');
    }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data?.user?.currency_code) {
          localStorage.setItem('currency_code', data.user.currency_code);
        }
        localStorage.setItem('userId', String(data.user.id));

    this.$router.push('/account/profile');
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific error messages
    if (err.message.includes('500') || err.message.includes('Duplicate entry')) {
      this.error = 'Registration failed: This email or information may already be registered.';
    } else {
      this.error = err?.message ? `Registration failed (${err.message})` : 'Unable to reach server. Please try again.';
    }
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
  background: radial-gradient(circle at 15% 20%, rgba(0, 255, 255, 0.12), rgba(0, 0, 0, 0) 45%), #2b2b2b;
  padding: 20px;
}

.auth-box {
  width: 100%;
  max-width: 450px;
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
  color: #f5f5f5;
  text-align: center;
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

.switch-auth {
  margin-top: 24px;
  text-align: center;
  font-size: 14.4px;
}

.switch-auth a {
  font-weight: bold;
  text-decoration: none;
  color: #00ffff;
}

.error-msg {
  color: #ff6b6b;
  margin-top: 16px;
  text-align: center;
}

.helper-text {
  color: #b7b7b7;
  font-size: 13.6px;
  margin-top: 5.6px;
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

input {
  width: 100%;
  height: 54px;
  padding: 16px 16px;
  margin-bottom: 16px;
  border: 2px solid #00ffff;
  border-radius: 999px;
  font-size: 16px;
  background-color: transparent;
  color: #e6e6e6;
  box-sizing: border-box;
}

input::placeholder {
  color: #a9a9a9;
}

label {
  display: block;
  color: #e6e6e6;
  margin-bottom: 6px;
  font-weight: 600;
}

.country-error {
  color: #ff6b6b;
  font-size: 12.8px;
  margin: 4px 0 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.retry-btn {
  border: none;
  background: transparent;
  color: #00ffff;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 12.8px;
  line-height: 1;
  margin: 0;
}

select:focus {
  outline: none;
  border-color: #00ffff;
}

.readonly-input {
  background-color: #f5f5f5;
  color: #666;
  border-color: #eee;
  cursor: not-allowed;
}
</style>

