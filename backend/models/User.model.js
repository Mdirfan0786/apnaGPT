import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  threads: {
    type: [Schema.Types.ObjectId],
    ref: "Thread",
    default: [],
  },
  token: {
    type: String,
    default: "",
  },
});

export default mongoose.model("User", userSchema);
