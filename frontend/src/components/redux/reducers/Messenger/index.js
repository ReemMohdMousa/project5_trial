import { createSlice } from "@reduxjs/toolkit";

export const messenger = createSlice({
  name: "messenger",

  initialState: {
    conversationFriendInfo: null,
    newMsg: false,
    openConversation: false,
    theOpenedConversation: null,
    conversations: [],
  },
  reducers: {
    setConversationFriendInfo: (state, action) => {
      state.conversationFriendInfo = action.payload;
    },

    setNewMsg: (state, action) => {
      state.newMsg = action.payload;
    },

    setOpenConversation: (state, action) => {
      state.openConversation = action.payload;
    },

    setTheOpenedConversation: (state, action) => {
      state.theOpenedConversation = action.payload;
    },

    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
  },
});
export const {
  setConversationFriendInfo,
  setNewMsg,
  setOpenConversation,
  setTheOpenedConversation,
  setConversations,
} = messenger.actions;

export default messenger.reducer;
