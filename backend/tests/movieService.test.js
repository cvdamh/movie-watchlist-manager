const { validateMovieInput } = require("../services/movieService");

describe("validateMovieInput", () => {
  test("should return no errors for a valid movie", () => {
    const movie = {
      title: "Interstellar",
      director: "Christopher Nolan",
      genre_id: 4,
      release_year: 2014,
      status: "Watched",
      rating: 9.5,
      is_favorite: true
    };

    const errors = validateMovieInput(movie);

    expect(errors).toEqual([]);
  });

  test("should return error when title is empty", () => {
    const movie = {
      title: "",
      release_year: 2014,
      status: "Watched",
      rating: 8
    };

    const errors = validateMovieInput(movie);

    expect(errors).toContain("Title is required.");
  });

  test("should return error when release year is invalid", () => {
    const movie = {
      title: "Invalid Year Movie",
      release_year: 1700,
      status: "Watched",
      rating: 8
    };

    const errors = validateMovieInput(movie);

    expect(errors).toContain("Release year must be between 1888 and 2100.");
  });

  test("should return error when rating is greater than 10", () => {
    const movie = {
      title: "Invalid Rating Movie",
      release_year: 2020,
      status: "Watched",
      rating: 11
    };

    const errors = validateMovieInput(movie);

    expect(errors).toContain("Rating must be between 0 and 10.");
  });

  test("should return error when status is invalid", () => {
    const movie = {
      title: "Invalid Status Movie",
      release_year: 2020,
      status: "Watching",
      rating: 8
    };

    const errors = validateMovieInput(movie);

    expect(errors).toContain("Status must be Watchlist or Watched.");
  });

  test("should allow optional empty fields", () => {
    const movie = {
      title: "Only Title Movie",
      release_year: "",
      status: "",
      rating: ""
    };

    const errors = validateMovieInput(movie);

    expect(errors).toEqual([]);
  });
});