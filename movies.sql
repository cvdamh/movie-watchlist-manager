CREATE DATABASE IF NOT EXISTS movie_watchlist_db;

USE movie_watchlist_db;


DROP DATABASE IF EXISTS movie_watchlist_db;
CREATE DATABASE movie_watchlist_db;

USE movie_watchlist_db;

CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255),
    genre_id INT,
    release_year INT,
    status ENUM('Watchlist', 'Watched') DEFAULT NULL,
    rating DECIMAL(3,1),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (genre_id) REFERENCES genres(id)
        ON DELETE SET NULL,

    CHECK (release_year IS NULL OR release_year BETWEEN 1888 AND 2100),
    CHECK (rating IS NULL OR rating BETWEEN 0 AND 10)
);

INSERT INTO genres (name) VALUES
('Action'),
('Drama'),
('Comedy'),
('Sci-Fi'),
('Horror'),
('Thriller'),
('Animation'),
('Romance'),
('Crime'),
('Fantasy');

USE movie_watchlist_db;

INSERT INTO movies 
(title, director, genre_id, release_year, status, rating, is_favorite)
VALUES
('Interstellar', 'Christopher Nolan', (SELECT id FROM genres WHERE name = 'Sci-Fi'), 2014, 'Watched', 10.0, TRUE),

('The Dark Knight', 'Christopher Nolan', (SELECT id FROM genres WHERE name = 'Action'), 2008, 'Watched', 9.5, TRUE),

('Fight Club', 'David Fincher', (SELECT id FROM genres WHERE name = 'Crime'), 1999, 'Watched', 9.0, FALSE),

('Inception', 'Christopher Nolan', (SELECT id FROM genres WHERE name = 'Sci-Fi'), 2010, 'Watched', 9.0, FALSE),

('The Batman', 'Matt Reeves', (SELECT id FROM genres WHERE name = 'Action'), 2022, 'Watchlist', NULL, FALSE),

('Spider-Man: Across the Spider-Verse', 'Joaquim Dos Santos', (SELECT id FROM genres WHERE name = 'Animation'), 2023, 'Watched', 9.5, TRUE),

('Shutter Island', 'Martin Scorsese', (SELECT id FROM genres WHERE name = 'Thriller'), 2010, NULL, NULL, FALSE),

('Casino Royale', 'Martin Campbell', (SELECT id FROM genres WHERE name = 'Action'), 2006, 'Watched', 9.5, TRUE),

('The Handmaiden', 'Park Chan-wook', (SELECT id FROM genres WHERE name = 'Thriller'), 2016, 'Watched', 10.0, TRUE),

('Oldboy', 'Park Chan-wook', (SELECT id FROM genres WHERE name = 'Thriller'), 2003, 'Watched', 9.0, FALSE),

('Top Gun', 'Tony Scott', (SELECT id FROM genres WHERE name = 'Action'), 1986, 'Watched', 9.5, FALSE),

('Top Gun: Maverick', 'Joseph Kosinski', (SELECT id FROM genres WHERE name = 'Action'), 2022, 'Watched', 10.0, TRUE),

('Persona', 'Ingmar Bergman', (SELECT id FROM genres WHERE name = 'Drama'), 1966, 'Watched', 8.0, FALSE),

('Ocean''s Eleven', 'Steven Soderbergh', (SELECT id FROM genres WHERE name = 'Crime'), 2001, 'Watched', 9.0, FALSE),

('Kill Bill: Volume 1', 'Quentin Tarantino', (SELECT id FROM genres WHERE name = 'Action'), 2003, 'Watched', 9.5, FALSE),

('Kill Bill: Volume 2', 'Quentin Tarantino', (SELECT id FROM genres WHERE name = 'Action'), 2004, 'Watched', 9.5, FALSE),

('Parasite', 'Bong Joon-ho', (SELECT id FROM genres WHERE name = 'Thriller'), 2019, 'Watched', 9.0, FALSE),

('Lilya 4-ever', 'Lukas Moodysson', (SELECT id FROM genres WHERE name = 'Drama'), 2002, 'Watched', 10.0, TRUE),

('Aftersun', 'Charlotte Wells', (SELECT id FROM genres WHERE name = 'Drama'), 2022, 'Watchlist', NULL, FALSE),

('Lost Highway', 'David Lynch', (SELECT id FROM genres WHERE name = 'Thriller'), 1997, 'Watchlist', NULL, FALSE),

('Barry Lyndon', 'Stanley Kubrick', (SELECT id FROM genres WHERE name = 'Drama'), 1975, 'Watchlist', NULL, FALSE),

('Three Colors: Red', 'Krzysztof Kieslowski', (SELECT id FROM genres WHERE name = 'Drama'), 1994, 'Watchlist', NULL, FALSE);


USE movie_watchlist_db;

INSERT INTO movies 
(title, director, genre_id, release_year, status, rating, is_favorite)
VALUES
('Project Hail Mary', 'Phil Lord, Christopher Miller', (SELECT id FROM genres WHERE name = 'Sci-Fi'), 2026, 'Watched', 9.5, FALSE),

('Blade Runner 2049', 'Denis Villeneuve', (SELECT id FROM genres WHERE name = 'Sci-Fi'), 2017, NULL, NULL, FALSE),

('Arrival', 'Denis Villeneuve', (SELECT id FROM genres WHERE name = 'Sci-Fi'), 2016, 'Watched', 9.0, FALSE),

('Dune', 'Denis Villeneuve', (SELECT id FROM genres WHERE name = 'Sci-Fi'), 2021, NULL, NULL, FALSE),

