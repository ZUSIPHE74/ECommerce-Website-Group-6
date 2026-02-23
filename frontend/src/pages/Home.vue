<template>
  <div class="home-page">
    <section class="hero" :style="{ backgroundImage: `url(${currentImage})` }">
      <div class="glass-frame">
        <h1 class="hero-title">ENGINEERED FOR <span class="cyan-text">THE JOURNEY</span></h1>
        <p class="hero-subtitle">Experience the Arc Travel Ecosystem.</p>
        
        <button @click="goToShop" class="arc-nav-btn">
          Shop Products
        </button>
      </div>
      
      <div class="slider-dots">
        <span v-for="(img, index) in images" :key="index" 
              :class="{ active: currentIndex === index }"
              @click="currentIndex = index"></span>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <div class="icon-glow"></div>
        <h2>Aerospace Quality</h2>
        <p>Carbon-fiber construction meets Tesla-inspired minimalist design.</p>
      </div>
      <div class="feature-card">
        <div class="icon-glow"></div>
        <h2>Instant Sync</h2>
        <p>Every product connects seamlessly to your Arc Travel App via Wi-Fi.</p>
      </div>
      <div class="feature-card">
        <div class="icon-glow"></div>
        <h2>Secure Transit</h2>
        <p>Biometric locking and global GPS tracking for peace of mind.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Add your generated product images here
const images = ref([
  'https://path-to-your-luggage-image.jpg',
  'https://path-to-your-headset-image.jpg',
  'https://path-to-your-backpack-image.jpg'
])

const currentIndex = ref(0)
const currentImage = computed(() => images.value[currentIndex.ref])

// Automatic Slider Logic
onMounted(() => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }, 5000)
})

const goToShop = () => {
  router.push('/shop')
}
</script>

<style scoped>
.home-page {
  background: #121212;
  color: white;
  overflow: hidden;
}

/* 1. Hero Section with Background Slide */
.hero {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease-in-out;
  border-radius: 20px;
  margin-bottom: 60px;
  position: relative;
  border: 1px solid #2a2a2a;
}

/* 2. The Glass Frame Box */
.glass-frame {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  padding: 60px;
  border-radius: 2px; /* Sharp, modern edges */
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  max-width: 600px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
}

.hero-title {
  font-size: 3rem;
  letter-spacing: 6px;
  font-weight: 800;
  margin-bottom: 10px;
}

.cyan-text {
  color: #00ffff;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
}

.hero-subtitle {
  font-size: 1.1rem;
  letter-spacing: 2px;
  margin-bottom: 40px;
  color: #cccccc;
  text-transform: uppercase;
}

/* 3. Shop Button (Styled like Navbar Active State) */
.arc-nav-btn {
  color: #121212;
  background: #ffffff; /* White in-box text effect */
  padding: 15px 40px;
  border: none;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: 0.3s;
}

.arc-nav-btn:hover {
  background: #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
  transform: translateY(-2px);
}

/* 4. Feature Section Styling */
.features {
  display: flex;
  gap: 20px;
  padding-bottom: 100px;
}

.feature-card {
  background: #1a1a1a;
  padding: 40px;
  flex: 1;
  border: 1px solid #2a2a2a;
  transition: 0.3s;
}

.feature-card:hover {
  border-color: #00ffff;
}

.icon-glow {
  font-size: 2rem;
  color: #00ffff;
  margin-bottom: 20px;
  display: block;
}

.feature-card h2 {
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 15px;
}

.feature-card p {
  color: #888;
  line-height: 1.6;
  font-size: 0.9rem;
}

/* Slider Indicators */
.slider-dots {
  position: absolute;
  bottom: 30px;
  display: flex;
  gap: 10px;
}

.slider-dots span {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.slider-dots span.active {
  background: #00ffff;
}
</style>