/**
 * Composer 자동 리사이즈 훅
 * textarea 높이를 내용에 따라 자동으로 조정합니다 (최대 200px)
 */
export const useComposerResize = () => {
  const composer = document.querySelector<HTMLTextAreaElement>("[data-composer]");

  const resizeComposer = () => {
    if (!composer) return;
    composer.style.height = "auto";
    const nextHeight = Math.min(composer.scrollHeight, 200);
    composer.style.height = `${nextHeight}px`;
  };

  // 이벤트 리스너 등록
  composer?.addEventListener("input", resizeComposer);
  window.addEventListener("load", resizeComposer);

  // 클린업 함수 반환
  return () => {
    composer?.removeEventListener("input", resizeComposer);
    window.removeEventListener("load", resizeComposer);
  };
};

/**
 * 사이드바 토글 훅
 * 사이드바 열기/닫기 기능과 이벤트 리스너를 관리합니다
 */
export const useSidebar = () => {
  const app = document.querySelector("[data-app]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const scrim = document.querySelector("[data-scrim]");

  const setSidebarOpen = (open: boolean) => {
    if (!app) return;
    app.classList.toggle("sidebar-open", open);
  };

  // 메뉴 토글 핸들러
  const handleMenuToggle = () => {
    setSidebarOpen(true);
  };

  // 스크림 클릭 핸들러
  const handleScrimClick = () => {
    setSidebarOpen(false);
  };

  // ESC 키 핸들러
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setSidebarOpen(false);
    }
  };

  // 이벤트 리스너 등록
  menuToggle?.addEventListener("click", handleMenuToggle);
  scrim?.addEventListener("click", handleScrimClick);
  window.addEventListener("keydown", handleKeydown);

  // 클린업 함수 반환
  return () => {
    menuToggle?.removeEventListener("click", handleMenuToggle);
    scrim?.removeEventListener("click", handleScrimClick);
    window.removeEventListener("keydown", handleKeydown);
  };
};