('Dune: Part Two', 'Denis Villeneuve', (SELECT id FROM genres WHERE name = 'Sci-Fi'), 2024, NULL, NULL, FALSE),

('Whiplash', 'Damien Chazelle', (SELECT id FROM genres WHERE name = 'Drama'), 2014, NULL, NULL, FALSE),

('La La Land', 'Damien Chazelle', (SELECT id FROM genres WHERE name = 'Romance'), 2016, 'Watched', 9.5, FALSE),

('Se7en', 'David Fincher', (SELECT id FROM genres WHERE name = 'Thriller'), 1995, 'Watched', 8.5, FALSE),

('Zodiac', 'David Fincher', (SELECT id FROM genres WHERE name = 'Crime'), 2007, 'Watched', 6.5, FALSE),

('Heat', 'Michael Mann', (SELECT id FROM genres WHERE name = 'Crime'), 1995, NULL, NULL, FALSE),

('The Matrix', 'Lana Wachowski, Lilly Wachowski', (SELECT id FROM genres WHERE name = 'Sci-Fi'), 1999, NULL, NULL, FALSE),

('Her', 'Spike Jonze', (SELECT id FROM genres WHERE name = 'Romance'), 2013, NULL, NULL, FALSE),

('The Grand Budapest Hotel', 'Wes Anderson', (SELECT id FROM genres WHERE name = 'Comedy'), 2014, NULL, NULL, FALSE),

('Mulholland Drive', 'David Lynch', (SELECT id FROM genres WHERE name = 'Thriller'), 2001, NULL, NULL, FALSE),

('No Country for Old Men', 'Joel Coen, Ethan Coen', (SELECT id FROM genres WHERE name = 'Crime'), 2007, 'Watched', 7.0, FALSE);

USE movie_watchlist_db;

INSERT INTO movies 
(title, director, genre_id, release_year, status, rating, is_favorite)
VALUES
('The Godfather', 'Francis Ford Coppola', (SELECT id FROM genres WHERE name = 'Crime'), 1972, NULL, NULL, FALSE),

('The Godfather Part II', 'Francis Ford Coppola', (SELECT id FROM genres WHERE name = 'Crime'), 1974, NULL, NULL, FALSE),

('Goodfellas', 'Martin Scorsese', (SELECT id FROM genres WHERE name = 'Crime'), 1990, 'Watched', 7.0, FALSE),

('Taxi Driver', 'Martin Scorsese', (SELECT id FROM genres WHERE name = 'Drama'), 1976, 'Watched', 6.0, FALSE),

('Pulp Fiction', 'Quentin Tarantino', (SELECT id FROM genres WHERE name = 'Crime'), 1994, 'Watched', 8.5, FALSE),

('Reservoir Dogs', 'Quentin Tarantino', (SELECT id FROM genres WHERE name = 'Crime'), 1992, 'Watched', 9.0, FALSE),

('2001: A Space Odyssey', 'Stanley Kubrick', (SELECT id FROM genres WHERE name = 'Sci-Fi'), 1968, 'Watched', 7.0, FALSE),

('A Clockwork Orange', 'Stanley Kubrick', (SELECT id FROM genres WHERE name = 'Drama'), 1971, NULL, NULL, FALSE),

('The Shining', 'Stanley Kubrick', (SELECT id FROM genres WHERE name = 'Horror'), 1980, NULL, NULL, FALSE),

('Eternal Sunshine of the Spotless Mind', 'Michel Gondry', (SELECT id FROM genres WHERE name = 'Romance'), 2004, 'Watched', 9.5, FALSE),

('Before Sunrise', 'Richard Linklater', (SELECT id FROM genres WHERE name = 'Romance'), 1995, NULL, NULL, FALSE),

('Before Sunset', 'Richard Linklater', (SELECT id FROM genres WHERE name = 'Romance'), 2004, NULL, NULL, FALSE),

('Chungking Express', 'Wong Kar-wai', (SELECT id FROM genres WHERE name = 'Romance'), 1994, NULL, NULL, FALSE),

('In the Mood for Love', 'Wong Kar-wai', (SELECT id FROM genres WHERE name = 'Romance'), 2000, NULL, NULL, FALSE),

('Seven Samurai', 'Akira Kurosawa', (SELECT id FROM genres WHERE name = 'Action'), 1954, 'Watched', 6.5, FALSE),

('Rashomon', 'Akira Kurosawa', (SELECT id FROM genres WHERE name = 'Drama'), 1950, NULL, NULL, FALSE),

('Spirited Away', 'Hayao Miyazaki', (SELECT id FROM genres WHERE name = 'Animation'), 2001, NULL, NULL, FALSE),

('Princess Mononoke', 'Hayao Miyazaki', (SELECT id FROM genres WHERE name = 'Animation'), 1997, NULL, NULL, FALSE),

('Pan''s Labyrinth', 'Guillermo del Toro', (SELECT id FROM genres WHERE name = 'Fantasy'), 2006, NULL, NULL, FALSE),

('The Silence of the Lambs', 'Jonathan Demme', (SELECT id FROM genres WHERE name = 'Thriller'), 1991, NULL, NULL, FALSE);


SELECT 
    movies.id,
    movies.title,
    movies.director,
    genres.name AS genre,
    movies.release_year,
    movies.status,
    movies.rating,
    movies.is_favorite
FROM movies
LEFT JOIN genres ON movies.genre_id = genres.id
ORDER BY movies.id;

