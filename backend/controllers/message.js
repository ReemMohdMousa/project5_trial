const messageModel = require("../models/messageSchema");
const conversationModel = require("../models/conversationSchema");

const SendNewMessage = (req, res) => {
  const { text, sender, conversationId } = req.body;

  const newMessage = new messageModel({
    text,
    sender,
    conversationId,
  });

  newMessage
    .save()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res.json(err);
    });
};

const getAllMessagesByConversationId = (req, res) => {
  const userId = req.token.userId;
  const conversationId = req.params.conversationId;
  const receiverId = req.params.receiverId;

  messageModel
    .find({ conversationId })
    .then(async (results) => {
      res.json(results);
      await messageModel.updateMany(
        { conversationId, sender: receiverId },
        { seen: true }
      );
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports = {
  SendNewMessage,
  getAllMessagesByConversationId,
};
