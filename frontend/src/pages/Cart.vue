<template>
  <section class="cart">
    <h2>Shopping Cart</h2>

    <div v-if="cart.length === 0" class="empty-state">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <div class="cart-list">
        <article v-for="item in cart" :key="item.id" class="cart-item">
          <div>
            <h3>{{ item.name }}</h3>
            <p>Price: ${{ Number(item.price).toFixed(2) }}</p>
            <p>Qty: {{ item.quantity }}</p>
          </div>

          <p class="line-total">
            ${{ (Number(item.price) * Number(item.quantity)).toFixed(2) }}
          </p>
        </article>
      </div>

      <div class="summary">
        <p>Items: {{ cartCount }}</p>
        <p>Total: ${{ Number(cartTotal).toFixed(2) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const userId = 1;

const cart = computed(() => store.state.Cart || []);
const cartCount = computed(() => store.getters.cartCount || 0);
const cartTotal = computed(() => store.getters.cartTotal || 0);

onMounted(() => {
  store.dispatch('fetchCart', userId);
});
</script>

<style scoped>
.cart {
  max-width: 760px;
  margin: 0 auto;
}

.empty-state {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.cart-list {
  display: grid;
  gap: 12px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.cart-item h3 {
  margin: 0 0 6px;
}

.cart-item p {
  margin: 4px 0;
}

.line-total {
  font-weight: 700;
}

.summary {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #cbd5e1;
  font-weight: 600;
}
</style>
