import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import validate from "../middleware/validate.middleware.js";
import { createPostSchema, updatePostSchema } from "../validators/post.validator.js";

const router = express.Router();

router.get("/", protect, getPosts);

router.get("/:id", protect, getPost);

router.post(
  "/",
  protect,
  validate(createPostSchema),
  createPost
);

router.put(
  "/:id",
  protect,
  validate(updatePostSchema),
  updatePost
);

router.delete(
  "/:id",
  protect,
  deletePost
);

export default router;
