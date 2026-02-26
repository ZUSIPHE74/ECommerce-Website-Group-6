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
import Contact from '../pages/Contact.vue'
import FAQ from '../pages/FAQ.vue'
import ShippingPolicy from '../pages/ShippingPolicy.vue'
import ReturnsRefundPolicy from '../pages/ReturnsRefundPolicy.vue'
import TrackOrder from '../pages/TrackOrder.vue'
import PrivacyPolicy from '../pages/PrivacyPolicy.vue'
import TermsConditions from '../pages/TermsConditions.vue'
import CookiePolicy from '../pages/CookiePolicy.vue'
import Blog from '../pages/Blog.vue'
import Careers from '../pages/Careers.vue'
import Disclaimer from '../pages/Disclaimer.vue'
import SecurityPayment from '../pages/SecurityPayment.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/blog', component: Blog },
  { path: '/careers', component: Careers },
  { path: '/security-payment', component: SecurityPayment },
  { path: '/contact', component: Contact },
  { path: '/faq', component: FAQ },
  { path: '/shipping-policy', component: ShippingPolicy },
  { path: '/returns-policy', component: ReturnsRefundPolicy },
  { path: '/track-order', component: TrackOrder },
  { path: '/privacy-policy', component: PrivacyPolicy },
  { path: '/terms-conditions', component: TermsConditions },
  { path: '/cookie-policy', component: CookiePolicy },
  { path: '/disclaimer', component: Disclaimer },
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
