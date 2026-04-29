import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  createChat,
  getChats,
  getMessages,
  deleteChat
} from "../controllers/chat.controller.js";



const chatRouter = Router();

// Create a new chat
chatRouter.post("/", authUser, createChat); 

//Send message to existing chat
chatRouter.post("/:chatId/message", authUser, createChat);

// Get all chats of logged-in user
chatRouter.get("/getMyChats", authUser, getChats);

// Get messages of a specific chat
chatRouter.get("/:chatId/messages", authUser, getMessages);

// Delete a chat
chatRouter.delete("/:chatId", authUser, deleteChat);

export default chatRouter;