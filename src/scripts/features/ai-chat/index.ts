import { useSendMessage, useSendMessageSSE } from "./hook";
import {
  getIsNewSession,
  setIsNewSession,
  getCurrentSessionId,
} from "../../share/state";

export const initAiChat = () => {
  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const sendButton = document.querySelector(".send-button");

  sendButton?.addEventListener("click", () => {
    const isNewSession = getIsNewSession();
    const sessionId = isNewSession ? null : getCurrentSessionId();

    useSendMessageSSE(sessionId);
  });

  composer?.addEventListener("keydown", (e) => {
    const isNewSession = getIsNewSession();
    const sessionId = isNewSession ? null : getCurrentSessionId();

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      useSendMessageSSE(sessionId);
    }
  });
};
