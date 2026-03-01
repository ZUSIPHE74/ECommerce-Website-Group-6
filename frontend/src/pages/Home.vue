<template>
  <div class="home-page">
    <!-- Hero Section with Animated Background -->
    <section class="hero" :style="{ backgroundImage: `url(${currentImage})` }">
      <div class="hero-overlay"></div>
      <div class="glass-frame">
        <div class="badge">ARC TRAVEL ECOSYSTEM</div>
        <h1 class="hero-title">
          <span class="line-one">ENGINEERED FOR</span>
          <span class="line-two cyan-text">THE JOURNEY</span>
        </h1>
        <p class="hero-subtitle">Where advanced technology meets seamless travel</p>
        
        <div class="hero-actions">
          <button @click="goToShop" class="btn-primary">
            <span>Shop Products</span>
            <ArrowRight class="btn-icon" size="18" />
          </button>
          <button @click="goToAbout" class="btn-secondary">
            Discover More
          </button>
        </div>
      </div>
      
      <div class="slider-controls">
        <div class="slider-dots">
          <span v-for="(img, index) in images" :key="index" 
                :class="{ active: currentIndex === index }"
                @click="currentIndex = index"></span>
        </div>
        <div class="slider-counter">
          <span class="current">{{ formatIndex(currentIndex + 1) }}</span>
          <span class="separator">/</span>
          <span class="total">{{ formatIndex(images.length) }}</span>
        </div>
      </div>
      
      
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="section-header">
        <span class="section-tag">01. CORE TECHNOLOGIES</span>
        <h2 class="section-title">Built for the <span class="cyan-text">modern explorer</span></h2>
        <p class="section-description">Every product in the Arc ecosystem is engineered with precision, combining aerospace-grade materials with cutting-edge technology.</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">
            <component :is="feature.icon" size="32" />
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <div class="feature-stats">
            <div class="stat" v-for="(stat, idx) in feature.stats" :key="idx">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Showcase -->
    <section class="showcase">
      <div class="section-header">
        <span class="section-tag">02. THE COLLECTION</span>
        <h2 class="section-title">Intelligent <span class="cyan-text">travel essentials</span></h2>
      </div>
      
      <div class="showcase-grid">
        <div class="showcase-card" v-for="product in featuredProducts" :key="product.name">
          <div class="card-image">
            <img :src="product.image" :alt="product.name">
            <div class="card-badge">{{ product.category }}</div>
          </div>
          <div class="card-content">
            <h4>{{ product.name }}</h4>
            <p>{{ product.description }}</p>
            <div class="card-footer">
              <span class="price">{{ formatMoney(product.price) }}</span>
              <button class="btn-icon-only" @click="viewProduct(product)">
                <ArrowRight size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="showcase-cta">
        <button @click="goToShop" class="btn-outline">
          View All Products
        </button>
      </div>
    </section>

    <!-- Technology Stats -->
    <section class="stats">
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <span class="stat-number">{{ stat.number }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to transform your journey?</h2>
        <p>Join thousands of travelers who trust Arc technology</p>
        <button @click="goToShop" class="btn-primary btn-large">
          Start Exploring
          <ArrowRight class="btn-icon" size="20" />
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowRight, 
  ChevronDown,
  Shield,
  Zap,
  Globe,
  Battery,
  Cpu,
  MapPin
} from 'lucide-vue-next'
import { formatMoney } from '../utils/currency'

const router = useRouter()

// Hero Images
const images = ref([
  'https://images.unsplash.com/photo-1685388180103-9b01db9d8521?q=80&w=701&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1684503830891-27e71ff697e3?q=80&w=701&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1684503830683-108f3e0fd03f?q=80&w=701&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
])

const currentIndex = ref(0)
const currentImage = computed(() => images.value[currentIndex.value])

// Features Data
const features = ref([
  {
    icon: Shield,
    title: 'Aerospace Grade',
    description: 'Carbon-fiber construction meets military-grade durability standards.',
    stats: [
      { value: '60%', label: 'Stronger' },
      { value: '40%', label: 'Lighter' }
    ]
  },
  {
    icon: Zap,
    title: 'Instant Sync',
    description: 'Real-time connectivity across all Arc devices via encrypted Wi-Fi.',
    stats: [
      { value: '0.3s', label: 'Sync Time' },
      { value: '24/7', label: 'Connectivity' }
    ]
  },
  {
    icon: Shield,
    title: 'Secure Transit',
    description: 'Biometric locking with global GPS tracking and geofencing alerts.',
    stats: [
      { value: '100%', label: 'Encrypted' },
      { value: 'Real-time', label: 'Tracking' }
    ]
  }
])

// Featured Products
const featuredProducts = ref([
  {
    name: 'Horizon S1',
    category: 'Luggage',
    description: 'Smart luggage with biometric lock and GPS tracking',
    price: 3400.00,
    image: 'https://images.unsplash.com/photo-1673505705680-36437a06ee27?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D'
  },
  {
    name: 'Pulse B1',
    category: 'Backpack',
    description: 'Anti-theft backpack with USB-C charging',
    price: 2600.00,
    image: 'https://images.unsplash.com/photo-1673505379592-aa9052cc7e65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D'
  },
  {
    name: 'Zenith',
    category: 'Audio',
    description: 'Noise-cancelling headset with biometric monitoring',
    price: 1300.00,
    image: 'https://plus.unsplash.com/premium_photo-1677838847804-4054143fb91a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
])

// Stats Data
const stats = ref([
  { number: '10k+', label: 'Active Travelers' },
  { number: '50+', label: 'Countries' },
  { number: '99.9%', label: 'Security Rating' },
  { number: '24/7', label: 'Global Support' }
])

// Auto-slider
onMounted(() => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }, 5000)
})

