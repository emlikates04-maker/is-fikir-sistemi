const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

let history = JSON.parse(localStorage.getItem("history")) || [];

function saveHistory() {
  localStorage.setItem("history", JSON.stringify(history));
}

function addMessage(role, text) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.classList.add(role);

  div.innerText = text;

  chat.appendChild(div);

  chat.scrollTop = chat.scrollHeight;
}

function loadMessages() {
  history.forEach((msg) => {
    addMessage(msg.role === "user" ? "user" : "ai", msg.content);
  });
}

async function sendMessage() {
  const message = input.value.trim();

  if (!message) return;

  addMessage("user", message);

  history.push({
    role: "user",
    content: message,
  });

  saveHistory();

  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history,
      }),
    });

    const data = await response.json();

    addMessage("ai", data.reply);

    history.push({
      role: "assistant",
      content: data.reply,
    });

    saveHistory();
  } catch (err) {
    addMessage(
      "ai",
      "Bağlantı problemi oluştu."
    );
  }
}

send.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

loadMessages();

if (history.length === 0) {
  const firstMessage =
    "Şu an en çok ilgini çeken alan ne?";

  addMessage("ai", firstMessage);

  history.push({
    role: "assistant",
    content: firstMessage,
  });

  saveHistory();
}