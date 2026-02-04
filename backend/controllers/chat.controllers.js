import Thread from "../models/Thread.model.js";
import { randomUUID } from "crypto";

export const testDb = async (req, res) => {
  try {
    const thread = new Thread({
      threadId: randomUUID(),
      title: "New Thread!",
      messages: [],
    });

    const response = await thread.save();

    return res.status(201).json({
      message: "Thread created successfully",
      data: response,
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ error: "failed to save data in db" });
  }
};
