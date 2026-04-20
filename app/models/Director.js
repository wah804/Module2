const mongoose = require("mongoose");

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

module.exports = mongoose.model("Director", directorSchema);
