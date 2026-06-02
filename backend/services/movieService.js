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

async function getAllMovies(filters = {}, userId) {
  let query = `
    SELECT 
      movies.id,
      movies.title,
      movies.director,
      movies.genre_id,
      genres.name AS genre,
      movies.release_year,
      user_movies.status,
      user_movies.rating,
      COALESCE(user_movies.is_favorite, 0) AS is_favorite,
      movies.created_at,
      movies.updated_at
    FROM movies
    LEFT JOIN genres ON movies.genre_id = genres.id
    LEFT JOIN user_movies 
      ON user_movies.movie_id = movies.id 
      AND user_movies.user_id = ?
    WHERE 1 = 1
  `;

  const values = [userId];

  if (filters.search) {
    query += " AND movies.title LIKE ?";
    values.push(`%${filters.search}%`);
  }

  if (filters.genre_id) {
    query += " AND movies.genre_id = ?";
    values.push(filters.genre_id);
  }

  if (filters.status) {
    query += " AND user_movies.status = ?";
    values.push(filters.status);
  }

  if (filters.is_favorite === "true") {
    query += " AND user_movies.is_favorite = TRUE";
  }

  const allowedSortFields = {
    id: "movies.id",
    title: "movies.title",
    director: "movies.director",
    genre: "genres.name",
    release_year: "movies.release_year",
    status: "user_movies.status",
    rating: "user_movies.rating",
    is_favorite: "user_movies.is_favorite"
  };

  const sortBy = allowedSortFields[filters.sort_by] || "movies.id";
  const order =
    filters.order && filters.order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  query += ` ORDER BY ${sortBy} ${order}`;

  const [rows] = await pool.query(query, values);
  return rows;
}

async function getMovieById(id, userId) {
  const [rows] = await pool.query(
    `
    SELECT 
      movies.id,
      movies.title,
      movies.director,
      movies.genre_id,
      genres.name AS genre,
      movies.release_year,
      user_movies.status,
      user_movies.rating,
      COALESCE(user_movies.is_favorite, 0) AS is_favorite,
      movies.created_at,
      movies.updated_at
    FROM movies
    LEFT JOIN genres ON movies.genre_id = genres.id
    LEFT JOIN user_movies 
      ON user_movies.movie_id = movies.id 
      AND user_movies.user_id = ?
    WHERE movies.id = ?
    `,
    [userId, id]
  );

  return rows[0];
}

async function createMovie(movie, userId) {
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

  const [movieResult] = await pool.query(
    `
    INSERT INTO movies 
    (title, director, genre_id, release_year, status, rating, is_favorite)
    VALUES (?, ?, ?, ?, NULL, NULL, FALSE)
    `,
    [title, director, genre_id, release_year]
  );

  const movieId = movieResult.insertId;

  await pool.query(
    `
    INSERT INTO user_movies
    (user_id, movie_id, status, rating, is_favorite)
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, movieId, status, rating, is_favorite]
  );

  return getMovieById(movieId, userId);
}

async function updateMovie(id, movie, userId) {
  const errors = validateMovieInput(movie);

  if (errors.length > 0) {
    const error = new Error(errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const existingMovie = await getMovieById(id, userId);

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
      release_year = ?
    WHERE id = ?
    `,
    [title, director, genre_id, release_year, id]
  );

  await pool.query(
    `
    INSERT INTO user_movies
    (user_id, movie_id, status, rating, is_favorite)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      status = VALUES(status),
      rating = VALUES(rating),
      is_favorite = VALUES(is_favorite)
    `,
    [userId, id, status, rating, is_favorite]
  );

  return getMovieById(id, userId);
}

async function deleteMovie(id, userId) {
  const existingMovie = await getMovieById(id, userId);

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