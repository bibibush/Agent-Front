# 지원자에게 무엇이든 물어봐! (진행중)

## 소개

> openai api, openai agents sdk를 활용한 ai서비스를 구현했습니다.
>
> 이 웹사이트는 채팅 UI로 구현되어 있고, 에이전트에 채팅을 걸면 stream 방식으로 답변을 내려주는 기능이 구현되어 있습니다.
>
> 프론트엔드는 html, scss, typescript로 구성된 일반적인 ssg 방식의 프로젝트 형태를 띄고 있고, 번들링 라이브러리로는 parcel을 선택했습니다.
>
> 간단한 UI이지만, 아키텍처 적용 학습을 위해 featured-sliced-design (FSD) 패턴을 적용한 프로젝트 구조를 설계 했습니다.
>
> 백엔드는 fastapi와 openai 라이브러리로 구현했습니다.
> 백엔드 구조는 클린 아키텍처를 적용 했습니다.
>
> 백엔드 repo: https://github.com/bibibush/AgentOps

## 사용 기술

- html, css, typescript
- parcel

## 프로젝트 구조

```
.
├─ src/
│  ├─ index.html            # 앱 마크업
│  ├─ styles/
│  │  └─ main.scss          # 전역 스타일
│  └─ scripts/
│     ├─ main.ts            # 엔트리, UI 이벤트 바인딩, ai-chat 초기화
│     ├─ share/
│     │  ├─ api.ts          # 공통 API 요청/스트리밍 유틸 + snake/camel 변환
│     │  ├─ type.ts         # 공통 응답 타입
│     │  └─ var.ts          # 공통 상수
│     └─ features/
│        └─ ai-chat/
│           ├─ index.ts     # 전송 이벤트 연결
│           ├─ hook.ts      # 메시지 전송 흐름(일반/SSE)
│           ├─ api.ts       # AI 응답 API 호출
│           ├─ ui.ts        # 채팅 UI 렌더링/스트리밍 표시
│           └─ type.ts      # AI 요청 타입 정의
└─ package.json
```

## 핵심 로직

<details>
  <summary><b>FSD 패턴 적용</b></summary>

### 1) FSD 패턴: 공통 로직과 채팅 로직 분리

- `src/scripts/share`: 전역 비즈니스 로직(공통 타입/요청/상수)
- `src/scripts/features/ai-chat`: 채팅 도메인 로직(API 호출, UI 렌더링)

### 2) 공통 요청 유틸 (camelCase ↔ snake_case)

`src/scripts/share/api.ts` 에서 요청은 `snake_case`, 응답은 `camelCase` 로 자동 변환하도록 fetch 를 감쌉니다.

```ts
export const requestAPI = async <T>(
  url: string,
  { method = "GET", params, body, headers }: RequestApiOptions = {},
): Promise<T> => {
  const requestUrl = new URL(url, window.location.origin);

  if (params) {
    const snakeParams = _camelToSnakeDeep(params) as JsonObject;
    Object.entries(snakeParams).forEach(([key, value]) => {
      requestUrl.searchParams.set(key, String(value));
    });
  }

  const hasBody = body !== undefined && body !== null;
  const requestBody = hasBody
    ? JSON.stringify(_camelToSnakeDeep(body))
    : undefined;

  const response = await fetch(requestUrl.toString(), {
    method,
    headers,
    body: requestBody,
  });

  const data = (await response.json()) as T;
  return _snakeToCamelDeep(data);
};
```

### 3) 채팅 도메인 API 호출

`src/scripts/features/ai-chat/api.ts` 에서는 위 공통 요청 유틸을 가져와 실제 요청 함수를 구성합니다.

```ts
import { requestAPI, requestStreamingAPI } from "../../share/api";
import { OPENAI_RESPONSE_PREFIX } from "../../share/var";

export async function getOpenaiResponse(data: OpenAIResponseAPIModel) {
  const response = await requestAPI<ResponseAPI<string>>(
    `http://localhost:8000/${OPENAI_RESPONSE_PREFIX}/text`,
    { method: "POST", body: data },
  );
  return response;
}

