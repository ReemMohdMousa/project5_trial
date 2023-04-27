import { configureStore } from "@reduxjs/toolkit";

// import the reducer
import authReducer from "./reducers/auth/index";
import friendsReducer from "./reducers/friends/index";
import postsReducer from "./reducers/posts/index";
import messengerReducer from "./reducers/Messenger/index";

export default configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    posts: postsReducer,
    messenger: messengerReducer,
  },
});
