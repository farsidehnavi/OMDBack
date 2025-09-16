const { Pool } = require("pg");

// PostgreSQL connection pool
const pool = new Pool({
  user: "hesam", // your PostgreSQL user
  host: "195.248.243.65", // your VPS IP or localhost
  database: "myappdb", // your database name
  password: "P0stgre", // your DB password
  port: 5432, // PostgreSQL default port
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

module.exports = pool;
