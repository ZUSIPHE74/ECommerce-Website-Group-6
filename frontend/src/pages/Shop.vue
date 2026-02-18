<template>
  <div class="shop">
    <h1 class="page-title">Our Products</h1>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchProducts" class="btn-retry">Try Again</button>
    </div>
    
    <template v-else>
      <!-- Filter/Sort Bar -->
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
      
      <!-- Products Grid -->
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
            
            <div class="product-actions">
              <button 
                class="btn-add-to-cart"
                @click="addToCart(product)"
                :disabled="isAddingToCart || product.stock === 0"
              >
                <span v-if="!isAddingToCart && product.stock > 0">Add to Cart</span>
                <span v-else-if="product.stock === 0">Out of Stock</span>
                <span v-else>Adding...</span>
              </button>
              
              <button 
                class="btn-buy-now" 
                @click="buyNow(product)"
                :disabled="product.stock === 0"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="displayedProducts.length === 0" class="empty-state">
        <p>No products found in this category.</p>
      </div>
    </template>
    
    <!-- Toast Notification -->
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
/* Add loading spinner styles */
.loading-state {
  text-align: center;
  padding: 50px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1e293b;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 50px;
  color: #ff4444;
}

.btn-retry {
  margin-top: 20px;
  padding: 10px 20px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.out-of-stock-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #999;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.shop {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.shop-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-section,
.sort-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-section label,
.sort-section label {
  font-weight: 600;
  color: #555;
}

.filter-section select,
.sort-section select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.filter-section select:hover,
.sort-section select:hover {
  border-color: #1e293b;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.sale-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4444;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.product-info {
  padding: 20px;
}

.product-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.product-price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.old-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
}

.current-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1e293b;
}

.current-price.on-sale {
  color: #ff4444;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stars {
  color: #ffc107;
  font-size: 1.1rem;
}

.rating-count {
  font-size: 0.8rem;
  color: #999;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.btn-add-to-cart,
.btn-buy-now {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-add-to-cart {
  background: #1e293b;
  color: white;
}

.btn-add-to-cart:hover:not(:disabled) {
  background: #2d3b4f;
}

.btn-add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-buy-now {
  background: #ff4444;
  color: white;
}

.btn-buy-now:hover {
  background: #ff6666;
}

.empty-state {
  text-align: center;
  padding: 50px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
  font-size: 1.1rem;
}

.toast-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 5px;
  color: white;
  font-weight: 500;
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.toast-notification.success {
  background: #4caf50;
}

.toast-notification.error {
  background: #f44336;
}

.toast-notification.info {
  background: #2196f3;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .shop-controls {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-section,
  .sort-section {
    width: 100%;
  }
  
  .filter-section select,
  .sort-section select {
    flex: 1;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .product-actions {
    flex-direction: column;
  }
}
</style>