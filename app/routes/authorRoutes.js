const router = require("express").Router();
const {
    createAuthorById,
    getAllAuthor,
    getAuthorById,
    updateAuthorById,
    deleteAuthorById
} = require("../controller/authorController");

router.get("/", getAllAuthor);

router.get("/:id", getAuthorById);

router.post("/", createAuthorById);
   
router.put("/:id", updateAuthorById) 

router.delete("/:id", deleteAuthorById) 

module.exports = router