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

app.get("/posts", async (req, res) => {
  res.send(posts);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
  res.json({
    accessToken: accessToken,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
