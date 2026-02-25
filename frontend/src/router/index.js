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
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/shop', component: Shop },
  { path: '/cart', component: Cart },
  { path: '/checkout', component: Checkout },
  { path: '/payment', component: Payment },
  { path: '/order-success', component: OrderSuccess },

  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },

  { path: '/profile', redirect: '/account/profile' },
  { path: '/account/profile', component: Profile },
  { path: '/dashboard', component: ProfileDashboard },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
