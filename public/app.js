let history = JSON.parse(localStorage.getItem("chat")) || [];

const chat = document.getElementById("chat");

function render() {
  chat.innerHTML = "";

  history.forEach(m => {
    const div = document.createElement("div");
    div.className = "msg " + (m.role === "user" ? "user" : "ai");
    div.innerText = m.content;
    chat.appendChild(div);
  });

  chat.scrollTop = chat.scrollHeight;
}

async function send() {
  const input = document.getElementById("input");
  const text = input.value;
  if (!text) return;

  history.push({ role: "user", content: text });

  render();
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      history
    })
  });

  const data = await res.json();

  history.push({ role: "assistant", content: data.reply });

  localStorage.setItem("chat", JSON.stringify(history));

  render();
}

render();