export async function* getOpenaiResponseSSE(data: OpenAIResponseAPIModel) {
  const stream = requestStreamingAPI(
    `http://localhost:8000/${OPENAI_RESPONSE_PREFIX}/sse`,
    { method: "POST", body: data },
  );

  for await (const chunk of stream) {
    yield chunk;
  }
}
```

### 4) 동적 채팅 UI 관리

`src/scripts/features/ai-chat/ui.ts` 에서 사용자/AI 메시지를 DOM 으로 생성하고,
스트리밍 응답은 동일한 엘리먼트를 갱신합니다.

```ts
export const sendMessageUI = () => {
  const composer =
    document.querySelector<HTMLTextAreaElement>("[data-composer]");
  const messagesContainer = document.querySelector(".messages");

  const text = composer?.value.trim();
  if (!text || !messagesContainer || !composer) return;

  const message = document.createElement("article");
  message.className = "message user";
  message.innerHTML = `
    <div class="message-meta">
      <span class="badge">나</span>
    </div>
    <div class="message-body">
      <p style="white-space: pre-wrap;">${text}</p>
    </div>
  `;

  messagesContainer.appendChild(message);
  message.scrollIntoView({ behavior: "smooth" });

  composer.value = "";
  composer.style.height = "auto";
};

export const receiveMessageSSE = (text: string, done = false) => {
  const messagesContainer = document.querySelector(".messages");
  if (!messagesContainer) return;

  let message = messagesContainer.querySelector<HTMLElement>(
    "[data-ai-streaming='true']",
  );

  if (!message) {
    message = document.createElement("article");
    message.className = "message assistant";
    message.dataset.aiStreaming = "true";
    message.innerHTML = `
      <div class="message-meta">
        <span class="badge">AI</span>
      </div>
      <div class="message-body">
        <p style="white-space: pre-wrap;"></p>
      </div>
    `;

    messagesContainer.appendChild(message);
  }

  const body = message.querySelector("p");
  if (body) body.textContent = text;

  if (done) {
    delete message.dataset.aiStreaming;
  }
};
```

### 5) 타입 정의 분리

- `src/scripts/share/type.ts`: 백엔드 응답에 대한 공통 데이터 모델
- `src/scripts/features/ai-chat/type.ts`: OpenAI 요청에 필요한 데이터 모델

```ts
// src/scripts/share/type.ts
export interface ResponseAPI<T> {
  statusCode: number;
  message: string;
  data: T;
}
```

```ts
// src/scripts/features/ai-chat/type.ts
export interface OpenAIResponseAPIModel {
  model: string;
  input: Array<Record<string, unknown>> | string;
  instructions?: string;
  stream?: boolean;
  tools?: OpenAIToolsModel[];
}
```

<details>
  <summary><b>스트리밍 응답 구현</b></summary>

### 스트리밍 응답 구현

`src/scripts/share/api.ts` 의 `requestStreamingAPI` 는 FastAPI 의 `data: {chunk}\n\n` 형식을
라인 단위로 파싱해 `AsyncGenerator` 로 전달합니다.

```ts
const reader = response.body?.getReader();
const decoder = new TextDecoder();

if (!reader) {
  throw new Error("Response body is null");
}

let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const data = line.slice(6);
      yield data;
    }
  }
}
```

이 함수는 `src/scripts/features/ai-chat/api.ts` 의 SSE 호출에서 사용됩니다.

```ts
export async function* getOpenaiResponseSSE(data: OpenAIResponseAPIModel) {
  const stream = requestStreamingAPI(
    `http://localhost:8000/${OPENAI_RESPONSE_PREFIX}/sse`,
    { method: "POST", body: data },
  );

  for await (const chunk of stream) {
    yield chunk;
  }
}
```

그리고 `src/scripts/features/ai-chat/hook.ts` 에서 스트리밍 결과를 받아 UI 를 갱신합니다.

```ts
const stream = getOpenaiResponseSSE({
  model: "gpt-5.2",
  input: text,
  stream: true,
});

let aiResponse = "";

for await (const chunk of stream) {
  aiResponse += chunk;
  receiveMessageSSE(aiResponse);
}

receiveMessageSSE(aiResponse, true);
```

</details>
