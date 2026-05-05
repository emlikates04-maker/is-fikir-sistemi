const sessionId = Date.now().toString();

async function generate() {
  const input = document.getElementById("prompt");
  const result = document.getElementById("result");

  const message = input.value;
  input.value = "";

  result.innerHTML += `<p><b>Sen:</b> ${message}</p>`;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      message,
    }),
  });

  const data = await res.json();

  result.innerHTML += `<p><b>AI:</b> ${data.reply}</p>`;
}