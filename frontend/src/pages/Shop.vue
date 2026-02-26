<template>
  <div class="shop">
    <h1 class="page-title">Our Products</h1>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="arc-spinner"></div>
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
              {{ formatCategoryName(category) }}
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
      
      <!-- Products Grid - Card View -->
      <div class="products-grid">
        <div 
          v-for="product in displayedProducts" 
          :key="product.id" 
          class="product-card"
          @click="openProductModal(product)"
        >
          <div class="product-image">
            <img 
              :src="getProductImage(product)" 
              :alt="product.name"
              @error="handleImageError"
            >
            <span v-if="product.stock === 0" class="out-of-stock-badge">Out of Stock</span>
          </div>
          
          <div class="product-info">
            <h3 class="product-title">{{ product.name }}</h3>
            <div class="product-price">
              <span class="current-price">{{ formatMoney(product.price) }}</span>
            </div>
            
            <div class="rating">
              <span class="stars">{{ getStarRating(product.rating) }}</span>
              <span class="rating-count">({{ product.reviews }})</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Product Detail Modal -->
    <div v-if="selectedProduct" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">×</button>
        
        <div class="modal-layout">
          <!-- Product Image Section -->
          <div class="modal-image-section">
            <div class="modal-image-container">
              <img 
                :src="getProductImage(selectedProduct)" 
                :alt="selectedProduct.name"
                @error="handleImageError"
              >
            </div>
            
            <!-- Stock Status -->
            <div class="stock-status" :class="{ 'out-of-stock': selectedProduct.stock === 0 }">
              {{ selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of Stock' }}
            </div>
          </div>
          
          <!-- Product Details Section -->
          <div class="modal-details-section">
            <h2 class="modal-product-title">{{ selectedProduct.name }}</h2>
            
            <div class="modal-category">
              Category: {{ formatCategoryName(selectedProduct.category) }}
            </div>
            
            <div class="modal-rating">
              <span class="stars">{{ getStarRating(selectedProduct.rating) }}</span>
              <span class="rating-count">({{ selectedProduct.reviews }} reviews)</span>
            </div>
            
            <div class="modal-price">
              <span class="current-price">{{ formatMoney(selectedProduct.price) }}</span>
              <span v-if="selectedProduct.oldPrice" class="old-price">{{ formatMoney(selectedProduct.oldPrice) }}</span>
            </div>
            
            <!-- Product Description -->
            <div class="modal-description">
              <h3>Description</h3>
              <p>{{ selectedProduct.description }}</p>
            </div>
            
            <!-- Action Buttons -->
            <div class="modal-actions">
              <button 
                class="btn-add-to-cart-modal"
                @click="addToCart(selectedProduct)"
                :disabled="isAddingToCart || selectedProduct.stock === 0"
              >
                <span v-if="!isAddingToCart && selectedProduct.stock > 0">Add to Cart</span>
                <span v-else-if="selectedProduct.stock === 0">Out of Stock</span>
                <span v-else>Adding...</span>
              </button>
              
              <button 
                class="btn-buy-now-modal"
                @click="buyNow(selectedProduct)"
                :disabled="selectedProduct.stock === 0"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <div v-if="showToast" class="toast-notification" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { formatMoney } from '../utils/currency';
import horizonImg from '../assets/luggage.png';
import pulseImg from '../assets/backpack.png';
import auraImg from '../assets/flask cup.png';
import zenithImg from '../assets/headset.png';
import neckImg from '../assets/neck pillow.png';
import lumeImg from '../assets/sleep mask.png';
import fluxImg from '../assets/adapter charger.png';

const IMAGE_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'><rect width='300' height='200' fill='%23222222'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23bbbbbb' font-family='Arial' font-size='16'>Image Not Available</text></svg>";

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
      categories: [],
      selectedProduct: null
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
    
    formatCategoryName(category) {
      if (!category) return '';
      return category.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    },
    
    truncateDescription(description) {
      if (!description) return '';
      if (description.length > 100) {
        return description.substring(0, 100) + '...';
      }
      return description;
    },
    
    formatMoney(price) {
      return formatMoney(price);
    },
    
    getStarRating(rating) {
      return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    },
    
    getProductImage(product) {
      // Map product names to images (you can replace with actual image URLs from database)
    
    const imageMap = {
      'Horizon S1 Luggage': horizonImg,
      'Pulse B1 Backpack': pulseImg,
      'Aura T1 Flask Cup': auraImg,
      'Zenith Headset': zenithImg,
      'Zen N1 Neck Pillow': neckImg,
      'Lume E1 Sleep Mask': lumeImg,
      'Flux P1 Adapter': fluxImg
    }

      
      return imageMap[product.name] || IMAGE_FALLBACK;
    },
    
    handleImageError(e) {
      e.target.onerror = null;
      e.target.src = IMAGE_FALLBACK;
    },
    
    openProductModal(product) {
      this.selectedProduct = product;
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    },
    
    closeModal() {
      this.selectedProduct = null;
      document.body.style.overflow = ''; // Restore scrolling
    },
    
    async addToCart(product) {
      if (product.stock === 0) return;
      
      this.isAddingToCart = true;
      
      try {
        const userId = Number(localStorage.getItem('userId')) || 1;
        await this.$store.dispatch('addToCart', {
          user_Id: userId,
          product_Id: product.id
        });
        
        this.showToastMessage('Product added to cart!', 'success');
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
      
      // Add to cart first
      this.addToCart(product).then(() => {
        this.showToastMessage('Redirecting to checkout...', 'info');
        
        // Navigate to checkout
        setTimeout(() => {
          this.$router.push('/checkout');
        }, 1000);
      });
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
  },
  
  beforeDestroy() {
    // Clean up when component is destroyed
    document.body.style.overflow = '';
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
  font-size: 40px;
  color: #fff;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 2px;
}

/* Filter Bar Styling */
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
  color: #00ffff;
  font-family: 'Inter', sans-serif;
  font-size: 12.8px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.filter-section select, .sort-section select {
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 35px 10px 15px;
  font-size: 14.4px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 1px;
  cursor: pointer;
  outline: none;
  border-radius: 0;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300ffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  transition: all 0.3s ease;
}

.filter-section select:hover, .sort-section select:hover {
  border-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
}

.filter-section select:focus, .sort-section select:focus {
  border-color: #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
}

select option {
  background-color: #1a1a1a;
  color: white;
  padding: 10px;
}

/* Products Grid - Card View */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.product-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.product-card:hover {
  border-color: #00ffff;
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 255, 255, 0.1);
}

.product-image {
  height: 220px;
  position: relative;
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

.out-of-stock-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 0, 0, 0.9);
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 2px;
  z-index: 1;
}

.product-info {
  padding: 20px;
}

.product-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: #fff;
  font-weight: 500;
  line-height: 1.4;
}

