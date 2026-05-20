const pool = require("../config/db");

async function getAllGenres() {
  const [rows] = await pool.query("SELECT * FROM genres ORDER BY name ASC");
  return rows;
}

async function createGenre(name) {
  if (!name || name.trim() === "") {
    const error = new Error("Genre name is required.");
    error.statusCode = 400;
    throw error;
  }

  const [result] = await pool.query(
    "INSERT INTO genres (name) VALUES (?)",
    [name.trim()]
  );

  const [rows] = await pool.query(
    "SELECT * FROM genres WHERE id = ?",
    [result.insertId]
  );

  return rows[0];
}

async function deleteGenre(id) {
  const [rows] = await pool.query(
    "SELECT * FROM genres WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    const error = new Error("Genre not found.");
    error.statusCode = 404;
    throw error;
  }

  await pool.query("DELETE FROM genres WHERE id = ?", [id]);

  return rows[0];
}

module.exports = {
  getAllGenres,
  createGenre,
  deleteGenre
};