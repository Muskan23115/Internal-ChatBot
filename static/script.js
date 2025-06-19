const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const typingDiv = document.getElementById("typing");
const historyList = document.getElementById("history-list");

// Splash screen
window.onload = () => {
  const splash = document.getElementById("splash-screen");
  setTimeout(() => splash.style.display = "none", 1500);
};

// Toggle theme
const themeToggle = document.getElementById("theme-toggle");

themeToggle.onchange = () => {
  document.body.classList.toggle("dark", themeToggle.checked);
};

// Send button
function sendMessage() {
  const message = input.value.trim();
  if (!message) return;
  appendMessage("You", message, "user");
  input.value = "";
  typingDiv.style.display = "flex";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
  .then(res => res.json())
  .then(data => {
    typingDiv.style.display = "none";
    appendMessage("IntraBot", data.response, "bot");
  });
}

// Add message to chat + history
function appendMessage(sender, message, type) {
    const msg = document.createElement("div");
    msg.className = "chat-message " + type;
    msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  
    // Create history entry with timestamp
    const item = document.createElement("li");
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    item.innerHTML = `
      <div class="history-entry">
        <div class="history-time">${timeString}</div>
        <div class="history-text">${message}</div>
      </div>
      <hr>
    `;
  
    historyList.appendChild(item);
  }
  
// Mic button
document.getElementById("mic-button").onclick = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
  };
};
// New Enter-key shortcut
// Detect Enter key on input field
document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents newline
      document.getElementById("send-btn").click();
    }
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
  
    inputField.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // prevent newline
        sendButton.click(); // trigger send
      }
    });
  });
  