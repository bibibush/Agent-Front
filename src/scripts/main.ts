import { initMessages } from "./messages/message";

const app = document.querySelector<HTMLElement>("[data-app]");
const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const scrim = document.querySelector<HTMLElement>("[data-scrim]");
const composer = document.querySelector<HTMLTextAreaElement>("[data-composer]");

const setSidebarOpen = (open: boolean) => {
  if (!app) return;
  app.classList.toggle("sidebar-open", open);
};

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

const resizeComposer = () => {
  if (!composer) return;
  composer.style.height = "auto";
  const nextHeight = Math.min(composer.scrollHeight, 200);
  composer.style.height = `${nextHeight}px`;
};

composer?.addEventListener("input", resizeComposer);
window.addEventListener("load", resizeComposer);

initMessages();
