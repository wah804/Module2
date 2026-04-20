const express = require("express");
const router = express.Router();
const directorRoutes = require("./directorRoutes");
const movieRoutes = require("./movieRoutes");

router.get("/", (req, res) => {
    res.status(200).json({ success: true, message: `${req.method} - Request made to Main API Route` });
});

router.use("/directors", directorRoutes);
router.use("/movies", movieRoutes);

module.exports = router;