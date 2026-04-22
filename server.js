const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// public klasörünü kullan
app.use(express.static(path.join(__dirname, "public")));

// ana sayfa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server çalışıyor: " + PORT);
});
