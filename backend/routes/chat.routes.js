import express from "express";
import {
  chat,
  deletingThreadsById,
  fetchingThreads,
  fetchingThreadsById,
  testDb,
} from "../controllers/chat.controllers.js";

const router = express.Router();

router.post("/test", testDb);
router.get("/threads", fetchingThreads);
router.get("/threads/:threadId", fetchingThreadsById);
router.delete("/threads/:threadId", deletingThreadsById);
router.post("/chat", chat);

export default router;
