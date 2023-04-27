const express = require("express");
const {
  SendNewMessage,
  getAllMessagesByConversationId,
} = require("../controllers/message");
const authentication = require("../middlewares/authentication");

const messagesRouter = express.Router();

messagesRouter.post("/", authentication, SendNewMessage);
messagesRouter.get(
  "/:conversationId/:receiverId",
  authentication,
  getAllMessagesByConversationId
);

module.exports = messagesRouter;
