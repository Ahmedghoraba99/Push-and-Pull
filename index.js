const express = require("express");
const db = require("./db");
const app = express();
const fs = require("fs");
const port = 8081;

// cors from all methods and ips
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  next();
});
let clients = [];
//Middlewares to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send(
    "Your routes are: \n /projects \n /projects/search \n /projects/delete \n /users"
  );
});
// search end points
app.get("/projects", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/projects/search", (req, res) => {
  const name = req.query.name;
  db.all(
    "SELECT * FROM projects WHERE name LIKE ?",
    [`%${name}%`],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});
// delete end point

app.get("/projects/delete", (req, res) => {
  const id = req.query.id;
  db.run("DELETE FROM projects WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ status: "success" });
  });
});

// Form register end points
app.post("/checkemail", (req, res) => {
  const email = req.body.email;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.status(400).json({ error: "Email already exists" });
      return;
    } else {
      res.status(200).json({ status: "success" });
    }
  });
});

app.post("/users", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.run(
    "INSERT INTO users (email, pass) VALUES (?, ?)",
    [email, password],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ status: "success" });
    }
  );
});

// long polling end points
var responses = [];
// Endpoint to subscribe to updates
app.get("/subscribe-to-update", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  responses.push(res);
});

fs.watch("./updates.txt", (eventType, filename) => {
  if (filename && eventType === "change") {
    const file = fs.readFileSync("./updates.txt", "utf-8");
    responses.forEach((res) => {
      res.write(`data: ${file}\n\n`);
    });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
