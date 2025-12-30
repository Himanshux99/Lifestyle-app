import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating Access Token",
      []
    );
  }
};

// Register User - Simple username and password
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required", []);
  }

  // Check if username already exists
  const existedUser = await User.findOne({ username });

  if (existedUser) {
    throw new ApiError(409, "Username already exists", []);
  }

  // Create new user
  const user = await User.create({
    username: username.toLowerCase().trim(),
    password, // Will be hashed by pre-save middleware
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, { user: createdUser }, "User registered successfully")
    );
});

// Login User
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required", []);
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(401, "Invalid username or password", []);
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid username or password", []);
  }

  const { accessToken } = await generateAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged in successfully"
      )
    );
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?._id;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required", []);
  }

  if (oldPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from old password",
      []
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found", []);
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Old password is incorrect", []);
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export { registerUser, login, changePassword };
