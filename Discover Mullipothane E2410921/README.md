# Discover Mullipothane

**Local Tourist Day-Visit Planner and Information System**

A web application for discovering local attractions within 25 km of Mullipothana, Trincomalee District, Sri Lanka. Tourists can browse, search, filter, view on map, and create custom one-day itineraries. Administrators can manage place listings through a secure dashboard.

## Prerequisites

- **Node.js** (LTS v18 or v20)
- **MongoDB** (local instance or MongoDB Atlas)
- **npm**

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd discover-mullipothane
```

### 2. Start MongoDB

Ensure MongoDB is running locally on port 27017, or update the connection string in `server/.env`.

### 3. Configure environment variables

Edit `server/.env` with your settings:

```
MONGODB_URI=mongodb://localhost:27017/discover_mullipothane
SESSION_SECRET=<your-random-secret>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<change-this-password>
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000
```

### 4. Seed the database

```bash
cd server
npm install
npm run seed
```

This creates 10 verified place records and one admin user.

### 5. Start the backend server

```bash
cd server
npm run dev
```

The API runs on http://localhost:5000.

### 6. Start the frontend

In a separate terminal:

```bash
cd client
npm install
npm start
```

The app opens at http://localhost:3000.

## Default Admin Credentials

- **Username:** admin
- **Password:** admin123

Change the password after first setup.

## Features

### Tourist (Public)

- Browse the attraction catalogue (10 verified places)
- Search by name or description
- Filter by category (Heritage, Nature, Scenic, etc.)
- Sort by distance or name
- View detailed place profiles (hours, fees, tips, map)
- Interactive Leaflet/OSM map with category colour coding
- One-day itinerary planner with reorder, duration editing, and time calculation
- Responsive design for mobile and desktop

### Administrator

- Secure login with session authentication
- Dashboard listing all places with status indicators
- Create, edit, and delete place records
- Mandatory field validation (distance 0-25 km, coordinates within Sri Lanka bounds)
- Soft delete (active/inactive toggle)

## Technology Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React.js, React Router, Leaflet.js      |
| Styling    | Custom CSS (responsive)                 |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB (Mongoose)                      |
| Maps       | Leaflet.js + OpenStreetMap tiles        |
| Auth       | express-session + bcrypt                |

## Project Structure

```
discover-mullipothane/
  server/
    models/         # Mongoose schemas (Place, User)
    routes/         # Express API routes (places, auth)
    seed.js         # Database seeder (10 places + admin)
    index.js        # Express server entry point
    .env            # Environment variables
  client/
    src/
      pages/        # React page components
      context/      # Itinerary state management
      App.js        # Main app with routing
      index.css     # Global styles
    public/
      index.html    # HTML template
```

## SRS Reference

This application implements the Software Requirements Specification (SRS) for **Discover Mullipothane** by M. F. F. Afrina (E2410921), ITE2953 Programming Group Project 25S2.
