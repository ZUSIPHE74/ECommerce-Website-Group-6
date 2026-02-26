<template>
  <section class="contact">
    <h2>Contact Us</h2>

    <form @submit.prevent="submitForm" class="contact-form">

      <input
        v-model="form.name"
        type="text"
        placeholder="Full Name"
        required
      />

      <input
        v-model="form.email"
        type="email"
        placeholder="Email Address"
        required
      />

      <input
        v-model="form.subject"
        type="text"
        placeholder="Subject"
      />

      <textarea
        v-model="form.message"
        placeholder="Your Message"
        rows="5"
        required
      ></textarea>

      <button type="submit" :disabled="loading">
        {{ loading ? "Sending..." : "Send Message" }}
      </button>

      <p v-if="successMessage" class="success">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>

    </form>
  </section>
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

    if (!res.ok) throw new Error()

    successMessage.value = "Message sent successfully!"

    // Clear form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''

  } catch (error) {
    errorMessage.value = "Failed to send message. Please try again."
  }

  loading.value = false
}
</script>

<style scoped>
.contact {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  background: #000303;
  border: 1px solid #6fd5fa;
}

.contact h2 {
  text-align: center;
  margin-bottom: 20px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  font-family: Arial, Helvetica, sans-serif;
}

.contact-form input,
.contact-form textarea {
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

.contact-form button {
  padding: 10px;
  background-color: #15a6b1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.contact-form button:hover {
  background-color: #09bbda;
}

.success {
  margin-top: 10px;
  color: rgb(22, 172, 227);
}

.error {
  margin-top: 10px;
  color: rgb(61, 174, 182);
}
</style>
