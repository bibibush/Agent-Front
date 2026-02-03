import { getUser } from "./api";
import { renderSessions } from "./hook";

export async function initSession(container: HTMLElement) {
  const response = await getUser();

  if (!response.data) {
    return;
  }

  const user = response.data;
  await renderSessions(user.id, container);
}
