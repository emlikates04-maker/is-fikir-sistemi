function generateIdeas() {
  const input = document.getElementById("ideaInput").value;
  const output = document.getElementById("output");

  if (!input) {
    output.innerHTML = "Bir fikir yaz.";
    return;
  }

  const ideas = [
    "🎯 Hedef kitleni daralt: " + input,
    "⚡ MVP versiyonunu 1 haftada çıkarabilirsin",
    "💰 Para kazanma modeli eklemelisin",
    "📊 Rakip analizi yap",
    "🚀 Küçük bir test landing page oluştur"
  ];

  output.innerHTML = ideas.map(i => `<p>${i}</p>`).join("");
}
if (input.toLowerCase().includes("yazılım müh")) {
  output.innerHTML = "Ne yazık ki bitti kardeşim 💀";
  return;
}