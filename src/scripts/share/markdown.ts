import { marked } from "marked";
import DOMPurify from "dompurify";

// marked 전역 설정
marked.setOptions({
  breaks: true, // \n을 <br>로 변환
  gfm: true, // GitHub Flavored Markdown
});

/**
 * 마크다운 텍스트를 안전한 HTML로 변환
 * @param markdown - 변환할 마크다운 텍스트
 * @returns 새니타이즈된 HTML 문자열
 */
export const renderMarkdown = (markdown: string): string => {
  if (!markdown) return "";

  try {
    // 마크다운을 HTML로 변환
    const rawHtml = marked.parse(markdown) as string;

    // XSS 방지를 위한 새니타이징
    const safeHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "del",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "blockquote",
        "pre",
        "code",
        "a",
        "hr",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class"],
      ALLOW_DATA_ATTR: false,
    });

    return safeHtml;
  } catch (error) {
    console.error("Markdown rendering error:", error);
    // 오류 발생 시 원본 텍스트를 이스케이프하여 반환
    const div = document.createElement("div");
    div.textContent = markdown;
    return div.innerHTML;
  }
};
