const Movie = require("../models/Movie");
const messages = require("../utils/messages");
const { buildQuery } = require("../utils/queryHelper");

// @desc    Get all movies with filtering, select, sort, and pagination
// @route   GET /api/v1/movies
// @query   ?releaseYear[gte]=2000&boxOfficeMillions[gte]=100 — filter by range ($gte, $lte)
// @query   ?genre[in]=Action,Sci-Fi                          — filter by genre ($in)
// @query   ?select=title,genre                                — return only selected fields
// @query   ?sort=-boxOfficeMillions                           — sort descending by box office
// @query   ?page=1&limit=10                                   — pagination (defaults: page 1, limit 10)
const getAllMovies = async (req, res) => {
    try {
        // Populate director reference with only name and _id
        const populateOpts = { path: "director", select: "name _id" };

        const { data, pagination } = await buildQuery(Movie, req.query, populateOpts);

        res.status(200).json({
            success: true,
            count: data.length,
            pagination,
            data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: messages.SERVER_ERROR, error: error.message });
    }
};

// @desc    Get single movie
// @route   GET /api/v1/movies/:id
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).select("-__v").populate("director", "name _id age");
        
        if (!movie) {
            return res.status(404).json({ success: false, message: messages.NOT_FOUND("movie", req.params.id) });
        }
        
        res.status(200).json({ success: true, data: movie });
    } catch (error) {
        res.status(400).json({ success: false, message: messages.INVALID_ID_FORMAT, error: error.message });
    }
};

// @desc    Create new movie
// @route   POST /api/v1/movies
const createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({ success: true, data: movie });
    } catch (error) {
        res.status(400).json({ success: false, message: messages.VALIDATION_ERROR, error: error.message });
    }
};

// @desc    Update movie
// @route   PUT /api/v1/movies/:id
const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!movie) {
            return res.status(404).json({ success: false, message: messages.NOT_FOUND("movie", req.params.id) });
        }
        
        res.status(200).json({ success: true, data: movie });
    } catch (error) {
        res.status(400).json({ success: false, message: messages.VALIDATION_ERROR, error: error.message });
    }
};

// @desc    Delete movie
// @route   DELETE /api/v1/movies/:id
const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        
        if (!movie) {
            return res.status(404).json({ success: false, message: messages.NOT_FOUND("movie", req.params.id) });
        }
        
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: messages.DELETE_ERROR("movie"), error: error.message });
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};
