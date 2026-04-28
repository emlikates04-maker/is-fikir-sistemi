async function generateIdeas() {
  const input = document.getElementById("ideaInput").value;
  const output = document.getElementById("output");

  if (!input) return;

  output.innerHTML = "🤖 AI düşünüyor...";

  const res = await fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ idea: input })
  });

  const data = await res.json();

  output.innerHTML = `<pre>${data.result}</pre>`;
}
fetch("/api/generate-idea", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ idea: "fitness app" })
})
async function generateIdea() {
  const input = document.getElementById("ideaInput").value;

  // loading göster
  document.getElementById("improvement").innerText = "AI düşünüyor...";

  const res = await fetch("/api/generate-idea", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ idea: input })
  });

  const data = await res.json();

  // 🔥 BURASI CEVAP BASMA KISMI
  document.getElementById("improvement").innerText = data.improvement;
  document.getElementById("risks").innerText = data.risks.join(", ");
  document.getElementById("monetization").innerText = data.monetization.join(", ");
  document.getElementById("mvp").innerText = data.mvp;
}