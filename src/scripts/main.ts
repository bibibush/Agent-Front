import { initAiChat } from "./features/ai-chat";
import { initSession } from "./features/session";
import { useComposerResize, useSidebar, useDropdown } from "./share/hooks";

// Composer 자동 리사이즈 초기화
useComposerResize();

// 사이드바 기능 초기화
useSidebar();

// 드롭다운 기능 초기화
useDropdown();

// 세션 기능 초기화
const sessionContainer = document.querySelector<HTMLElement>("[data-session-list]");
if (sessionContainer) {
  initSession(sessionContainer);
}

// AI 채팅 기능 초기화
initAiChat();
