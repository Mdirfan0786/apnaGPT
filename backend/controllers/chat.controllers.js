import Thread from "../models/Thread.model.js";
import getOpenAIAPIResponse from "../utils/openAi.utils.js";
import User from "../models/user.model.js";

//* =============== frtching threads =============== *//
export const fetchingThreads = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const threads = await Thread.find({ owner: userId }).sort({
      updatedAt: -1,
    });

    res.json(threads);
  } catch (err) {
    next(err);
  }
};

//* =============== frtching thread by id =============== *//
export const fetchingThreadsById = async (req, res, next) => {
  try {
    const { threadId } = req.params;

    const thread = await Thread.findOne({
      threadId,
      owner: req.user.id,
    });

    if (!thread) {
      const error = new Error("Thread not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      title: thread.title,
      messages: thread.messages,
    });
  } catch (err) {
    next(err);
  }
};

//* =============== deleting thread by id =============== *//
export const deletingThreadsById = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const userId = req.user._id;

    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      owner: userId,
    });

    if (!deletedThread) {
      const error = new Error("Thread not found or not authorized");
      error.statusCode = 404;
      throw error;
    }

    await User.updateOne(
      { _id: userId },
      { $pull: { threads: deletedThread._id } },
    );

    res.status(200).json({
      success: true,
      message: "Thread deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

//* =============== chat =============== *//
export const chat = async (req, res, next) => {
  try {
    const { threadId, message } = req.body;
    const userId = req.user.id;

    if (!threadId || !message) {
      const error = new Error("Missing required fields");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    let thread = await Thread.findOne({ threadId, owner: userId });
    let isNewThread = false;

    if (!thread) {
      isNewThread = true;

      thread = new Thread({
        threadId,
        owner: userId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const aiResponse = await getOpenAIAPIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: aiResponse.reply,
    });

    thread.updatedAt = new Date();
    const savedThread = await thread.save();

    if (isNewThread) {
      user.threads.push(savedThread._id);
      await user.save();
    }

    res.json({ reply: aiResponse.reply });
  } catch (err) {
    next(err);
  }
};
