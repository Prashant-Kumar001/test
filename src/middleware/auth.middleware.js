import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = await User.findById(
      decoded.userId
    ).select("-password");

    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default protect;