# FurniShop - MERN Stack Furniture E-commerce Website

A comprehensive furniture e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, admin panel, shopping cart, wishlist, and order management.

## Features

### User Features
- **Authentication**: Sign up, login, and profile management
- **Product Browsing**: View products by categories with search and filtering
- **Wishlist**: Save favorite products (requires authentication)
- **Shopping Cart**: Add products with quantity management
- **Checkout**: Complete address and phone validation (10 digits only)
- **Payment Options**: Cash on Delivery (COD) and UPI payment
- **Order Tracking**: Track orders with delivery estimation
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Product Management**: Add, edit, update, and delete products
- **Inventory Control**: Manage product quantities
- **Order Management**: View and update order status
- **Image Upload**: Support for multiple product images
- **Dashboard**: Overview of products and orders

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React** with React Router
- **Axios** for API calls
- **React Toastify** for notifications
- **React Icons** for UI icons
- **Context API** for state management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd furni
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/furniture-shop
   JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

5. **Create uploads directory**
   ```bash
   mkdir uploads
   mkdir uploads/products
   ```

6. **Start the application**
   
   **Development mode (both frontend and backend):**
   ```bash
   npm run dev
   ```
   
   **Or start separately:**
   
   **Backend only:**
   ```bash
   npm run server
   ```
   
   **Frontend only:**
   ```bash
   npm run client
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/categories/list` - Get all categories
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add/:productId` - Add to cart
- `PUT /api/cart/update/:productId` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add/:productId` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:orderId` - Get single order
- `GET /api/orders/track/:orderNumber` - Track order
- `POST /api/orders/:orderId/payment/upi` - Process UPI payment

## Demo Accounts

### Admin Account
- Email: admin@furnishop.com
- Password: admin123

### User Account
- Email: user@furnishop.com
- Password: user123

## Project Structure

```
furni/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context providers
│   │   ├── pages/          # Page components
│   │   └── App.js
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # Express routes
├── middleware/             # Custom middleware
├── uploads/                # File uploads directory
├── server.js              # Express server
├── package.json
└── README.md
```

## Key Features Implementation

### Authentication Flow
1. User registers/logs in
2. JWT token stored in localStorage
3. Token sent with authenticated requests
4. Middleware validates token for protected routes

### Wishlist Functionality
- Requires user authentication
- Redirects to login if not authenticated
- Persistent across sessions

### Shopping Cart
- Quantity management with stock validation
- Real-time price calculations
- Persistent cart data

### Order Management
- Complete checkout process
- Address validation
- Phone number validation (exactly 10 digits)
- Payment method selection (COD/UPI)
- Order tracking with status updates
- Delivery estimation (7-10 days)

### Admin Panel
- Product CRUD operations
- Image upload support
- Inventory management
- Order status updates

## Payment Integration

### Cash on Delivery (COD)
- No additional validation required
- Order confirmed immediately

### UPI Payment
- UPI ID collection
- Transaction ID verification
- Payment status tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact: info@furnishop.com
