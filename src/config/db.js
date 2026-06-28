import mongoose from "mongoose";

const connectDB = async () => {

  await mongoose.connect(
    process.env.MONGO_URI
  );

  console.log("MongoDB Connected");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
