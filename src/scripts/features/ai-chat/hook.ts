import { getOpenaiResponse } from "./api";
import { receiveMessage, sendMessageUI } from "./ui";

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
    });

    receiveMessage(response.data);
  } catch (error) {
    console.error("Failed to get AI response:", error);
    receiveMessage("죄송합니다. 응답을 받는 중 오류가 발생했습니다.");
  } finally {
    if (IS_DEV) console.timeEnd("ai-chat-response");
  }
};
