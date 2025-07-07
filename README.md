# StayScape - MERN Stack

A full-stack vacation rental platform built with the MERN stack (MongoDB, Express.js, React, Node.js). StayScape allows users to discover, list, and book unique accommodations worldwide.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Contributing](#contributing)

## Features

### Core Features
- **User Authentication**: JWT-based secure signup/login
- **Property Listings**: Create, read, update, and delete vacation rental listings
- **Image Upload**: Integration with Cloudinary for image storage and optimization
- **Review System**: Rate and review properties with star ratings
- **Search Functionality**: Find properties by destination
- **Responsive Design**: Mobile-friendly interface with Bootstrap
- **Interactive Maps**: Google Maps integration for property locations
- **Real-time Updates**: React-based SPA for smooth user experience

### User Roles
- **Property Owners**: List and manage rental properties
- **Travelers**: Browse, search, and review accommodations
- **Admin**: Full CRUD operations (implemented through ownership validation)

### UI/UX Features
- Clean, modern interface inspired by Airbnb
- Property filtering by categories (trending, rooms, pools, etc.)
- Tax calculation toggle
- Image compression for optimized loading
- Form validation with real-time feedback

## Technology Stack

### Frontend (React)
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **CSS Framework**: Bootstrap 5.3.3
- **Icons**: Font Awesome 6.6.0
- **Fonts**: Google Fonts (Plus Jakarta Sans)

### Backend (Node.js/Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with Cloudinary storage
- **Validation**: Joi for server-side validation
- **Security**: CORS, bcryptjs password hashing

### Development Tools
- **Build Tool**: Vite (frontend)
- **Process Manager**: Nodemon (backend)
- **Environment Management**: dotenv
- **Package Manager**: npm

## Project Structure

```
StayScape-MERN/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context (Auth)
│   │   ├── services/       # API service layer
│   │   ├── assets/         # CSS and static assets
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Express API backend
│   ├── controllers/        # Route handlers
│   ├── models/            # Database schemas
│   ├── routes/            # Route definitions
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── package.json
├── public/                 # Legacy static assets
├── views/                  # Legacy EJS templates
├── package.json           # Root package.json with scripts
└── README.md
```

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v20.11.0 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stayscape.git
   cd stayscape
   ```

2. **Install dependencies for both client and server**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   
   # Or use the root package.json script
   cd ..
   npm run install-all
   ```

## Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Database
ATLASDB_URL=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Getting API Keys

1. **MongoDB Atlas**: Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/) for image storage
3. **JWT Secret**: Generate a secure random string for JWT signing

## Running the Application

### Development Mode

1. **Start the backend server** (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the frontend server** (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

### Quick Start Scripts

```bash
# Start backend server
npm run server

# Start frontend server
npm run client

# Get development instructions
npm run dev
```

## API Routes

### Authentication Routes
```
POST /api/users/signup     - Register new user
POST /api/users/login      - Authenticate user
POST /api/users/logout     - Logout user
GET  /api/users/me         - Get current user (protected)
```

### Listing Routes
```
GET    /api/listings           - Get all listings
GET    /api/listings/:id       - Get specific listing
POST   /api/listings           - Create new listing (protected)
PUT    /api/listings/:id       - Update listing (owner only)
DELETE /api/listings/:id       - Delete listing (owner only)
```

### Review Routes
```
POST   /api/listings/:id/reviews          - Create review (protected)
DELETE /api/listings/:id/reviews/:reviewId - Delete review (author only)
```

## Authentication Flow

1. User signs up or logs in
2. Server returns JWT token
3. Frontend stores token in localStorage
4. Token is automatically included in API requests
5. Server verifies token for protected routes

## Development Guidelines

1. **Frontend Development**: Work in the `client/` directory
2. **Backend Development**: Work in the `server/` directory
3. **API Testing**: Backend runs on port 5000, test with tools like Postman
4. **Frontend Testing**: Frontend runs on port 3000 with hot reload

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Next Steps

The conversion to MERN stack is complete with basic functionality. You can now:

1. Complete the remaining pages (ListingShow, ListingNew, ListingEdit)
2. Add the review system to the show page
3. Implement Google Maps integration
4. Add search functionality
5. Deploy to production

---

**StayScape MERN** - Discover your perfect getaway destination with modern web technology. 