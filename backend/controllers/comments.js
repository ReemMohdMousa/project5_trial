const { pool } = require("../models/db");

const createNewComment = async (req, res) => {
  const post_id = req.params.id;
  const user_id = req.token.userId;
  let firstname = "";
  let lastname = "";
  let avatar = "";
  let receiver;

  const querytofindname = `
  SELECT users.firstname,users.lastname ,users.avatar from users 
 where users.user_id =$1`;
  const result1 = await pool.query(querytofindname, [user_id]);
  firstname = result1.rows[0].firstname;
  lastname = result1.rows[0].lastname;
  avatar = result1.rows[0].avatar;

  let messagecontent = `${firstname}  ${lastname} comment in your post`;
  const queryuser = `SELECT user_id from posts where post_id=$1`;
  const result2 = await pool.query(queryuser, [post_id]);
  receiver = result2.rows[0].user_id;

  const { content, image, video } = req.body;

  const query = `INSERT INTO comments (post_id, user_id, content, image, video) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  const data = [post_id, user_id, content, image, video];
  const notiquery = `INSERT INTO notifications(user_id,sender_id,content,avatar) VALUES($1,$2,$3,$4)RETURNING*`;
  await pool.query(notiquery, [receiver, user_id, messagecontent, avatar]);
  pool
    .query(query, data)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Comment created successfully",
        result: result.rows[0],
        firstname: firstname,
        lastname: lastname,
        avatar: avatar,
        receiver: receiver,
        messagecontent:messagecontent,
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
const createNewNestedComment = async (req, res) => {
  const comment_id = req.query.comment_id;
  const post_id = req.query.post_id;
  const user_id = req.token.userId;

  let firstname = "";
  let lastname = "";
  let receiver = "";
  let postcontent = "";
  let postimage = "";
  const { content, image } = req.body;
  const querytofindname = `
  SELECT users.firstname,users.lastname  from users 
   where user_id =$1`;
  pool.query(querytofindname, [user_id]).then((result) => {
    firstname = result.rows[0].firstname;
    lastname = result.rows[0].lastname;
    postcontent = result.rows[0].content;
    postimage = result.rows[0].image;
  });
  let messagecontent = `${firstname}  ${lastname} comment in your comment ${postcontent} ${postimage} ${postvideo}`;
  const queryuser = `SELECT user_id from comments where comment_id=$1`;
  pool.query(queryuser, [comment_id]).then((result) => {
    receiver = result.rows[0].user_id;
  });
  const query = `INSERT INTO nestedComments (post_id, comment_id, content, image,user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  const data = [post_id, comment_id, content || null, image || null, user_id];
  await pool.query(notiquery, [receiver, user_id, messagecontent]);


  pool
    .query(query, data)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Comment created successfully",
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
const getAllNestedCommentsByCommentId = (req, res) => {
  const post_id = req.query.post_id;
  const comment_id = req.query.comment_id;
  const query = `SELECT nestedcomments.*, users.firstname ,users.lastname
  FROM nestedcomments 
  INNER JOIN users ON nestedcomments.user_id = users.user_id
  WHERE nestedcomments.is_deleted=0 AND nestedcomments.post_id =$1
  AND nestedcomments.comment_id=$2
ORDER BY nestedcomments.created_at DESC`;

  const data = [post_id, comment_id];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `All comments for post: ${post_id}`,
        result: result.rows,
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
const getCommentsByPostId = (req, res) => {
  const post_id = req.params.id;

  const query = `SELECT comments.*, users.firstname,users.lastname
  FROM comments 
  INNER JOIN users ON comments.user_id = users.user_id
  WHERE comments.is_deleted=0 AND comments.post_id =$1 
ORDER BY comments.created_at DESC`;

  const data = [post_id];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `All comments for post: ${post_id}`,
        result: result.rows,
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

const UpdateCommentById = (req, res) => {
  const comment_id = req.params.id;
  const user_id = req.token.userId;

  let { content, image, video } = req.body;

  const query = `UPDATE comments 
  SET content = COALESCE($1,content), 
  image = COALESCE($2, image), 
  video = COALESCE($3, video), updated_at=NOW()
  WHERE comment_id=$4 AND user_id=$5 AND is_deleted = 0  RETURNING *;`;
  const data = [content, image, video, comment_id, user_id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(200).json({
          success: false,
          message: `The comment with id: ${comment_id} is not found`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Comment with id: ${comment_id} updated successfully `,
          comment: result.rows[0],
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

const deleteCommentById = (req, res) => {
  const comment_id = req.params.id;
  const user_id = req.token.userId;

  pool
    .query(
      `SELECT * FROM comments WHERE comments.is_deleted=0 AND comments.comment_id = $1
    `,
      [comment_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(200).json({
          success: false,
          message: `The comment with id: ${comment_id} is not found`,
        });
      } else {
        const query = `UPDATE comments SET is_deleted=1 WHERE comment_id=$1 AND user_id= $2`;
        const data = [comment_id, user_id];

        pool.query(query, data).then((result) => {
          res.status(200).json({
            success: true,
            message: `Comment with id: ${comment_id} deleted successfully`,
          });
        });
      }
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
  createNewComment,
  getCommentsByPostId,
  UpdateCommentById,
  deleteCommentById,
  createNewNestedComment,
  getAllNestedCommentsByCommentId,
};
