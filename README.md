# Movie API

This is a Express-based RESTful API designed to manage Movies and Directors, featuring full CRUD operations and a persistent MongoDB database. The project implements a "has-a" relationship, wherein a Director can have many Movies, and each Movie is strictly associated with a valid Director.

## Features Let's Review requirements:
- **Two Modals:** `Director` and `Movie` with a relationship.
- **Data Validations:** Detailed rules enforce correct data creation natively with Mongoose.
- **Properties**: Models utilize `String, Number, Boolean, Date, and ObjectId` data types.
- **Full CRUD:** Controller functions to Create, Read, Update, and Delete.
- **Separation of Concerns:** Distinct files for Controller, Routes, Database configuration, and Mongoose Modeling.

## Prerequisites
- Node.js installed locally.
- A local instance of MongoDB running on port 27017, or a valid connection string available in `.env`.

## Installation & Setup

1. **Install dependencies:**
   Open a terminal in the root folder and run:
   ```
   npm install
   ```
2. **Setup environment variables:**
   Verify your `.env` file matches your local instance mapping.
   ```
   PORT = 3000
   MONGODB_URI = mongodb://127.0.0.1:27017/moviedb
   ```
3. **Start the server:**
   You can run the server directly or use a script like nodemon if installed.
   ```bash
   npm run dev
   # or
   node server.js
   ```

## Base Endpoint
- Development Base URL: `http://localhost:3000/api/v1/`

### Directors Endpoint (`/api/v1/directors`)
- `GET /` — Fetch all directors.
- `GET /:id` — Fetch a director by their MongoDB `_id`.
- `POST /` — Create a new director. Ensure you provide:
  - `name`: String
  - `age`: Number
  - `isActive`: Boolean (Optional, defaults to true)
  - `awardsWon`: Number (Optional, defaults to 0)
- `PUT /:id` — Update an existing director.
- `DELETE /:id` — Delete a director. 

### Movies Endpoint (`/api/v1/movies`)
- `GET /` - Fetch all movies. This will also expand to return associated Director metadata.
- `GET /:id` - View a movie entry by its MongoDB `_id`.
- `POST /` - Add a new movie. The `director` Object ID must be generated first and passed into this request! 
  - `title`: String
  - `releaseYear`: Number 
  - `genre`: String 
  - `boxOfficeMillions`: Number (Optional, defaults to 0)
  - `director`: string (References an existing Director ObjectId)
- `PUT /:id` - Update existing movie attributes.
- `DELETE /:id` - Delete a movie.