const formatIndex = (num) => {
  return num.toString().padStart(2, '0')
}

const goToShop = () => {
  router.push('/shop')
}

const goToAbout = () => {
  router.push('/about')
}

const viewProduct = (product) => {
  router.push('/shop')
}
</script>

<style scoped>
.home-page {
  background: #121212;
  color: white;
  overflow: hidden;
}

/* ====================
   Hero Section
==================== */
.hero {
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease-in-out;
  position: relative;
  border-bottom: 1px solid #2a2a2a;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%);
}

.glass-frame {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 40px;
  text-align: center;
}

.badge {
  display: inline-block;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffff;
  color: #00ffff;
  padding: 8px 16px;
  font-size: 12px;
  letter-spacing: 3px;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
}

.line-one {
  display: block;
  color: white;
  letter-spacing: 8px;
}

.line-two {
  display: block;
  font-size: 72px;
  letter-spacing: 12px;
}

.cyan-text {
  color: #00ffff;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
}

.hero-subtitle {
  font-size: 18px;
  color: #aaa;
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-primary {
  background: #00ffff;
  color: #121212;
  border: none;
  padding: 16px 32px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 2px solid #00ffff;
}

.btn-primary:hover {
  background: transparent;
  color: #00ffff;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 16px 32px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: white;
  color: #121212;
  transform: translateY(-2px);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-icon {
  transform: translateX(5px);
}

/* Slider Controls */
.slider-controls {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 30px;
  z-index: 3;
}

.slider-dots {
  display: flex;
  gap: 12px;
}

.slider-dots span {
  width: 50px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dots span.active {
  background: #00ffff;
  box-shadow: 0 0 20px #00ffff;
}

.slider-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
}

.slider-counter .separator {
  color: #00ffff;
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 12px;
  letter-spacing: 2px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

/* ====================
   Section Headers
==================== */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  display: inline-block;
  color: #00ffff;
  font-size: 12px;
  letter-spacing: 4px;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.section-description {
  max-width: 600px;
  margin: 0 auto;
  color: #aaa;
  font-size: 16px;
  line-height: 1.8;
}

/* ====================
   Features Section
==================== */
.features {
  padding: 100px 50px;
  max-width: 1400px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  padding: 40px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.feature-card:hover {
  border-color: #00ffff;
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 255, 255, 0.1);
}

.feature-card:hover::before {
  transform: translateX(100%);
}

.feature-icon {
  color: #00ffff;
  margin-bottom: 25px;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  letter-spacing: 2px;
}

.feature-card p {
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 14px;
}

.feature-stats {
  display: flex;
  gap: 20px;
  border-top: 1px solid #2a2a2a;
  padding-top: 25px;
}

.stat {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #00ffff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ====================
   Showcase Section
==================== */
.showcase {
  padding: 100px 50px;
  background: #0a0a0a;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto 50px;
}

.showcase-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  overflow: hidden;
  transition: all 0.3s ease;
}

.showcase-card:hover {
  border-color: #00ffff;
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 255, 255, 0.15);
}

.card-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.showcase-card:hover .card-image img {
  transform: scale(1.1);
}

.card-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 255, 255, 0.9);
  color: #121212;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card-content {
  padding: 25px;
}

.card-content h4 {
  font-size: 20px;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.card-content p {
  color: #aaa;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #00ffff;
}

.btn-icon-only {
  width: 45px;
  height: 45px;
  border: 2px solid #00ffff;
  background: transparent;
  color: #00ffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-icon-only:hover {
  background: #00ffff;
  color: #121212;
  transform: scale(1.1);
}

.showcase-cta {
  text-align: center;
}

.btn-outline {
  background: transparent;
  color: #00ffff;
  border: 2px solid #00ffff;
  padding: 16px 48px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #00ffff;
  color: #121212;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
}

/* ====================
   Stats Section
==================== */
.stats {
  padding: 80px 50px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  padding: 50px;
}

.stat-card {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 48px;
  font-weight: 800;
  color: #00ffff;
  margin-bottom: 10px;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
}

.stat-card .stat-label {
  font-size: 14px;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ====================
   CTA Section
==================== */
.cta-section {
  padding: 120px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-top: 1px solid #2a2a2a;
  border-bottom: 1px solid #2a2a2a;
  text-align: center;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.cta-content p {
  font-size: 18px;
  color: #aaa;
  margin-bottom: 40px;
}

.btn-large {
  padding: 18px 48px;
  font-size: 16px;
}

/* ====================
   Responsive Design
==================== */
@media (max-width: 1200px) {
  .features-grid,
  .showcase-grid,
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .line-two {
    font-size: 48px;
    letter-spacing: 8px;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .features,
  .showcase,
  .stats {
    padding: 60px 20px;
  }
  
  .features-grid,
  .showcase-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .stats-grid {
    padding: 30px;
  }
  
  .stat-number {
    font-size: 36px;
  }
  
  .slider-controls {
    flex-direction: column;
    gap: 15px;
  }
  
  .scroll-indicator {
    display: none;
  }
}
</style>