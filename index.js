require("dotenv").config();
const express = require("express");
const core = require("cors");
const app = express();
const port = process.env.SERVER_PORT || 8000;

app.use(core());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`The chill game server open`);
});

app.listen(port, () => {
  console.log(`The chill game server running:${port}`);
});
