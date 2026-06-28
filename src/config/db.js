import mongoose from "mongoose";

const connectDB = async () => {
<<<<<<< HEAD

  await mongoose.connect(
    process.env.MONGO_URI
  );

  console.log("MongoDB Connected");
=======
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
>>>>>>> 9d880a94890582507b1b84dea03a77608fdd3718
};

export default connectDB;
