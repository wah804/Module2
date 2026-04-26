const router = require("express").Router();
const {
    getAllDirectors,
    getDirectorById,
    createDirector,
    updateDirector,
    deleteDirector
} = require("../controller/directorController");

// GET all directors | POST create director
router.route("/")
    .get(getAllDirectors)
    .post(createDirector);

// GET / PUT / DELETE director by ID
router.route("/:id")
    .get(getDirectorById)
    .put(updateDirector)
    .delete(deleteDirector);

module.exports = router;
