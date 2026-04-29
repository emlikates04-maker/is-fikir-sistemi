async function generateIdea() {
  const idea = document.getElementById("idea").value;

  if (!idea) {
    document.getElementById("result").innerText = "Lütfen bir fikir yaz";
    return;
  }

  document.getElementById("result").innerText = "AI düşünüyor...";

  try {
    const res = await fetch("/api/generate-idea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    });

    const data = await res.json();

    if (data.suggestion) {
      document.getElementById("result").innerText = data.suggestion;
    } else {
      document.getElementById("result").innerText =
        data.error || "Bir hata oluştu";
    }
  } catch (err) {
    document.getElementById("result").innerText =
      "Bağlantı hatası: " + err.message;
  }
}