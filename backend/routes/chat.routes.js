import express from "express";
import { testDb } from "../controllers/chat.controllers.js";

const router = express.Router();

router.post("/test", testDb);

export default router;
