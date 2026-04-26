const mongoose = require("mongoose");

/**
 * Movie Schema
 * Fields: title (String), releaseYear (Number), genre (String enum),
 *         boxOfficeMillions (Number), director (ObjectId ref to Director)
 */
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Movie title is required"],
        trim: true,
        maxlength: [150, "Title cannot be more than 150 characters"]
    },
    releaseYear: {
        type: Number,
        required: [true, "Release year is required"],
        min: [1888, "Year must be after the invention of film"],
        max: [new Date().getFullYear() + 5, "Year cannot be too far in the future"]
    },
    genre: {
        type: String,
        required: [true, "Genre is required"],
        enum: ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary", "Other"],
        default: "Other"
    },
    boxOfficeMillions: {
        type: Number,
        default: 0,
        min: [0, "Box office cannot be negative"]
    },
    director: {
        type: mongoose.Schema.ObjectId,
        ref: "Director",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
