import express from "express";
import {
  getAllChatHistories,
  getChatHistoriesByUserId,
  getChatHistoryById,
  addChatHistory,
  deleteChatHistory,
  deleteChatHistoryById,
} from "../controllers/chathistory.controller.js";

const router = express.Router();
router.get("/", getAllChatHistories);
router.get("/:userId", getChatHistoriesByUserId);
router.get("/:userId/:chatHistoryId", getChatHistoryById);
router.post("/", addChatHistory);
router.delete("/:userId", deleteChatHistory);
router.delete("/:userId/:chatHistoryId", deleteChatHistoryById);

export default router;
