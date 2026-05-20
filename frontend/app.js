const API_BASE_URL = "http://localhost:3000/api";

const movieForm = document.getElementById("movieForm");
const movieIdInput = document.getElementById("movieId");
const titleInput = document.getElementById("title");
const directorInput = document.getElementById("director");
const genreSelect = document.getElementById("genre");
const releaseYearInput = document.getElementById("releaseYear");
const statusSelect = document.getElementById("status");
const ratingInput = document.getElementById("rating");
const isFavoriteInput = document.getElementById("isFavorite");

const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const formMessage = document.getElementById("formMessage");

const movieTableBody = document.getElementById("movieTableBody");

const searchInput = document.getElementById("searchInput");
const filterGenre = document.getElementById("filterGenre");
const filterStatus = document.getElementById("filterStatus");
const filterFavorite = document.getElementById("filterFavorite");
const clearFiltersButton = document.getElementById("clearFiltersButton");

let genres = [];
let currentSortBy = "id";
let currentSortOrder = "DESC";

async function fetchGenres() {
  try {
    const response = await fetch(`${API_BASE_URL}/genres`);
    genres = await response.json();

    genreSelect.innerHTML = `<option value="">Select genre</option>`;
    filterGenre.innerHTML = `<option value="">All genres</option>`;

    genres.forEach((genre) => {
      const optionForForm = document.createElement("option");
      optionForForm.value = genre.id;
      optionForForm.textContent = genre.name;
      genreSelect.appendChild(optionForForm);

      const optionForFilter = document.createElement("option");
      optionForFilter.value = genre.id;
      optionForFilter.textContent = genre.name;
      filterGenre.appendChild(optionForFilter);
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
}

async function fetchMovies() {
  try {
    const queryParams = new URLSearchParams();

    if (searchInput.value.trim() !== "") {
      queryParams.append("search", searchInput.value.trim());
    }

    if (filterGenre.value !== "") {
      queryParams.append("genre_id", filterGenre.value);
    }

    if (filterStatus.value !== "") {
      queryParams.append("status", filterStatus.value);
    }

    if (filterFavorite.value !== "") {
      queryParams.append("is_favorite", filterFavorite.value);
    }

    queryParams.append("sort_by", currentSortBy);
    queryParams.append("order", currentSortOrder);

    const response = await fetch(`${API_BASE_URL}/movies?${queryParams.toString()}`);
    const movies = await response.json();

    renderMovies(movies);
    updateSortIndicators();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function renderMovies(movies) {
  movieTableBody.innerHTML = "";

  if (movies.length === 0) {
    movieTableBody.innerHTML = `
      <tr>
        <td colspan="8">No movies found.</td>
      </tr>
    `;
    return;
  }

  movies.forEach((movie) => {
    const row = document.createElement("tr");

    const director = movie.director ? movie.director : "-";
    const genre = movie.genre ? movie.genre : "-";
    const releaseYear = movie.release_year ? movie.release_year : "-";
    const status = movie.status ? movie.status : "-";
    const rating = movie.rating !== null && movie.rating !== undefined ? movie.rating : "-";
    const favorite = movie.is_favorite ? `<span class="favorite">Yes</span>` : "No";

    row.innerHTML = `
      <td>${movie.title}</td>
      <td>${director}</td>
      <td>${genre}</td>
      <td>${releaseYear}</td>
      <td>${status}</td>
      <td>${rating}</td>
      <td>${favorite}</td>
      <td>
        <div class="action-buttons">
          <button class="edit-btn" onclick="startEditMovie(${movie.id})">Edit</button>
          <button class="delete-btn" onclick="deleteMovie(${movie.id})">Delete</button>
        </div>
      </td>
    `;

    movieTableBody.appendChild(row);
  });
}

function validateForm(movieData) {
  if (!movieData.title || movieData.title.trim() === "") {
    return "Title is required.";
  }

  if (movieData.release_year) {
    const year = Number(movieData.release_year);

    if (Number.isNaN(year) || year < 1888 || year > 2100) {
      return "Release year must be between 1888 and 2100.";
    }
  }

  if (movieData.rating) {
    const rating = Number(movieData.rating);

    if (Number.isNaN(rating) || rating < 0 || rating > 10) {
      return "Rating must be between 0 and 10.";
    }
  }

  return null;
}

function getMovieFormData() {
  return {
    title: titleInput.value.trim(),
    director: directorInput.value.trim(),
    genre_id: genreSelect.value || null,
    release_year: releaseYearInput.value || null,
    status: statusSelect.value || null,
    rating: ratingInput.value || null,
    is_favorite: isFavoriteInput.checked
  };
}

movieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const movieData = getMovieFormData();
  const validationError = validateForm(movieData);

  if (validationError) {
    formMessage.textContent = validationError;
    return;
  }

  const movieId = movieIdInput.value;
  const isEditing = movieId !== "";

  const url = isEditing
    ? `${API_BASE_URL}/movies/${movieId}`
    : `${API_BASE_URL}/movies`;

  const method = isEditing ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(movieData)
    });

    const result = await response.json();

    if (!response.ok) {
      formMessage.textContent = result.message || "Something went wrong.";
      return;
    }

    formMessage.textContent = isEditing
      ? "Movie updated successfully."
      : "Movie added successfully.";

    resetForm();
    fetchMovies();
  } catch (error) {
    formMessage.textContent = "Request failed.";
    console.error(error);
  }
});

