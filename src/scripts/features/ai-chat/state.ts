let currentSessionId: string | null = null;

export const getCurrentSessionId = () => currentSessionId;
export const setCurrentSessionId = (sessionId: string) => {
  currentSessionId = sessionId;
};
