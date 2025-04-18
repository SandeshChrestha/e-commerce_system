# Futsal E-Commerce Website

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce website for futsal products.

## Features

### User Features
- Browse futsal products
- Add to cart
- Remove from cart
- Checkout
- User authentication (JWT-based login/register)
- View order history

### Admin Features
- Add, edit, delete futsal products
- Manage users
- View orders

## Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt.js

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mern-futsal-ecommerce
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
- Create a `.env` file in the root directory
- Add the following variables:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/futsal-ecommerce
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
```

4. Run the application
```bash
# Run backend
cd server
npm run dev

# Run frontend
cd ../client
npm run dev
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/) 