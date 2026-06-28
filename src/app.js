import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import "./public/suggestion.worker.js"

import swaggerSpec from "./docs/swagger.js";


import authRoutes
  from "./routes/auth.routes.js";

import postRoutes
  from "./routes/post.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

import suggestionRoutes from './public/suggestion.route.js'

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
  "/api/public/suggestions",
  suggestionRoutes
);


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
 
app.get("/swagger.json", (req, res) => {
    res.json(swaggerSpec);  
});  

app.use(errorMiddleware);
                 
export default app;