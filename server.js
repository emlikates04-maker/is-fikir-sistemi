const express = require("express");
const path = require("path");

const app = express();

// 🔥 EN KRİTİK SATIR
app.use(express.static(path.join(__dirname, "public")));

// Ana route garantiye al
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Port ayarı (Render için şart)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server çalışıyor: ${PORT}`);
});
