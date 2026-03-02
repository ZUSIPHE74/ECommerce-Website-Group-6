<template>
  <div class="faq-container">
    <div class="header-section">
      <h1>Frequently Asked <span>Questions</span></h1>
      <p>Everything you need to know about the Arc Travel ecosystem.</p>
    </div>

    <div class="faq-list">
      <div v-for="(item, index) in faqs" :key="index" class="faq-item">
        <div class="faq-question" @click="toggleFaq(index)">
          <span>{{ item.question }}</span>
          <span class="toggle">{{ activeIndex === index ? '−' : '+' }}</span>
        </div>
        <div v-if="activeIndex === index" class="faq-answer">
          {{ item.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(null);

const faqs = [
  {
    question: "What is the Horizon S1 Luggage made of?",
    answer: "The Horizon S1 features a high-grade carbon-fiber shell, making it extremely durable yet lightweight for global transit."
  },
  {
    question: "How does the biometric security work?",
    answer: "Our smart luggage uses integrated fingerprint scanners. You can register up to 5 fingerprints via the Arc Travel mobile app."
  },
  {
    question: "What is your shipping policy?",
    answer: "We offer free priority shipping on all orders over R1000. For orders below that, a flat rate of R500 applies."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking link. You can also track your order directly on our 'Track Order' page."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to over 50 countries worldwide. Customs and import duties are calculated at checkout."
  }
];

const toggleFaq = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<style scoped>
.faq-container {
  padding: 40px 0;
  max-width: 800px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 60px;
}

h1 {
  font-size: 2.5rem;
  letter-spacing: 4px;
  margin-bottom: 20px;
}

h1 span {
  color: #00ffff;
  font-weight: 300;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.faq-item {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.faq-question:hover {
  background: #252525;
  color: #00ffff;
}

.faq-answer {
  padding: 20px;
  background: #121212;
  color: #aaaaaa;
  line-height: 1.6;
  border-top: 1px solid #2a2a2a;
}

.toggle {
  color: #00ffff;
  font-size: 1.5rem;
}
</style>
