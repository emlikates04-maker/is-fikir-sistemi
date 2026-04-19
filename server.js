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
});const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server çalışıyor");
});const path = require("path");

// ANA SAYFA
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "test.html"));
});const express = require("express");
const app = express();

app.use(express.json());const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

// ANA SAYFA (HTML'i gösterir)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "test.html"));
});

// API
app.post("/idea", (req, res) => {
  const { name, trait, interest } = req.body;

  res.json({
    idea: `${name} için ${interest} alanında ${trait} kişiliğine uygun bir iş fikri: dijital ürün veya online hizmet oluşturabilirsin 🚀`
  });
});

// PORT (Render için zorunlu)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server çalışıyor");
});const path = require("path");
     const PORT = process.env.PORT || 3000;      
                                                                                          const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server çalışıyor 🚀");
});

app.post("/idea", (req, res) => {
  res.json({ idea: "Çalışıyor" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server çalışıyor");
});
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server çalışıyor 🚀");
});

app.post("/idea", (req, res) => {
  res.json({ idea: "Çalışıyor" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server çalışıyor");
});
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("OK 🚀");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT);