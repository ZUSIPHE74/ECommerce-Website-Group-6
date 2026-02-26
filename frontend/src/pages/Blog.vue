<template>
  <div class="blog-container">
    <div class="header-section">
      <h1>The Arc <span>Blog</span></h1>
      <p>Insights into the future of travel and smart luggage technology.</p>
    </div>

    <div class="blog-grid">
      <div v-for="post in posts" :key="post.id" class="blog-card">
        <div class="blog-image">🖼️</div>
        <div class="blog-info">
          <span class="category">{{ post.category }}</span>
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt }}</p>
          <a href="#" class="read-more">Read More →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const posts = [
  { id: 1, title: 'Mastering Jet Lag with Lume E1', category: 'Travel Tips', excerpt: 'How our latest sleep mask uses light therapy to reset your internal clock...' },
  { id: 2, title: 'The Future of Sustainable Luggage', category: 'Innovation', excerpt: 'Exploring the carbon-fiber tech that makes Arc gear last a lifetime...' },
  { id: 3, title: 'Top 5 Digital Nomad Terminals', category: 'Destinations', excerpt: 'The best airports in the world for working efficiently while on the move...' }
];
</script>

<style scoped>
.blog-container { padding: 60px 0; max-width: 1200px; margin: 0 auto; }
.header-section { text-align: center; margin-bottom: 60px; }
h1 { font-size: 3rem; letter-spacing: 4px; }
h1 span { color: #00ffff; font-weight: 300; }

.blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
.blog-card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; transition: 0.3s; }
.blog-card:hover { transform: translateY(-10px); border-color: #00ffff; }
.blog-image { height: 200px; background: #252525; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
.blog-info { padding: 25px; }
.category { color: #00ffff; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
h3 { margin: 10px 0; color: white; }
p { color: #aaaaaa; font-size: 0.9rem; line-height: 1.6; margin-bottom: 20px; }
.read-more { color: #00ffff; text-decoration: none; font-weight: 700; font-size: 0.9rem; }
</style>
