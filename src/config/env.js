import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  JWT_SECRET: str(),
  BASE_URL: str({ default: "http://localhost:5000" }),
});

export default env;
