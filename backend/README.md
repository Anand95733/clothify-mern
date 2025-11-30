# Clothify MERN Backend

Backend API for the Clothify e-commerce application. Built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based auth with HttpOnly cookie support (or token in response).
- **Products**: Search, filter (category, size, price), and pagination.
- **Cart**: Guest cart support (merge on login) and persistent user carts.
- **Checkout**: Server-side total calculation and order creation.
- **Emails**: Order confirmation emails using Ethereal (dev) or SMTP.

## Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas)

## Setup

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Environment Variables**

    Copy `.env.example` to `.env` and update the values.

    ```bash
    cp .env.example .env
    ```

    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: Secret key for signing tokens.
    *   `SMTP_*`: Email configuration (use Ethereal for testing).

3.  **Seed Database**

    Populate the database with 200 demo products and test users.

    ```bash
    npm run seed
    ```

    *   **Test User**: `john@example.com` / `password123`
    *   **Admin User**: `admin@example.com` / `password123`

4.  **Run Server**

    ```bash
    # Development mode (nodemon)
    npm run dev

    # Production mode
    npm start
    ```

    Server runs on `http://localhost:5000` by default.

## API Documentation

The API is documented using Swagger UI.

*   **URL**: `http://localhost:5000/api-docs`

## API Documentation (Postman Examples)

### Authentication

*   **Register**: `POST /api/auth/register`
    *   Body: `{ "name": "Test", "email": "test@test.com", "password": "password" }`
*   **Login**: `POST /api/auth/login`
    *   Body: `{ "email": "john@example.com", "password": "password123", "cartId": "optional-guest-cart-id" }`

### Products

*   **List**: `GET /api/products?page=1&limit=10&q=shirt&category=Men&size=M&minPrice=10&maxPrice=50`
*   **Detail**: `GET /api/products/:id`

### Cart

*   **Get Cart**: `GET /api/cart` (Header: `Authorization: Bearer <token>`) or `GET /api/cart/:cartId` (Guest)
*   **Add Item**: `POST /api/cart`
    *   Body: `{ "productId": "...", "size": "M", "quantity": 1, "cartId": "..." }`
*   **Update Item**: `PUT /api/cart`
    *   Body: `{ "productId": "...", "size": "M", "quantity": 2, "cartId": "..." }`
*   **Remove Item**: `DELETE /api/cart/:itemId?cartId=...`

### Checkout

*   **Place Order**: `POST /api/checkout`
    *   Body: `{ "cartId": "..." }` (if guest, also provide `guestEmail`)
    *   Header: `Authorization: Bearer <token>` (optional for guests)

## Testing Emails

1.  Run the server.
2.  Place an order via `POST /api/checkout`.
3.  Check the console for the Ethereal URL (if using Ethereal) or check your inbox.

## Acceptance Criteria Checklist

- [x] JWT Authentication
- [x] Product Filters (Search, Category, Size, Price)
- [x] Guest Cart Support & Merge
- [x] Server-side Checkout & Validation
- [x] Order Confirmation Emails
