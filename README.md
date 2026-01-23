# 지원자에게 무엇이든 물어봐! (진행중)

## 소개

> openai api, openai agents sdk를 활용한 ai서비스를 구현했습니다.
>
> 이 웹사이트는 채팅 UI로 구현되어 있고, 에이전트에 채팅을 걸면 stream 방식으로 답변을 내려주는 > 기능이 구현되어 있습니다.
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
