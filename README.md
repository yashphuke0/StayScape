# StayScape

A full-stack vacation rental platform built with Node.js, Express, and MongoDB. StayScape allows users to discover, list, and book unique accommodations worldwide.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features
- **User Authentication**: Secure signup/login with Passport.js
- **Property Listings**: Create, read, update, and delete vacation rental listings
- **Image Upload**: Integration with Cloudinary for image storage and optimization
- **Review System**: Rate and review properties with star ratings
- **Search Functionality**: Find properties by destination
- **Responsive Design**: Mobile-friendly interface with Bootstrap
- **Interactive Maps**: Google Maps integration for property locations
- **Flash Messaging**: User feedback with success/error notifications

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

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **Session Management**: Express-session with MongoDB store
- **File Upload**: Multer with Cloudinary storage
- **Validation**: Joi for server-side validation

### Frontend
- **Template Engine**: EJS with EJS-Mate
- **CSS Framework**: Bootstrap 5.3.3
- **Icons**: Font Awesome 6.6.0
- **Fonts**: Google Fonts (Plus Jakarta Sans)
- **Maps**: Google Maps JavaScript API

### Development Tools
- **Environment Management**: dotenv
- **HTTP Method Override**: method-override
- **Flash Messages**: connect-flash
- **Error Handling**: Custom ExpressError class

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v20.11.0 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stayscape.git
   cd stayscape
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables))

4. **Initialize the database (optional)**
   ```bash
   node init/index.js
   ```

5. **Start the application**
   ```bash
   node app.js
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:8080`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
ATLASDB_URL=your_mongodb_connection_string

# Session Secret
SECRET=your_session_secret_key

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Environment
NODE_ENV=development
```

### Getting API Keys

1. **MongoDB Atlas**: Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/) for image storage
3. **Google Maps**: Get an API key from [Google Cloud Console](https://console.cloud.google.com/)

## Usage

### For Property Owners
1. **Sign up** for a new account or **log in**
2. Navigate to "Airbnb your home" to create a new listing
3. Fill in property details, upload images, and set pricing
4. **Manage your listings** through the edit/delete options (only available to listing owners)

### For Travelers
1. **Browse listings** on the homepage
2. Use **search and filters** to find desired accommodations
3. **View detailed property information** including location on map
4. **Leave reviews and ratings** for properties you've experienced

### Admin Features
- Property ownership validation ensures only owners can modify their listings
- User authentication required for creating listings and reviews
- Comprehensive error handling and validation

## API Routes

### Authentication Routes
```
GET  /signup          - Display signup form
POST /signup          - Register new user
GET  /login           - Display login form
POST /login           - Authenticate user
GET  /logout          - Logout user
```

### Listing Routes
```
GET    /listings           - Display all listings
GET    /listings/new       - Show new listing form (auth required)
POST   /listings           - Create new listing (auth required)
GET    /listings/:id       - Show specific listing
GET    /listings/:id/edit  - Show edit form (owner only)
PUT    /listings/:id       - Update listing (owner only)
DELETE /listings/:id       - Delete listing (owner only)
```

### Review Routes
```
POST   /listings/:id/reviews          - Create new review (auth required)
DELETE /listings/:id/reviews/:reviewId - Delete review (author only)
```

## Project Structure

```
StayScape/
├── app.js                 # Main application file
├── cloudConfig.js         # Cloudinary configuration
├── middlewares.js         # Custom middleware functions
├── package.json           # Project dependencies
├── controllers/           # Route handlers
│   ├── listing.js
│   ├── reviews.js
│   └── user.js
├── models/               # Database schemas
│   ├── listing.js
│   ├── reviews.js
│   └── user.js
├── routes/               # Route definitions
│   ├── listing.js
│   ├── reviews.js
│   └── user.js
├── views/                # EJS templates
│   ├── includes/         # Partial templates
│   ├── layouts/          # Layout templates
│   ├── listings/         # Listing-related views
│   └── users/           # User-related views
├── public/               # Static assets
│   ├── css/
│   └── js/
├── utils/                # Utility functions
│   ├── expressError.js
│   ├── schema.js
│   └── wrapAsync.js
└── init/                 # Database initialization
    ├── data.js
    └── index.js
```

## Database Schema

### User Model
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (hashed),
  createdAt: Date
}
```

### Listing Model
```javascript
{
  title: String (required),
  description: String,
  image: {
    filename: String,
    url: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [ObjectId] (ref: Review),
  owner: ObjectId (ref: User)
}
```

### Review Model
```javascript
{
  comment: String,
  rating: Number (1-5),
  date: Date,
  createAt: Date,
  author: ObjectId (ref: User)
}
```

## Security Features

- **Input Validation**: Server-side validation using Joi
- **Authentication**: Passport.js with local strategy
- **Authorization**: Route-level middleware for protected operations
- **Session Security**: Secure session configuration with MongoDB store
- **File Upload Security**: Restricted file types and Cloudinary integration
- **CSRF Protection**: Form validation and user verification

## Performance Optimizations

- **Image Optimization**: Cloudinary automatic compression and resizing
- **Database Indexing**: Efficient queries with Mongoose
- **Session Management**: MongoDB session store for scalability
- **Client-side Validation**: Immediate user feedback
- **Responsive Images**: Adaptive image serving

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

### Development Guidelines
- Follow MVC architecture patterns
- Use consistent code formatting
- Add appropriate error handling
- Include validation for all user inputs
- Test all routes and functionality

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## Acknowledgments

- Built with Express.js and MongoDB
- UI/UX inspired by modern rental platforms
- Uses various open-source libraries and tools

---

**StayScape** - Discover your perfect getaway destination. 