const { Pool, Client } = require("pg");
//require mongoose
const mongoose = require("mongoose");


  const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
  });

  pool.connect((err, pool) => {
    if (err) {
     console.log("ERROR", err.message);
     return;
   }
   console.log("connected to", pool.user);
  });

//  const pool = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "project5_Reem", // create the database before connect
//   password: "admin",
//   port: "5432",
// });

// pool.connect((err, pool) => {
//   if (err) {
//     console.log("ERROR", err.message);
//     return;
//   }
//   console.log("connected to", pool.user);
// }); 


//strictQuery
mongoose.set("strictQuery", false);

//connect the db to the server
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("mongoose DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = { pool };
