const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const port = 5000;
const posts = require("./posts.json");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");

// Middleware Setup
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieparser());

// Custom Authentication Middleware
function authintication(req, res, next) {
  const token = req.cookies.token;
  if (!token || token === null) {
    return res.status(401).json({ message: "token not found" });
  }

  // verifying the accesss token
  jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
    // handling an error if the verification is not successfull
    if (error) {
      return res.status(403).json({
        message:
          error.name === "TokenExpiredError"
            ? "Token expired"
            : "Token is invalid",
        error: error,
      });
    }

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

// Protected Route
app.get("/posts", authintication, (req, res) => {
  const user = req.user.name;
  console.log("user:", user);
  res.status(200).json(posts.filter((post) => post.username === user));
});

// Login Route
app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: "1h",
  });

  res
    .status(200)
    .cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "strict", // Protect against CSRF attacks
    })
    .json({
      accessToken: accessToken,
      status: 200,
      message: "login successfull.",
    });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
