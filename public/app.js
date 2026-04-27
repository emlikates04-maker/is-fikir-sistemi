function generateIdeas() {
  const input = document.getElementById("ideaInput").value;
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerHTML = "Bir fikir yazmalısın.";
    return;
  }

  const category = detectCategory(input);
  const ideas = createIdeas(input, category);

  output.innerHTML = `
    <h3>📌 Kategori: ${category}</h3>
    ${ideas.map(i => `
      <div style="
        padding:10px;
        margin:8px 0;
        border:1px solid #ddd;
        border-radius:8px;
      ">
        💡 ${i}
      </div>
    `).join("")}
  `;
}

// Basit kategori tespiti
function detectCategory(text) {
  const t = text.toLowerCase();

  if (t.includes("app") || t.includes("uygulama")) {
    return "Uygulama Fikri";
  }

  if (t.includes("instagram") || t.includes("tiktok") || t.includes("video")) {
    return "İçerik Fikri";
  }

  if (t.includes("para") || t.includes("sat") || t.includes("iş")) {
    return "İş Fikri";
  }

  return "Genel Fikir";
}

// Fikir üretme motoru (MVP logic)
function createIdeas(input, category) {
  return [
    `${input} için hedef kitleni daha spesifik hale getirebilirsin.`,
    `${category} olarak bunu küçük bir MVP’ye indirgemelisin.`,
    `Bu fikri test etmek için 1 sayfalık landing page yapabilirsin.`,
    `Para kazanma modeli eklemeyi düşünebilirsin (abonelik / reklam / satış).`,
    `Rakip analizi yaparak fark yaratabileceğin bir alan bulabilirsin.`
  ];
}