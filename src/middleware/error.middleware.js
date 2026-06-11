import { ZodError } from "zod";

const errorMiddleware = (
  err,
  req,
  res,
  next
) => {

  if (err.statusCode) {
    return res.status(
      err.statusCode
    ).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map(
        (issue) => ({
          field:
            issue.path.join("."),
          message:
            issue.message,
        })
      ),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message:
        "Duplicate field value",
    });
  }

  if (
    err.name === "CastError"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid resource ID",
    });
  }

  if (
    err.name ===
    "JsonWebTokenError"
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (
    err.name ===
    "TokenExpiredError"
  ) {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  return res.status(500).json({
    success: false,
    message: err?.message || 
      "Internal Server Error",
  });
};

export default errorMiddleware;