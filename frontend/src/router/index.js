import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Shop from '../pages/Shop.vue'
import Cart from '../pages/Cart.vue'
import Checkout from '../pages/Checkout.vue'
import Payment from '../pages/Payment.vue'
import OrderSuccess from '../pages/OrderSuccess.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import ForgotPassword from '../pages/ForgotPassword.vue'
import Profile from '../pages/Profile.vue'
import ProfileDashboard from '../pages/ProfileDashboard.vue'

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/about', component: About, name: 'About' },
  { path: '/shop', component: Shop, name: 'Shop' },
  { path: '/cart', component: Cart, name: 'Cart' },
  { path: '/checkout', component: Checkout, name: 'Checkout' },
  { path: '/payment', component: Payment, name: 'Payment' },
  { path: '/order-success', component: OrderSuccess, name: 'OrderSuccess' },

  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/forgot-password', component: ForgotPassword, name: 'ForgotPassword' },

  { path: '/profile', redirect: { name: 'Profile' } },
  { path: '/account/profile', component: Profile, name: 'Profile' },
  { path: '/dashboard', component: ProfileDashboard, name: 'Dashboard' },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router