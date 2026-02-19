<template>
  <div class="shop">
    <h1 class="page-title">Our Products</h1>
    
    <div v-if="loading" class="loading-state">
      <div class="arc-spinner"></div>
      <p>Loading products...</p>
    </div>
    
    <template v-else>
      <div class="shop-controls">
        <div class="filter-section">
          <label for="category">Category:</label>
          <select id="category" v-model="selectedCategory" @change="filterProducts">
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </option>
          </select>
        </div>
        
        <div class="sort-section">
          <label for="sort">Sort by:</label>
          <select id="sort" v-model="sortBy" @change="sortProducts">
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
      
      <div class="products-grid">
        <div v-for="product in displayedProducts" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.image || 'https://via.placeholder.com/300x200?text=No+Image'" :alt="product.name">
            <span v-if="product.onSale" class="sale-badge">SALE</span>
            <span v-if="product.stock === 0" class="out-of-stock-badge">Out of Stock</span>
          </div>
          
          <div class="product-info">
            <h3 class="product-title">{{ product.name }}</h3>
            <p class="product-description">{{ truncateDescription(product.description) }}</p>
            
            <div class="product-price-section">
              <div class="price-container">
                <span v-if="product.oldPrice" class="old-price">R{{ formatPrice(product.oldPrice) }}</span>
                <span class="current-price" :class="{ 'on-sale': product.onSale }">R{{ formatPrice(product.price) }}</span>
              </div>
              
              <div class="rating">
                <span class="stars">{{ getStarRating(product.rating) }}</span>
                <span class="rating-count">({{ product.reviews }})</span>
              </div>
            </div>
            
            <button 
              class="btn-add-to-cart"
              @click="addToCart(product)"
              :disabled="isAddingToCart || product.stock === 0"
            >
              <span v-if="!isAddingToCart && product.stock > 0">Add to Cart</span>
              <span v-else-if="product.stock === 0">Out of Stock</span>
              <span v-else>Adding...</span>
            </button>
          </div>
        </div>
      </div>
    </template>
    
    <div v-if="showToast" class="toast-notification" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Shop",
  
  data() {
    return {
      selectedCategory: 'all',
      sortBy: 'default',
      isAddingToCart: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      loading: true,
      error: null,
      products: [],
      categories: []
    }
  },
  
  computed: {
    displayedProducts() {
      let products = [...this.products];
      
      // Apply category filter
      if (this.selectedCategory !== 'all') {
        products = products.filter(p => p.category === this.selectedCategory);
      }
      
      // Apply sorting
      if (this.sortBy === 'price-low') {
        return products.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === 'price-high') {
        return products.sort((a, b) => b.price - a.price);
      } else if (this.sortBy === 'name') {
        return products.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortBy === 'rating') {
        return products.sort((a, b) => b.rating - a.rating);
      }
      
      return products;
    }
  },
  
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('http://localhost:5050/api/products');
        
        if (response.data.success) {
          this.products = response.data.data;
          
          // Extract unique categories
          const uniqueCategories = [...new Set(this.products.map(p => p.category))];
          this.categories = uniqueCategories.filter(c => c && c !== 'uncategorized');
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    
    filterProducts() {
      // Filtering is handled by computed property
    },
    
    sortProducts() {
      // Sorting is handled by computed property
    },
    
    truncateDescription(description) {
      if (description.length > 100) {
        return description.substring(0, 100) + '...';
      }
      return description;
    },
    
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    
    getStarRating(rating) {
      return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    },
    
    async addToCart(product) {
      if (product.stock === 0) return;
      
      this.isAddingToCart = true;
      
      try {
        // Get existing cart from localStorage or initialize empty array
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Check if product already exists in cart
        const existingProduct = cart.find(item => item.id === product.id);
        
        if (existingProduct) {
          if (existingProduct.quantity < product.stock) {
            existingProduct.quantity += 1;
          } else {
            this.showToastMessage('Cannot add more than available stock', 'error');
            return;
          }
        } else {
          cart.push({
            ...product,
            quantity: 1
          });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        this.showToastMessage('Product added to cart!', 'success');
        
        // Emit event for parent component
        this.$emit('cart-updated');
      } catch (err) {
        console.error('Error adding to cart:', err);
        this.showToastMessage('Failed to add to cart', 'error');
      } finally {
        this.isAddingToCart = false;
      }
    },
    
    buyNow(product) {
      if (product.stock === 0) {
        this.showToastMessage('Product is out of stock', 'error');
        return;
      }
      
      this.showToastMessage('Redirecting to checkout...', 'info');
      
      // Navigate to checkout with this product
      setTimeout(() => {
        this.$router.push({
          path: '/checkout',
          query: { product: product.id.toString() }
        });
      }, 1000);
    },
    
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  },
  
  mounted() {
    this.fetchProducts();
  }
}
</script>
<style scoped>
.shop {
  background: #121212;
  min-height: 100vh;
  padding: 40px 20px;
  color: white;
}

.page-title {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 2px;
}

/* 1. Filter Bar Styling */
.shop-controls {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.filter-section, .sort-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-section label, .sort-section label {
  color: #00ffff; /* Signature Cyan for labels */
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* 1. The White Frame Dropdown Styling */
.filter-section select, .sort-section select {
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3); /* Muted white frame */
  padding: 10px 35px 10px 15px;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  letter-spacing: 1px;
  cursor: pointer;
  outline: none;
  border-radius: 0; /* Modern sharp look */
  
  /* Custom Arrow Design */
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300ffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  transition: all 0.3s ease;
}

/* 2. Hover & Focus States */
.filter-section select:hover, .sort-section select:hover {
  border-color: #ffffff; /* Brightens to full white frame */
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
}

.filter-section select:focus, .sort-section select:focus {
  border-color: #00ffff; /* Glows Cyan when clicked */
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
}

  select option {
  background-color: #1a1a1a;
  color: white;
  padding: 10px;
}

/* 2. White Frame Card Styling */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.product-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1); /* White frame card */
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
}

.product-card:hover {
  border-color: #00ffff;
  transform: translateY(-5px);
}

.product-image {
  height: 220px;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 3. White Frame Button Styling */
.btn-add-to-cart {
  width: 100%;
  padding: 14px;
  background: transparent;
  color: white;
  border: 2px solid white; /* White frame border */
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-add-to-cart:hover:not(:disabled) {
  background: white;
  color: #121212;
}

.btn-add-to-cart:disabled {
  border-color: #444;
  color: #444;
  cursor: not-allowed;
}

/* 4. Product Details */
.product-info {
  padding: 20px;
}

.product-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #fff;
}

.product-description {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.current-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
}

.current-price.on-sale {
  color: #00ffff;
}

.stars {
  color: #00ffff;
}

/* Custom UI Elements */
.arc-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.toast-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 30px;
  background: white;
  color: #121212;
  font-weight: bold;
  border-left: 5px solid #00ffff;
}
</style>