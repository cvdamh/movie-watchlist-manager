const pool = require("../config/db");

function validateMovieInput(movie) {
  const errors = [];

  if (!movie.title || movie.title.trim() === "") {
    errors.push("Title is required.");
  }

  if (
    movie.release_year !== null &&
    movie.release_year !== undefined &&
    movie.release_year !== ""
  ) {
    const year = Number(movie.release_year);

    if (Number.isNaN(year) || year < 1888 || year > 2100) {
      errors.push("Release year must be between 1888 and 2100.");
    }
  }

  if (
    movie.rating !== null &&
    movie.rating !== undefined &&
    movie.rating !== ""
  ) {
    const rating = Number(movie.rating);

    if (Number.isNaN(rating) || rating < 0 || rating > 10) {
      errors.push("Rating must be between 0 and 10.");
    }
  }

  if (movie.status && !["Watchlist", "Watched"].includes(movie.status)) {
    errors.push("Status must be Watchlist or Watched.");
  }

  return errors;
}

async function getAllMovies(filters = {}) {
  let query = `
    SELECT 
      movies.id,
      movies.title,
      movies.director,
      movies.genre_id,
      genres.name AS genre,
      movies.release_year,
      movies.status,
      movies.rating,
      movies.is_favorite,
      movies.created_at,
      movies.updated_at
    FROM movies
    LEFT JOIN genres ON movies.genre_id = genres.id
    WHERE 1 = 1
  `;

  const values = [];

  if (filters.search) {
    query += " AND movies.title LIKE ?";
    values.push(`%${filters.search}%`);
  }

  if (filters.genre_id) {
    query += " AND movies.genre_id = ?";
    values.push(filters.genre_id);
  }

  if (filters.status) {
    query += " AND movies.status = ?";
    values.push(filters.status);
  }

  if (filters.is_favorite === "true") {
    query += " AND movies.is_favorite = TRUE";
  }

  const allowedSortFields = {
    id: "movies.id",
    title: "movies.title",
    director: "movies.director",
    genre: "genres.name",
    release_year: "movies.release_year",
    status: "movies.status",
    rating: "movies.rating",
    is_favorite: "movies.is_favorite"
  };

  const sortBy = allowedSortFields[filters.sort_by] || "movies.id";
  const order =
    filters.order && filters.order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  query += ` ORDER BY ${sortBy} ${order}`;

  const [rows] = await pool.query(query, values);
  return rows;
}

async function getMovieById(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      movies.id,
      movies.title,
      movies.director,
      movies.genre_id,
      genres.name AS genre,
      movies.release_year,
      movies.status,
      movies.rating,
      movies.is_favorite,
      movies.created_at,
      movies.updated_at
    FROM movies
    LEFT JOIN genres ON movies.genre_id = genres.id
    WHERE movies.id = ?
    `,
    [id]
  );

  return rows[0];
}

async function createMovie(movie) {
  const errors = validateMovieInput(movie);

  if (errors.length > 0) {
    const error = new Error(errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const title = movie.title;
  const director = movie.director || null;
  const genre_id = movie.genre_id || null;
  const release_year = movie.release_year === "" ? null : movie.release_year;
  const status = movie.status || null;
  const rating = movie.rating === "" ? null : movie.rating;
  const is_favorite = movie.is_favorite ? 1 : 0;

  const [result] = await pool.query(
    `
    INSERT INTO movies 
    (title, director, genre_id, release_year, status, rating, is_favorite)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [title, director, genre_id, release_year, status, rating, is_favorite]
  );

  return getMovieById(result.insertId);
}

async function updateMovie(id, movie) {
  const errors = validateMovieInput(movie);

  if (errors.length > 0) {
    const error = new Error(errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const existingMovie = await getMovieById(id);

  if (!existingMovie) {
    const error = new Error("Movie not found.");
    error.statusCode = 404;
    throw error;
  }

  const title = movie.title;
  const director = movie.director || null;
  const genre_id = movie.genre_id || null;
  const release_year = movie.release_year === "" ? null : movie.release_year;
  const status = movie.status || null;
  const rating = movie.rating === "" ? null : movie.rating;
  const is_favorite = movie.is_favorite ? 1 : 0;

  await pool.query(
    `
    UPDATE movies
    SET 
      title = ?,
      director = ?,
      genre_id = ?,
      release_year = ?,
      status = ?,
      rating = ?,
      is_favorite = ?
    WHERE id = ?
    `,
    [title, director, genre_id, release_year, status, rating, is_favorite, id]
  );

  return getMovieById(id);
}

async function deleteMovie(id) {
  const existingMovie = await getMovieById(id);

  if (!existingMovie) {
    const error = new Error("Movie not found.");
    error.statusCode = 404;
    throw error;
  }

  await pool.query("DELETE FROM movies WHERE id = ?", [id]);

  return existingMovie;
}

module.exports = {
  validateMovieInput,
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};