async function startEditMovie(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    const movie = await response.json();

    movieIdInput.value = movie.id;
    titleInput.value = movie.title;
    directorInput.value = movie.director || "";
    genreSelect.value = movie.genre_id || "";
    releaseYearInput.value = movie.release_year || "";
    statusSelect.value = movie.status || "";
    ratingInput.value = movie.rating || "";
    isFavoriteInput.checked = Boolean(movie.is_favorite);

    formTitle.textContent = "Edit Movie";
    submitButton.textContent = "Update Movie";
    cancelEditButton.classList.remove("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } catch (error) {
    console.error("Error loading movie:", error);
  }
}

async function deleteMovie(id) {
  const confirmDelete = confirm("Are you sure you want to delete this movie?");

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: "DELETE"
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Delete failed.");
      return;
    }

    fetchMovies();
  } catch (error) {
    console.error("Error deleting movie:", error);
  }
}

function resetForm() {
  movieForm.reset();
  movieIdInput.value = "";
  formTitle.textContent = "Add Movie";
  submitButton.textContent = "Add Movie";
  cancelEditButton.classList.add("hidden");
}

function handleSort(sortField) {
  if (currentSortBy === sortField) {
    currentSortOrder = currentSortOrder === "ASC" ? "DESC" : "ASC";
  } else {
    currentSortBy = sortField;

    if (
      sortField === "rating" ||
      sortField === "release_year" ||
      sortField === "is_favorite"
    ) {
      currentSortOrder = "DESC";
    } else {
      currentSortOrder = "ASC";
    }
  }

  fetchMovies();
}

function updateSortIndicators() {
  document.querySelectorAll(".sortable").forEach((header) => {
    const originalText = header.textContent.replace(" ▲", "").replace(" ▼", "");
    header.textContent = originalText;
    header.classList.remove("active-sort");

    if (header.dataset.sort === currentSortBy) {
      header.classList.add("active-sort");

      if (currentSortOrder === "ASC") {
        header.textContent = `${originalText} ▲`;
      } else {
        header.textContent = `${originalText} ▼`;
      }
    }
  });
}

document.querySelectorAll(".sortable").forEach((header) => {
  header.addEventListener("click", () => {
    handleSort(header.dataset.sort);
  });
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  formMessage.textContent = "";
});

searchInput.addEventListener("input", fetchMovies);
filterGenre.addEventListener("change", fetchMovies);
filterStatus.addEventListener("change", fetchMovies);
filterFavorite.addEventListener("change", fetchMovies);

clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  filterGenre.value = "";
  filterStatus.value = "";
  filterFavorite.value = "";
  fetchMovies();
});

fetchGenres();
fetchMovies();