import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Blogify API",
      version: "1.0.0",
      description: "Blog Application API Documentation",
    },

    servers: [
      {
        url: `${process.env.BASE_URL}/api`,
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              example: "prashant",
            },
            email: {
              type: "string",
              example: "prashant@gmail.com",
            },
            password: {
              type: "string",
              example: "Password123",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "prashant@gmail.com",
            },
            password: {
              type: "string",
              example: "Password123",
            },
          },
        },

        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            username: {
              type: "string",
            },
            email: {
              type: "string",
            },
          },
        },

        Post: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
            author: {
              type: "string",
            },
          },
        },

        CreatePostRequest: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: {
              type: "string",
              example: "My First Blog Post",
              description: "Title of the blog post",
            },
            content: {
              type: "string",
              example: "This is the content of my blog post...",
              description: "Content of the blog post",
            },
          },
        },

        UpdatePostRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "My Updated Blog Post",
              description: "Updated title of the blog post",
            },
            content: {
              type: "string",
              example: "This is the updated content of my blog post...",
              description: "Updated content of the blog post",
            },
          },
        },

        AuthResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Login successful",
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Something went wrong",
            },
            error: {
              type: "string",
              example: "Error details",
            },
          },
        },
      },
    },

    paths: {
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register User",
          description: "Create a new user account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "User registered successfully",
                      },
                      user: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Bad request - missing or invalid fields",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            409: {
              description: "User already exists",
            },
          },
        },
      },

      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login User",
          description: "Authenticate user and get JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginRequest",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse",
                  },
                },
              },
            },
            401: {
              description: "Invalid credentials",
            },
          },
        },
      },

      "/auth/profile": {
        get: {
          tags: ["Auth"],
          summary: "Get Profile",
          description: "Get current user's profile information",
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "Profile fetched successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - invalid or missing token",
            },
          },
        },
      },

      "/posts": {
        get: {
          tags: ["Posts"],
          summary: "Get All Posts",
          description: "Retrieve all blog posts",
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "Posts fetched successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      posts: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Post",
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - invalid or missing token",
            },
          },
        },

        post: {
          tags: ["Posts"],
          summary: "Create Post",
          description: "Create a new blog post (Authentication required)",
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreatePostRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Post created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Post created successfully",
                      },
                      post: {
                        $ref: "#/components/schemas/Post",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Bad request - missing title or content",
            },
            401: {
              description: "Unauthorized - invalid or missing token",
            },
          },
        },
      },

      "/posts/{id}": {
        get: {
          tags: ["Posts"],
          summary: "Get Single Post",
          description: "Retrieve a specific blog post by ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "Post ID",
            },
          ],
          responses: {
            200: {
              description: "Post fetched successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      post: {
                        $ref: "#/components/schemas/Post",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "Post not found",
            },
          },
        },

        put: {
          tags: ["Posts"],
          summary: "Update Post",
          description: "Update an existing blog post (Authentication required)",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "Post ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdatePostRequest",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Post updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Post updated successfully",
                      },
                      post: {
                        $ref: "#/components/schemas/Post",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - invalid or missing token",
            },
            403: {
              description: "Forbidden - you can only update your own posts",
            },
            404: {
              description: "Post not found",
            },
          },
        },

        delete: {
          tags: ["Posts"],
          summary: "Delete Post",
          description: "Delete a blog post (Authentication required)",
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "Post ID",
            },
          ],
          responses: {
            200: {
              description: "Post deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Post deleted successfully",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - invalid or missing token",
            },
            403: {
              description: "Forbidden - you can only delete your own posts",
            },
            404: {
              description: "Post not found",
            },
          },
        },
      },
    },
  },

  apis: [], 
};

export default swaggerJsdoc(options);