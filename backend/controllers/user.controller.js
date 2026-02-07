import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

//* =============== Register new User =============== *//
export const register = async (req, res) => {
  const { email, name, username, password } = req.body;

  // Validation
  if (!email || !name || !username || !password) {
    return res.status(400).json({ error: "all fiels are required!" });
  }

  try {
    // checking existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exist!" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Generating Jwt
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    newUser.token = token;
    await newUser.save();

    // Response
    return res.status(201).json({
      message: "User registered!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Unable to register new User!", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== login User =============== *//
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { $set: { token: token } });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Unable to login!", err.message);
    return res.status(500).json({ message: "Server Error!" });
  }
};

//* =============== login User =============== *//
// export const userDetails = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user =
//   } catch (err) {
//     console.log("error while fetching user details!", err.message)
//   }
// };
