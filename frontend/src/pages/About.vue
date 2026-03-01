<template>
  <div class="about-page">
    <!-- Hero Section with Mission -->
    <section class="about-hero">
      <h1 class="glitch-text">THE ARC <span class="cyan-text">MISSION</span></h1>
      <div class="mission-container">
        <p class="mission-statement">
          At Arc Travel, we believe that movement should be seamless, secure, and intelligent. 
          We exist to eliminate the friction of travel through advanced technology, giving you 
          the freedom to focus on what truly matters—the journey itself.
        </p>
      </div>
    </section>

    <!-- Why Us Section -->
    <section class="why-us-section">
      <h2 class="section-label">01. WHY ARC TRAVEL</h2>
      <div class="why-us-grid">
        <div class="why-us-card">
          <h3>Safety First</h3>
          <p>Every product is engineered with biometric encryption and anti-theft technology. Your peace of mind is our priority.</p>
        </div>
        <div class="why-us-card">
          <h3>Smart Technology</h3>
          <p>We integrate cutting-edge tech to make travel effortless—from GPS tracking to UV purification and smart charging.</p>
        </div>
        <div class="why-us-card">
          <h3>Global Perspective</h3>
          <p>Designed for the modern explorer, our gear adapts to any destination, any culture, any journey.</p>
        </div>
        <div class="why-us-card">
          <h3>Sustainable Innovation</h3>
          <p>We source aerospace-grade materials that are built to last, reducing waste and environmental impact.</p>
        </div>
      </div>
    </section>

    <!-- Our Story / Philosophy -->
    <section class="philosophy-section">
      <h2 class="section-label">02. OUR PHILOSOPHY</h2>
      <div class="philosophy-content">
        <p class="philosophy-text">
          We started Arc Travel because we were tired of lost luggage, dead batteries, and uncomfortable journeys. 
          <span class="cyan-text">We asked ourselves: Why can't travel gear be as smart as our phones?</span>
        </p>
        <p class="philosophy-text">
          Today, we engineer products that anticipate your needs. From luggage that tracks itself to backpacks that charge your devices, 
          every detail is designed to make your journey smoother. We don't just sell gear—we provide peace of mind.
        </p>
        <div class="quote-block">
          <p>"Technology should serve the traveler, not complicate the journey."</p>
          <span class="quote-author">— The Arc Travel Team</span>
        </div>
      </div>
    </section>

    <!-- Leadership Team Section -->
    <section class="leadership-section">
      <h2 class="section-label">03. LEADERSHIP TEAM</h2>
      <p class="section-intro">Seasoned professionals dedicated to transforming the travel experience through innovation and design.</p>
      
      <div class="leadership-grid">
        <!-- Project Manager -->
        <div class="leadership-card">
          <div class="card-header">
            <span class="role-badge">PROJECT MANAGEMENT</span>
          </div>
          <div class="card-content">
            <h3 class="member-name">ZUSIPHE SIDIMBA</h3>
            <p class="member-title">Project Manager</p>
            <p class="member-bio">Leads the vision and execution of Arc Travel, ensuring every product aligns with our mission of safe, smart travel solutions.</p>
          </div>
        </div>

        <!-- Marketing Lead -->
        <div class="leadership-card">
          <div class="card-header">
            <span class="role-badge">MARKETING</span>
          </div>
          <div class="card-content">
            <h3 class="member-name">TAMRYN RIPEPI</h3>
            <p class="member-title">Marketing Lead</p>
            <p class="member-bio">Drives market research and customer insights, identifying opportunities and developing strategies to reach modern travelers.</p>
          </div>
        </div>

        <!-- Product Designer -->
        <div class="leadership-card">
          <div class="card-header">
            <span class="role-badge">PRODUCT DESIGN</span>
          </div>
          <div class="card-content">
            <h3 class="member-name">AYOLA DUKA</h3>
            <p class="member-title">Product Designer</p>
            <p class="member-bio">Designs the complete product range, focusing on user experience, functionality, and the seamless integration of smart technology.</p>
          </div>
        </div>

        <!-- Web Developer -->
        <div class="leadership-card">
          <div class="card-header">
            <span class="role-badge">TECHNOLOGY</span>
          </div>
          <div class="card-content">
            <h3 class="member-name">BUHLE GWELE</h3>
            <p class="member-title">Lead Developer</p>
            <p class="member-bio">Builds the digital infrastructure, payment systems, and ensures a seamless online experience for every customer.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values - Circular Styling -->
    <section class="values-section">
      <h2 class="section-label">04. CORE VALUES</h2>
      <div class="values-circle-grid">
        <div class="value-circle" v-for="value in values" :key="value.id">
          <div class="circle-content">
            <span class="value-code">{{ value.id }}</span>
            <h4>{{ value.title }}</h4>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const values = [
  { 
    id: 'ALPHA', 
    title: 'AEROSPACE GRADE', 
    description: 'Materials sourced from the highest tiers of engineering for durability you can trust.' 
  },
  { 
    id: 'BETA', 
    title: 'SEAMLESS SYNC', 
    description: 'Every device communicates within the Arc Travel ecosystem for effortless travel.' 
  },
  { 
    id: 'GAMMA', 
    title: 'GLOBAL LOGISTICS', 
    description: 'Fast, secure delivery to any point on the globe, because adventure has no borders.' 
  },
  { 
    id: 'DELTA', 
    title: 'VAULT SECURITY', 
    description: 'Your data and gear are protected by biometric encryption—safety first, always.' 
  }
]
</script>

