async function generate() {
  const prompt = document.getElementById("prompt").value;
  const result = document.getElementById("result");
  const loading = document.getElementById("loading");

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
      <h3>💡 Fikir</h3>
      <p>${data.idea}</p>
      <small>mode: ${data.mode}</small>
    `;

    // 🧠 HISTORY SAVE
    saveHistory(prompt, data.idea);

    // UI update
    renderHistory();

  } catch (err) {
    loading.classList.add("hidden");
    result.innerHTML = "Hata oluştu";
  }
}

/* 🧠 SAVE TO LOCALSTORAGE */
function saveHistory(prompt, idea) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({
    prompt,
    idea,
    time: new Date().toLocaleString(),
  });

  // max 20 kayıt
  history = history.slice(0, 20);

  localStorage.setItem("history", JSON.stringify(history));
}

/* 📌 RENDER HISTORY */
function renderHistory() {
  const historyDiv = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("history")) || [];

  historyDiv.innerHTML = history
    .map(
      (item) => `
      <div class="history-item" onclick="loadItem('${item.prompt}')">
        <b>${item.prompt}</b><br/>
        <small>${item.time}</small>
      </div>
    `
    )
    .join("");
}

/* 🔁 HISTORY ITEM CLICK */
function loadItem(prompt) {
  document.getElementById("prompt").value = prompt;
}

/* 🚀 INIT */
renderHistory();