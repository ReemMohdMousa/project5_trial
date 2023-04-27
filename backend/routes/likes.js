const express = require("express");

const {
  addLike,
  getLikesByUser,
  getLikesByPost,
  removeLike,
  getLikes,
} = require("../controllers/likes");

const authentication = require("../middlewares/authentication");

const likesRouter = express.Router();

likesRouter.post("/", authentication, addLike);
likesRouter.get("/", authentication, getLikesByUser);
likesRouter.get("/l", getLikes);

likesRouter.get("/:id", getLikesByPost);
likesRouter.delete("/:id", authentication, removeLike);

module.exports = likesRouter;
