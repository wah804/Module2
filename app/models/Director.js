const mongoose = require("mongoose");

/**
 * Director Schema
 * Fields: name (String), age (Number), isActive (Boolean), awardsWon (Number)
 * Virtual: movies — populated from Movie collection via director field
 */
const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Director name is required"],
        trim: true,
        maxlength: [100, "Name cannot be more than 100 characters"]
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "Age must be at least 18"],
        max: [120, "Age cannot exceed 120"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    awardsWon: {
        type: Number,
        default: 0,
        min: [0, "Awards won cannot be negative"]
    }
}, { timestamps: true });

// Virtual field: populates associated movies for a director
directorSchema.virtual('movies', {
    ref: 'Movie',
    localField: '_id',
    foreignField: 'director',
    justOne: false
});

// Enable virtuals in JSON output
directorSchema.set('toJSON', { virtuals: true });
directorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Director", directorSchema);
