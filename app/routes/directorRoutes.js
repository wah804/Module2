const router = require("express").Router();
const {
    getAllDirectors,
    getDirectorById,
    createDirector,
    updateDirector,
    deleteDirector
} = require("../controller/directorController");

router.route("/")
    .get(getAllDirectors)
    .post(createDirector);

router.route("/:id")
    .get(getDirectorById)
    .put(updateDirector)
    .delete(deleteDirector);

module.exports = router;
