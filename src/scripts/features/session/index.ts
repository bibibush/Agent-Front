import { setUser, setCurrentSessionId, setMessages } from "../../share/state";
import { getUser } from "./api";
import { renderSessions } from "./hook";

export async function initSession(container: HTMLElement) {
  const response = await getUser();

  if (!response.data) {
    return;
  }

  const user = response.data;
  setUser(user);

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
