import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";

import {
  registerUser,
  loginUser,
  getProfile,
} from "../services/auth.service.js";

export const register = asyncHandler(
  async (req, res) => {
    const result = await registerUser(
      req.body || {}
    );

    sendResponse(
      res,
      201,
      "User registered successfully",
      result
    );
  }
);

export const login = asyncHandler(
  async (req, res) => {


    const result = await loginUser(
     req.body || {}
    );

    sendResponse(
      res,
      200,
      "Login successful",
      result
    );
  }
);

export const profile = asyncHandler(
  async (req, res) => {
    const user = await getProfile(
      req.user._id
    );

    sendResponse(
      res,
      200,
      "Profile fetched successfully",
      user
    );
  }
);