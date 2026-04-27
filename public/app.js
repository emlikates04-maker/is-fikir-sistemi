alert("JS çalışıyor");
function generateIdeas() {
  const input = document.getElementById("ideaInput").value;
  const output = document.getElementById("output");

  if (!input) return;

  if (input.toLowerCase().includes("yazılım müh")) {
    output.innerHTML = "Ne yazık ki bitti kardeşim 💀";
    return;
  }

  const ideas = [
    "MVP oluştur",
    "Hedef kitleyi daralt",
    "Para kazanma modeli ekle"
  ];

  output.innerHTML = ideas.map(i => `<p>${i}</p>`).join("");
}
