import { getOpenaiResponse, getOpenaiResponseSSE } from "./api";
import { receiveMessage, receiveMessageSSE, sendMessageUI } from "./ui";
import {
  getCurrentSessionId,
  getUserState,
  setCurrentSessionId,
} from "../../share/state";
import { renderSessions } from "../session/hook";

const IS_DEV = process.env.NODE_ENV !== "production";

export const useSendMessage = async () => {
  if (IS_DEV) console.time("ai-chat-response");

  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const text = composer?.value.trim();

  if (!text) return;

  sendMessageUI();

  try {
    const response = await getOpenaiResponse({
      model: "gpt-5.2",
      input: text,
      sessionId: null,
    });

    receiveMessage(response.data);
  } catch (error) {
    console.error("Failed to get AI response:", error);
    receiveMessage("죄송합니다. 응답을 받는 중 오류가 발생했습니다.");
  } finally {
    if (IS_DEV) console.timeEnd("ai-chat-response");
  }
};

export const useSendMessageSSE = async () => {
  if (IS_DEV) console.time("ai-chat-response-sse");

  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const text = composer?.value.trim();

  if (!text) return;

  sendMessageUI();

  try {
    const sessionId = getCurrentSessionId();
    const isNewSession = sessionId === null;

    const stream = getOpenaiResponseSSE({
      model: "gpt-5.2",
      input: text,
      stream: true,
      sessionId,
    });

    let aiResponse = "";

    for await (const event of stream) {
      if (event.type === "session") {
        setCurrentSessionId(Number(event.data));
        if (IS_DEV) console.log("Session ID received:", event.data);
      } else {
        aiResponse += event.data;
        receiveMessageSSE(aiResponse);
      }
    }

    receiveMessageSSE(aiResponse, true);
    if (isNewSession) {
      const sessionContainer = document.querySelector<HTMLElement>(
        "[data-session-list]",
      );
      const user = getUserState();
      if (sessionContainer && user) {
        await renderSessions(user.id, sessionContainer);
      }
    }
  } catch (error) {
    console.error("Failed to get AI response via SSE:", error);
    receiveMessage("죄송합니다. 응답을 받는 중 오류가 발생했습니다.");
  } finally {
    if (IS_DEV) console.timeEnd("ai-chat-response-sse");
  }
};
