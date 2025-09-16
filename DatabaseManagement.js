const sqlite = require('sqlite3').verbose()

let db

const ConnectDB = async () => {
  db = new sqlite.Database('Database.sqlite', (error) => {
    if (error) {
      console.error(error)
    } else {
      // console.log('Connected to DB')
    }
  })

  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Username TEXT UNIQUE NOT NULL,
      Password TEXT NOT NULL,
      Credit NUMBER NOT NULL,
      HiddifyAPIKey TEXT UNIQUE NOT NULL,
      ProxyPath TEXT NOT NULL
    )
`);
}

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

const FindUser = (Username,res) => {
  return new Promise((resolve, reject) => {
    const Command = 'SELECT * FROM users WHERE Username = ?'
    db.get(Command, Username, (error,row) => {
      if (error) {
        res.send(error)
        reject(error)
      } else {
        res.send(row)
        resolve(row)
        // console.log(row)
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