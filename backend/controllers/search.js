const { pool } = require("../models/db");

const mainSearch = (req, res) => {
  const value = req.query.firstName;
  const val = value.charAt(0).toUpperCase() + value.slice(1);

  const query = `SELECT firstName, lastName, avatar, user_id FROM users
      WHERE to_tsvector(firstName) @@ to_tsquery($1) OR firstName LIKE  '%${value}%' OR lastName LIKE '%${value}%' OR firstName LIKE  '${val}%' OR lastName LIKE '${val}%'`;

  pool
    .query(query, [value])
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Results",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server error`,
        err: err,
      });
    });
};

module.exports = { mainSearch };
