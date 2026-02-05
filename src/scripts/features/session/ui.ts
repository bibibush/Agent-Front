import { ChatMessage } from "./type";
import { renderMarkdown } from "../../share/markdown";
import { deleteSession } from "./api";

interface SessionItemProps {
  title: string;
  sessionId: number;
  onClick?: () => void;
  onDeleteSuccess?: () => void;
}

export function createSessionItem(props: SessionItemProps): HTMLLIElement {
  const { title, sessionId, onClick, onDeleteSuccess } = props;

  const li = document.createElement("li");
  li.className = "chat-item";
  li.style.cursor = "pointer";
  li.style.display = "flex";
  li.style.flexDirection = "row";
  li.style.justifyContent = "space-between";
  li.style.alignItems = "center";

  const titleSpan = document.createElement("span");
  titleSpan.textContent = title;
  titleSpan.style.overflow = "hidden";
  titleSpan.style.textOverflow = "ellipsis";
  titleSpan.style.whiteSpace = "nowrap";
  li.appendChild(titleSpan);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-session-btn";
  deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
  deleteButton.style.background = "none";
  deleteButton.style.border = "none";
  deleteButton.style.cursor = "pointer";
  deleteButton.style.padding = "4px";
  deleteButton.style.opacity = "0.6";
  deleteButton.style.display = "flex";
  deleteButton.style.alignItems = "center";
  deleteButton.style.justifyContent = "center";
  deleteButton.style.flexShrink = "0";

  deleteButton.addEventListener("mouseenter", () => {
    deleteButton.style.opacity = "1";
  });
  deleteButton.addEventListener("mouseleave", () => {
    deleteButton.style.opacity = "0.6";
  });

  deleteButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  });

  li.appendChild(deleteButton);

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
