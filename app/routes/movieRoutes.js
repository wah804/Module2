const router = require("express").Router();
const {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} = require("../controller/movieController");

// GET all movies | POST create movie
router.route("/")
    .get(getAllMovies)
    .post(createMovie);

// GET / PUT / DELETE movie by ID
router.route("/:id")
    .get(getMovieById)
    .put(updateMovie)
    .delete(deleteMovie);

module.exports = router;
