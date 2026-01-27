import { renderMarkdown } from "../../share/markdown";

export const sendMessageUI = () => {
  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const messagesContainer = document.querySelector(".messages");

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

export const receiveMessage = (text: string) => {
  const messagesContainer = document.querySelector(".messages");
  if (!messagesContainer) return;

  const message = document.createElement("article");
  message.className = "message assistant";
  message.innerHTML = `
    <div class="message-meta">
      <span class="badge">AI</span>
    </div>
    <div class="message-body"></div>
  `;

  // 마크다운 렌더링 적용
  const messageBody = message.querySelector(".message-body");
  if (messageBody) {
    messageBody.innerHTML = renderMarkdown(text);
  }

  messagesContainer.appendChild(message);
  message.scrollIntoView({ behavior: "smooth" });
};

export const receiveMessageSSE = (text: string, done = false) => {
  const messagesContainer = document.querySelector(".messages");
  if (!messagesContainer) return;

  let message = messagesContainer.querySelector<HTMLElement>(
    "[data-ai-streaming='true']",
  );

  if (!message) {
    message = document.createElement("article");
    message.className = "message assistant";
    message.dataset.aiStreaming = "true";
    message.innerHTML = `
      <div class="message-meta">
        <span class="badge">AI</span>
      </div>
      <div class="message-body"></div>
    `;

    messagesContainer.appendChild(message);
  }

  // 마크다운 렌더링 적용
  const body = message.querySelector(".message-body");
  if (body) {
    body.innerHTML = renderMarkdown(text);
  }

  if (done) {
    delete message.dataset.aiStreaming;
  }

  message.scrollIntoView({ behavior: "smooth" });
};
