const express = require("express");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// =======================
// IDEA GENERATOR API
// =======================
app.post("/api/generate-idea", (req, res) => {
  const idea = req.body.idea?.toLowerCase() || "";

  let response = {
    improvement: "",
    risks: [],
    monetization: [],
    mvp: ""
  };

  // Simple intelligence rules (MVP logic)
  if (idea.includes("fitness")) {
    response = {
      improvement: "Niche seç: evde spor yapanlara veya yeni başlayanlara odaklan.",
      risks: ["yüksek rekabet", "kullanıcı tutma zor"],
      monetization: ["subscription modeli", "premium workout plan"],
      mvp: "Günde 5 egzersiz öneren basit mobil/web app"
    };
  } 
  else if (idea.includes("app")) {
    response = {
      improvement: "Fikri daralt: tek bir problemi çözmeye odaklan.",
      risks: ["user acquisition maliyeti", "rekabet"],
      monetization: ["freemium model", "premium özellikler"],
      mvp: "Tek özellikli minimal uygulama"
    };
  } 
  else if (idea.includes("saas")) {
    response = {
      improvement: "B2B odaklı düşün: işletmelere değer üret.",
      risks: ["satış süreci uzun", "müşteri bulma zor"],
      monetization: ["aylık abonelik", "tiered pricing"],
      mvp: "Tek bir otomasyon yapan web panel"
    };
  } 
  else {
    response = {
      improvement: "Fikri daha spesifik hale getir ve hedef kitle belirle.",
      risks: ["pazar belirsizliği", "ürün-fit riski"],
      monetization: ["belirsiz - önce MVP test edilmeli"],
      mvp: "Basit landing page + fikir doğrulama formu"
    };
  }

  res.json(response);
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
