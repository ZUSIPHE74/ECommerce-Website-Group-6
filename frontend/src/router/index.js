import { createRouter, createWebHistory } from 'vue-router'

// Main Pages
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Shop from '../pages/Shop.vue'
import Cart from '../pages/Cart.vue'
import Checkout from '../pages/Checkout.vue'

// Auth
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

// Account
import Profile from '../pages/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/shop', component: Shop },
  { path: '/cart', component: Cart },

  // Checkout Route
  {
    path: '/checkout',
    component: Checkout,
  },

  // Login + Register (Nested)
  {
    path: '/login',
    component: Login,
    children: [
      {
        path: 'register',
        component: Register
      }
    ]
  },

  // Account + Profile (Nested)
  {
    path: '/account',
    component: { template: '<router-view />' }, // Wrapper
    children: [
      {
        path: 'profile',
        component: Profile
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
