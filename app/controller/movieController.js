const Movie = require("../models/Movie");

// @desc    Get all movies
// @route   GET /api/v1/movies
const getAllMovies = async (req, res) => {
    try {
        // Optional: you can populate the director field to get director details
        const movies = await Movie.find({}).populate("director", "name _id");
        res.status(200).json({ success: true, count: movies.length, data: movies });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get single movie
// @route   GET /api/v1/movies/:id
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate("director", "name _id age");
        
        if (!movie) {
            return res.status(404).json({ success: false, message: `No movie found with id of ${req.params.id}` });
        }
        
        res.status(200).json({ success: true, data: movie });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid ID format", error: error.message });
    }
};

// @desc    Create new movie
// @route   POST /api/v1/movies
const createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({ success: true, data: movie });
    } catch (error) {
        res.status(400).json({ success: false, message: "Validation Error", error: error.message });
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
            return res.status(404).json({ success: false, message: `No movie found with id of ${req.params.id}` });
        }
        
        res.status(200).json({ success: true, data: movie });
    } catch (error) {
        res.status(400).json({ success: false, message: "Validation error", error: error.message });
    }
};

// @desc    Delete movie
// @route   DELETE /api/v1/movies/:id
const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        
        if (!movie) {
            return res.status(404).json({ success: false, message: `No movie found with id of ${req.params.id}` });
        }
        
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error deleting movie", error: error.message });
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};
