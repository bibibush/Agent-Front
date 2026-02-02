const stateManager = (() => {
  let currentSessionId: number | null = null;

  return {
    getCurrentSessionId: () => currentSessionId,
    setCurrentSessionId: (sessionId: number | null) => {
      currentSessionId = sessionId;
    },
  };
})();

export const { getCurrentSessionId, setCurrentSessionId } = stateManager;
