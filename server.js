const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/api/generate-idea", (req, res) => {
  res.json({
    improvement: "Test mode working",
    risks: ["no risks"],
    monetization: ["none yet"],
    mvp: "server is alive"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});