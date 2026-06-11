import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

import express from "express";
import cors from "cors";

import authRoutes
  from "./routes/auth.routes.js";

import postRoutes
  from "./routes/post.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true,
  }
));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
})

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/posts",
  postRoutes
);


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(errorMiddleware);

export default app;