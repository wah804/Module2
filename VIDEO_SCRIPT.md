# Video Presentation Script — Module 3: Jest Unit Tests (Mocked)

> **Estimated time:** 5–7 minutes  
> **Before recording:** Have the project open in your IDE with the `tests/` folder visible in the sidebar. Make sure the terminal is ready.

---

## PART 1 — Intro (~20 sec)

> **On screen:** IDE with the project file tree visible, `tests/` folder expanded showing `directors.test.js` and `movies.test.js`.

**Say:**

"Hey, this week I'm writing mocked Jest unit tests for my Movie API. I'm testing the new query operator features I added last week — specifically field selection, pagination, and sorting — on both the Directors and Movies endpoints. All 12 tests are fully mocked, meaning no real database connection is needed to run them."

---

## PART 2 — Project Setup (~30 sec)

> **Open file:** `package.json`  
> **Highlight:** the `devDependencies` block and the `"test"` script.

**Say:**

"First, I added two dev dependencies — `jest` for the test runner and `supertest` to make real HTTP requests to the Express app without needing to start the server manually. I also added the `test` script here which runs `jest --verbose` so we can see every individual test result. There's also a jest config block that tells Jest to look inside the `tests/` directory and use the node environment."

---

## PART 3 — How Mocking Works (~45 sec)

> **Open file:** `tests/directors.test.js`  
> **Scroll to the top — lines 1–15 (imports and jest.mock)**

**Say:**

"At the very top, I import `supertest` and the Express `app` — not `server.js`, just the app, so the database connection function is never called. Then on this line, `jest.mock('../app/models/Director')` — this tells Jest to intercept every single call to the Director model. No real MongoDB queries happen at all."

> **Scroll to the `createMockQuery` function (~lines 20–30)**

**Say:**

"This is the key piece — the chainable mock query. Mongoose chains methods like `.select()`, `.sort()`, `.skip()`, `.limit()`, and `.populate()` together. Each one here uses `mockReturnThis()` so it returns itself and keeps the chain going. The last method, `.populate()`, uses `mockResolvedValue()` — it returns a Promise that resolves to our fake data. That's what the `await query` in the query helper picks up."

> **Scroll to the `beforeEach` block**

**Say:**

"Before every test, I clear all mocks and reset the two model methods the query helper uses — `countDocuments`, which returns the total for pagination, and `find`, which kicks off the query chain."

---

## PART 4 — Directors Test Suite (~1.5 min)

> **Stay in:** `tests/directors.test.js`

### Select Tests

> **Scroll to `describe('Directors — Select & Field Filtering')`**

**Say:**

"The first describe block covers field selection. Test one hits `GET /api/v1/directors?select=name,awardsWon`. The mock returns objects with only `name` and `awardsWon`. I assert the response is 200, the first item has `name` and `awardsWon`, and does NOT have `age` or `isActive` — proving the select is working."

"Test two adds a filter — `isActive=true&select=name` — with a count of 1. I assert the response count is 1 and the data only has the `name` field."

### Pagination Tests

> **Scroll to `describe('Directors — Pagination')`**

**Say:**

"The second describe block tests pagination. Test one sends `?page=1&limit=2` against 7 total documents. I assert the pagination object has `limit: 2`, `total: 7`, `totalPages: 4`, `hasNextPage: true`, and `hasPrevPage: false`."

"Test two sends `?page=2&limit=2`. Here I go deeper — I grab the actual mock query object from `Director.find.mock.results` and assert that `.skip()` was called with `2` and `.limit()` was called with `2`. That directly verifies the skip and limit math is correct."

### Sort Tests

> **Scroll to `describe('Directors — Sorting')`**

**Say:**

"The third block tests sorting in both directions. Test one sends `?sort=age` — ascending — and asserts `.sort()` was called with the string `'age'`. Test two sends `?sort=-age` — the minus sign means descending — and asserts `.sort()` was called with `'-age'`. This confirms the query helper correctly passes the sort string to Mongoose."

---

## PART 5 — Movies Test Suite (~1 min)

> **Open file:** `tests/movies.test.js`

**Say:**

"The movies test file follows the exact same pattern. Same mock structure, same three describe blocks — but using movie-specific fields."

> **Scroll to `describe('Movies — Select & Field Filtering')`**

"The select tests use `?select=title,genre` and `?genre[in]=Action,Sci-Fi&select=title` — testing the `$in` operator alongside field selection."

> **Scroll to `describe('Movies — Pagination')`**

"Pagination tests use a total of 8 movies with a limit of 3 — giving us 3 total pages. Page 2 asserts `skip(3)` and `limit(3)` were called."

> **Scroll to `describe('Movies — Sorting')`**

"Sort tests cover `?sort=releaseYear` ascending and `?sort=-boxOfficeMillions` descending — the most useful sort for a movie database."

---

## PART 6 — Running the Tests (~1 min)

> **Open the terminal in the IDE (or switch to an integrated terminal).**

**Say:**

"Now let's run everything. I'll type `npm test` in the terminal."

> **Type and run:** `npm test`

> **Wait for output — all 12 tests should pass.**

**Say:**

"You can see Jest running both test suites — directors and movies — with the `--verbose` flag so every test name is printed. All 12 are passing. Notice the test run time — it's nearly instant because nothing is hitting a real database. The mocks handle everything."

> **Point to the summary line at the bottom (e.g. "12 passed, 2 suites")**

"Two suites, 12 tests, all green. No database required."

---

## PART 7 — Wrap-up (~20 sec)

> **Stay on the terminal output OR switch back to the file tree.**

**Say:**

"To summarize — I have 12 mocked Jest tests split across two files. Each file covers three scenarios: field selection with select, pagination testing both skip and limit math, and sorting in ascending and descending order. Supertest makes the HTTP requests, Jest mocks intercept the Mongoose model, and `jest --verbose` prints every result clearly. The GitHub repo is linked. Thanks."

---

> **Stop recording.**
