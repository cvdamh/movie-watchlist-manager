const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

function validateRegisterInput(user) {
  const errors = [];

  if (!user.username || user.username.trim() === "") {
    errors.push("Username is required.");
  }

  if (!user.password || user.password.trim() === "") {
    errors.push("Password is required.");
  }

  if (user.password && user.password.length < 4) {
    errors.push("Password must be at least 4 characters.");
  }

  return errors;
}

function validateLoginInput(user) {
  const errors = [];

  if (!user.username || user.username.trim() === "") {
    errors.push("Username is required.");
  }

  if (!user.password || user.password.trim() === "") {
    errors.push("Password is required.");
  }

  return errors;
}

async function registerUser(user) {
  const errors = validateRegisterInput(user);

  if (errors.length > 0) {
    const error = new Error(errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const username = user.username.trim();
  const password = user.password;

  const [existingUsers] = await pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (existingUsers.length > 0) {
    const error = new Error("Username already exists.");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (username, password_hash) VALUES (?, ?)",
    [username, passwordHash]
  );

  const userId = result.insertId;

  if (username.toLowerCase() === "berkay") {
    await pool.query(
      `
      INSERT IGNORE INTO user_movies 
      (user_id, movie_id, status, rating, is_favorite)
      SELECT 
        ?,
        movies.id,
        movies.status,
        movies.rating,
        movies.is_favorite
      FROM movies
      `,
      [userId]
    );
  }

  const token = jwt.sign(
    {
      id: userId,
      username: username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return {
    message: "Register successful.",
    token,
    user: {
      id: userId,
      username
    }
  };
}

async function loginUser(user) {
  const errors = validateLoginInput(user);

  if (errors.length > 0) {
    const error = new Error(errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const username = user.username.trim();
  const password = user.password;

  const [users] = await pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (users.length === 0) {
    const error = new Error("Invalid username or password.");
    error.statusCode = 401;
    throw error;
  }

  const foundUser = users[0];

  const isPasswordCorrect = await bcrypt.compare(
    password,
    foundUser.password_hash
  );

  if (!isPasswordCorrect) {
    const error = new Error("Invalid username or password.");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: foundUser.id,
      username: foundUser.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return {
    message: "Login successful.",
    token,
    user: {
      id: foundUser.id,
      username: foundUser.username
    }
  };
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  registerUser,
  loginUser
};