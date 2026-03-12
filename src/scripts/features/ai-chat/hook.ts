import { getOpenaiResponse, getOpenaiResponseSSE } from "./api";
import { receiveMessage, receiveMessageSSE, sendMessageUI } from "./ui";
import {
  getCurrentSessionId,
  getUserState,
  setCurrentSessionId,
} from "../../share/state";
import { renderSessions } from "../session/hook";

const IS_DEV = process.env.NODE_ENV !== "production";

let pendingImageFile: File | null = null;

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.slice(dataUrl.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

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
      mode: "architecture",
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

  const imageFile = pendingImageFile;

  sendMessageUI();

  if (imageFile) {
    document
      .querySelector<HTMLButtonElement>("[data-image-preview-remove]")
      ?.click();
  }

  try {
    const sessionId = getCurrentSessionId();
    const isNewSession = sessionId === null;

    const input = imageFile
      ? await fileToBase64(imageFile).then((base64) => [
          {
            role: "user",
            content: [
              { type: "input_text", text },
              {
                type: "input_image",
                image_url: `data:${imageFile.type};base64,${base64}`,
              },
            ],
          },
        ])
      : text;

    const stream = getOpenaiResponseSSE({
      model: "gpt-5.3-chat-latest",
      input,
      stream: true,
      mode: "frontend",
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
  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const composerInput = document.querySelector<HTMLElement>(
    "[data-composer-input]",
  );
  const preview = document.querySelector<HTMLElement>("[data-image-preview]");
  const previewImage = document.querySelector<HTMLImageElement>(
    "[data-image-preview-img]",
  );
  const previewRemoveButton = document.querySelector<HTMLButtonElement>(
    "[data-image-preview-remove]",
  );
  let previewUrl: string | null = null;

  const syncComposerResize = () => {
    composer?.dispatchEvent(new Event("input"));
  };

  const clearPreview = () => {
    pendingImageFile = null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }

    if (previewImage) {
      previewImage.removeAttribute("src");
    }

    preview?.setAttribute("hidden", "");
    composerInput?.classList.remove("has-image-preview");

    if (fileInput) {
      fileInput.value = "";
    }

    syncComposerResize();
  };

  const handleUploadTriggerClick = () => {
    if (!fileInput) return;
    fileInput.value = "";
    fileInput.click();
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const isSupportedImage =
      file.type === "image/jpeg" || file.type === "image/png";

    if (!isSupportedImage) {
      if (IS_DEV) {
        console.warn("Unsupported image file type:", file.type);
      }
      target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }

    pendingImageFile = file;

    const objectUrl = URL.createObjectURL(file);
    previewUrl = objectUrl;

    if (previewImage) {
      previewImage.src = objectUrl;
    }
    preview?.removeAttribute("hidden");
    composerInput?.classList.add("has-image-preview");
    syncComposerResize();

    if (IS_DEV) console.log("Selected image:", file.name);
  };

  const handlePreviewRemoveClick = () => {
    clearPreview();
  };

  uploadTrigger?.addEventListener("click", handleUploadTriggerClick);
  fileInput?.addEventListener("change", handleFileChange);
  previewRemoveButton?.addEventListener("click", handlePreviewRemoveClick);

  return () => {
    clearPreview();
    uploadTrigger?.removeEventListener("click", handleUploadTriggerClick);
    fileInput?.removeEventListener("change", handleFileChange);
    previewRemoveButton?.removeEventListener("click", handlePreviewRemoveClick);
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
