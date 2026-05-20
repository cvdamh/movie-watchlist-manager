# Movie Watchlist Manager

Movie Watchlist Manager is a web-based CRUD application inspired by Letterboxd. It allows users to manage their personal movie collection, add movies to a watchlist, mark movies as watched, give ratings, mark favorites, search, filter, and sort movies.

## Features

- Add new movies
- View all movies
- Update movie information
- Delete movies
- Search movies by title
- Filter movies by genre
- Filter movies by status
- Filter favorite movies
- Sort movies by title, director, genre, year, status, rating, and favorite status
- Manage movie genres
- RESTful API with JSON request and response format
- Swagger API documentation
- Frontend and backend validation
- Unit testing for business logic

## Technologies Used

### Frontend
- HTML
- CSS
- Vanilla JavaScript
- Fetch API

### Backend
- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- cors
- swagger-ui-express
- swagger-jsdoc
- Jest

## Project Structure

```txt
movie-watchlist-manager/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── movieController.js
│   │   └── genreController.js
│   ├── routes/
│   │   ├── movieRoutes.js
│   │   └── genreRoutes.js
│   ├── services/
│   │   ├── movieService.js
│   │   └── genreService.js
│   ├── tests/
│   │   └── movieService.test.js
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── swagger.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── movies.sql
└── README.md