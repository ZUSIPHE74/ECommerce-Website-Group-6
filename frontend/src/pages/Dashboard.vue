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
      const response = await fetch('http://localhost:5050/api/user/profile', {
        headers: { 'x-auth-token': token }
      });
      
      if (!response.ok) throw new Error('Failed to load profile');
      
      this.user = await response.json();
      this.form = { ...this.user };
    } catch (err) {
      this.logout();
    }
  },
  methods: {
    async updateProfile() {
      try {
        this.message = '';
        this.error = '';
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:5050/api/user/profile', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(this.form)
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        this.message = 'Profile updated successfully!';
        this.user = { ...this.user, ...this.form };
      } catch (err) {
        this.error = err.message;
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
}

.sidebar {
  width: 250px;
  border-right: 1px solid #eee;
  padding: 40px 20px;
  background: #f9f9f9;
}

.user-info {
  text-align: center;
  margin-bottom: 40px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 10px;
}

.sidebar nav button {
  display: block;
  width: 100%;
  padding: 15px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  border-bottom: 1px solid #eee;
  transition: 0.2s;
}

.sidebar nav button:hover, .sidebar nav button.active {
  background: #000;
  color: #fff;
}

.content {
  flex: 1;
  padding: 40px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: bold;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
}

.success-msg { color: green; margin-top: 10px; }
.error-msg { color: red; margin-top: 10px; }
</style>
