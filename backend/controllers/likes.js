const { pool } = require("../models/db");

const addLike =async (req, res) => {
  const { post_id } = req.body;
  const user_id = req.token.userId;

  let firstname=""
  let lastname=""
let receiver=""
let postcontent=""
let postimage=""
let postvideo=""

const querytofindname=`
  SELECT users.firstname,users.lastname ,users.avatar from users where user_id =$1`
  const result1= await pool.query(querytofindname,[user_id])
      firstname=result1.rows[0].firstname
      lastname=result1.rows[0].lastname
      avatar= result1.rows[0].avatar;
  
    let messagecontent=`${firstname}  ${lastname} like  your post`
    const queryuser=`SELECT user_id from posts where post_id=$1`
    const result2=await pool.query(queryuser,[post_id])
    receiver=result2.rows[0].user_id



    const notiquery = `INSERT INTO notifications(user_id,sender_id,content,avatar) VALUES($1,$2,$3,$4)RETURNING*`;


  const query1 = `select exists(select 1 from likes where user_id=$1 AND post_id=$2)`;
  const data1 = [user_id, post_id];
  await pool.query(notiquery,[receiver,user_id,messagecontent,avatar])

  pool
    .query(query1, data1)
    .then((result) => {
      if (result.rows[0].exists) {
        res.status(200).json({
          success: false,
          message: "Like is already exist",
        });
      } else {
        const query = `INSERT INTO likes (user_id, post_id) VALUES ($1,$2) RETURNING *;`;
        const data = [user_id, post_id];
        pool.query(query, data).then((result) => {
          res.status(200).json({
            success: true,
            message: "Like added successfully",
            result: result.rows[0],
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

const getLikesByUser = (req, res) => {
  const user_id = req.token.userId;
  const query = `SELECT * FROM likes WHERE user_id = $1 AND is_deleted=0;`;
  const data = [user_id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(200).json({
          success: false,
          message: `The user: ${user_id} has no likes`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All likes for the user: ${user_id}`,
          result: result.rows,
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

const getLikesByPost = (req, res) => {
  const post_id = req.params.id;

  const query = `SELECT users.firstname, users.lastname, likes.post_id, users.avatar
    FROM likes 
    INNER JOIN users ON likes.user_id = users.user_id
    WHERE likes.is_deleted=0 AND likes.post_id = $1
    `;

  const data = [post_id];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `All likes for post: ${post_id}`,
        likesNo: result.rowCount,
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

const getLikes = (req, res) => {
  const query = `SELECT users.firstname, users.lastname,likes.user_id, likes.post_id, users.avatar FROM (( likes INNER JOIN posts ON likes.post_id =posts.post_id) INNER JOIN users ON likes.user_id = users.user_id) 
    `;

  pool
    .query(query)
    .then((result) => {
      pool
        .query(
          `SELECT post_id ,COUNT(post_id) AS  total_likes FROM  likes
        GROUP BY post_id`
        )
        .then((result2) => {
          res.status(200).json({
            success: true,
            users: result.rows,
            num: [result2.rows],
          });
        })
        .catch((err) => {
          res.json(err);
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

//hard delete
const removeLike = (req, res) => {
  const post_id = req.params.id;
  const user_id = req.token.userId;
  const query = `DELETE FROM likes WHERE user_id=$1 AND post_id = $2`;
  const data = [user_id, post_id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount === 0) {
        res.status(200).json({
          success: false,
          message: `The user: ${user_id} has no likes on this post`,
        });
      } else {
        pool
          .query(
            `SELECT post_id ,COUNT(post_id) AS  total_likes FROM  likes
        GROUP BY post_id`
          )
          .then((result2) => {
            res.status(200).json({
              success: true,
              message: `Like of user: ${user_id} removed successfully`,
              num: [result2.rows],
            });
          })
          .catch((err) => {
            res.json(err);
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
  addLike,
  getLikesByUser,
  getLikesByPost,
  removeLike,
  getLikes,
};
