import asyncHandler from "../utils/asyncHandler.js";

import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";

import { sendResponse }
  from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

export const createPost =
  asyncHandler(async (req, res) => {

    const post =
      await createPostService(
        req.user._id,
        req.body
      );

    sendResponse(
      res,
      201,
      "Post created",
      post
    );
  });

export const getPosts =
  asyncHandler(async (req, res) => {

    const posts =
      await getAllPostsService(req.user._id);

    sendResponse(
      res,
      200,
      "Posts fetched",
      posts
    );
  });

export const getPost =
  asyncHandler(async (req, res) => {

    const post =
      await getPostByIdService(
        req.params.id
      );

    sendResponse(
      res,
      200,
      "Post fetched",
      post
    );
  });

export const updatePost =
  asyncHandler(async (req, res) => {

    if (!req.params?.id) {
      throw new ApiError(
        400,
        "Post id required"
      );
    }

    const post =
      await updatePostService(
        req.params.id,
        req.user._id,
        req.body
      );

    sendResponse(
      res,
      200,
      "Post updated",
      post
    );
  });

export const deletePost =
  asyncHandler(async (req, res) => {

    await deletePostService(
      req.params.id,
      req.user._id
    );

    sendResponse(
      res,
      200,
      "Post deleted"
    );
  });