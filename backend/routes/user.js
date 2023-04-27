const express = require("express");

const authentication = require("../middlewares/authentication");
const {
  register,
  login,
  checkGoogleUser,
  profileInfo,
  otherUsersInfo,
  editUserInfo,
} = require("../controllers/user");

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.get("/info", authentication, profileInfo);
usersRouter.post("/login", login);
usersRouter.post("/google", checkGoogleUser);

usersRouter.get("/others/info/:id", otherUsersInfo);
usersRouter.put("/update/user/info", editUserInfo);

module.exports = usersRouter;
