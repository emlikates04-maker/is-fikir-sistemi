const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test endpoint
app.post("/test", (req, res) => {
  res.json({ message: "Çalışıyor 🚀" });
});

// server başlatma
app.listen(3001, () => {
  console.log("Server çalışıyor: http://localhost:3001");
});app.post("/idea", (req, res) => {
  const { name, trait, interest } = req.body;

  let idea = "";

  if (trait.includes("girişimci")) {
    idea = "Sosyal medya otomasyon aracı geliştirebilirsin.";
  } 
  else if (interest.includes("yapay zeka")) {
    idea = "AI tabanlı içerik üretim aracı yapabilirsin.";
  } 
  else {
    idea = "Dijital ürün satışı (e-kitap, template) yapabilirsin.";
  }

  res.json({
    idea: `${name} için öneri: ${idea}`
  });
});