import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  JWT_SECRET: str(),
<<<<<<< HEAD
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  BASE_URL: str(),
=======
  BASE_URL: str({ default: "http://localhost:5000" }),
>>>>>>> 9d880a94890582507b1b84dea03a77608fdd3718
});

export default env;
