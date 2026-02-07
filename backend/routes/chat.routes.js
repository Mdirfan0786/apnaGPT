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
router.get("/users/:userId/threads", fetchingThreads);
router.get("/threads/:threadId/:userId", fetchingThreadsById);
router.delete("/threads/:threadId/:userId", deletingThreadsById);
router.post("/chat", chat);

export default router;
