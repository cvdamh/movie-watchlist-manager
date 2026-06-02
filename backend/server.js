const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const pool = require("./config/db");
const movieRoutes = require("./routes/movieRoutes");
const genreRoutes = require("./routes/genreRoutes");
const authRoutes = require("./routes/authRoutes");
const swaggerSpec = require("./swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    message: "Movie Watchlist Manager API is running."
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS database_name");

    res.status(200).json({
      message: "Database connection successful.",
      database: rows[0].database_name
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed.",
      error: error.message
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/genres", genreRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found."
  });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});