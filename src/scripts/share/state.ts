import { ChatMessage, User } from "../features/session/type";

const stateManager = (() => {
  let currentSessionId: number | null = null;
  let messages: ChatMessage[] = [];
  let user: User | null = null;

  return {
    getCurrentSessionId: () => currentSessionId,
    setCurrentSessionId: (sessionId: number | null) => {
      currentSessionId = sessionId;
    },
    getMessages: () => messages,
    setMessages: (newMessages: ChatMessage[]) => {
      messages = newMessages;
    },
    getUserState: () => user,
    setUser: (newUser: User | null) => {
      user = newUser;
    },
  };
})();

export const {
  getCurrentSessionId,
  setCurrentSessionId,
  getMessages,
  setMessages,
  getUserState,
  setUser,
} = stateManager;
