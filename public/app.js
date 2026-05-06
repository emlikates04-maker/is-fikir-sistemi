const chatBox = document.getElementById("chat");
const input = document.getElementById("input");

let messages = [];

function render() {
  chatBox.innerHTML = "";

  messages.forEach(m => {
    const div = document.createElement("div");
    div.className = m.role;
    div.innerText = m.content;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  messages.push({ role: "user", content: text });

  input.value = "";
  render();

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages })
  });

  const data = await res.json();

  messages.push({
    role: "assistant",
    content: data.reply
  });

  render();
}

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});