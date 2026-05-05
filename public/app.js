async function generate() {
  const prompt = document.getElementById("prompt").value;
  const result = document.getElementById("result");
  const loading = document.getElementById("loading");

  result.innerHTML = "";
  loading.classList.remove("hidden");

  try {
    const res = await fetch("/api/generate-idea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    loading.classList.add("hidden");

    result.innerHTML = `
      <h3>💡 Fikir</h3>
      <p>${data.idea}</p>
      <small>mode: ${data.mode}</small>
    `;
  } catch (err) {
    loading.classList.add("hidden");
    result.innerHTML = "Hata oluştu";
  }
}