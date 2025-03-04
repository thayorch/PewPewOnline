require("dotenv").config();
const axios = require("axios");
const express = require("express");
const { userInfo } = require("os");
const path = require("path");

const app = express();

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/index.html"));
});

app.get("/auth", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

app.get("/oauth-callback", ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };
  const opts = { headers: { accept: "application/json" } };

  axios
    .post("https://github.com/login/oauth/access_token", body, opts)
    .then((_res) => {
      // console.log("GitHub Response:", _res.data); // Log the response
      return _res.data.access_token;
    })
    .then((token) => {
      if (!token) {
        throw new Error("Token not found in GitHub response");
      }
      // console.log("My token:", token);

      // Fetch user details using the access token
      return axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .then((userRes) => {
      const userDetails = userRes.data;
      // console.log("User Details:", userDetails);
      console.log(`[log] : User[${userDetails.login}] is Login`);
      
      // Redirect to the home page with user details as query parameters
      const queryParams = new URLSearchParams({
        username: userDetails.login,
        avatar_url: userDetails.avatar_url,
        name: userDetails.name || userDetails.login,
      }).toString();
      res.redirect(`/?${queryParams}`);
    })
    .catch((err) => {
      console.error("Error:", err.message); // Log the error
      res.status(500).json({ err: err.message });
    });
});



// Add this route to your existing backend code
app.post("/join-room", express.json(), (req, res) => {
  const { roomName, playerName } = req.body;

  if (!roomName || !playerName) {
    return res.status(400).json({ error: "Room name and player name are required" });
  }
  
  console.log(`[log] : Player[${playerName}] joined room[${roomName}]`);
  res.json({ success: true, message: `Player ${playerName} joined room ${roomName}` });
});

app.listen(3000);
// eslint-disable-next-line no-console
console.log("App listening http://localhost:3000/");
