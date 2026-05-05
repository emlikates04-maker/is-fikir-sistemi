async function generate() {
  const prompt = document.getElementById("prompt").value;
  const result = document.getElementById("result");
  const loading = document.getElementById("loading");

  if (!prompt) return;

  result.innerHTML = "";
  loading.classList.remove("hidden");

  try {
    const res = await fetch("/api/generate-idea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    loading.classList.add("hidden");

    result.innerHTML = `
      <h3>💡 AI Fikir</h3>
      <p>${data.idea}</p>
      <small>mode: ${data.mode}</small>
    `;

    saveHistory(prompt, data.idea);
    renderHistory();

  } catch (err) {
    loading.classList.add("hidden");
    result.innerHTML = "Hata oluştu";
  }
}

/* 🧠 HISTORY */
function saveHistory(prompt, idea) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({
    prompt,
    idea,
    time: Date.now(),
  });

  history = history.slice(0, 20);

  localStorage.setItem("history", JSON.stringify(history));
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const el = document.getElementById("history");

  el.innerHTML = history
    .map(
      (h) => `
      <div class="history-item" onclick="loadPrompt('${h.prompt}')">
        <b>${h.prompt}</b>
        <br/>
        <small>${new Date(h.time).toLocaleString()}</small>
      </div>
    `
    )
    .join("");
}

function loadPrompt(p) {
  document.getElementById("prompt").value = p;
}

renderHistory();