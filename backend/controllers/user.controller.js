import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

//* =============== Register new User =============== *//
export const register = asyncHandler(async (req, res, next) => {
  const { email, name, username, password } = req.body;

  if (!email || !name || !username || !password) {
    throw new AppError(400, "All fields are required!");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    const error = new Error("User already exists!");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

//* =============== login User =============== *//
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, "All fields are required!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(400, "Invalid Credentials!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError(400, "Invalid Credentials!");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    },
  });
});
