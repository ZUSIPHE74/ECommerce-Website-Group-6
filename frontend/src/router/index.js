import { createRouter, createWebHistory } from 'vue-router'

import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import ForgotPassword from '../pages/ForgotPassword.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/profile', redirect: '/dashboard' }, // Redirect old profile to dashboard
  { path: '/forgot-password', component: ForgotPassword }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
