const express = require("express");

const { getAllFriendsPosts,getAllNotificationByUserId } = require("../controllers/home");

const authentication = require("../middlewares/authentication");

const homeRouter = express.Router();

homeRouter.get("/", authentication, getAllFriendsPosts);
homeRouter.get("/notification", authentication, getAllNotificationByUserId);
module.exports = homeRouter;
