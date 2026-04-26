/**
 * queryHelper.js
 * 
 * Shared utility for building advanced Mongoose queries from
 * Express request query strings. Supports:
 *  - MongoDB comparison operators ($gt, $gte, $lt, $lte, $in)
 *  - Field selection / projection  (?select=name,age)
 *  - Sorting                       (?sort=-awardsWon,name)
 *  - Pagination                    (?page=1&limit=10)
 */

/**
 * Builds a Mongoose query with filtering, select, sort, and pagination.
 *
 * @param {import('mongoose').Model} model        - The Mongoose model to query.
 * @param {Object}                   reqQuery     - The raw req.query object from Express.
 * @param {Object|null}              populateOpts - Optional populate config ({ path, select }).
 * @returns {Promise<{ data: Array, pagination: Object }>}
 */
const buildQuery = async (model, reqQuery, populateOpts = null) => {
    // ── 1. Copy query & extract reserved keys ──────────────────────────
    const queryObj = { ...reqQuery };
    const reservedFields = ["select", "sort", "page", "limit"];
    reservedFields.forEach((field) => delete queryObj[field]);

    // ── 2. Convert operator shorthand to MongoDB syntax ────────────────
    // Turns { age: { gte: '40', lte: '70' } } into { age: { $gte: '40', $lte: '70' } }
    // Also handles $in — e.g. ?genre[in]=Action,Sci-Fi
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    let parsedFilter = JSON.parse(queryStr);

    // Handle $in values — split comma-separated strings into arrays
    for (const key in parsedFilter) {
        if (parsedFilter[key] && parsedFilter[key]["$in"]) {
            parsedFilter[key]["$in"] = parsedFilter[key]["$in"].split(",");
        }
    }

    // ── 3. Get total count for pagination metadata ─────────────────────
    const total = await model.countDocuments(parsedFilter);

    // ── 4. Build the base query ────────────────────────────────────────
    let query = model.find(parsedFilter);

    // ── 5. Field Selection ─────────────────────────────────────────────
    // ?select=name,age  →  .select("name age")
    // Always exclude __v regardless
    if (reqQuery.select) {
        const fields = reqQuery.select.split(",").join(" ");
        query = query.select(fields);
    } else {
        query = query.select("-__v");
    }

    // ── 6. Sorting ─────────────────────────────────────────────────────
    // ?sort=-awardsWon,name  →  .sort("-awardsWon name")
    if (reqQuery.sort) {
        const sortBy = reqQuery.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        // Default sort: newest first
        query = query.sort("-createdAt");
    }

    // ── 7. Pagination ──────────────────────────────────────────────────
    const page = Math.max(parseInt(reqQuery.page, 10) || 1, 1);
    const limit = Math.max(parseInt(reqQuery.limit, 10) || 10, 1);
    const startIndex = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit) || 1;

    query = query.skip(startIndex).limit(limit);

    // ── 8. Populate (optional) ─────────────────────────────────────────
    if (populateOpts) {
        query = query.populate(populateOpts);
    }

    // ── 9. Execute query ───────────────────────────────────────────────
    const data = await query;

    // ── 10. Build pagination metadata ──────────────────────────────────
    const pagination = {
        total,
        count: data.length,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };

    return { data, pagination };
};

module.exports = { buildQuery };
