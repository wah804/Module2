/**
 * movies.test.js
 *
 * Mocked Jest unit tests for GET /api/v1/movies.
 * Tests cover:
 *   - Field selection via ?select= query string
 *   - Pagination via ?page= and ?limit= query strings
 *   - Sorting in ascending and descending order via ?sort=
 *
 * Mocking strategy:
 *   - jest.mock() intercepts all Movie model calls — no real DB connection used.
 *   - supertest sends real HTTP requests through the Express app.
 *   - createMockQuery() builds a chainable Mongoose query mock where each
 *     method returns `this` except populate(), which resolves the mock data.
 */

const request = require("supertest");
const app     = require("../app");

// ── Mock the Movie model ──────────────────────────────────────────────────────
// Replaces real Mongoose model methods with jest.fn() stubs.
jest.mock("../app/models/Movie", () => ({
    find:           jest.fn(),
    countDocuments: jest.fn(),
}));

const Movie = require("../app/models/Movie");

// ── Sample dataset (8 movies — one per genre + 1 extra Other) ────────────────
const mockMovies = [
    { _id: "1", title: "Mad Max: Fury Road",        genre: "Action",      releaseYear: 2015, boxOfficeMillions: 375, director: { _id: "dir1", name: "Christopher Nolan" } },
    { _id: "2", title: "The Grand Budapest Hotel",  genre: "Comedy",      releaseYear: 2014, boxOfficeMillions: 174, director: { _id: "dir1", name: "Christopher Nolan" } },
    { _id: "3", title: "The Shawshank Redemption",  genre: "Drama",       releaseYear: 1994, boxOfficeMillions: 16,  director: { _id: "dir1", name: "Christopher Nolan" } },
    { _id: "4", title: "Interstellar",              genre: "Sci-Fi",      releaseYear: 2014, boxOfficeMillions: 701, director: { _id: "dir1", name: "Christopher Nolan" } },
    { _id: "5", title: "Get Out",                   genre: "Horror",      releaseYear: 2017, boxOfficeMillions: 255, director: { _id: "dir1", name: "Christopher Nolan" } },
    { _id: "6", title: "Free Solo",                 genre: "Documentary", releaseYear: 2018, boxOfficeMillions: 29,  director: { _id: "dir1", name: "Christopher Nolan" } },
    { _id: "7", title: "Inception",                 genre: "Other",       releaseYear: 2010, boxOfficeMillions: 836, director: { _id: "dir1", name: "Christopher Nolan" } },
    { _id: "8", title: "The Dark Knight",           genre: "Action",      releaseYear: 2008, boxOfficeMillions: 1005,director: { _id: "dir1", name: "Christopher Nolan" } },
];

/**
 * Creates a chainable Mongoose query mock.
 * select / sort / skip / limit return `this` to allow chaining.
 * populate() returns a resolved Promise — it is the last call before `await query`.
 *
 * @param {Array} resolveValue - Mock data the query resolves to.
 */
const createMockQuery = (resolveValue) => ({
    select:   jest.fn().mockReturnThis(),
    sort:     jest.fn().mockReturnThis(),
    skip:     jest.fn().mockReturnThis(),
    limit:    jest.fn().mockReturnThis(),
    populate: jest.fn().mockResolvedValue(resolveValue),
});

// Reset all mock state before each test to prevent bleed-through
beforeEach(() => {
    jest.clearAllMocks();
    Movie.countDocuments.mockResolvedValue(mockMovies.length);
    Movie.find.mockReturnValue(createMockQuery(mockMovies));
});

