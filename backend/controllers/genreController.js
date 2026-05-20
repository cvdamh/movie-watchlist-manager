const genreService = require("../services/genreService");

async function getAllGenres(req, res, next) {
  try {
    const genres = await genreService.getAllGenres();
    res.status(200).json(genres);
  } catch (error) {
    next(error);
  }
}

async function createGenre(req, res, next) {
  try {
    const genre = await genreService.createGenre(req.body.name);
    res.status(201).json(genre);
  } catch (error) {
    next(error);
  }
}

async function deleteGenre(req, res, next) {
  try {
    const genre = await genreService.deleteGenre(req.params.id);

    res.status(200).json({
      message: "Genre deleted successfully.",
      deletedGenre: genre
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllGenres,
  createGenre,
  deleteGenre
};