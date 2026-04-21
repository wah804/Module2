const Director = require("../models/Director");
const messages = require("../utils/messages");

// @desc    Get all directors
// @route   GET /api/v1/directors
const getAllDirectors = async (req, res) => {
    try {
        const directors = await Director.find({}).select("-__v").populate("movies", "title genre releaseYear");
        res.status(200).json({ success: true, count: directors.length, data: directors });
    } catch (error) {
        res.status(500).json({ success: false, message: messages.SERVER_ERROR, error: error.message });
    }
};

// @desc    Get single director
// @route   GET /api/v1/directors/:id
const getDirectorById = async (req, res) => {
    try {
        const director = await Director.findById(req.params.id).select("-__v").populate("movies", "title genre releaseYear");
        
        if (!director) {
            return res.status(404).json({ success: false, message: messages.NOT_FOUND("director", req.params.id) });
        }
        
        res.status(200).json({ success: true, data: director });
    } catch (error) {
        res.status(400).json({ success: false, message: messages.INVALID_ID_FORMAT, error: error.message });
    }
};

// @desc    Create new director
// @route   POST /api/v1/directors
const createDirector = async (req, res) => {
    try {
        const director = await Director.create(req.body);
        res.status(201).json({ success: true, data: director });
    } catch (error) {
        res.status(400).json({ success: false, message: messages.DUPLICATION_ERROR, error: error.message });
    }
};

// @desc    Update director
// @route   PUT /api/v1/directors/:id
const updateDirector = async (req, res) => {
    try {
        const director = await Director.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!director) {
            return res.status(404).json({ success: false, message: messages.NOT_FOUND("director", req.params.id) });
        }
        
        res.status(200).json({ success: true, data: director });
    } catch (error) {
        res.status(400).json({ success: false, message: messages.VALIDATION_ERROR, error: error.message });
    }
};

// @desc    Delete director
// @route   DELETE /api/v1/directors/:id
const deleteDirector = async (req, res) => {
    try {
        const director = await Director.findByIdAndDelete(req.params.id);
        
        if (!director) {
            return res.status(404).json({ success: false, message: messages.NOT_FOUND("director", req.params.id) });
        }
        
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: messages.DELETE_ERROR("director"), error: error.message });
    }
};

module.exports = {
    getAllDirectors,
    getDirectorById,
    createDirector,
    updateDirector,
    deleteDirector
};
