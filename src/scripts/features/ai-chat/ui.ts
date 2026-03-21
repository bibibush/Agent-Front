import { renderMarkdown } from "../../share/markdown";

const isNearBottom = (el: Element, threshold = 100): boolean =>
  el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;

const scrollToBottom = (el: Element) => {
  el.scrollTop = el.scrollHeight;
};

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

  const scrollContainer = messagesContainer.closest(".chat");
  if (scrollContainer) {
    scrollToBottom(scrollContainer);
  }

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

  const scrollContainer = messagesContainer.closest(".chat");
  if (scrollContainer) {
    scrollToBottom(scrollContainer);
  }
};

export const showTypingIndicator = () => {
  const messagesContainer = document.querySelector(".messages");
  if (!messagesContainer) return;

  const indicator = document.createElement("article");
  indicator.className = "message assistant";
  indicator.dataset.typingIndicator = "true";
  indicator.innerHTML = `
    <div class="message-meta"><span class="badge">AI</span></div>
    <div class="message-body">
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  messagesContainer.appendChild(indicator);

  const scrollContainer = messagesContainer.closest(".chat");
  if (scrollContainer) {
    scrollToBottom(scrollContainer);
  }
};

export const removeTypingIndicator = () => {
  document.querySelector("[data-typing-indicator='true']")?.remove();
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

  const scrollContainer = messagesContainer.closest(".chat");
  if (scrollContainer && isNearBottom(scrollContainer)) {
    scrollToBottom(scrollContainer);
  }
};
