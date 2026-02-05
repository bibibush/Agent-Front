import { ChatMessage, User } from "../features/session/type";

const stateManager = (() => {
  let currentSessionId: number | null = null;
  let messages: ChatMessage[] = [];
  let user: User | null = null;
  const messagesListeners: Array<(messages: ChatMessage[]) => void> = [];

  return {
    getCurrentSessionId: () => currentSessionId,
    setCurrentSessionId: (sessionId: number | null) => {
      currentSessionId = sessionId;
    },
    getMessages: () => messages,
    setMessages: (newMessages: ChatMessage[]) => {
      messages = newMessages;
      messagesListeners.forEach((listener) => listener(messages));
    },
    getUserState: () => user,
    setUser: (newUser: User | null) => {
      user = newUser;
    },
    addMessagesListener: (listener: (messages: ChatMessage[]) => void) => {
      messagesListeners.push(listener);
    },
    removeMessagesListener: (listener: (messages: ChatMessage[]) => void) => {
      const index = messagesListeners.indexOf(listener);
      if (index > -1) {
        messagesListeners.splice(index, 1);
      }
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
  addMessagesListener,
  removeMessagesListener,
} = stateManager;