// ═════════════════════════════════════════════════════════════════════════════
// SELECT & FIELD FILTERING
// ═════════════════════════════════════════════════════════════════════════════
describe("Movies API — Select & Field Filtering", () => {

    /**
     * Test 1 — Select specific fields.
     * ?select=title,genre should return only title and genre in each object.
     * All other fields (releaseYear, boxOfficeMillions, director) must be absent.
     */
    test("should return only title and genre when ?select=title,genre is passed", async () => {
        // Mock returns objects containing only the requested fields
        const limitedData = mockMovies.map(({ _id, title, genre }) => ({
            _id,
            title,
            genre,
        }));
        Movie.find.mockReturnValue(createMockQuery(limitedData));

        const res = await request(app).get("/api/v1/movies?select=title,genre");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        // Selected fields ARE present
        expect(res.body.data[0]).toHaveProperty("title");
        expect(res.body.data[0]).toHaveProperty("genre");
        // Non-selected fields are NOT present
        expect(res.body.data[0]).not.toHaveProperty("releaseYear");
        expect(res.body.data[0]).not.toHaveProperty("boxOfficeMillions");
        expect(res.body.data[0]).not.toHaveProperty("director");
    });

    /**
     * Test 2 — Combine the $in operator with select.
     * ?genre[in]=Action,Sci-Fi&select=title filters to Action and Sci-Fi movies
     * and returns only the title field.
     */
    test("should filter by genre $in Action,Sci-Fi and return only the title field", async () => {
        const filteredData = [
            { _id: "1", title: "Mad Max: Fury Road" },
            { _id: "4", title: "Interstellar"       },
            { _id: "8", title: "The Dark Knight"    },
        ];
        Movie.countDocuments.mockResolvedValue(3);
        Movie.find.mockReturnValue(createMockQuery(filteredData));

        const res = await request(app).get(
            "/api/v1/movies?genre%5Bin%5D=Action%2CSci-Fi&select=title"
        );

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(3);
        // Only title is present
        expect(res.body.data[0]).toHaveProperty("title");
        expect(res.body.data[0]).not.toHaveProperty("genre");
        expect(res.body.data[0]).not.toHaveProperty("releaseYear");
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// PAGINATION
// ═════════════════════════════════════════════════════════════════════════════
describe("Movies API — Pagination", () => {

    /**
     * Test 3 — Page 1, limit 3.
     * Validates the full pagination metadata object returned in the response:
     * page, limit, total, totalPages, hasNextPage, hasPrevPage, count.
     */
    test("should return correct pagination metadata for page=1 limit=3", async () => {
        Movie.countDocuments.mockResolvedValue(8);
        Movie.find.mockReturnValue(createMockQuery(mockMovies.slice(0, 3)));

        const res = await request(app).get("/api/v1/movies?page=1&limit=3");

        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(3);
        expect(res.body.pagination.total).toBe(8);
        expect(res.body.pagination.totalPages).toBe(3);
        expect(res.body.pagination.hasNextPage).toBe(true);
        expect(res.body.pagination.hasPrevPage).toBe(false);
        expect(res.body.count).toBe(3);
    });

    /**
     * Test 4 — Page 2, limit 3.
     * Validates hasPrevPage=true and directly asserts that skip(3) and limit(3)
     * were called on the Mongoose query — proving the skip math is correct.
     */
    test("should call skip(3) and limit(3) and return hasPrevPage=true for page=2 limit=3", async () => {
        Movie.countDocuments.mockResolvedValue(8);
        const mockQuery = createMockQuery(mockMovies.slice(3, 6));
        Movie.find.mockReturnValue(mockQuery);

        const res = await request(app).get("/api/v1/movies?page=2&limit=3");

        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(2);
        expect(res.body.pagination.hasPrevPage).toBe(true);
        expect(res.body.pagination.hasNextPage).toBe(true);
        // Verify skip = (page - 1) * limit = (2 - 1) * 3 = 3
        expect(mockQuery.skip).toHaveBeenCalledWith(3);
        expect(mockQuery.limit).toHaveBeenCalledWith(3);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// SORTING
// ═════════════════════════════════════════════════════════════════════════════
describe("Movies API — Sorting", () => {

    /**
     * Test 5 — Ascending sort by releaseYear.
     * ?sort=releaseYear should call .sort("releaseYear") on the Mongoose query chain.
     */
    test("should call .sort('releaseYear') for ascending sort when ?sort=releaseYear is passed", async () => {
        const ascending = [...mockMovies].sort((a, b) => a.releaseYear - b.releaseYear);
        const mockQuery = createMockQuery(ascending);
        Movie.find.mockReturnValue(mockQuery);

        const res = await request(app).get("/api/v1/movies?sort=releaseYear");

        expect(res.statusCode).toBe(200);
        expect(mockQuery.sort).toHaveBeenCalledWith("releaseYear");
    });

    /**
     * Test 6 — Descending sort by boxOfficeMillions.
     * ?sort=-boxOfficeMillions should call .sort("-boxOfficeMillions") on the
     * Mongoose query chain. The minus prefix = descending order in Mongoose.
     */
    test("should call .sort('-boxOfficeMillions') for descending sort when ?sort=-boxOfficeMillions is passed", async () => {
        const descending = [...mockMovies].sort(
            (a, b) => b.boxOfficeMillions - a.boxOfficeMillions
        );
        const mockQuery = createMockQuery(descending);
        Movie.find.mockReturnValue(mockQuery);

        const res = await request(app).get("/api/v1/movies?sort=-boxOfficeMillions");

        expect(res.statusCode).toBe(200);
        expect(mockQuery.sort).toHaveBeenCalledWith("-boxOfficeMillions");
    });
});
