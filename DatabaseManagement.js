const sqlite = require('sqlite3').verbose()
const { error } = require('console');
const path = require("path");

let db

const ConnectDB = async () => {
  const dbPath = path.join(__dirname, "data/Database.sqlite");

  return new Promise((resolve, reject) => {
    db = new sqlite.Database(dbPath, (err) => {
      if (err) {
        console.error("Failed to open DB:", err.message);
        return reject(false); // return false on error
      }

      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          Username TEXT UNIQUE NOT NULL,
          Password TEXT NOT NULL,
          Credit NUMBER NOT NULL,
          HiddifyAPIKey TEXT UNIQUE NOT NULL,
          ProxyPath TEXT NOT NULL
        )
      `,
        (err) => {
          if (err) {
            console.error("Failed to create table:", err.message);
            reject('This is a custom Error');
          } else {
            resolve();
          }
        }
      );
    });
  });
};


const AddUser = (Username, Password, Credit,HiddifyAPIKey,ProxyPath) => {
  const Command = 'INSERT INTO users (Username,Password,Credit,HiddifyAPIKey,ProxyPath) VALUES (?,?,?,?,?)'
  db.run(Command, [Username, Password, Credit,HiddifyAPIKey,ProxyPath], (error) => {
    if (error) {
      console.error(error)
    } else {
      // console.log('User inserted successfully !')
    }
  })
}

const FindUser = (Username) => {
  return new Promise((resolve, reject) => {

    if (!db) return resolve(new Error("DB not initialized"));

    const Command = 'SELECT * FROM users WHERE Username = ?'
    db.get(Command, Username, (error,row) => {
      if (error) {
        resolve(error)
      } else {
        resolve(row)
      }
    })
  })
}

const UpdateUserCredit = (Username, NewCredit) => {
  return new Promise((resolve, reject) => {
    const Command = "UPDATE users SET Credit = ? WHERE Username = ?";
    db.run(Command, [NewCredit, Username], function (error) {
      if (error) {
        reject(error);
      } else {
        if (this.changes === 0) {
          // No rows affected — user not found
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });
  });
};

module.exports = {ConnectDB,AddUser,FindUser,UpdateUserCredit}