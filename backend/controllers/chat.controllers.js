import Thread from "../models/Thread.model.js";
import { randomUUID } from "crypto";
import getOpenAIAPIResponse from "../utils/openAi.utils.js";

//* =============== testing dabase by uploading thread =============== *//
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

//* =============== frtching threads =============== *//
export const fetchingThreads = async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }); //fetching thread in descending order
    return res.json(threads);
  } catch (err) {
    console.error("error while fetching threads!", err.message);
    return res.status(500).json({ error: "Server Error!" });
  }
};

//* =============== frtching thread by id =============== *//
export const fetchingThreadsById = async (req, res) => {
  const { threadId } = req.params;
  console.log(threadId);
  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) return res.status(404).json({ message: "thread not found!" });
    return res.json(thread.messages);
  } catch (err) {
    console.error("error while fetching threads by id!", err.message);
    return res.status(500).json({ error: "Server Error!" });
  }
};

//* =============== deleting thread by id =============== *//
export const deletingThreadsById = async (req, res) => {
  const { threadId } = req.params;
  try {
    const deleteThread = await Thread.findOneAndDelete({ threadId });

    if (!deleteThread)
      return res.status(404).json({ message: "thread not found!" });

    return res.status(200).json({ message: "Thread deleted!" });
  } catch (err) {
    console.error("error while deleting thread!", err.message);
    return res.status(500).json({ error: "Server Error!" });
  }
};

//* =============== deleting thread by id =============== *//
export const chat = async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message)
    return res.status(400).json({ message: "missing required field!" });

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "User", content: message }],
      });
    } else {
      thread.messages.push({ role: "User", content: message });
    }

    const aiResponse = await getOpenAIAPIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: aiResponse.reply,
    });
    thread.updatedAt = new Date();

    await thread.save();

    return res.json({ reply: aiResponse.reply });
  } catch (err) {
    console.error("error while creating chat!", err.message);
    return res.status(500).json({ error: "Server Error!" });
  }
};
