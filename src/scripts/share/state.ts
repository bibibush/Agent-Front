const stateManager = (() => {
  let currentSessionId: number | null = null;
  let isNewSession: boolean = true;

  return {
    getCurrentSessionId: () => currentSessionId,
    setCurrentSessionId: (sessionId: number) => {
      currentSessionId = sessionId;
    },
    getIsNewSession: () => isNewSession,
    setIsNewSession: (newSession: boolean) => {
      isNewSession = newSession;
    },
  };
})();

export const {
  getCurrentSessionId,
  setCurrentSessionId,
  getIsNewSession,
  setIsNewSession,
} = stateManager;
