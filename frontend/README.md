# Clothify Frontend

A modern e-commerce frontend built with React, Vite, and Tailwind CSS.

## Setup & Installation

1.  **Install Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

2.  **Environment Variables:**
    Copy `.env.example` to `.env` and adjust if necessary.
    ```bash
    cp .env.example .env
    ```
    *   `VITE_API_BASE_URL`: URL of your backend API (default: `http://localhost:4000/api`)

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

4.  **Build for Production:**
    ```bash
    npm run build
    ```

5.  **Preview Production Build:**
    ```bash
    npm run preview
    ```

## Features

*   **Catalog:** Search, Filter (Category, Price), Pagination.
*   **Product Detail:** Size selection, Quantity, Add to Cart.
*   **Cart:** Guest cart (localStorage) + User cart (Database). Auto-merge on login.
*   **Checkout:** Shipping form, Order placement.
*   **Auth:** Login, Register, Protected Routes.
*   **Profile:** Order history.

## QA Checklist & Manual Tests

### 1. Guest Cart Flow
- [ ] Open Incognito window.
- [ ] Add item to cart. Verify badge count updates.
- [ ] Refresh page. Cart should persist (localStorage).
- [ ] Go to Checkout. Should redirect to Login.

### 2. Auth & Merge
- [ ] Register a new account.
- [ ] Verify redirection to Home/Previous page.
- [ ] If items were in Guest Cart, verify they are now in User Cart.
- [ ] Logout. Cart should clear (or revert to empty guest state).

### 3. Checkout Process
- [ ] Login as user.
- [ ] Add items to cart.
- [ ] Proceed to Checkout.
- [ ] Fill form (validate required fields).
- [ ] Submit Order.
- [ ] Verify redirection to Order Confirmation page with Order ID.

### 4. Catalog & Search
- [ ] Search for "Shirt". URL should update `?search=Shirt`.
- [ ] Filter by Category "Men". URL should update.
- [ ] Refresh page. Filters should persist from URL.
- [ ] Pagination: Click Next. Page should change.

### 5. Responsive Design
- [ ] Open on Mobile (Chrome DevTools).
- [ ] Verify Hamburger menu works.
- [ ] Verify Grid becomes 1 column.

## API Integration

The frontend expects the following API endpoints:

*   `POST /auth/register`
*   `POST /auth/login`
*   `GET /products`
*   `GET /products/:id`
*   `POST /cart`
*   `GET /cart`
*   `PUT /cart`
*   `DELETE /cart/:itemId`
*   `POST /cart/merge` (Optional, or handled via login)
*   `POST /checkout`
*   `GET /orders`
*   `GET /orders/:id`
