import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  JWT_SECRET: str(),
});

export default env;