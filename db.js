const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");
// sqllite memory database (temp)
db.serialize(() => {
  db.run(
    "CREATE TABLE projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, descreption TEXT)"
  );
  // projects seeder
  const stmt = db.prepare(
    "INSERT INTO projects (name, descreption) VALUES (?, ?)"
  );
  stmt.run(
    "sssssssssss",
    "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
  );
  stmt.run(
    "tttttttt",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
  );
  stmt.run(
    "another",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
  );
  stmt.run(
    "anotherrrr",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
  );
  stmt.finalize();
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, pass TEXT)"
  );
  // users seeder

  const stmt2 = db.prepare("INSERT INTO users (email, pass) VALUES (?, ?)");
  stmt2.run("e@e.com", "123456");
  stmt2.run("d@d.com", "123456");
  stmt2.finalize();
});

module.exports = db;
