import { initAiChat } from "./features/ai-chat";
import { useComposerResize, useSidebar } from "./share/hooks";

// Composer 자동 리사이즈 초기화
useComposerResize();

// 사이드바 기능 초기화
useSidebar();

// AI 채팅 기능 초기화
initAiChat();
