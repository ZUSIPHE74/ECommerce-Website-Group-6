<template>
  <div class="contact-page">
    <div class="contact-container">
      <h1 class="page-title">Contact Us</h1>
      <p class="subtitle">We'd love to hear from you</p>

      <form @submit.prevent="submitForm" class="contact-form">
        <div class="form-group">
          <label for="name">Full Name <span class="required">*</span></label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address <span class="required">*</span></label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="subject">Subject</label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            placeholder="What is this about?"
          />
        </div>

        <div class="form-group">
          <label for="message">Message <span class="required">*</span></label>
          <textarea
            id="message"
            v-model="form.message"
            placeholder="Type your message here..."
            rows="6"
            required
          ></textarea>
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading">Send Message</span>
          <span v-else class="loading-spinner">Sending...</span>
        </button>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function submitForm() {
  successMessage.value = ''
  errorMessage.value = ''
  loading.value = true

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send message')
    }

    successMessage.value = "Message sent successfully! We'll get back to you soon."

    // Clear form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''

  } catch (error) {
    errorMessage.value = error.message || "Failed to send message. Please try again."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #121212;
  padding: 40px 20px;
}

.contact-container {
  width: 100%;
  max-width: 600px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 50px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.contact-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
}

.page-title {
  font-size: 40px;
  color: #fff;
  margin: 0 0 8px 0;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.subtitle {
  color: #888;
  text-align: center;
  margin-bottom: 40px;
  font-size: 16px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #00ffff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.required {
  color: #ff4444;
  margin-left: 4px;
}

.form-group input,
.form-group textarea {
  background: transparent;
  border: 2px solid #00ffff;
  border-radius: 8px;
  padding: 14px 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  border-color: #fff;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #666;
  font-size: 14px;
}

.btn-submit {
  background: #00ffff;
  color: #121212;
  border: none;
  border-radius: 8px;
  padding: 16px;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  border: 2px solid #00ffff;
}

.btn-submit:hover:not(:disabled) {
  background: transparent;
  color: #00ffff;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 255, 255, 0.3);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  position: relative;
}

.success-message {
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  color: #00ff00;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff4444;
  color: #ff4444;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 768px) {
  .contact-container {
    padding: 30px 20px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .btn-submit {
    padding: 14px;
    font-size: 16px;
  }
}
</style>