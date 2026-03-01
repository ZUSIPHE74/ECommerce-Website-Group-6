<template>
  <div class="careers-container">
    <div class="header-section">
      <h1>Join the <span>Team</span></h1>
      <p>Help us redefine the boundaries of modern travel.</p>
    </div>

    <div class="culture-section">
      <h3>Why Work with Arc Travel?</h3>
      <div class="benefits-grid">
        <div class="benefit">Innovation First</div>
        <div class="benefit">Remote Freedom</div>
        <div class="benefit">Global Impact</div>
      </div>
    </div>

    <div class="jobs-section">
      <h3>Open Positions</h3>
      <div class="job-item">
        <div class="job-info">
          <h4>Smart Gear Engineer</h4>
          <p>Full-time | Remote</p>
        </div>
        <button class="apply-btn">Apply</button>
      </div>
      <div class="job-item">
        <div class="job-info">
          <h4>UX Designer (Future Tech)</h4>
          <p>Full-time | Remote</p>
        </div>
        <button class="apply-btn">Apply</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.careers-container { padding: 60px 0; max-width: 900px; margin: 0 auto; }
.header-section { text-align: center; margin-bottom: 60px; }
h1 { font-size: 3rem; letter-spacing: 4px; }
h1 span { color: #00ffff; font-weight: 300; }

h3 { color: #00ffff; margin-bottom: 30px; border-bottom: 1px solid #2a2a2a; padding-bottom: 10px; }

.benefits-grid { display: flex; gap: 20px; margin-bottom: 60px; }
.benefit { flex: 1; padding: 20px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; text-align: center; }

.job-item { display: flex; justify-content: space-between; align-items: center; background: #1a1a1a; padding: 20px 30px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #2a2a2a; }
.job-info h4 { margin-bottom: 5px; color: white; }
.job-info p { color: #aaaaaa; font-size: 0.9rem; }

.apply-btn { padding: 10px 25px; border: 1px solid #00ffff; background: transparent; color: #00ffff; border-radius: 4px; cursor: pointer; transition: 0.3s; }
.apply-btn:hover { background: #00ffff; color: black; }
</style>