<style scoped>
.about-page {
  background: #121212;
  color: #fff;
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Cyan Text Accent */
.cyan-text {
  color: #00ffff;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

/* Section Labels */
.section-label {
  font-size: 14px;
  color: #00ffff;
  letter-spacing: 4px;
  text-transform: uppercase;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 12px;
  margin-bottom: 30px;
  font-weight: 600;
}

.section-intro {
  color: #aaa;
  font-size: 16px;
  margin-bottom: 40px;
  max-width: 700px;
  line-height: 1.6;
}

/* Hero Section */
.about-hero {
  text-align: center;
  margin-bottom: 80px;
  padding: 40px 0;
}

.glitch-text {
  font-size: 48px;
  letter-spacing: 8px;
  font-weight: 900;
  margin-bottom: 30px;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .glitch-text {
    font-size: 64px;
    letter-spacing: 12px;
  }
}

.mission-container {
  max-width: 800px;
  margin: 0 auto;
}

.mission-statement {
  color: #e0e0e0;
  line-height: 1.8;
  font-size: 18px;
  font-weight: 300;
}

/* Why Us Section */
.why-us-section {
  margin-bottom: 80px;
}

.why-us-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.why-us-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  padding: 35px 25px;
  transition: all 0.3s ease;
  border-radius: 4px;
  text-align: center;
}

.why-us-card:hover {
  border-color: #00ffff;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.1);
}

.why-us-card h3 {
  color: #00ffff;
  font-size: 20px;
  margin-bottom: 15px;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 12px;
}

.why-us-card h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: #00ffff;
}

.why-us-card p {
  color: #aaa;
  line-height: 1.6;
  font-size: 14px;
}

/* Philosophy Section */
.philosophy-section {
  margin-bottom: 80px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  padding: 50px;
  border-radius: 4px;
}

.philosophy-content {
  max-width: 800px;
  margin: 0 auto;
}

.philosophy-text {
  font-size: 18px;
  line-height: 1.8;
  color: #ddd;
  margin-bottom: 25px;
}

.quote-block {
  margin-top: 40px;
  padding: 30px;
  border-left: 4px solid #00ffff;
  background: rgba(0, 255, 255, 0.05);
}

.quote-block p {
  font-size: 20px;
  font-style: italic;
  color: #fff;
  margin-bottom: 10px;
}

.quote-author {
  color: #00ffff;
  font-size: 14px;
  letter-spacing: 2px;
}

/* Leadership Team Section */
.leadership-section {
  margin-bottom: 80px;
}

.leadership-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.leadership-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.leadership-card:hover {
  border-color: #00ffff;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.15);
}

.card-header {
  background: rgba(0, 255, 255, 0.05);
  padding: 12px 20px;
  border-bottom: 1px solid #2a2a2a;
}

.role-badge {
  color: #00ffff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.card-content {
  padding: 25px 20px;
}

.member-name {
  font-size: 22px;
  color: #fff;
  margin-bottom: 6px;
  letter-spacing: 1px;
  font-weight: 600;
}

.member-title {
  color: #888;
  font-size: 14px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #2a2a2a;
}

.member-bio {
  color: #aaa;
  font-size: 14px;
  line-height: 1.7;
}

/* Values Section - Circular Styling */
.values-section {
  margin-top: 60px;
}

.values-circle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  justify-items: center;
  padding: 20px 0;
}

.value-circle {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1/1;
  border: 2px solid #00ffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  transition: all 0.4s ease;
  background: #1a1a1a;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
}

.value-circle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.value-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
  border-color: #fff;
}

.value-circle:hover::before {
  opacity: 1;
}

.circle-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.value-code {
  color: #00ffff;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: 700;
  display: block;
  margin-bottom: 15px;
  letter-spacing: 2px;
}

.value-circle h4 {
  color: #fff;
  font-size: 16px;
  letter-spacing: 2px;
  margin-bottom: 15px;
  line-height: 1.4;
  font-weight: 600;
}

.value-circle p {
  color: #aaa;
  font-size: 12px;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .glitch-text {
    font-size: 32px;
    letter-spacing: 6px;
  }
  
  .philosophy-section {
    padding: 30px 20px;
  }
  
  .philosophy-text {
    font-size: 16px;
  }
  
  .quote-block p {
    font-size: 18px;
  }
  
  .leadership-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .values-circle-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
  }
  
  .value-circle {
    max-width: 240px;
    padding: 25px;
  }
}
</style>