async function generateIdea() {
  const prompt = document.getElementById("prompt").value;

  const res = await fetch("/api/generate-idea", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();

  document.getElementById("result").innerText =
    data.idea || data.error;
}