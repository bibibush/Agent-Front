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

export const useImageUpload = () => {
  const uploadTrigger = document.querySelector<HTMLElement>(
    "[data-image-upload-trigger]",
  );
  const fileInput = document.querySelector<HTMLInputElement>(
    "[data-image-file-input]",
  );

  const handleUploadTriggerClick = () => {
    if (!fileInput) return;
    fileInput.value = "";
    fileInput.click();
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (IS_DEV) console.log("Selected image:", file.name);
  };

  uploadTrigger?.addEventListener("click", handleUploadTriggerClick);
  fileInput?.addEventListener("change", handleFileChange);

  return () => {
    uploadTrigger?.removeEventListener("click", handleUploadTriggerClick);
    fileInput?.removeEventListener("change", handleFileChange);
  };
};

/**
 * 드롭다운 토글 훅
 * 드롭다운 메뉴 열기/닫기 기능과 이벤트 리스너를 관리합니다
 */
export const useDropdown = () => {
  const trigger = document.querySelector("[data-dropdown-trigger]");
  const menu = document.querySelector("[data-dropdown-menu]");

  const setDropdownOpen = (open: boolean) => {
    if (!menu) return;
    menu.classList.toggle("active", open);
  };

  // 드롭다운 토글 핸들러
  const handleTriggerClick = (event: Event) => {
    event.stopPropagation();
    const isOpen = menu?.classList.contains("active");
    setDropdownOpen(!isOpen);
  };

  // 외부 클릭 핸들러
  const handleOutsideClick = (event: Event) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest("[data-dropdown-trigger]") &&
      !target.closest("[data-dropdown-menu]")
    ) {
      setDropdownOpen(false);
    }
  };

  // ESC 키 핸들러
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  // 이벤트 리스너 등록
  trigger?.addEventListener("click", handleTriggerClick);
  document.addEventListener("click", handleOutsideClick);
  window.addEventListener("keydown", handleKeydown);

  // 클린업 함수 반환
  return () => {
    trigger?.removeEventListener("click", handleTriggerClick);
    document.removeEventListener("click", handleOutsideClick);
    window.removeEventListener("keydown", handleKeydown);
  };
};
