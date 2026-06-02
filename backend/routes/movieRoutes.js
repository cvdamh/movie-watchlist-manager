const express = require("express");
const movieController = require("../controllers/movieController");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, movieController.getAllMovies);
router.get("/:id", authenticateUser, movieController.getMovieById);
router.post("/", authenticateUser, movieController.createMovie);
router.put("/:id", authenticateUser, movieController.updateMovie);
router.delete("/:id", authenticateUser, movieController.deleteMovie);

module.exports = router;