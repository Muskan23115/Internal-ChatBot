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

// Send message to backend
function sendMessage(message) {
  if (!message.trim()) return;

  appendMessage("You", message, "user");
  input.value = "";

  typingDiv.style.display = "block";

  fetch("/chatgpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message })
  })
    .then(response => response.json())
    .then(data => {
      displayBotResponse(data.reply);
    })
    .catch(error => {
      displayBotResponse("Sorry, there was an error!");
      console.error("Error:", error);
    });
}

// Show bot response
function displayBotResponse(message) {
  typingDiv.style.display = "none";
  appendMessage("Bot", message, "bot");
}

// Add message to chat + history
function appendMessage(sender, message, type) {
  const msg = document.createElement("div");
  msg.className = "chat-message " + type;
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

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

// Mic input
document.getElementById("mic-button").onclick = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    sendMessage(transcript);  // Optional: auto-send
  };
};

// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("user-input");
  const sendButton = document.getElementById("send-btn");

  // Send on button click
  sendButton.addEventListener("click", function () {
    const message = inputField.value.trim();
    if (message !== "") {
      sendMessage(message);
    }
  });

  // Send on Enter key
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendButton.click();
    }
  });
});
