# ARC Travel E-Commerce Project

This is a full-stack e-commerce platform built with:
- Frontend: Vue 3 + Vite + Vue Router + Vuex
- Backend: Node.js + Express
- Database: MySQL (XAMPP-compatible)

The app supports product browsing, cart management, authentication, checkout/order creation, profile management, and contact form submission.

## 1. Project Overview

### Core capabilities
- User registration and login (JWT-based)
- Password reset flow via security question
- Product catalog listing/search/filter
- Cart operations (add, remove, update, clear, merge)
- Checkout + order creation
- User profile view/update
- Contact form submission
- Currency preference handling on frontend

### Current architecture
- `frontend/`: SPA application
- `backend/`: REST API + MySQL access
- Frontend calls backend on `http://localhost:5050`

## 2. Tech Stack

### Frontend
- `vue` (beta)
- `vite` (beta)
- `vue-router`
- `vuex`
- `axios`
- `lucide-vue-next`

### Backend
- `express`
- `mysql2/promise`
- `dotenv`
- `jsonwebtoken`
- `bcrypt` / `bcryptjs`
- `cors`

## 3. Folder Structure

```text
ECommerce-Website-Group-6/
  backend/
    config/
      database.js
    controllers/
    middleware/
      authMiddleware.js
    models/
    routes/
      api.js
    server.js
    .env
  frontend/
    src/
      pages/
      router/
        index.js
      store/
        index.js
      utils/
        apiRequest.js
      App.vue
      main.js
    vite.config.js
```

## 4. Environment Configuration

Create/update `backend/.env`:

```env
USER='root'
HOST='localhost'
DATABASE='ecommerce_db'
PASSWORD=''
PORT='5050'
JWT_SECRET='secretkey'
```

Notes:
- `PORT` is the Node/Express server port.
- MySQL port is currently not explicitly set in `database.js`; default MySQL behavior is used.

## 5. Run Instructions

## 5.1 Install dependencies

From project root:

```bash
npm install
```

From backend:

```bash
cd backend
npm install
```

From frontend:

```bash
cd frontend
npm install
```

## 5.2 Start backend

```bash
cd backend
npm run dev
```

or

```bash
npm start
```

Backend runs on:
- `http://localhost:5050`

## 5.3 Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs on Vite dev server (usually `http://localhost:5173`).

Vite proxy forwards:
- `/api` -> backend
- `/cart` -> backend
- `/products` -> backend

## 6. API Overview (Current)

Base API router is mounted as `/api` from `backend/server.js`.

### Product endpoints
- `GET /api/products`
- `GET /api/products/search?q=...`
- `GET /api/products/category/:category`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Cart endpoints (protected with `x-auth-token`)
- `GET /api/cart/:userId`
- `POST /api/cart/add`
- `DELETE /api/cart/remove`
- `PUT /api/cart/update`
- `DELETE /api/cart/clear`
- `GET /api/cart/:userId/total`
- `POST /api/cart/merge`

