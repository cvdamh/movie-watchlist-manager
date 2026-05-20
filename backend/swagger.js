const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Watchlist Manager API",
      version: "1.0.0",
      description:
        "REST API documentation for the Movie Watchlist Manager project."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],
    components: {
      schemas: {
        Movie: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            title: {
              type: "string",
              example: "Interstellar"
            },
            director: {
              type: "string",
              example: "Christopher Nolan"
            },
            genre_id: {
              type: "integer",
              example: 4
            },
            genre: {
              type: "string",
              example: "Sci-Fi"
            },
            release_year: {
              type: "integer",
              example: 2014
            },
            status: {
              type: "string",
              enum: ["Watchlist", "Watched"],
              nullable: true,
              example: "Watched"
            },
            rating: {
              type: "number",
              nullable: true,
              example: 9.5
            },
            is_favorite: {
              type: "boolean",
              example: true
            }
          }
        },
        MovieInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              example: "The Prestige"
            },
            director: {
              type: "string",
              example: "Christopher Nolan"
            },
            genre_id: {
              type: "integer",
              example: 6
            },
            release_year: {
              type: "integer",
              example: 2006
            },
            status: {
              type: "string",
              enum: ["Watchlist", "Watched"],
              nullable: true,
              example: "Watched"
            },
            rating: {
              type: "number",
              nullable: true,
              example: 9.0
            },
            is_favorite: {
              type: "boolean",
              example: true
            }
          }
        },
        Genre: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            name: {
              type: "string",
              example: "Action"
            }
          }
        },
        GenreInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              example: "Mystery"
            }
          }
        }
      }
    },
    paths: {
      "/api/movies": {
        get: {
          summary: "Get all movies",
          description:
            "Returns all movies. Supports search, filter, favorite filter, and sorting.",
          parameters: [
            {
              name: "search",
              in: "query",
              schema: {
                type: "string"
              },
              description: "Search movies by title"
            },
            {
              name: "genre_id",
              in: "query",
              schema: {
                type: "integer"
              },
              description: "Filter movies by genre id"
            },
            {
              name: "status",
              in: "query",
              schema: {
                type: "string",
                enum: ["Watchlist", "Watched"]
              },
              description: "Filter movies by status"
            },
            {
              name: "is_favorite",
              in: "query",
              schema: {
                type: "string",
                enum: ["true"]
              },
              description: "Filter favorite movies"
            },
            {
              name: "sort_by",
              in: "query",
              schema: {
                type: "string",
                enum: [
                  "id",
                  "title",
                  "director",
                  "genre",
                  "release_year",
                  "status",
                  "rating",
                  "is_favorite"
                ]
              },
              description: "Sort movies by selected field"
            },
            {
              name: "order",
              in: "query",
              schema: {
                type: "string",
                enum: ["ASC", "DESC"]
              },
              description: "Sorting order"
            }
          ],
          responses: {
            200: {
              description: "List of movies",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Movie"
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Create a new movie",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MovieInput"
                }
              }
            }
          },
          responses: {
            201: {
              description: "Movie created successfully"
            },
            400: {
              description: "Invalid input"
            }
          }
        }
      },
      "/api/movies/{id}": {
        get: {
          summary: "Get a movie by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer"
              }
            }
          ],
          responses: {
            200: {
              description: "Movie found"
            },
            404: {
              description: "Movie not found"
            }
          }
        },
        put: {
          summary: "Update a movie by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer"
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MovieInput"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Movie updated successfully"
            },
            400: {
              description: "Invalid input"
            },
            404: {
              description: "Movie not found"
            }
          }
        },
        delete: {
          summary: "Delete a movie by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer"
              }
            }
          ],
          responses: {
            200: {
              description: "Movie deleted successfully"
            },
            404: {
              description: "Movie not found"
            }
          }
        }
      },
      "/api/genres": {
        get: {
          summary: "Get all genres",
          responses: {
            200: {
              description: "List of genres"
            }
          }
        },
        post: {
          summary: "Create a new genre",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GenreInput"
                }
              }
            }
          },
          responses: {
            201: {
              description: "Genre created successfully"
            },
            400: {
              description: "Invalid input"
            }
          }
        }
      },
      "/api/genres/{id}": {
        delete: {
          summary: "Delete a genre by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer"
              }
            }
          ],
          responses: {
            200: {
              description: "Genre deleted successfully"
            },
            404: {
              description: "Genre not found"
            }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;