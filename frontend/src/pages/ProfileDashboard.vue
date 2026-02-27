<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="user-info">
        <div class="avatar">{{ user?.full_name?.charAt(0) || 'U' }}</div>
        <h3>{{ user?.full_name }}</h3>
        <p class="user-email">{{ user?.email }}</p>
      </div>
      
      <nav class="sidebar-nav">
        <button 
          :class="{ active: currentTab === 'profile' }" 
          @click="navigateToProfile"
        >
          <User size="18" />
          <span>My Profile</span>
        </button>
        
        <button 
          :class="{ active: currentTab === 'orders' }" 
          @click="currentTab = 'orders'"
        >
          <Package size="18" />
          <span>Orders</span>
        </button>
        
        <button 
          :class="{ active: currentTab === 'paid-orders' }" 
          @click="currentTab = 'paid-orders'"
        >
          <CheckCircle size="18" />
          <span>Paid Orders</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button @click="openSettings" class="settings-btn">
          <Settings size="18" />
          <span>Settings</span>
        </button>
        <button @click="logout" class="logout-btn">
          <LogOut size="18" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <!-- Settings Modal -->
      <div v-if="showSettings" class="modal-overlay" @click="closeSettings">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Account Settings</h3>
            <button class="modal-close" @click="closeSettings">×</button>
          </div>
          
          <div class="modal-body">
            <div class="settings-option danger-zone">
              <h4>Delete Account</h4>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <button @click="confirmDeleteAccount" class="btn-delete">
                <Trash2 size="16" />
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="closeDeleteConfirm">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Confirm Account Deletion</h3>
            <button class="modal-close" @click="closeDeleteConfirm">×</button>
          </div>
          
          <div class="modal-body">
            <p>Are you absolutely sure you want to delete your account? This action cannot be undone.</p>
            <div class="modal-actions">
              <button @click="closeDeleteConfirm" class="btn-cancel">Cancel</button>
              <button @click="deleteAccount" class="btn-confirm-delete">
                <Trash2 size="16" />
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile View (from Profile.vue) -->
      <div v-if="currentTab === 'profile'" class="profile-view">
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar-container">
              <div class="avatar-glow"></div>
              <div class="avatar-large">{{ user?.full_name?.charAt(0) || 'U' }}</div>
            </div>
            <div class="header-info">
              <h1>{{ user?.full_name }}</h1>
              <p class="role-tag">{{ user?.role?.toUpperCase() || 'USER' }}</p>
            </div>
          </div>

          <div class="profile-grid">
            <div class="info-group">
              <label>Full Name</label>
              <p>{{ user?.full_name }}</p>
            </div>
            <div class="info-group">
              <label>Email Address</label>
              <p>{{ user?.email }}</p>
            </div>
            <div class="info-group">
              <label>Gender</label>
              <p>{{ user?.gender || 'Not specified' }}</p>
            </div>
            <div class="info-group">
              <label>Country</label>
              <p>{{ user?.country_name || 'Not specified' }}</p>
            </div>
            <div class="info-group">
              <label>Currency</label>
              <p>{{ user?.currency_code || 'USD' }}</p>
            </div>
            <div class="info-group">
              <label>Member Since</label>
              <p>{{ formatDate(user?.created_at) }}</p>
            </div>
          </div>

          <div class="profile-actions">
            <router-link to="/dashboard/edit" class="btn-edit">
              <Edit size="16" />
              Edit Profile
            </router-link>
          </div>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <!-- Edit Profile Form -->
<div v-else-if="currentTab === 'edit-profile'" class="edit-profile-section">
  <h2>Edit Profile</h2>
  <form @submit.prevent="updateProfile" class="profile-form">
    <div class="form-grid">
      <div class="form-group">
        <label>Full Name</label>
        <input v-model="form.full_name" type="text" placeholder="Enter your full name" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label>Gender</label>
        <select v-model="form.gender">
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div class="form-group">
        <label>Country</label>
        <select v-model="form.country_id" @change="onCountryChange">
          <option value="" disabled>Select your country</option>
          <option v-for="country in countries" :key="country.id" :value="country.id">
            {{ country.country_name }}
          </option>
        </select>
        <p v-if="usingFallbackCountries" class="fallback-note">
          Using local country list (API unavailable)
        </p>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="submit" class="btn-save" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
      <button type="button" @click="cancelEdit" class="btn-cancel">Cancel</button>
    </div>
    
    <p v-if="message" class="success-msg">{{ message }}</p>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </form>
</div>

      <!-- Orders Placeholder -->
      <div v-else-if="currentTab === 'orders'" class="placeholder">
        <Package size="48" />
        <h2>Orders</h2>
        <p>Your order history will appear here.</p>
      </div>

      <!-- Paid Orders Placeholder -->
      <div v-else-if="currentTab === 'paid-orders'" class="placeholder">
        <CheckCircle size="48" />
        <h2>Paid Orders</h2>
        <p>Your completed orders will appear here.</p>
      </div>
    </main>
  </div>
</template>

