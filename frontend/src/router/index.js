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
import Contact from '../pages/contact.vue'

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/about', component: About, name: 'About' },
  { path: '/contact', component: Contact, name: 'Contact' }, 
  { path: '/shop', component: Shop, name: 'Shop' },
  { path: '/cart', component: Cart, name: 'Cart' },
  { path: '/checkout', component: Checkout, name: 'Checkout' },
  { path: '/payment', component: Payment, name: 'Payment' },
  { path: '/order-success', component: OrderSuccess, name: 'OrderSuccess' },

  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/forgot-password', component: ForgotPassword, name: 'ForgotPassword' },

  { path: '/profile', redirect: '/account/profile' },
  { path: '/account/profile', component: Profile },
  { path: '/dashboard', component: ProfileDashboard },
  { path: '/account/dashboard', redirect: '/dashboard' },

  { path: '/:pathMatch(.*)*', redirect: '/' },

  {
  path: '/contact',
  name: 'Contact',
  component: Contact
}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router