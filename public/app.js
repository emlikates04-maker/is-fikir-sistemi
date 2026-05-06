const chatBox = document.getElementById("chat");
const input = document.getElementById("input");

let messages = JSON.parse(localStorage.getItem("chat")) || [];

// ===== RENDER CHAT =====
function render() {
  chatBox.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.role;
    div.innerText = msg.content;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

// ===== SEND MESSAGE =====
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // add user message
  messages.push({
    role: "user",
    content: text
  });

  input.value = "";

  render();
  save();

  // typing indicator
  const typing = document.createElement("div");
  typing.className = "assistant";
  typing.innerText = "Yazıyor...";
  chatBox.appendChild(typing);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    const data = await res.json();

    typing.remove();

    messages.push({
      role: "assistant",
      content: data.reply
    });

    render();
    save();

  } catch (err) {
    typing.innerText = "Hata oluştu. Tekrar dene.";
  }
}

// ===== SAVE =====
function save() {
  localStorage.setItem("chat", JSON.stringify(messages));
}

// ===== ENTER KEY =====
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ===== INIT =====
render();