import Post from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";

export const createPostService = async (
  userId,
  postData
) => {
  const { title, content } = postData;

  const post = await Post.create({
    title,
    content,
    author: userId,
  });

  return post;
};

export const getAllPostsService = async (id) => {


  return await Post.find({
    author: id
  })
    .populate("author", "username email")
    .sort({ createdAt: -1 });
};

export const getPostByIdService = async (
  postId
) => {
  const post = await Post.findById(postId)
    .populate("author", "username email");

  if (!post) {
    throw new ApiError(
      404,
      "Post not found"
    );
  }

  return post;
};

export const updatePostService = async (
  postId,
  userId,
  data
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(
      404,
      "Post not found"
    );
  }

  if (
    post.author.toString() !== userId.toString()
  ) {
    throw new ApiError(
      403,
      "You can update only your own posts"
    );
  }

  post.title =
    data.title || post.title;

  post.content =
    data.content || post.content;

  await post.save();

  return post;
};

export const deletePostService = async (
  postId,
  userId
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(
      404,
      "Post not found"
    );
  }

  if (
    post.author.toString() !== userId.toString()
  ) {
    throw new ApiError(
      403,
      "You can delete only your own posts"
    );
  }

  await post.deleteOne();

  return true;
};