const conversationModel = require("../models/conversationSchema");
const messageModel = require("../models/messageSchema");

//create a new conversation
const createNewConversation = (req, res) => {
  const { sender_id, receiver_id } = req.body;

  const newConversation = new conversationModel({
    members: [Number(sender_id), Number(receiver_id)],
  });

  newConversation
    .save()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res.json(err);
    });
};

// get all user's conversations
const getAllConversationsByUserId = (req, res) => {
  const user_id = req.token.userId;

  conversationModel
    .find({ members: { $in: [user_id] } })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res.json(err);
    });
};

// get all user a specific conversation between the user and his friend
const getAConversationOfTheUserAndHisFriend = (req, res) => {
  const user_id = req.token.userId;
  const friend_id = req.params.friend_id;

  conversationModel
    .find({
      members: { $all: [user_id, friend_id] },
    })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res.json(err);
    });

  // messageModel.updateMany({conversationId:})
};

const ProfileSendMsgBtn = (req, res) => {
  const user_id = req.token.userId;
  const friend_id = Number(req.params.friendId);

  conversationModel
    .find({
      members: { $all: [user_id, friend_id] },
    })
    .then(async (results) => {
      if (results.length !== 0) {
        res.json(results);
      } else {
        const newConversation = await new conversationModel({
          members: [user_id, friend_id],
        });

        newConversation
          .save()
          .then((results) => {
            res.json(results);
          })
          .catch((err) => {
            res.json(err);
          });
      }
    })
    .catch((err) => {
      res.json(err);
    });
};

const checkIfThereAreNewMsgs = (req, res) => {
  const conversationId = req.params.conversationId;
  const receiverId = req.params.receiverId;

  messageModel
    .find({ conversationId, sender: receiverId, seen: false })
    .then((results) => {
      if (results.length === 0) {
        res.json(false);
      } else {
        res.json(true);
      }
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports = {
  createNewConversation,
  getAllConversationsByUserId,
  getAConversationOfTheUserAndHisFriend,
  checkIfThereAreNewMsgs,
  ProfileSendMsgBtn,
};
