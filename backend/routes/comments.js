const express = require("express");

const {
  createNewComment,
  getCommentsByPostId,
  UpdateCommentById,
  deleteCommentById,createNewNestedComment,getAllNestedCommentsByCommentId

} = require("../controllers/comments");
const authentication = require("../middlewares/authentication");

const authorization = require("../middlewares/authorization");

const commentsRouter = express.Router();

commentsRouter.post("/nested", authentication, createNewNestedComment);
commentsRouter.get("/getnested",getAllNestedCommentsByCommentId);


commentsRouter.post("/:id", authentication, createNewComment);
commentsRouter.get("/:id", getCommentsByPostId);
commentsRouter.put(
  "/comment/:id",
  authentication,
  authorization("UPDATE_COMMENT"),
  UpdateCommentById
);
commentsRouter.delete(
  "/comment/:id",
  authentication,
  authorization("DELETE_COMMENT"),
  deleteCommentById
);

commentsRouter.post("/:id", authentication, createNewComment);
commentsRouter.get("/:id", authentication, getCommentsByPostId);
commentsRouter.put("/:id", authentication, UpdateCommentById);
commentsRouter.delete("/:id", authentication, deleteCommentById);

module.exports = commentsRouter;
