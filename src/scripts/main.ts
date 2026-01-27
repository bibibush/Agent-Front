import { initAiChat } from "./features/ai-chat";

const composer = document.querySelector<HTMLTextAreaElement>("[data-composer]");

const resizeComposer = () => {
  if (!composer) return;
  composer.style.height = "auto";
  const nextHeight = Math.min(composer.scrollHeight, 200);
  composer.style.height = `${nextHeight}px`;
};

composer?.addEventListener("input", resizeComposer);
window.addEventListener("load", resizeComposer);

initAiChat();
