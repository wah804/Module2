/**
 * directors.test.js
 *
 * Mocked Jest unit tests for GET /api/v1/directors.
 * Tests cover:
 *   - Field selection via ?select= query string
 *   - Pagination via ?page= and ?limit= query strings
 *   - Sorting in ascending and descending order via ?sort=
 *
 * Mocking strategy:
 *   - jest.mock() intercepts all Director model calls — no real DB connection used.
 *   - supertest sends real HTTP requests through the Express app.
 *   - createMockQuery() builds a chainable Mongoose query mock where each
 *     method returns `this` except populate(), which resolves the mock data.
 */

const request = require("supertest");
const app     = require("../app");

// ── Mock the Director model ───────────────────────────────────────────────────
// Replaces real Mongoose model methods with jest.fn() stubs.
jest.mock("../app/models/Director", () => ({
    find:           jest.fn(),
    countDocuments: jest.fn(),
}));

const Director = require("../app/models/Director");

// ── Sample dataset (7 directors) ─────────────────────────────────────────────
const mockDirectors = [
    { _id: "1", name: "Christopher Nolan",  age: 53, isActive: true,  awardsWon: 10 },
    { _id: "2", name: "Steven Spielberg",   age: 77, isActive: true,  awardsWon: 20 },
    { _id: "3", name: "Greta Gerwig",       age: 40, isActive: true,  awardsWon: 5  },
    { _id: "4", name: "Martin Scorsese",    age: 81, isActive: true,  awardsWon: 15 },
    { _id: "5", name: "Ava DuVernay",       age: 51, isActive: true,  awardsWon: 8  },
    { _id: "6", name: "Denis Villeneuve",   age: 56, isActive: true,  awardsWon: 12 },
    { _id: "7", name: "Jordan Peele",       age: 44, isActive: false, awardsWon: 7  },
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
    Director.countDocuments.mockResolvedValue(mockDirectors.length);
    Director.find.mockReturnValue(createMockQuery(mockDirectors));
});

// ═════════════════════════════════════════════════════════════════════════════
// SELECT & FIELD FILTERING
// ═════════════════════════════════════════════════════════════════════════════
describe("Directors API — Select & Field Filtering", () => {

    /**
     * Test 1 — Select specific fields.
     * ?select=name,awardsWon should return only name and awardsWon in each object.
     * All other fields (age, isActive) must be absent.
     */
    test("should return only name and awardsWon when ?select=name,awardsWon is passed", async () => {
        // Mock returns objects containing only the requested fields
        const limitedData = mockDirectors.map(({ _id, name, awardsWon }) => ({
            _id,
            name,
            awardsWon,
        }));
        Director.find.mockReturnValue(createMockQuery(limitedData));

        const res = await request(app).get("/api/v1/directors?select=name,awardsWon");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        // Selected fields ARE present
        expect(res.body.data[0]).toHaveProperty("name");
        expect(res.body.data[0]).toHaveProperty("awardsWon");
        // Non-selected fields are NOT present
        expect(res.body.data[0]).not.toHaveProperty("age");
        expect(res.body.data[0]).not.toHaveProperty("isActive");
    });

    /**
     * Test 2 — Combine a filter with select.
     * ?isActive=true&select=name should return only active directors
     * showing only the name field.
     */
    test("should filter by isActive=true and return only the name field", async () => {
        const filteredData = [{ _id: "1", name: "Christopher Nolan" }];
        Director.countDocuments.mockResolvedValue(1);
        Director.find.mockReturnValue(createMockQuery(filteredData));

        const res = await request(app).get("/api/v1/directors?isActive=true&select=name");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
        // Only name is present
        expect(res.body.data[0]).toHaveProperty("name");
        expect(res.body.data[0]).not.toHaveProperty("age");
        expect(res.body.data[0]).not.toHaveProperty("awardsWon");
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// PAGINATION
// ═════════════════════════════════════════════════════════════════════════════
describe("Directors API — Pagination", () => {

    /**
     * Test 3 — Page 1, limit 2.
     * Validates the full pagination metadata object returned in the response:
     * page, limit, total, totalPages, hasNextPage, hasPrevPage, count.
     */
    test("should return correct pagination metadata for page=1 limit=2", async () => {
        Director.countDocuments.mockResolvedValue(7);
        Director.find.mockReturnValue(createMockQuery(mockDirectors.slice(0, 2)));

        const res = await request(app).get("/api/v1/directors?page=1&limit=2");

        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(2);
        expect(res.body.pagination.total).toBe(7);
        expect(res.body.pagination.totalPages).toBe(4);
        expect(res.body.pagination.hasNextPage).toBe(true);
        expect(res.body.pagination.hasPrevPage).toBe(false);
        expect(res.body.count).toBe(2);
    });

    /**
     * Test 4 — Page 2, limit 2.
     * Validates hasPrevPage=true and directly asserts that skip(2) and limit(2)
     * were called on the Mongoose query — proving the skip math is correct.
     */
    test("should call skip(2) and limit(2) and return hasPrevPage=true for page=2 limit=2", async () => {
        Director.countDocuments.mockResolvedValue(7);
        const mockQuery = createMockQuery(mockDirectors.slice(2, 4));
        Director.find.mockReturnValue(mockQuery);

        const res = await request(app).get("/api/v1/directors?page=2&limit=2");

        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(2);
        expect(res.body.pagination.hasPrevPage).toBe(true);
        expect(res.body.pagination.hasNextPage).toBe(true);
        // Verify skip = (page - 1) * limit = (2 - 1) * 2 = 2
        expect(mockQuery.skip).toHaveBeenCalledWith(2);
        expect(mockQuery.limit).toHaveBeenCalledWith(2);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// SORTING
// ═════════════════════════════════════════════════════════════════════════════
describe("Directors API — Sorting", () => {

    /**
     * Test 5 — Ascending sort by age.
     * ?sort=age should call .sort("age") on the Mongoose query chain.
     */
    test("should call .sort('age') for ascending sort when ?sort=age is passed", async () => {
        const ascending = [...mockDirectors].sort((a, b) => a.age - b.age);
        const mockQuery = createMockQuery(ascending);
        Director.find.mockReturnValue(mockQuery);

        const res = await request(app).get("/api/v1/directors?sort=age");

        expect(res.statusCode).toBe(200);
        expect(mockQuery.sort).toHaveBeenCalledWith("age");
    });

    /**
     * Test 6 — Descending sort by age.
     * ?sort=-age should call .sort("-age") on the Mongoose query chain.
     * The minus prefix is the Mongoose/MongoDB convention for descending order.
     */
    test("should call .sort('-age') for descending sort when ?sort=-age is passed", async () => {
        const descending = [...mockDirectors].sort((a, b) => b.age - a.age);
        const mockQuery = createMockQuery(descending);
        Director.find.mockReturnValue(mockQuery);

        const res = await request(app).get("/api/v1/directors?sort=-age");

        expect(res.statusCode).toBe(200);
        expect(mockQuery.sort).toHaveBeenCalledWith("-age");
    });
});
