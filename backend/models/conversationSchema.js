const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
