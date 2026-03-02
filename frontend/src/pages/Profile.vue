<template>
  <div class="profile-page">
    <div class="profile-container" v-if="user">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-container">
            <div class="avatar-glow"></div>
            <div class="avatar">{{ user.full_name?.charAt(0) || 'U' }}</div>
          </div>
          <div class="header-info">
            <h1>{{ user.full_name }}</h1>
            <p class="role-tag">{{ user.role?.toUpperCase() || 'USER' }}</p>
          </div>
        </div>

        <div class="profile-grid">
          <div class="info-group">
            <label>Full Name</label>
            <p>{{ user.full_name }}</p>
          </div>
          <div class="info-group">
            <label>Email Address</label>
            <p>{{ user.email }}</p>
          </div>
          <div class="info-group">
            <label>Gender</label>
            <p>{{ user.gender || 'Not specified' }}</p>
          </div>
          <div class="info-group">
            <label>Country</label>
            <p>{{ user.country_name || 'Not specified' }}</p>
          </div>
          <div class="info-group">
            <label>Currency</label>
            <p>{{ user.currency_code || 'USD' }}</p>
          </div>
          <div class="info-group">
            <label>Member Since</label>
            <p>{{ formatDate(user.created_at) }}</p>
          </div>
        </div>

        <div class="actions">
          <!-- FIXED: Changed from /account/dashboard to /dashboard -->
          <router-link to="/dashboard/edit" class="btn-primary">Edit Your Profile</router-link>
          <button @click="closeProfile" class="btn-secondary">Close Profile</button>
        </div>
      </div>
    </div>
    <div v-else class="loading-state">
      <div class="loader"></div>
      <p>Deciphering Persona...</p>
    </div>
  </div>
</template>

<script>
import { getWithFallback } from '../utils/apiRequest'

export default {
  data() {
    return {
      user: null,
      loading: true,
      error: null
    }
  },
  async mounted() {
    const token = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user');
    
    if (!token) {
      this.$router.push('/login');
      return;
    }

    if (cachedUser) {
      try {
        this.user = JSON.parse(cachedUser);
      } catch (e) {
        console.error("Failed to parse cached user", e);
      }
    }

    try {
      // First try to get from localStorage for immediate display
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        this.user = JSON.parse(cachedUser);
      }

      // Then fetch fresh data from API
      const response = await getWithFallback('/api/user/profile', {
        'x-auth-token': token
      });
      
      console.log('Profile API response:', response); // Debug log
      
      // Handle the response structure from your backend
      if (response && response.success === true && response.user) {
        this.user = response.user;
      } else if (response && response.user) {
        this.user = response.user;
      } else if (response && typeof response === 'object') {
        this.user = response;
      }
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(this.user));
      this.loading = false;
      
    } catch (err) {
      console.error('Profile fetch error:', err);
      this.error = err.message;
      // If API fails but we have cached user, keep showing it
      if (!this.user) {
        this.logout();
      }
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    closeProfile() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #121212;
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.profile-container {
  width: 100%;
  max-width: 800px;
  padding: 40px 20px;
}

.profile-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 50px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
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
  margin-bottom: 50px;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 30px;
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.avatar {
  position: relative;
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
  font-size: 35.2px;
  letter-spacing: -1px;
  margin: 0;
  text-transform: uppercase;
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
  margin-top: 10px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
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
  font-size: 17.6px;
  color: #f5f5f5;
  margin: 0;
}

.actions {
  display: flex;
  gap: 20px;
}

.btn-primary {
  flex: 1;
  background: #00ffff;
  color: #121212;
  padding: 15px;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: #ffffff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.btn-secondary {
  padding: 15px 30px;
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #ef4444;
  color: white;
}

.loading-state {
  text-align: center;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid #2a2a2a;
  border-radius: 50%;
  border-top-color: #00ffff;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  .actions {
    flex-direction: column;
  }
}
</style>