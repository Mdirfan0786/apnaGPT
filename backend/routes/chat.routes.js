import express from "express";
import {
  chat,
  deletingThreadsById,
  fetchingThreads,
  fetchingThreadsById,
} from "../controllers/chat.controllers.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/threads", isLoggedIn, fetchingThreads);
router.get("/threads/:threadId", isLoggedIn, fetchingThreadsById);
router.delete("/threads/:threadId", isLoggedIn, deletingThreadsById);
router.post("/chat", isLoggedIn, chat);

export default router;
