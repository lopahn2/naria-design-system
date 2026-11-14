# naria Design System 1.0.1

웹과 모바일웹을 위한 React 디자인 시스템입니다. 기존 디자인 Atlas 40개와 모션 갤러리 82개를 보존하고, 그 위에 실제 사용할 공통 체계를 구성했습니다.

## 이어서 진행한 작업

76개 컴포넌트와 82개 모션을 복구하고, 동적 상태의 키보드 접근성과 이미지 재시도를 보완했습니다. 변경 내용과 추가 검증은 `docs/system/RESUME-v1.0.1.md`를 참고하세요.

## 빠르게 보기

`deliverables/naria-design-system.html`을 브라우저에서 열면 설치나 외부 리소스 요청 없이 문서와 데모를 볼 수 있습니다. 코드 예제와 토큰 JSON도 문서에서 다운로드할 수 있습니다. 파일 URL에서는 브라우저 정책에 따라 클립보드와 저장 기능이 제한될 수 있으므로 개발 서버 실행을 권장합니다.

```sh
npm ci
npm run dev
```

- 기본 화면: `/#system`
- 구성요소: `/#components`
- 실제 화면: `/#patterns`
- 모션 갤러리: `/#motion-lab`
- 이전 탐색판: `/#all`

## 구성

| 영역 | 내용 |
| --- | --- |
| Foundations 9 | 설계 원칙, 색상/테마, 타입, 간격, 반응형, 곡률/깊이, 공식 아이콘, 모션, 접근성 |
| Components 76 | 행동 8, 입력/선택 22, 탐색 9, 표면/콘텐츠 11, 레이어 6, 피드백 8, 데이터 5, 레이아웃 7 |
| Patterns 6 | 가입/동의, 계정/설정, 검색/필터, 데이터 관리, 주문 요약, 대시보드 |
| Resources | React API, 다운로드 가능한 TSX 예제, 토큰 JSON, 패키지, 기존 모션 82개 |

Apple/IBM의 간결한 행동 위계, IBM의 읽기 체계, Toss/Adobe의 입력 구조, Apple의 선택 상태, Toss/Apple의 탐색, IBM의 오류 복구, Vercel/Daangn에서 선호한 절제된 반응을 하나의 독립적인 구현으로 정리했습니다. 디자인을 그대로 복제한 라이브러리가 아닙니다. 보라색은 새 시스템에 사용하지 않고, 공식 Radix Icons와 IBM Plex Sans KR만 사용합니다. 기본은 중립색이며 서비스 강조색을 교체할 수 있습니다.

## 코드 구조

| 경로 | 역할 |
| --- | --- |
| `packages/ui/src/` | 재사용 컴포넌트 원본과 스타일 |
| `packages/ui/tokens.json` | 원시·의미·타입·모션·크기 토큰 |
| `packages/ui/dist/` | ESM, 타입 선언, 내장 서체 CSS |
| `src/system/` | 컴포넌트 문서, 라이브 데모, 6개 화면 패턴 |
| `scripts/build-system-api.mjs` | 실제 export에서 Props와 실행 예제 생성 |
| `scripts/build-system-tokens.mjs` | 토큰과 오프라인 서체 CSS 생성 |
| `src/Root.tsx` | 새 시스템과 기존 탐색판 경로 연결 |
| `motion/`, `references/motion-originals/` | 이전 82개 모션 구현과 원본 |
| `docs/system/` | 설계 결정, 전체 목록, 검증 결과 |

## 빌드·검증

```sh
npm run build            # 모션 + 토큰 + API + 타입 + UI 패키지 + 정적 사이트 + 단일 HTML 3종
npm test                 # 기존 갤러리 및 시스템 논리/렌더/대비 검사
npm run test:examples    # 다운로드 가능한 예제 76개의 TypeScript 검사
npm run build:ui         # UI 패키지만 생성
npm pack ./packages/ui --pack-destination deliverables
```

`dist/`를 정적 호스팅에 배포할 수 있습니다. 단일 HTML에 한국어 서체와 기존 82개 모션을 넣어 문서 번들은 비교적 큽니다. 실제 제품에는 `@naria/ui` 패키지를 사용해 갤러리와 문서 코드를 제외하세요. npm 레지스트리 게시나 공용 웹 배포는 수행하지 않았습니다.

## 상태와 저장

데모 상태는 화면 내부에서만 변경됩니다. 설정 패턴의 저장 예제와 문서 테마·기존 선택 기록은 현재 브라우저 localStorage를 사용합니다. 계정 생성·결제·메일·실제 파일 전송은 하지 않습니다. 데스크톱과 모바일 사이의 서버 동기화는 포함하지 않습니다.

문서와 코드가 원본입니다. Figma 파일은 생성하지 않았습니다. 사용자가 언급한 TDS 파일은 체계와 범위의 참고 예시이며 원본 파일을 가져오거나 동일한 구조라고 주장하지 않습니다. 공개 TDS와 Carbon/WAI-ARIA 문서의 링크는 기반 가이드에 포함했습니다.

실제 검증 범위와 미검증 항목은 `docs/system/VALIDATION.md`, 이전 탐색판의 기록은 `docs/VALIDATION.md`를 참고하세요. 타사 출처·라이선스는 `THIRD_PARTY_NOTICES.md`에 정리했습니다.
