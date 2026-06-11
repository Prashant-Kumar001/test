import dotenv from "dotenv";
import "dotenv/config";


import app from "./app.js";

import env from "./config/env.js";

import connectDB from "./config/db.js";

connectDB();

app.listen(
  env.PORT,
  () => {
    console.log(
      `Server running on ${env.PORT}`
    );
  }
);