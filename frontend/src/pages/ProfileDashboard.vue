<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="user-info">
        <div class="avatar">{{ user?.full_name?.charAt(0) }}</div>
        <h3>{{ user?.full_name }}</h3>
      </div>
      <nav>
        <button :class="{ active: currentTab === 'profile' }" @click="currentTab = 'profile'">My Profile</button>
        <button :class="{ active: currentTab === 'orders' }" @click="currentTab = 'orders'">Orders</button>
        <button :class="{ active: currentTab === 'wishlist' }" @click="currentTab = 'wishlist'">Wishlist</button>
        <button @click="logout" class="logout-btn">Sign Out</button>
      </nav>
    </aside>

    <main class="content">
      <div v-if="currentTab === 'profile'" class="profile-section">
        <h2>Edit Profile</h2>
        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="form.full_name" type="text" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" />
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select v-model="form.gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Country</label>
              <select v-model="form.country_id" @change="onCountryChange" required>
                <option value="" disabled>Select your country</option>
                <option v-for="country in countries" :key="country.id" :value="country.id">
                  {{ country.country_name }}
                </option>
              </select>
            </div>
          </div>
          
          <button type="submit" class="btn">Save Changes</button>
          <p v-if="message" class="success-msg">{{ message }}</p>
          <p v-if="error" class="error-msg">{{ error }}</p>
        </form>
      </div>

      <div v-else class="placeholder">
        <h2>{{ currentTab.charAt(0).toUpperCase() + currentTab.slice(1) }}</h2>
        <p>This feature is coming soon.</p>
      </div>
    </main>
  </div>
</template>

<script>
import { getWithFallback, putWithFallback } from '../utils/apiRequest'

export default {
  data() {
    return {
      user: null,
      currentTab: 'profile',
      form: {
        full_name: '',
        email: '',
        gender: '',
        country_id: '',
        currency_code: ''
      },
      countries: [],
      message: '',
      error: ''
    }
  },
  async mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }

    try {
      this.user = await getWithFallback('/api/user/profile', {
        'x-auth-token': token
      });
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (err) {
      this.logout();
      return;
    }
    this.form = {
      full_name: this.user?.full_name || '',
      email: this.user?.email || '',
      gender: this.user?.gender || '',
      country_id: this.user?.country_id ? Number(this.user.country_id) : '',
      currency_code: this.user?.currency_code || ''
    };

    await this.loadCountries();
  },
  methods: {
    async loadCountries() {
      try {
        const countries = await getWithFallback('/api/countries');
        this.countries = Array.isArray(countries) ? countries : [];
      } catch (err) {
        console.error('Countries load failed:', err);
        this.countries = [];
        this.error = 'Countries are temporarily unavailable. You can still edit other fields.';
      }
    },
    onCountryChange() {
      const selectedCountry = this.countries.find(c => c.id == this.form.country_id);
      if (selectedCountry) {
        this.form.currency_code = selectedCountry.currency_code;
      }
    },
    async updateProfile() {
      try {
        this.message = '';
        this.error = '';
        if (!this.form.country_id) {
          this.error = 'Please select your country.';
          return;
        }
        const token = localStorage.getItem('token');

        await putWithFallback('/api/user/profile', this.form, {
          'x-auth-token': token
        });

        this.message = 'Profile updated successfully!';
        this.user = { ...this.user, ...this.form };
        localStorage.setItem('user', JSON.stringify(this.user));
        if (this.form?.currency_code) {
          localStorage.setItem('currency_code', this.form.currency_code);
        }
      } catch (err) {
        this.error = err?.message || 'Failed to update profile.';
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: calc(100vh - 80px);
  background: #0c0d10;
  color: #e7e7e7;
  border: 1px solid #1f2229;
}

.sidebar {
  width: 250px;
  border-right: 1px solid #20242c;
  padding: 40px 20px;
  background:
    linear-gradient(180deg, rgba(0, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0) 25%),
    #121418;
}

.user-info {
  text-align: center;
  margin-bottom: 40px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: #090a0d;
  color: #00ffff;
  border-radius: 50%;
  border: 2px solid #00ffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 10px;
}

.user-info h3 {
  color: #f3f3f3;
  font-size: 18px;
  margin: 10px 0 0;
}

.sidebar nav button {
  display: block;
  width: 100%;
  padding: 15px;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  border-bottom: 1px solid #20242c;
  color: #d7d7d7;
  transition: 0.2s ease;
}

.sidebar nav button:hover,
.sidebar nav button.active {
  background: #07090d;
  color: #00ffff;
}

.content {
  flex: 1;
  padding: 40px;
}

.profile-section h2 {
  color: #f4f4f4;
  font-size: 42px;
  margin: 0 0 24px;
  letter-spacing: -0.5px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14.4px;
  font-weight: 700;
  color: #efefef;
}

.form-group input,
.form-group select {
  width: 100%;
  height: 52px;
  padding: 12px 14px;
  border: 2px solid #00ffff;
  border-radius: 999px;
  background: transparent;
  color: #e7e7e7;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group select option {
  background: #1a1d24;
  color: #e7e7e7;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.15);
}

.btn {
  border: none;
  background: #00ffff;
  color: #0a0a0c;
  border-radius: 999px;
  height: 48px;
  min-width: 170px;
  padding: 0 24px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn:hover {
  filter: brightness(1.06);
}

.logout-btn {
  color: #ef6b6b !important;
}

.logout-btn:hover {
  color: #fff !important;
  background: rgba(239, 107, 107, 0.2) !important;
}

.success-msg { color: green; margin-top: 10px; }
.error-msg { color: red; margin-top: 10px; }

.placeholder h2,
.placeholder p {
  color: #d8d8d8;
}

@media (max-width: 920px) {
  .dashboard-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #20242c;
    padding: 24px 16px;
  }

  .content {
    padding: 24px 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

