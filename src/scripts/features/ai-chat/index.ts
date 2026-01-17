import { sendMessage } from "./ui";

export const initAiChat = () => {
  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const sendButton = document.querySelector(".send-button");

  sendButton?.addEventListener("click", sendMessage);

  composer?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
};
