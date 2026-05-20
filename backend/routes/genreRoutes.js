const express = require("express");
const genreController = require("../controllers/genreController");

const router = express.Router();

router.get("/", genreController.getAllGenres);
router.post("/", genreController.createGenre);
router.delete("/:id", genreController.deleteGenre);

module.exports = router;