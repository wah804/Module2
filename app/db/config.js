const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 * Logs a success message with the host on connection.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB successfully ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
