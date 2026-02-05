import {
  setUser,
  setCurrentSessionId,
  setMessages,
  addMessagesListener,
  getMessages,
} from "../../share/state";
import { getUser } from "./api";
import { renderSessions } from "./hook";
import { renderMessages } from "./ui";

export async function initSession(container: HTMLElement) {
  const response = await getUser();

  if (!response.data) {
    return;
  }

  const user = response.data;
  setUser(user);

  // 메시지 변경 감지 리스너 등록
  const messagesContainer = document.querySelector<HTMLElement>(".messages");
  if (messagesContainer) {
    addMessagesListener(() => {
      const messages = getMessages();
      renderMessages(messages, messagesContainer);
    });
  }

  await renderSessions(user.id, container);

  // New chat 버튼 이벤트 추가
  const newChatButton = document.querySelector(".new-chat");
  if (newChatButton) {
    newChatButton.addEventListener("click", () => {
      setCurrentSessionId(null);
      setMessages([]);
    });
  }
}
