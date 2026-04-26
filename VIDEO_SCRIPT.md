# Video Presentation Script — Module 2: MongoDB Query Operators

> **Estimated time:** 5–7 minutes  
> **Before recording:** Make sure the server is running (`npm run dev`) and Postman is open.

---

## PART 1 — Intro & Project Overview (~30 sec)

> **On screen:** Your IDE with the project file tree visible in the sidebar.

**Say:**

"Hey, this is my Movie API project. Last week I built out two Mongoose models — Director and Movie — with full CRUD and a relationship between them. This week I'm expanding the getAll endpoints on both collections with MongoDB query operators, field selection, sorting, and pagination — all done at the database level through RESTful query strings."

---

## PART 2 — Project Structure (~30 sec)

> **On screen:** Expand the file tree in the sidebar so the full `app/` folder is visible.

**Say:**

"Quick look at the project structure. Everything lives inside the `app` folder — models, controllers, routes, and utils. The key change this week is I added a new file: `queryHelper.js` inside `app/utils/`. This is a shared utility that both controllers import, so I'm not duplicating any query logic. I also updated `messages.js` with a new pagination error message."

---

## PART 3 — The Query Helper (Core Logic) (~1.5 min)

> **Open file:** `app/utils/queryHelper.js`

**Say:**

"This is the heart of the changes — `queryHelper.js`. It exports one function called `buildQuery` that takes three arguments: the Mongoose model, the raw `req.query` object from Express, and an optional populate config."

> **Scroll to lines 21–24 (Step 1)**

"First, I copy the query object and strip out the reserved keys — `select`, `sort`, `page`, and `limit` — so they don't get treated as filter fields."

> **Scroll to lines 26–42 (Step 2)**

"Next is where the MongoDB query operators come in. I convert the query string into a JSON string and use a regex replace to turn shorthand like `gte`, `lte`, and `in` into proper MongoDB operators — `$gte`, `$lte`, `$in`. For the `$in` operator specifically, I also split the comma-separated string into an array so Mongo can match against multiple values."

> **Scroll to lines 44–48 (Steps 3–4)**

"Then I count the total matching documents for pagination metadata and build the base `find()` query with the parsed filter."

> **Scroll to lines 50–58 (Step 5)**

"Here's the `select` — field selection. If the user passes `?select=name,age`, I split the commas into spaces and pass it to Mongoose's `.select()`. Otherwise I just exclude the `__v` field by default."

> **Scroll to lines 60–68 (Step 6)**

"For sorting, if the user passes `?sort=-awardsWon`, the dash means descending. If no sort is provided, I default to newest first using `createdAt`."

> **Scroll to lines 70–76 (Step 7)**

"Pagination — I parse `page` and `limit` from the query string, defaulting to page 1 and limit 10. I calculate the skip value and chain `.skip()` and `.limit()` onto the query."

> **Scroll to lines 86–97 (Step 10)**

"Finally, I build a pagination metadata object with the total count, current page, total pages, and boolean flags for `hasNextPage` and `hasPrevPage` — and return both the data and the pagination object back to the controller."

---

## PART 4 — Director Controller (~45 sec)

> **Open file:** `app/controller/directorController.js`

**Say:**

"Now let's see how the controller uses it. Open `directorController.js`. At the top on line 3, I'm importing `buildQuery` from the query helper."

> **Scroll to lines 5–11 (the comment block)**

"I've documented all the supported query strings right here in the comments — `age[gte]`, `age[lte]`, `isActive`, `select`, `sort`, and `page`/`limit`."

> **Scroll to lines 12–28 (the getAllDirectors function)**

"The `getAllDirectors` function is now clean and simple. I define my populate options — I still want the virtual `movies` field to come back with title, genre, and releaseYear. Then I just call `buildQuery` with the Director model, `req.query`, and the populate options. It returns the data and pagination, which I include in the JSON response. All the rest of the CRUD methods — getById, create, update, delete — stay exactly the same as last week."

---

## PART 5 — Movie Controller (~30 sec)

> **Open file:** `app/controller/movieController.js`

**Say:**

"Same pattern in `movieController.js`. Line 3, I import `buildQuery`. The `getAllMovies` function on line 12 sets up populate options for the director reference — returning only name and ID — and calls `buildQuery` the same way. The comment block on lines 5 through 11 documents the movie-specific query strings like `releaseYear[gte]`, `genre[in]`, and `sort=-boxOfficeMillions`."

---

## PART 6 — Postman Demos (~2.5 min)

> **Switch to Postman.** Run each request and briefly show the response.

### Demo 1: Basic getAll (pagination visible)

> **URL:** `GET http://localhost:3000/api/v1/directors`

**Say:**

"First, a basic get-all. Notice the response now includes a `pagination` object with the total count, current page, total pages, and the hasNext/hasPrev flags. Pagination is on by default — page 1, limit 10."

---

### Demo 2: Query Operators — $gte / $lte on Directors

> **URL:** `GET http://localhost:3000/api/v1/directors?age[gte]=40&age[lte]=70`

**Say:**

"Here I'm filtering directors by age range using `$gte` and `$lte`. Only directors between 40 and 70 years old come back. This filtering happens at the database level — Mongoose translates the query string into a proper MongoDB filter."

---

### Demo 3: Select on Directors

> **URL:** `GET http://localhost:3000/api/v1/directors?select=name,awardsWon`

**Say:**

"Now I'm using `select` to only return the `name` and `awardsWon` fields. You can see the response is much smaller — no age, no isActive, no timestamps. Just the fields I asked for."

---

### Demo 4: Sort on Directors

> **URL:** `GET http://localhost:3000/api/v1/directors?sort=-awardsWon`

**Say:**

"Sorting — the dash before `awardsWon` means descending order. So the most-awarded directors appear first."

---

### Demo 5: Pagination on Directors

> **URL:** `GET http://localhost:3000/api/v1/directors?page=1&limit=2`

**Say:**

"Pagination in action — I'm asking for page 1 with a limit of 2. You can see the count is 2 and `hasNextPage` is true, meaning there are more results on the next page."

---

### Demo 6: Query Operators — $in on Movies

> **URL:** `GET http://localhost:3000/api/v1/movies?genre[in]=Action,Sci-Fi`

**Say:**

"On the movies endpoint now. I'm using the `$in` operator to get movies that are either Action or Sci-Fi. The comma-separated values get split into an array by the query helper."

---

### Demo 7: Combined query on Movies

> **URL:** `GET http://localhost:3000/api/v1/movies?releaseYear[gte]=2000&sort=-boxOfficeMillions&select=title,genre,boxOfficeMillions&page=1&limit=5`

**Say:**

"Finally, here's everything combined on one request — filtering movies released after 2000, sorting by highest box office, selecting only three fields, and paginating with a limit of 5. All of these work together through the shared query helper."

---

## PART 7 — README & Wrap-up (~30 sec)

> **Open file:** `README.md` — scroll to the "Query Parameters" section around line 66.

**Say:**

"I also updated the README with full documentation of all the query parameters — the operator table, select, sort, pagination, and a combined example URL. The project structure diagram is also updated to show the new `queryHelper.js` file."

"To summarize — both getAll endpoints now support MongoDB query operators `$gte`, `$lte`, and `$in` for filtering, `select` for field projection, `sort` for ordering, and pagination with page and limit. All the logic is shared through a single `queryHelper.js` utility to keep things DRY. The GitHub repo is linked. Thanks for watching."

---

> **Stop recording.**
