<template>
  <div class="profile-container" v-if="user">
    <div class="profile-header">
      <div class="avatar-placeholder">{{ user.full_name.charAt(0) }}</div>
      <h1>{{ user.full_name }}</h1>
      <p class="email">{{ user.email }}</p>
      <button @click="logout" class="btn btn-outline" style="margin-top: 1rem;">Sign Out</button>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>My Orders</h3>
        <p>No active orders</p>
      </div>
      <div class="card">
        <h3>Wishlist</h3>
        <p>Your wishlist is empty</p>
      </div>
      <div class="card">
        <h3>Address Book</h3>
        <p>Manage your shipping addresses</p>
      </div>
      <div class="card">
        <h3>Account Settings</h3>
        <p>Update password and details</p>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    Loading profile...
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null
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
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      this.user = await response.json();
    } catch (err) {
      console.error(err);
      this.logout();
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 60px;
  border-bottom: 1px solid #eee;
  padding-bottom: 40px;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto 20px;
}

.email {
  color: #666;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.card {
  border: 1px solid #eee;
  padding: 30px;
  transition: 0.3s;
  cursor: pointer;
}

.card:hover {
  border-color: #000;
  box-shadow: 5px 5px 0px #000;
}

.card h3 {
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.card p {
  font-size: 0.9rem;
  color: #666;
}

.loading {
  text-align: center;
  padding: 50px;
}
</style>