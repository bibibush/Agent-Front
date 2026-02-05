import { setMessages } from "../../share/state";
import { getSessions } from "./api";
import { createSessionItem } from "./ui";

export async function renderSessions(userId: number, container: HTMLElement) {
  const response = await getSessions(userId);

  if (!response.data) {
    return;
  }

  const sessions = response.data;
  container.innerHTML = "";

  sessions.forEach((session) => {
    const sessionItem = createSessionItem({
      title: session.title ?? "새 대화",
      onClick: () => {
        setMessages(session.messages);
      },
    });
    container.appendChild(sessionItem);
  });
}
