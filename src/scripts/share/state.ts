import { ChatMessage } from "../features/session/type";

const stateManager = (() => {
  let currentSessionId: number | null = null;
  let messages: ChatMessage[] = [];

  return {
    getCurrentSessionId: () => currentSessionId,
    setCurrentSessionId: (sessionId: number | null) => {
      currentSessionId = sessionId;
    },
    getMessages: () => messages,
    setMessages: (newMessages: ChatMessage[]) => {
      messages = newMessages;
    },
  };
})();

export const {
  getCurrentSessionId,
  setCurrentSessionId,
  getMessages,
  setMessages,
} = stateManager;
