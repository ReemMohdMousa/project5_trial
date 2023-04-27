import { createSlice } from "@reduxjs/toolkit";

export const posts = createSlice({
  name: "posts",

  initialState: {
    posts: [],
    likes: [],
    homePosts: [],
    notifications: [],
    sharedPosts: [],

  },
  reducers: {
  
    setPosts: (state, action) => {
      state.posts = action.payload;
      //   state.articles.map((elem)=>{
      //     console.log("SETArticles",elem)
      //   })
    },
    addpost: (state, action) => {
      state.posts.push(action.payload);
      //   state.articles.map((elem)=>{
      //     console.log("ADDArticles",elem)
      //   })
    },
    updatePost: (state, action) => {
      state.posts.map((elem, i) => {
        if (elem.post_id == action.payload.updatedpost.post_id) {
          return state.posts.splice(i, 1, action.payload.updatedpost);
        }
        return elem;
        //dont forget return please
      });
    },
    removePost: (state, action) => {
      state.posts.forEach((elem, idx) => {
        if (elem.post_id === action.payload) {
          state.posts.splice(idx, 1);
        }
      });
    },
    setComments: (state, action) => {
      // state.articles = action.payload.comments;
      state.posts.map((elem, i) => {
        if (elem.post_id === action.payload.id) {
          elem.comments = action.payload.comments;
        }
      });
    },
    addComment: (state, action) => {
      state.posts.map((elem, i) => {
        if (elem.post_id === action.payload.id) {
          elem.comments.push(action.payload.newComment);
        }
      });
    },
    removeComment: (state, action) => {
      console.log(action.payload);
      state.posts.forEach((elem, idx) => {
        console.log(elem);
        let found = state.posts.find((elem) => {
          return elem.post_id === action.payload.post_id;
        });
        console.log("found", found);
        if (elem.comment_id === action.payload) {
          state.posts.comments.splice(idx, 1);
        }
      });
    },
    setLike: (state, action) => {
      state.likes = [action.payload];
    },

    addLike: (state, action) => {
      state.likes.push(action.payload);
    },


    removeLike: (state, action) => {
      state.likes = state.likes.filter((elem) => {
        return elem.post_id !== action.payload;
      });
    },

    setHomePosts: (state, action) => {
      state.homePosts = action.payload;
    },
    setNestedComments: (state, action) => {
      let found = state.posts.find((elem) => {
        return elem.post_id === action.payload.post_id;
      });
      found.comments.map((elem, i) => {
        if (elem.comment_id === action.payload.comment_id) {
          return (elem.nestedcomments = action.payload.nestedcomments);
        }
      });
    },
    addNested: (state, action) => {
      console.log(action.payload);

      let found = state.posts.find((elem) => {
        return elem.post_id === action.payload.post_id;
      });
      console.log(found);
      let found2 = [found].find((elem) => {
        return elem.comment_id === action.payload.comment_id;
      });
      console.log(found2);
      //  let result= [found2].nestedcomments?[found2].nestedcomments.push(action.payload.nestedcomment):[found2].nestedcomments= action.payload.nestedcomment
      //  console.log (result)
      //  return result
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      console.log(action.payload);

      state.homePosts = action.payload;
    },

    setSharedPosts: (state, action) => {
      state.sharedPosts = action.payload;
    },
    sharepost: (state, action) => {
      state.sharedPosts.push(action.payload);
    },
  },
});
export const {
  setPosts,
  addpost,
  updatePost,
  removePost,
  setComments,
  addComment,
  addLike,
  setLike,
  setNestedComments,
  updateComment,
  removeComment,
  removeLike,
  setHomePosts,
  addNested,
  setNotifications,
  setSharedPosts,
  sharepost,
} = posts.actions;

export default posts.reducer;
