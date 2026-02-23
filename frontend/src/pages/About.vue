<template>
  <div class="about-page">
    <section class="about-hero">
      <h1 class="glitch-text">THE ARC <span class="cyan-text">MISSION</span></h1>
      <p class="mission-statement">
        We don't just build travel gear. We engineer the bridge between where you are and where you’re going. 
        Arc Travel exists to eliminate the friction of movement through advanced biometrics and sustainable materials.
      </p>
    </section>

    <section class="team-section">
      <h2 class="section-label">01. COMMAND</h2>
      <div class="members-grid manager-highlight">
        <div class="member-card" v-for="manager in managers" :key="manager.name">
          <div class="photo-container">
            <img :src="manager.photo" :alt="manager.name" />
            <div class="scan-line"></div>
          </div>
          <div class="member-info">
            <h3>{{ manager.name }}</h3>
            <p class="role-tag">{{ manager.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section">
      <h2 class="section-label">02. THE EXPEDITION CREW</h2>
      <div class="members-grid">
        <div class="member-card" v-for="person in retailTeam" :key="person.name">
          <div class="photo-container secondary">
            <img :src="person.photo" :alt="person.name" />
          </div>
          <div class="member-info">
            <h3>{{ person.name }}</h3>
            <p class="role-tag">{{ person.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="values-grid">
      <div class="value-item" v-for="value in values" :key="value.title">
        <span class="value-index">[{{ value.id }}]</span>
        <h4>{{ value.title }}</h4>
        <p>{{ value.text }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const managers = [
  { name: 'ALICE JOHNSON', role: 'RETAIL DIRECTOR', photo: '' }
]

const retailTeam = [
  { name: 'BUHLE', role: 'EXPEDITION SPECIALIST', photo: '' },
  { name: 'ZUSIPHE', role: 'EXPEDITION SPECIALIST', photo: '' },
  { name: 'DAVID', role: 'EXPEDITION SPECIALIST', photo: '' }
]

const values = [
  { id: 'ALPHA', title: 'AEROSPACE GRADE', text: 'Materials sourced from the highest tiers of engineering.' },
  { id: 'BETA', title: 'SEAMLESS SYNC', text: 'Every device communicates within the Arc Travel ecosystem.' },
  { id: 'GAMMA', title: 'GLOBAL LOGISTICS', text: 'Fast, secure delivery to any point on the globe.' },
  { id: 'DELTA', title: 'VAULT SECURITY', text: 'Your data and gear are protected by biometric encryption.' }
]
</script>

<style scoped>
.about-page {
  background: #121212;
  color: #fff;
  padding: 80px 20px;
}

/* 1. Hero / Mission */
.about-hero {
  text-align: center;
  margin-bottom: 100px;
}

.glitch-text {
  font-size: 3.5rem;
  letter-spacing: 10px;
  font-weight: 900;
}

.cyan-text {
  color: #00ffff;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.mission-statement {
  max-width: 800px;
  margin: 20px auto;
  color: #888;
  line-height: 1.8;
  font-size: 1.1rem;
}

/* 2. Team Sections */
.team-section {
  margin-bottom: 80px;
}

.section-label {
  font-size: 0.8rem;
  color: #00ffff;
  letter-spacing: 4px;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 10px;
  margin-bottom: 40px;
}

.members-grid {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

/* 3. Member Cards */
.member-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  padding: 10px;
  transition: 0.3s;
  width: 240px;
}

.photo-container {
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
  position: relative;
  border: 1px solid #333;
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: 0.5s;
}

.member-card:hover img {
  filter: grayscale(0%);
  transform: scale(1.1);
}

.member-card:hover {
  border-color: #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
}

/* Scan-line animation for the manager */
.scan-line {
  position: absolute;
  top: 0; width: 100%; height: 2px;
  background: #00ffff;
  box-shadow: 0 0 10px #00ffff;
  animation: scan 3s infinite linear;
}

@keyframes scan {
  0% { top: 0%; }
  100% { top: 100%; }
}

.member-info {
  padding: 20px 10px;
}

.member-info h3 {
  font-size: 1rem;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.role-tag {
  font-size: 0.7rem;
  color: #00ffff;
  text-transform: uppercase;
}

/* 4. Values Section */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2px; /* For a grid-line look */
  background: #2a2a2a;
  margin-top: 100px;
  border: 1px solid #2a2a2a;
}

.value-item {
  background: #121212;
  padding: 40px;
  text-align: left;
}

.value-index {
  color: #444;
  font-family: monospace;
  display: block;
  margin-bottom: 10px;
}

.value-item h4 {
  color: #fff;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.value-item p {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>