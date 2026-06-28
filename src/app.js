import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

// import "./public/suggestion.worker.js"
// import suggestionRoutes from './public/suggestion.route.js'



import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(cors(
  {
    origin: ["http://localhost:4200", "http://localhost:5173", "http://localhost:3000"],
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


// app.use(
//   "/api/public/suggestions",
//   suggestionRoutes
// );


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
