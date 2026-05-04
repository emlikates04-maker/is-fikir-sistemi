async function generateIdea() {
  const input = document.getElementById("ideaInput").value;
  const output = document.getElementById("output");

  output.innerHTML = "AI düşünüyor...";

  try {
    const res = await fetch("/api/generate-idea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idea: input })
    });

    const data = await res.json();

    console.log("RAW RESPONSE:", data);

    // 🔥 HER DURUMA DAYANIKLI OKUMA
    const result =
      data.result ||
      data.message ||
      data.data ||
      JSON.stringify(data);

    output.innerHTML = `
      <div style="padding:10px;border:1px solid #ddd;margin-top:10px;">
        ${result}
      </div>
    `;

  } catch (err) {
    console.log(err);
    output.innerHTML = "Hata oluştu ama sistem çalışıyor";
  }
}