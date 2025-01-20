const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const port = 5000;
const posts = require("./posts.json");
const jwt = require("jsonwebtoken");

// middlewares
dotenv.config();
app.use(cors());
app.use(express.json());

// coustom middleware
function authintication(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.status(401).json({ message: "token not found" });
  }

  // verifying the accesss token
  jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
    // handling an error if the verification is not successfull
    if (error)
      return res.status(403).json({
        message: "token is invalid",
        error: error,
      });

    // setting the token details in the requiest user
    req.user = user;
    next();
  });
}

// routers
app.get("/", (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Backend Server</title>
          <style>
            body {
              background-color: black;
              color: white;
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <h1>Backend Server is Running</h1>
        </body>
        </html>
      `);
});

app.get("/posts", authintication, (req, res) => {
  const user = req.user.name;
  res.status(200).json(posts.filter((post) => post.username === user));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
  res.json({
    accessToken: accessToken,
    status: 200,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
