async function generateIdea() {
  const input = document.getElementById("ideaInput").value;

  document.getElementById("improvement").innerText = "AI düşünüyor...";

  try {
    const res = await fetch("/api/generate-idea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: input })
    });

    const data = await res.json();

    document.getElementById("improvement").innerText = data.improvement;
    document.getElementById("risks").innerText = data.risks.join(", ");
    document.getElementById("monetization").innerText = data.monetization.join(", ");
    document.getElementById("mvp").innerText = data.mvp;

  } catch (err) {
    console.log(err);
    document.getElementById("improvement").innerText = "Hata oluştu";
  }
}