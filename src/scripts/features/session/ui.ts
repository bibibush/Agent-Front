import { ChatMessage } from "./type";
import { renderMarkdown } from "../../share/markdown";

interface SessionItemProps {
  title: string;
  onClick?: () => void;
}

export function createSessionItem(props: SessionItemProps): HTMLLIElement {
  const { title, onClick } = props;

  const li = document.createElement("li");
  li.className = "chat-item";
  li.style.cursor = "pointer";
  li.textContent = title;

  if (onClick) {
    li.addEventListener("click", onClick);
  }

  return li;
}

/**
 * HTML 특수문자를 이스케이프하여 XSS 방지
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 개별 메시지 element 생성
 */
function createMessageElement(message: ChatMessage): HTMLElement {
  const article = document.createElement("article");

  if (message.role === "user") {
    article.className = "message user";
    article.innerHTML = `
      <div class="message-meta">
        <span class="badge">나</span>
      </div>
      <div class="message-body">
        <p style="white-space: pre-wrap;">${escapeHtml(message.message)}</p>
      </div>
    `;
  } else if (message.role === "assistant") {
    article.className = "message assistant";
    article.innerHTML = `
      <div class="message-meta">
        <span class="badge">AI</span>
      </div>
      <div class="message-body"></div>
    `;

    // 마크다운 렌더링 적용
    const messageBody = article.querySelector(".message-body");
    if (messageBody) {
      messageBody.innerHTML = renderMarkdown(message.message);
    }
  } else {
    // Unknown role - 기본적으로 plain text로 표시
    console.warn(`Unknown message role: ${message.role}`, message);
    article.className = "message assistant";
    article.innerHTML = `
      <div class="message-meta">
        <span class="badge">System</span>
      </div>
      <div class="message-body">
        <p style="white-space: pre-wrap;">${escapeHtml(message.message)}</p>
      </div>
    `;
  }

  return article;
}

export function renderMessages(
  messages: ChatMessage[],
  container: HTMLElement,
): void {
  // 컨테이너 검증
  if (!container) {
    console.warn("renderMessages: Container element is null");
    return;
  }

  // 빈 배열 처리
  if (!messages || messages.length === 0) {
    container.innerHTML = "";
    return;
  }

  // DocumentFragment 사용으로 리플로우 최소화
  const fragment = document.createDocumentFragment();

  // 각 메시지를 순회하며 element 생성
  messages.forEach((message) => {
    try {
      const messageElement = createMessageElement(message);
      fragment.appendChild(messageElement);
    } catch (error) {
      console.error("Error rendering message:", message, error);
      // 에러 발생 시 해당 메시지는 스킵하고 계속 진행
    }
  });

  // 한 번에 DOM에 추가
  container.innerHTML = "";
  container.appendChild(fragment);

  // 마지막 메시지로 부드럽게 스크롤
  const lastMessage = container.lastElementChild;
  if (lastMessage) {
    lastMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}
