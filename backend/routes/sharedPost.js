const express = require("express");
const {
  createSharedPost,
  getSharedPostsByUser,
} = require("../controllers/sharedPost");
const authentication = require("../middlewares/authentication");

const shareRouter = express.Router();
shareRouter.post("/", authentication, createSharedPost);
shareRouter.get("/", authentication, getSharedPostsByUser);

module.exports = shareRouter;
