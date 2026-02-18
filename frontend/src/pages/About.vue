<template>
  <div class="about-page">
    <section class="hero">
      <h1>About MyStore</h1>
      <p>Our mission is to provide the best online shopping experience for everyone.</p>
    </section>

    <!-- Retail Manager -->
    <section class="team-manager">
      <h2>Retail Manager</h2>
      <div class="members">
        <div class="member" v-for="manager in managers" :key="manager.name">
          <img :src="manager.photo" :alt="manager.name" />
          <h3>{{ manager.name }}</h3>
          <p>{{ manager.role }}</p>
        </div>
      </div>
    </section>

    <!-- Retail Team -->
    <section class="team">
      <h2>Retail Team</h2>
      <div class="members">
        <div class="member" v-for="person in retailTeam" :key="person.name">
          <img :src="person.photo" :alt="person.name" />
          <h3>{{ person.name }}</h3>
          <p>{{ person.role }}</p>
        </div>
      </div>
    </section>

    <section class="values">
      <h2>Our Values</h2>
      <ul>
        <li>✅ Quality products</li>
        <li>✅ Excellent customer service</li>
        <li>✅ Fast and reliable delivery</li>
        <li>✅ Easy and secure shopping experience</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
const managers = [
  { name: 'Alice Johnson', role: 'Retail Manager', photo: '/assets/team/manager.jpg' }
]

const retailTeam = [
  { name: 'Buhle', role: 'Sales Associate', photo: '/assets/team/buhle.jpg' },
  { name: 'Zusiphe', role: 'Sales Associate', photo: '/assets/team/zusiphe.jpg' },
  { name: 'David', role: 'Sales Associate', photo: '/assets/team/david.jpg' }
]
</script>

<style scoped>
.about-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #1e293b;
}

.hero p {
  font-size: 1.2rem;
  color: #334155;
  margin-bottom: 50px;
}

.team-manager, .team {
  margin-bottom: 50px;
}

.team-manager h2, .team h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #1e293b;
}

.members {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.member {
  background: #f3f4f6;
  padding: 20px;
  border-radius: 8px;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.member img {
  width: 100%;
  border-radius: 50%;
  margin-bottom: 10px;
}

.member h3 {
  margin-bottom: 5px;
  color: #1e293b;
}

.member p {
  color: #475569;
  font-size: 0.9rem;
}

.values h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #1e293b;
}

.values ul {
  list-style: none;
  padding: 0;
}

.values li {
  font-size: 1rem;
  margin: 10px 0;
  color: #334155;
}
</style>
