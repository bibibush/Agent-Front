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

// Sidebar DOM elements
const app = document.querySelector("[data-app]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const scrim = document.querySelector("[data-scrim]");

// Sidebar toggle function
const setSidebarOpen = (open: boolean) => {
  if (!app) return;
  app.classList.toggle("sidebar-open", open);
};

// Event listeners
menuToggle?.addEventListener("click", () => {
  setSidebarOpen(true);
});

scrim?.addEventListener("click", () => {
  setSidebarOpen(false);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSidebarOpen(false);
  }
});

initAiChat();
