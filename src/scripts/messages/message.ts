export const initMessages = () => {
  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const messagesContainer = document.querySelector(".messages");
  const sendButton = document.querySelector(".send-button");

  const sendMessage = () => {
    const text = composer?.value.trim();
    if (!text || !messagesContainer || !composer) return;

    const message = document.createElement("article");
    message.className = "message user";
    message.innerHTML = `
      <div class="message-meta">
        <span class="badge">나</span>
      </div>
      <div class="message-body">
        <p style="white-space: pre-wrap;">${text}</p>
      </div>
    `;

    messagesContainer.appendChild(message);
    message.scrollIntoView({ behavior: "smooth" });

    composer.value = "";
    composer.style.height = "auto";
  };

  sendButton?.addEventListener("click", sendMessage);

  composer?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
};

export const receiveMessage = (text: string) => {
  const messagesContainer = document.querySelector(".messages");
  if (!messagesContainer) return;

  const message = document.createElement("article");
  message.className = "message assistant";
  message.innerHTML = `
    <div class="message-meta">
      <span class="badge">AI</span>
    </div>
    <div class="message-body">
      <p style="white-space: pre-wrap;">${text}</p>
    </div>
  `;

  messagesContainer.appendChild(message);
  message.scrollIntoView({ behavior: "smooth" });
};
