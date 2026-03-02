<template>
  <div class="contact-container">
    <div class="header-section">
      <h1>Contact <span>Us</span></h1>
      <p>Have questions? We're here to help you 24/7.</p>
    </div>

    <div class="contact-grid">
      <div class="contact-form-card">
        <h3>Send us a Message</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your Name" required />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Your Email" required />
          </div>
          <div class="form-group">
            <label>Subject</label>
            <input type="text" placeholder="Topic" />
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea rows="5" placeholder="How can we help?" required></textarea>
          </div>
          <button type="submit" class="submit-btn">Send Message</button>
        </form>
      </div>

      <div class="contact-info-card">
        <h3>Get in Touch</h3>
        <div class="info-item">
          <div class="icon">📍</div>
          <div class="text">
            <h4>Location</h4>
            <p>123 Stealth Terminal, Cyber City, WC 8080</p>
          </div>
        </div>
        <div class="info-item">
          <div class="icon">📞</div>
          <div class="text">
            <h4>Phone</h4>
            <p>+27 (0) 12 345 6789</p>
          </div>
        </div>
        <div class="info-item">
          <div class="icon">✉️</div>
          <div class="text">
            <h4>Email</h4>
            <p>support@arctravel.com</p>
          </div>
        </div>
        <div class="info-item">
          <div class="icon">🕒</div>
          <div class="text">
            <h4>Office Hours</h4>
            <p>Monday - Friday: 09:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleSubmit = () => {
  alert('Thank you for your message! Our team will get back to you shortly.');
};
</script>

<style scoped>
.contact-container {
  padding: 40px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 60px;
}

h1 {
  font-size: 3rem;
  letter-spacing: 4px;
  margin-bottom: 20px;
}

h1 span {
  color: #00ffff;
  font-weight: 300;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1.51fr 1fr;
  gap: 40px;
}

.contact-form-card, .contact-info-card {
  background: #1a1a1a;
  padding: 40px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
}

h3 {
  margin-bottom: 30px;
  font-size: 1.5rem;
  color: #00ffff;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #aaaaaa;
}

input, textarea {
  width: 100%;
  padding: 12px;
  background: #252525;
  border: 1px solid #333;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #00ffff;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #00ffff;
  color: black;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.submit-btn:hover {
  background: white;
  box-shadow: 0 0 20px #00ffff;
}

.info-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.icon {
  font-size: 1.5rem;
}

.text h4 {
  margin-bottom: 5px;
  color: white;
}

.text p {
  color: #aaaaaa;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
