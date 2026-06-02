const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Watchlist Manager API",
      version: "1.0.0",
      description:
        "REST API documentation for the Movie Watchlist Manager project with authentication."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        AuthInput: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              example: "berkay"
            },
            password: {
              type: "string",
              example: "123456"
            }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Login successful."
            },
            token: {
              type: "string",
              example: "jwt_token_here"
            },
            user: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: 1
                },
                username: {
                  type: "string",
                  example: "berkay"
                }
              }
            }
          }
        },
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
      "/api/auth/register": {
        post: {
          summary: "Register a new user",
          description:
            "Creates a new user account using username and password. Password is stored as a hash.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthInput"
                }
              }
            }
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse"
                  }
                }
              }
            },
            400: {
              description: "Invalid input or username already exists"
            }
          }
        }
      },
      "/api/auth/login": {
        post: {
          summary: "Login user",
          description:
            "Logs in a user with username and password and returns a JWT token.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthInput"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse"
                  }
                }
              }
            },
            401: {
              description: "Invalid username or password"
            }
          }
        }
      },
      "/api/movies": {
        get: {
          summary: "Get all movies",
          description:
            "Returns all movies from the shared movie catalog. User-specific status, rating, and favorite information are returned according to the authenticated user.",
          security: [
            {
              bearerAuth: []
            }
          ],
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
              description: "Filter movies by user-specific status"
            },
            {
              name: "is_favorite",
              in: "query",
              schema: {
                type: "string",
                enum: ["true"]
              },
              description: "Filter favorite movies for the authenticated user"
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
            },
            401: {
              description: "Unauthorized. Token is missing or invalid."
            }
          }
        },
        post: {
          summary: "Create a new movie",
          description:
            "Creates a movie in the shared movie catalog and stores the authenticated user's status, rating, and favorite data in user_movies.",
          security: [
            {
              bearerAuth: []
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
            201: {
              description: "Movie created successfully"
            },
            400: {
              description: "Invalid input"
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/movies/{id}": {
        get: {
          summary: "Get a movie by id",
          security: [
            {
              bearerAuth: []
            }
          ],
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
            401: {
              description: "Unauthorized"
            },
            404: {
              description: "Movie not found"
            }
          }
        },
        put: {
          summary: "Update a movie by id",
          description:
            "Updates movie catalog information and the authenticated user's status, rating, and favorite information.",
          security: [
            {
              bearerAuth: []
            }
          ],
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
            401: {
              description: "Unauthorized"
            },
            404: {
              description: "Movie not found"
            }
          }
        },
        delete: {
          summary: "Delete a movie by id",
          security: [
            {
              bearerAuth: []
            }
          ],
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
            401: {
              description: "Unauthorized"
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