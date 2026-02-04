import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "apnaGPT" });
    console.log("Connected to db");
  } catch (err) {
    console.log("unable to connect Db", err.message);
  }
};

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  connectDB();
});
