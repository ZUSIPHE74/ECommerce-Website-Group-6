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
          <p v-if="countriesError" style="color: red; font-size: 0.8rem;">To fix: Refresh page or check server.</p>
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
      countries: [],
      error: '',
      countriesError: false
    }
  },
  async mounted() {
    try {
      const response = await fetch('http://localhost:5050/api/countries');
      if (response.ok) {
        this.countries = await response.json();
      } else {
        this.countriesError = true;
      }
    } catch (err) {
      console.error('Failed to load countries', err);
      this.countriesError = true;
    }
  },
  methods: {
    onCountryChange() {
      const selectedCountry = this.countries.find(c => c.id === this.country_id);
      if (selectedCountry) {
        this.currency_code = selectedCountry.currency_code;
      }
    },
    async handleRegister() {
      try {
        const response = await fetch('http://localhost:5050/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            full_name: this.full_name, 
            email: this.email, 
            password: this.password,
            country_id: this.country_id,
            currency_code: this.currency_code,
            gender: this.gender,
            referral_source: this.referral_source
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
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
  padding: 20px;
}

.auth-box {
  width: 100%;
  max-width: 450px;
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

.error-msg {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

select {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  background-color: #fff;
}

select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.readonly-input {
  background-color: #f5f5f5;
  color: #666;
  border-color: #eee;
  cursor: not-allowed;
}
</style>