.product-price {
  margin-bottom: 10px;
}

.current-price {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stars {
  color: #00ffff;
  font-size: 16px;
}

.rating-count {
  color: #888;
  font-size: 14px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
}

.modal-close:hover {
  background: #00ffff;
  color: #121212;
  border-color: #00ffff;
}

.modal-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 40px;
}

/* Modal Image Section */
.modal-image-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-image-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  height: 400px;
}

.modal-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stock-status {
  text-align: center;
  padding: 10px;
  border: 1px solid #00ffff;
  color: #00ffff;
  font-weight: bold;
  border-radius: 4px;
}

.stock-status.out-of-stock {
  border-color: #ff4444;
  color: #ff4444;
}

/* Modal Details Section */
.modal-details-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-product-title {
  font-size: 32px;
  color: white;
  margin: 0;
  line-height: 1.2;
}

.modal-category {
  color: #888;
  font-size: 16px;
}

.modal-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-price {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-price .current-price {
  font-size: 32px;
  color: #00ffff;
}

.modal-price .old-price {
  font-size: 20px;
  color: #888;
  text-decoration: line-through;
}

.modal-description h3 {
  color: #00ffff;
  font-size: 18px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-description p {
  color: #ccc;
  line-height: 1.6;
  font-size: 16px;
  white-space: pre-line;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-add-to-cart-modal,
.btn-buy-now-modal {
  flex: 1;
  padding: 15px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  font-size: 16px;
}

.btn-add-to-cart-modal {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-add-to-cart-modal:hover:not(:disabled) {
  background: white;
  color: #121212;
}

.btn-add-to-cart-modal:disabled {
  border-color: #444;
  color: #444;
  cursor: not-allowed;
}

.btn-buy-now-modal {
  background: #00ffff;
  color: #121212;
  border: 2px solid #00ffff;
}

.btn-buy-now-modal:hover:not(:disabled) {
  background: transparent;
  color: #00ffff;
}

.btn-buy-now-modal:disabled {
  background: #444;
  border-color: #444;
  color: #888;
  cursor: not-allowed;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px;
}

.arc-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 60px;
}

.error-state p {
  color: #ff4444;
  margin-bottom: 20px;
}

.btn-retry {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 12px 30px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-retry:hover {
  background: white;
  color: #121212;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 30px;
  background: white;
  color: #121212;
  font-weight: bold;
  border-left: 5px solid #00ffff;
  animation: slideIn 0.3s ease;
  z-index: 2000;
}

.toast-notification.success {
  border-left-color: #00ff00;
}

.toast-notification.error {
  border-left-color: #ff4444;
}

.toast-notification.info {
  border-left-color: #00ffff;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin { 
  to { transform: rotate(360deg); } 
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

/* Responsive Design */
@media (max-width: 768px) {
  .shop-controls {
    flex-direction: column;
    gap: 20px;
  }
  
  .filter-section, .sort-section {
    width: 100%;
  }
  
  .filter-section select, .sort-section select {
    flex: 1;
    width: 100%;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-layout {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  
  .modal-image-container {
    height: 300px;
  }
  
  .modal-product-title {
    font-size: 24px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
