// db.js (replace your old SQLite file)
const pool = require("./ConnectDB"); // your existing PG pool

// Initialize DB and create table if not exists
const ConnectDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      Username TEXT UNIQUE NOT NULL,
      Password TEXT NOT NULL,
      Credit NUMERIC NOT NULL,
      HiddifyAPIKey TEXT UNIQUE NOT NULL,
      ProxyPath TEXT NOT NULL
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("✅ Users table is ready");
  } catch (err) {
    console.error("Failed to create users table:", err.message);
    throw err;
  }
};

// Add a new user
const AddUser = async (
  Username,
  Password,
  Credit,
  HiddifyAPIKey,
  ProxyPath
) => {
  const query = `
    INSERT INTO users (Username, Password, Credit, HiddifyAPIKey, ProxyPath)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  try {
    const res = await pool.query(query, [
      Username,
      Password,
      Credit,
      HiddifyAPIKey,
      ProxyPath,
    ]);
    return res.rows[0];
  } catch (err) {
    console.error("AddUser error:", err.message);
    throw err;
  }
};

// Find a user by username
const FindUser = async (Username) => {
  const query = "SELECT * FROM users WHERE Username = $1";
  try {
    const res = await pool.query(query, [Username]);
    return res.rows[0] || null;
  } catch (err) {
    console.error("FindUser error:", err.message);
    throw err;
  }
};

const AllUsers = async () => {
  const query = "SELECT * FROM users";
  try {
    const res = await pool.query(query);
    return res.rows || null;
  } catch (err) {
    console.error("AllUsers error:", err.message);
    throw err;
  }
};

// Update user's credit
const UpdateUserCredit = async (Username, NewCredit) => {
  const query = "UPDATE users SET Credit = $1 WHERE Username = $2 RETURNING *";
  try {
    const res = await pool.query(query, [NewCredit, Username]);
    return res.rowCount > 0; // true if updated, false if user not found
  } catch (err) {
    console.error("UpdateUserCredit error:", err.message);
    throw err;
  }
};

module.exports = { ConnectDB, AddUser, FindUser,AllUsers, UpdateUserCredit };
