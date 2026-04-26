# Movie API

This is a Express-based RESTful API designed to manage Movies and Directors, featuring full CRUD operations and a persistent MongoDB database. The project implements a "has-a" relationship, wherein a Director can have many Movies, and each Movie is strictly associated with a valid Director.

## Features Let's Review requirements:
- **Two Modals:** `Director` and `Movie` with a relationship.
- **Data Validations:** Detailed rules enforce correct data creation natively with Mongoose.
- **Properties**: Models utilize `String, Number, Boolean, Date, and ObjectId` data types.
- **Full CRUD:** Controller functions to Create, Read, Update, and Delete.
- **Separation of Concerns:** Distinct files for Controller, Routes, Database configuration, and Mongoose Modeling.
- **Advanced Querying:** MongoDB query operators (`$gte`, `$lte`, `$in`), field selection, sorting, and pagination on both `getAll` endpoints.

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

## Project Structure

```
├── server.js                    # Entry point — starts Express & connects to MongoDB
├── app/
│   ├── index.js                 # Express app config (middleware, route mounting)
│   ├── db/
│   │   └── config.js            # Mongoose connection setup
│   ├── models/
│   │   ├── Director.js          # Director schema (name, age, isActive, awardsWon)
│   │   └── Movie.js             # Movie schema (title, releaseYear, genre, boxOfficeMillions, director)
│   ├── controller/
│   │   ├── directorController.js
│   │   └── movieController.js
│   ├── routes/
│   │   ├── index.js             # Route aggregator
│   │   ├── directorRoutes.js
│   │   └── movieRoutes.js
│   └── utils/
│       ├── messages.js          # Centralised response messages
│       └── queryHelper.js       # Shared query builder (filter, select, sort, paginate)
```

---

## Query Parameters (Both getAll Endpoints)

All `GET /` (getAll) endpoints support the following query string parameters. Filtering happens at the **database level** using MongoDB query operators.

### Filtering with MongoDB Query Operators

| Operator | Syntax | Example | Description |
|----------|--------|---------|-------------|
| `$gte` | `?field[gte]=value` | `?age[gte]=40` | Greater than or equal to |
| `$lte` | `?field[lte]=value` | `?age[lte]=70` | Less than or equal to |
| `$gt` | `?field[gt]=value` | `?awardsWon[gt]=5` | Greater than |
| `$lt` | `?field[lt]=value` | `?releaseYear[lt]=2000` | Less than |
| `$in` | `?field[in]=val1,val2` | `?genre[in]=Action,Sci-Fi` | Matches any value in list |

### Field Selection (select)

Use `?select=` to return only specific fields. Fields are comma-separated.

```
GET /api/v1/directors?select=name,awardsWon
GET /api/v1/movies?select=title,genre
```

### Sorting (sort)

Use `?sort=` to order results. Prefix with `-` for descending. Comma-separate multiple fields.

```
GET /api/v1/directors?sort=-awardsWon        # Most awarded first
GET /api/v1/movies?sort=-boxOfficeMillions    # Highest grossing first
GET /api/v1/directors?sort=name               # Alphabetical by name
```

### Pagination (page & limit)

Both getAll endpoints are paginated. Defaults: **page 1, limit 10**.

```
GET /api/v1/directors?page=1&limit=5
GET /api/v1/movies?page=2&limit=10
```

The response includes a `pagination` object:

```json
{
  "pagination": {
    "total": 25,
    "count": 5,
    "page": 1,
    "limit": 5,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Combined Example

```
GET /api/v1/movies?genre[in]=Action,Sci-Fi&releaseYear[gte]=2000&sort=-boxOfficeMillions&select=title,genre,boxOfficeMillions&page=1&limit=5
```

This returns the top 5 highest-grossing Action or Sci-Fi movies released since 2000, showing only title, genre, and box office.

---

### Directors Endpoint (`/api/v1/directors`)
- `GET /` — Fetch all directors (supports filtering, select, sort, pagination).
- `GET /:id` — Fetch a director by their MongoDB `_id`.
- `POST /` — Create a new director. Ensure you provide:
  - `name`: String
  - `age`: Number
  - `isActive`: Boolean (Optional, defaults to true)
  - `awardsWon`: Number (Optional, defaults to 0)
- `PUT /:id` — Update an existing director.
- `DELETE /:id` — Delete a director. 

### Movies Endpoint (`/api/v1/movies`)
- `GET /` - Fetch all movies (supports filtering, select, sort, pagination). Returns associated Director metadata.
- `GET /:id` - View a movie entry by its MongoDB `_id`.
- `POST /` - Add a new movie. The `director` Object ID must be generated first and passed into this request! 
  - `title`: String
  - `releaseYear`: Number 
  - `genre`: String 
  - `boxOfficeMillions`: Number (Optional, defaults to 0)
  - `director`: string (References an existing Director ObjectId)
- `PUT /:id` - Update existing movie attributes.
- `DELETE /:id` - Delete a movie.
