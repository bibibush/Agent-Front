import { useSendMessage, useSendMessageSSE } from "./hook";

export const initAiChat = () => {
  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const sendButton = document.querySelector(".send-button");

  sendButton?.addEventListener("click", useSendMessageSSE);

  composer?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      useSendMessageSSE();
    }
  });
};
