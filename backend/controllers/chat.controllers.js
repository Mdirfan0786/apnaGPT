import Thread from "../models/Thread.model.js";
import getOpenAIAPIResponse from "../utils/openAi.utils.js";
import User from "../models/User.model.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

//* =============== frtching threads =============== *//
export const fetchingThreads = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const threads = await Thread.find({ owner: userId }).sort({
    updatedAt: -1,
  });

  res.json(threads);
});

//* =============== frtching thread by id =============== *//
export const fetchingThreadsById = asyncHandler(async (req, res, next) => {
  const { threadId } = req.params;

  const thread = await Thread.findOne({
    threadId,
    owner: req.user._id,
  });

  if (!thread) {
    throw new AppError(404, "Thread not found");
  }

  res.json({
    title: thread.title,
    messages: thread.messages,
  });
});

//* =============== deleting thread by id =============== *//
export const deletingThreadsById = asyncHandler(async (req, res, next) => {
  const { threadId } = req.params;
  const userId = req.user._id;

  const deletedThread = await Thread.findOneAndDelete({
    threadId,
    owner: userId,
  });

  if (!deletedThread) {
    throw new AppError(404, "Thread not found or not authorized");
  }

  await User.updateOne(
    { _id: userId },
    { $pull: { threads: deletedThread._id } },
  );

  res.status(200).json({
    success: true,
    message: "Thread deleted successfully",
  });
});

//* =============== chat =============== *//
export const chat = asyncHandler(async (req, res, next) => {
  const { threadId, message } = req.body;
  const userId = req.user._id;

  if (!threadId || !message) {
    throw new AppError(400, "Missing required fields");
  }

  if (!message.trim()) {
    throw new AppError(400, "Message cannot be empty");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
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

  if (!aiResponse || !aiResponse.reply) {
    throw new AppError(500, "AI response failed");
  }

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
});
