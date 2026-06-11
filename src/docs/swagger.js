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
  },
},

paths: {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register User",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref:
                "#/components/schemas/RegisterRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description:
            "User registered successfully",
        },
      },
    },
  },

  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login User",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref:
                "#/components/schemas/LoginRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description:
            "Login successful",
        },
      },
    },
  },

  "/auth/profile": {
    get: {
      tags: ["Auth"],
      summary: "Get Profile",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description:
            "Profile fetched",
        },
      },
    },
  },

  "/posts": {
    get: {
      tags: ["Posts"],
      summary: "Get All Posts",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description:
            "Posts fetched",
        },
      },
    },

    post: {
      tags: ["Posts"],
      summary: "Create Post",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        201: {
          description:
            "Post created",
        },
      },
    },
  },

  "/posts/{id}": {
    get: {
      tags: ["Posts"],
      summary: "Get Single Post",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description:
            "Post fetched",
        },
      },
    },

    put: {
      tags: ["Posts"],
      summary: "Update Post",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description:
            "Post updated",
        },
      },
    },

    delete: {
      tags: ["Posts"],
      summary: "Delete Post",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description:
            "Post deleted",
        },
      },
    },
  },
},

},

apis: [],
};

export default swaggerJsdoc(options);
