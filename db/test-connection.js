// const connection = require("./connection");
// require("dotenv").config({ path: "../.env.test" });

// connection.query("SELECT 1 + 1 AS result", (err, results) => {
//   if (err) {
//     console.error("Error executing query:", err);
//     return;
//   }

//   console.log("Query result:", results[0].result);
//   connection.end();
// });
const pool = require("./connection");

(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("Connection successful:", rows[0].result);
  } catch (err) {
    console.error("Error connecting to the database:", err);
  } finally {
    pool.end(); // Close the connection pool
  }
})();
