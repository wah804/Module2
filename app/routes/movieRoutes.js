const router = require("express").Router();
const {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} = require("../controller/movieController");

router.route("/")
    .get(getAllMovies)
    .post(createMovie);

router.route("/:id")
    .get(getMovieById)
    .put(updateMovie)
    .delete(deleteMovie);

module.exports = router;