<script>
import { getWithFallback, putWithFallback } from '../utils/apiRequest'
import fallbackCountries from '../utils/countries'
import { 
  User, 
  Package, 
  CheckCircle, 
  Settings, 
  LogOut, 
  Edit,
  Trash2 
} from 'lucide-vue-next'

export default {
  components: {
    User,
    Package,
    CheckCircle,
    Settings,
    LogOut,
    Edit,
    Trash2
  },

  data() {
    return {
      user: null,
      currentTab: 'profile', // 'profile', 'edit-profile', 'orders', 'paid-orders'
      form: {
        full_name: '',
        email: '',
        gender: '',
        country_id: '',
        currency_code: ''
      },
      countries: [],
      message: '',
      error: '',
      loading: false,
      usingFallbackCountries: false,
      showSettings: false,
      showDeleteConfirm: false
    }
  },

  async mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }

    // Check if we're on edit page from route
    if (this.$route.path === '/dashboard/edit') {
      this.currentTab = 'edit-profile';
    }

    await this.loadUserData();
    await this.loadCountries();
  },

  methods: {
    async loadUserData() {
      try {
        const token = localStorage.getItem('token');
        
        // First try to get from localStorage
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          this.user = JSON.parse(cachedUser);
          this.populateForm();
        }

        // Then fetch fresh data from API
        const response = await getWithFallback('/api/user/profile', {
          'x-auth-token': token
        });
        
        console.log('Dashboard profile response:', response);
        
        // Handle the response structure
        if (response && response.success === true && response.user) {
          this.user = response.user;
        } else if (response && response.user) {
          this.user = response.user;
        } else if (response && typeof response === 'object') {
          this.user = response;
        }
        
        // Update localStorage and form
        localStorage.setItem('user', JSON.stringify(this.user));
        this.populateForm();
        
      } catch (err) {
        console.error('Profile fetch error:', err);
        this.error = 'Failed to load profile data. Please try again.';
        if (!this.user) {
          this.logout();
        }
      }
    },

    async loadCountries() {
      try {
        const response = await getWithFallback('/countries');
        console.log('Countries API response:', response);
        
        if (Array.isArray(response) && response.length > 0) {
          this.countries = response;
          this.usingFallbackCountries = false;
        } else {
          throw new Error('API returned invalid data');
        }
      } catch (err) {
        console.error('Countries API failed, using fallback:', err);
        this.countries = fallbackCountries;
        this.usingFallbackCountries = true;
      }
    },

    populateForm() {
      if (this.user) {
        this.form = {
          full_name: this.user.full_name || '',
          email: this.user.email || '',
          gender: this.user.gender || '',
          country_id: this.user.country_id ? Number(this.user.country_id) : '',
          currency_code: this.user.currency_code || ''
        };
      }
    },

    navigateToProfile() {
      this.currentTab = 'profile';
      this.$router.push('/dashboard').catch(() => {});
    },

    cancelEdit() {
      this.currentTab = 'profile';
      this.$router.push('/dashboard').catch(() => {});
      this.populateForm(); // Reset form
    },

    onCountryChange() {
      const selectedCountry = this.countries.find(c => c.id == this.form.country_id);
      if (selectedCountry) {
        this.form.currency_code = selectedCountry.currency_code;
        console.log('Selected country:', selectedCountry);
      }
    },

    async updateProfile() {
      this.loading = true;
      this.message = '';
      this.error = '';
      
      try {
        if (!this.form.country_id) {
          this.error = 'Please select your country.';
          this.loading = false;
          return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
          this.logout();
          return;
        }

        const updateData = {
          ...this.form,
          country_id: Number(this.form.country_id)
        };

        console.log('Sending update data:', updateData);

        const response = await putWithFallback('/api/user/profile', updateData, {
          'x-auth-token': token
        });

        console.log('Update response:', response);

        let updatedUser;
        if (response && response.success === true && response.user) {
          updatedUser = response.user;
        } else if (response && response.user) {
          updatedUser = response.user;
        } else if (response && typeof response === 'object') {
          updatedUser = response;
        }
        
        this.message = 'Profile updated successfully!';
        
        if (updatedUser) {
          this.user = { ...this.user, ...updatedUser };
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        
        if (this.form?.currency_code) {
          localStorage.setItem('currency_code', this.form.currency_code);
        }
        
        // Redirect back to profile view after successful update
        setTimeout(() => {
          this.currentTab = 'profile';
          this.$router.push('/dashboard').catch(() => {});
          this.message = '';
        }, 1500);
        
      } catch (err) {
        console.error('Update error:', err);
        this.error = err?.message || 'Failed to update profile.';
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    openSettings() {
      this.showSettings = true;
    },

    closeSettings() {
      this.showSettings = false;
    },

    confirmDeleteAccount() {
      this.closeSettings();
      this.showDeleteConfirm = true;
    },

    closeDeleteConfirm() {
      this.showDeleteConfirm = false;
    },

    async deleteAccount() {
      try {
        const token = localStorage.getItem('token');
        const userId = this.user?.user_id;
        
        // Call your delete account API endpoint
        // await deleteWithFallback(`/api/user/${userId}`, {
        //   'x-auth-token': token
        // });
        
        console.log('Account deleted');
        this.logout();
      } catch (err) {
        console.error('Delete account error:', err);
        this.error = 'Failed to delete account. Please try again.';
        this.closeDeleteConfirm();
      }
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currency_code');
      this.$router.push('/login');
    }
  },

  watch: {
    '$route.path'(newPath) {
      if (newPath === '/dashboard/edit') {
        this.currentTab = 'edit-profile';
      } else if (newPath === '/dashboard') {
        this.currentTab = 'profile';
      }
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: calc(100vh - 80px);
  background: #121212;
  color: #e7e7e7;
}

/* ====================
   Sidebar Styles
==================== */
.sidebar {
  width: 280px;
  background: #1a1a1a;
  border-right: 1px solid #2a2a2a;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
}

.user-info {
  text-align: center;
  padding-bottom: 30px;
  border-bottom: 1px solid #2a2a2a;
  margin-bottom: 30px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: #0a0a0a;
  color: #00ffff;
  border: 2px solid #00ffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  margin: 0 auto 15px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.user-info h3 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #fff;
}

.user-email {
  font-size: 13px;
  color: #888;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sidebar-nav button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  width: 100%;
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.sidebar-nav button:hover {
  background: #2a2a2a;
  color: #00ffff;
}

.sidebar-nav button.active {
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  border-left: 3px solid #00ffff;
}

.sidebar-footer {
  padding-top: 20px;
  border-top: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  width: 100%;
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.settings-btn:hover {
  background: #2a2a2a;
  color: #00ffff;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  width: 100%;
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ff6b6b;
}

/* ====================
   Main Content
==================== */
.content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

/* Profile View Styles */
.profile-view {
  max-width: 900px;
  margin: 0 auto;
}

.profile-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #2a2a2a;
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.avatar-large {
  width: 100%;
  height: 100%;
  background: #2a2a2a;
  color: #00ffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 800;
  border: 2px solid #00ffff;
  position: relative;
  z-index: 2;
}

.avatar-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00ffff;
  filter: blur(20px);
  opacity: 0.2;
  border-radius: 50%;
}

.header-info h1 {
  font-size: 32px;
  margin: 0 0 10px 0;
  color: #fff;
}

.role-tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.info-group label {
  display: block;
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
}

.info-group p {
  font-size: 16px;
  color: #fff;
  margin: 0;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #00ffff;
  color: #121212;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 255, 255, 0.3);
}

/* Edit Profile Form */
.edit-profile-section {
  max-width: 800px;
  margin: 0 auto;
}

.edit-profile-section h2 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #fff;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px; /* Increased gap for better spacing */
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #00ffff;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-actions {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

/* Replace these styles in your ProfileDashboard.vue */

.form-group input,
.form-group select {
  width: 100%;
  height: 52px; /* Match the height from your original */
  padding: 12px 16px;
  border: 2px solid #00ffff;
  border-radius: 999px; /* This creates the curved/pill shape */
  background: transparent;
  color: #e7e7e7;
  font-size: 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  border-color: #fff;
}

.form-group select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2300ffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 44px;
}

.form-group select option {
  background-color: #1a1a1a;
  color: #e7e7e7;
  padding: 10px;
}

.form-group input::placeholder {
  color: #666;
  font-size: 14px;
}

.fallback-note {
  font-size: 12px;
  color: #ffa500;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
}

/* Update button styles to match your design */

.btn-save {
  background: #00ffff;
  color: #121212;
  border: 2px solid #00ffff;
  border-radius: 999px; /* Curved border */
  height: 48px;
  min-width: 170px;
  padding: 0 24px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover:not(:disabled) {
  background: transparent;
  color: #00ffff;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 255, 255, 0.3);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 999px; /* Curved border */
  height: 48px;
  min-width: 170px;
  padding: 0 24px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #fff;
  color: #121212;
  transform: translateY(-2px);
}

/* Placeholder Styles */
.placeholder {
  text-align: center;
  padding: 60px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  color: #888;
}

.placeholder svg {
  color: #00ffff;
  margin-bottom: 20px;
}

.placeholder h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #fff;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #2a2a2a;
}

.modal-header h3 {
  color: #fff;
  font-size: 20px;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #fff;
}

.modal-body {
  padding: 30px;
}

.danger-zone {
  border: 1px solid #ef4444;
  padding: 20px;
  border-radius: 8px;
}

.danger-zone h4 {
  color: #ef4444;
  font-size: 18px;
  margin-bottom: 10px;
}

.danger-zone p {
  color: #aaa;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: #ff6b6b;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.3);
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-confirm-delete {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm-delete:hover {
  background: #ff6b6b;
}

.success-msg {
  color: #00ff00;
  margin-top: 15px;
  font-weight: 600;
}

.error-msg {
  color: #ff4444;
  margin-top: 15px;
  font-weight: 600;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static;
    height: auto;
    padding: 20px;
  }

  .content {
    padding: 20px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>