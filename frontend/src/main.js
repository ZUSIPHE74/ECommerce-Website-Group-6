import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { detectCurrencyCode } from './utils/currency'

const app = createApp(App)

if (!localStorage.getItem('currency_code')) {
  localStorage.setItem('currency_code', detectCurrencyCode())
}

app.use(router)
app.use(store)

app.mount('#app')
