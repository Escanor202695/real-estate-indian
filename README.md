
# ClickProp - Real Estate Platform

ClickProp is a comprehensive real estate platform built using the MERN stack (MongoDB, Express, React, Node.js). This application allows users to browse properties, search by cities, save favorite properties, and more. Admin users can manage properties, cities, and users.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Authentication](#authentication)
- [Remaining Work](#remaining-work)
- [Project Structure](#project-structure)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- Google OAuth credentials (for social authentication)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd clickprop
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

## Environment Variables

1. Create a `.env` file in the root directory for frontend configuration:
   ```
   FRONTEND_URL=http://localhost:3000
   ```

2. Create a `.env` file in the server directory for backend configuration:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/clickprop
   JWT_SECRET=your_strong_secret_key_here
   NODE_ENV=development
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   BACKEND_URL=http://localhost:4000
   FRONTEND_URL=http://localhost:3000
   ```

### Important Notes about Environment Variables:

1. **MONGO_URI**: Connection string to your MongoDB database. You can use a local MongoDB instance or set up a cloud MongoDB using MongoDB Atlas.

2. **JWT_SECRET**: A strong secret key for JWT token generation. Should be a random string.

3. **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**: 
   - Get these by creating a project in the [Google Developer Console](https://console.developers.google.com/)
   - Create OAuth credentials with the following settings:
     - Application type: Web application
     - Authorized JavaScript origins: `http://localhost:4000`
     - Authorized redirect URIs: `http://localhost:4000/api/auth/google/callback`

4. **BACKEND_URL** and **FRONTEND_URL**: URLs for your backend and frontend services.

## Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server (in a new terminal):
   ```bash
   npm run dev
   ```

3. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:4000](http://localhost:4000)
   - API Documentation: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

## API Documentation

The API is documented using Swagger. You can access the Swagger UI at [http://localhost:4000/api-docs](http://localhost:4000/api-docs) when the backend server is running.

Use the Swagger UI to:
- Explore available API endpoints
- Test API requests directly from the browser
- Understand request and response formats
- See required parameters and authentication methods

## Features

- User authentication (email/password and Google OAuth)
- Property listings with search and filter functionality
- City-based property browsing
- User dashboard with profile management
- Saved searches and property alerts
- Admin dashboard for managing properties, users, and cities

## Authentication

The application supports two authentication methods:
1. **Email/Password**: Traditional signup and login
2. **Google OAuth**: Sign in with Google account

## Remaining Work

To complete the project, the following tasks need to be addressed:

1. **Google OAuth Configuration**:
   - Add valid `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the `.env` file
   - Ensure redirect URIs are correctly set up in Google Developer Console

2. **Authentication Middleware Implementation**:
   - Implement mandatory authentication for user and admin routes
   - Apply the existing middleware to all protected routes
   - Update frontend to handle unauthorized access

3. **Replace Dummy Data**:
   - Remove hardcoded dummy data from components:
     - `LatestProperties.tsx`
     - `FeaturedProperties.tsx`
     - `PopularCities.tsx`
     - `CitiesManagementTab.tsx`
   - Uncomment the API calls in these components to fetch real data

4. **Backend Connection**:
   - Ensure proper connection to MongoDB database
   - Validate all API endpoints are working correctly

5. **Error Handling Improvements**:
   - Add comprehensive error handling for API requests
   - Implement better user feedback for failed actions

6. **Data Validation**:
   - Add form validation for all user inputs
   - Implement server-side validation for API requests

7. **Testing**:
   - Add unit and integration tests for backend and frontend

## Project Structure

The project follows a typical MERN stack structure:

- **Frontend (React + TypeScript)**
  - `/src`: Source files for the React application
  - `/src/components`: Reusable UI components
  - `/src/pages`: Top-level page components
  - `/src/services`: API service functions
  - `/src/types`: TypeScript type definitions

- **Backend (Node.js + Express)**
  - `/server`: Backend server code
  - `/server/controllers`: Route controller functions
  - `/server/models`: Mongoose models for MongoDB
  - `/server/routes`: Express route definitions
  - `/server/middleware`: Custom middleware functions

## License

[MIT License](LICENSE)
