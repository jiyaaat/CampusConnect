const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

const tx = async (callback, errCallback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await callback(client);

    await client.query("COMMIT");
  } catch (err) {
    console.error("DB_ERROR:", err);

    await client.query("ROLLBACK");

    errCallback && errCallback(err);
  } finally {
    client.release();
  }
};

pool.on("error", (err) => {
  console.error("Error in the database pool:", err);

  process.exit(-1);
});

pool.on("connect", () => {
  console.log("Connected to the Database");
});

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
  tx,
  pool,
};
