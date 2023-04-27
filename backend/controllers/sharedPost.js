const { pool } = require("../models/db");
const createSharedPost = (req, res) => {
  const { sharedPost_content, post_id } = req.body;
  const sharedPost_user_id = req.token.userId;
  const query = `INSERT INTO sharedPost1 (sharedPost_content,sharedPost_user_id,post_id) VALUES ($1,$2,$3) RETURNING *`;
  const data = [sharedPost_content, sharedPost_user_id, post_id];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Post shared successfully",
        result: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const getSharedPostsByUser = (req, res) => {
  const user_id = req.token.userId;
  const query = `SELECT * FROM sharedPost1 INNER JOIN posts ON posts.post_id =sharedPost1.post_id
    WHERE sharedPost_user_id = $1 AND sharedPost_is_deleted=0
    ORDER BY sharedPost_created_at DESC
  `;
  const data = [user_id];

  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `All shared posts for the user: ${user_id}`,
        posts: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

module.exports = {
  createSharedPost,
  getSharedPostsByUser,
};
