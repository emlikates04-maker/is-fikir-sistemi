const express = require("express");

const app = express();

// 🔥 CRITICAL: Render health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 🔥 MUST BE LAST
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server listening on PORT:", PORT);
});