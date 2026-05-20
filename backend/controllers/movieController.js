const movieService = require("../services/movieService");

async function getAllMovies(req, res, next) {
  try {
    const movies = await movieService.getAllMovies(req.query);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
}

async function getMovieById(req, res, next) {
  try {
    const movie = await movieService.getMovieById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found."
      });
    }

    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
}

async function createMovie(req, res, next) {
  try {
    const movie = await movieService.createMovie(req.body);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
}

async function updateMovie(req, res, next) {
  try {
    const movie = await movieService.updateMovie(req.params.id, req.body);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
}

async function deleteMovie(req, res, next) {
  try {
    const movie = await movieService.deleteMovie(req.params.id);

    res.status(200).json({
      message: "Movie deleted successfully.",
      deletedMovie: movie
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};