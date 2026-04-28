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