import { getOpenaiResponse, getOpenaiResponseSSE } from "./api";
import { receiveMessage, receiveMessageSSE, sendMessageUI } from "./ui";
import { getCurrentSessionId, setCurrentSessionId } from "./state";

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

export const useSendMessageSSE = async (sessionId?: number) => {
  if (IS_DEV) console.time("ai-chat-response-sse");

  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const text = composer?.value.trim();

  if (!text) return;

  sendMessageUI();

  try {
    const stream = getOpenaiResponseSSE({
      model: "gpt-5.2",
      input: text,
      stream: true,
      sessionId,
    });

    let aiResponse = "";

    for await (const event of stream) {
      if (event.type === "session") {
        setCurrentSessionId(event.data);
        if (IS_DEV) console.log("Session ID received:", event.data);
      } else {
        aiResponse += event.data;
        receiveMessageSSE(aiResponse);
      }
    }

    receiveMessageSSE(aiResponse, true);
  } catch (error) {
    console.error("Failed to get AI response via SSE:", error);
    receiveMessage("죄송합니다. 응답을 받는 중 오류가 발생했습니다.");
  } finally {
    if (IS_DEV) console.timeEnd("ai-chat-response-sse");
  }
};
