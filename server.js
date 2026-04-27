const express = require("express");

const app = express();

// JSON ve static dosya desteği
app.use(express.json());
app.use(express.static("public"));

/*
  BASİT MVP SERVER
  - OpenAI yok
  - Sadece frontend (app.js) çalışır
  - Render'da sorunsuz deploy olur
*/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// server başlat
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});