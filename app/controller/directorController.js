const Director = require("../models/Director");

// @desc    Get all directors
// @route   GET /api/v1/directors
const getAllDirectors = async (req, res) => {
    try {
        const directors = await Director.find({});
        res.status(200).json({ success: true, count: directors.length, data: directors });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get single director
// @route   GET /api/v1/directors/:id
const getDirectorById = async (req, res) => {
    try {
        const director = await Director.findById(req.params.id);
        
        if (!director) {
            return res.status(404).json({ success: false, message: `No director found with id of ${req.params.id}` });
        }
        
        res.status(200).json({ success: true, data: director });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid ID format", error: error.message });
    }
};

// @desc    Create new director
// @route   POST /api/v1/directors
const createDirector = async (req, res) => {
    try {
        const director = await Director.create(req.body);
        res.status(201).json({ success: true, data: director });
    } catch (error) {
        res.status(400).json({ success: false, message: "Validation or duplication error", error: error.message });
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
            return res.status(404).json({ success: false, message: `No director found with id of ${req.params.id}` });
        }
        
        res.status(200).json({ success: true, data: director });
    } catch (error) {
        res.status(400).json({ success: false, message: "Validation error", error: error.message });
    }
};

// @desc    Delete director
// @route   DELETE /api/v1/directors/:id
const deleteDirector = async (req, res) => {
    try {
        const director = await Director.findByIdAndDelete(req.params.id);
        
        if (!director) {
            return res.status(404).json({ success: false, message: `No director found with id of ${req.params.id}` });
        }
        
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error deleting director", error: error.message });
    }
};

module.exports = {
    getAllDirectors,
    getDirectorById,
    createDirector,
    updateDirector,
    deleteDirector
};
