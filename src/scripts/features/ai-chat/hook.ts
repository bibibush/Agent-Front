import { getOpenaiResponse } from "./api";
import { receiveMessage, sendMessageUI } from "./ui";

export const useSendMessage = async () => {
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
  }
};
