import Thread from "../models/Thread.model.js";
import { v4 as uuidv4 } from "uuid";
import getOpenAIAPIResponse from "../utils/openAi.utils.js";
import User from "../models/User.model.js";

//* =============== testing dabase by uploading thread =============== *//
export const testDb = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const thread = new Thread({
      threadId: uuidv4(),
      owner: user._id,
      title: "New Thread",
      messages: [],
    });

    const savedThread = await thread.save();

    user.threads.push(savedThread._id);
    await user.save();

    return res.status(201).json({
      message: "Thread created successfully",
      data: savedThread,
    });
  } catch (err) {
    console.error("DB ERROR:", err.message);
    return res.status(500).json({ error: "Failed to save data in DB" });
  }
};

//* =============== frtching threads =============== *//
export const fetchingThreads = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const threads = await Thread.find({ owner: user._id }).sort({
      updatedAt: -1,
    }); //fetching thread in descending order
    return res.json(threads);
  } catch (err) {
    console.error("error while fetching threads!", err.message);
    return res.status(500).json({ error: "Server Error!" });
  }
};

//* =============== frtching thread by id =============== *//
export const fetchingThreadsById = async (req, res) => {
  const { threadId, userId } = req.params;

  try {
    const thread = await Thread.findOne({
      threadId,
      owner: userId,
    });

    if (!thread) {
      return res.status(404).json({ message: "thread not found!" });
    }

    return res.json({
      title: thread.title,
      messages: thread.messages,
    });
  } catch (err) {
    console.error("error while fetching thread!", err.message);
    return res.status(500).json({ error: "Server Error!" });
  }
};

//* =============== deleting thread by id =============== *//
export const deletingThreadsById = async (req, res) => {
  const { threadId, userId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      owner: userId,
    });

    if (!deletedThread) {
      return res.status(404).json({ message: "thread not found!" });
    }

    await User.updateOne(
      { _id: userId },
      { $pull: { threads: deletedThread._id } },
    );

    return res.status(200).json({ message: "Thread deleted successfully" });
  } catch (err) {
    console.error("error while deleting thread!", err.message);
    return res.status(500).json({ error: "Server Error!" });
  }
};

//* =============== chat =============== *//
export const chat = async (req, res) => {
  const { threadId, message, userId } = req.body;

  if (!threadId || !message || !userId)
    return res.status(400).json({ message: "missing required field!" });

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        owner: userId,
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
