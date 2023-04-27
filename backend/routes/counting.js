const express = require("express");
const {
  userCount,
  postCount,
  likeCount,
  registeredUserPerDay,
  addedPostPerDay,
  registeredUserDetailWithinWeek,
  postsEveryHour,
  mostReactedPost,
  getUsers,
} = require("../controllers/counting");

const countingRouter = express.Router();
countingRouter.get("/user", userCount);
countingRouter.get("/newuser", registeredUserPerDay);
countingRouter.get("/newuser/details", registeredUserDetailWithinWeek);
countingRouter.get("/reacted", mostReactedPost);
countingRouter.get("/alluser", getUsers);

countingRouter.get("/post", postCount);
countingRouter.get("/newpost", addedPostPerDay);
countingRouter.get("/num", postsEveryHour);

countingRouter.get("/like", likeCount);

module.exports = countingRouter;