### Auth/User endpoints
- `POST /api/register`
- `POST /api/login`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/profile` (auth)
- `PUT /api/user/profile` (auth)
- `POST /api/forgot-password`
- `POST /api/verify-security-answer`
- `POST /api/reset-password-security`
- `GET /api/countries`
- `GET /api/currencies`

### Orders
- `POST /api/orders` (auth)

### Contact
- `POST /api/contact`

## 7. Frontend Route Map

From `frontend/src/router/index.js`:

- `/` -> Home
- `/about` -> About
- `/contact` -> Contact
- `/shop` -> Shop
- `/cart` -> Cart
- `/checkout` -> Checkout
- `/payment` -> Payment
- `/order-success` -> OrderSuccess
- `/login` -> Login
- `/register` -> Register
- `/forgot-password` -> ForgotPassword
- `/profile` -> redirects to `/account/profile`
- `/account/profile` -> Profile
- `/dashboard` -> ProfileDashboard
- `/dashboard/edit` -> ProfileDashboard
- `/account/dashboard` -> redirects to `/dashboard`

## 8. Detailed User Flow

### Flow A: Guest browsing products
1. User opens Home (`/`).
2. User navigates to Shop (`/shop`).
3. Frontend requests products from backend.
4. User filters/sorts products.
5. User opens product modal for details.

### Flow B: Register + Login
1. User opens Register (`/register`).
2. Frontend submits registration data to `/api/auth/register`.
3. Backend validates, hashes password, creates user, returns token + user.
4. Frontend stores:
   - `token`
   - `user`
   - `userId`
   - `currency_code` (if provided)
5. User is redirected to Dashboard.
6. Login flow is similar using `/api/auth/login`.

### Flow C: Add to Cart
1. User clicks Add to Cart in Shop.
2. Frontend dispatches Vuex action.
3. Cart API request is sent.
4. Cart data is refreshed and shown in Cart page.

### Flow D: Cart Management
1. User opens `/cart`.
2. User can:
   - increase/decrease quantity
   - remove item
   - clear cart
3. Vuex recalculates subtotal/shipping/customs totals.

### Flow E: Checkout -> Payment -> Order
1. User clicks Checkout from cart (`/checkout`).
2. User enters shipping details.
3. User chooses payment method.
4. Checkout data is stored in `sessionStorage` as draft/pending checkout.
5. User proceeds to `/payment`.
6. Payment page submits order to `POST /api/orders` with `x-auth-token`.
7. On success, frontend clears cart and navigates to `/order-success`.

### Flow F: Profile Management
1. Logged-in user opens `/dashboard` or `/account/profile`.
2. Frontend loads profile via `GET /api/user/profile` with token.
3. User edits details and saves via `PUT /api/user/profile`.
4. Updated user data is also synced to `localStorage`.

### Flow G: Forgot Password
1. User opens `/forgot-password`.
2. Step 1: submit email to `/api/forgot-password`.
3. Backend returns security question.
4. Step 2: submit answer to `/api/verify-security-answer`.
5. Backend returns short-lived `resetToken`.
6. Step 3: submit new password to `/api/reset-password-security`.

### Flow H: Contact Support
1. User opens `/contact`.
2. User submits form (`name`, `email`, optional `subject`, `message`).
3. Frontend posts to `/api/contact`.
4. Backend stores message in database and returns success.

## 9. Database Entities (Inferred from Code)

Expected tables include:
- `users`
- `countries`
- `currencies`
- `currency_rates`
- `products`
- `categories`
- `cart_items`
- `orders`
- `order_items`
- `payments`
- `contact_messages` (or equivalent table used by `Contact` model)

## 10. Authentication and Headers

Protected endpoints use JWT passed in header:

```http
x-auth-token: <jwt_token>
```

Token payload includes `userId` and `email`.

## 11. Important Implementation Notes

- Stripe/payment processing files were intentionally removed from this codebase.
- There are both `/api/...` routes and legacy direct routes in `backend/server.js` (`/cart`, `/products`). Prefer `/api/...` for consistency.
- Router imports `contact.vue` (lowercase filename). Keep filename/import casing consistent across environments.
- Code assumes local backend on port `5050`.

## 12. Troubleshooting

### Backend cannot connect to DB
- Verify MySQL is running (XAMPP).
- Verify `.env` host/user/password/database values.
- Ensure database and required tables exist.

### Frontend cannot reach backend
- Confirm backend is running on `http://localhost:5050`.
- Check Vite proxy in `frontend/vite.config.js`.
- Check browser console for network errors.

### Unauthorized errors on protected endpoints
- Ensure `token` exists in localStorage.
- Ensure request includes `x-auth-token` header.
- Re-login if token expired/invalid.

### Cart/order inconsistencies
- Confirm same user ID is used across login/localStorage/cart requests.
- Clear stale local/session storage and retry.

## 13. Scripts

### Backend scripts
- `npm run dev` -> starts backend with nodemon
- `npm start` -> starts backend with node

### Frontend scripts
- `npm run dev` -> starts Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview production build

---

If you want, this document can be split into:
1. `README.md` (quick start + overview)
2. `docs/API.md` (endpoint details)
3. `docs/USER_FLOW.md` (product/user journeys)

