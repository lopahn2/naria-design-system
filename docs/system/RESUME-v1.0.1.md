# v1.0.1 · 작업 재개 기록

마지막 저장본 `naria-design-system-v1.0.zip`에서 전체 소스·빌드·설치 패키지를 복구했습니다. 이전 macOS 작업 경로와 localhost 서버 대신 현재 작업 환경에서 문서를 실행했습니다. 76개 구성요소, 9개 기반 규칙, 6개 패턴, 기존 82개 모션의 범위는 유지합니다.

## 변경

| 항목 | 재현된 문제 | 수정 |
| --- | --- | --- |
| Tabs | 선택된 항목이 목록에서 사라지면 남은 탭이 모두 tabindex=-1 | 첫 활성 탭에 키보드 진입점 유지. 값 변경은 사용자가 선택할 때 콜백으로 전달 |
| Tree | 현재 노드가 제거되면 키보드로 다시 들어갈 수 없음 | 남은 선택 노드 또는 첫 노드로 진입점 복구 |
| Tree 의미 구조 | 펼쳐진 일부 노드만 DOM에 있고 형제 순서·전체 수 누락 | aria-posinset, aria-setsize 추가 |
| Avatar | 이미지 실패 후 src가 바뀌어도 이름 대체 상태에 고정 | 실패한 주소를 따로 기억하여 새 주소는 로딩 재시도 |
| Combobox | 첫 옵션이 비활성인데도 처음 활성 후보로 표시 | 첫 사용 가능한 후보로 이동, Enter 선택 가능 |

이 5개 조건을 먼저 테스트로 재현해 실패를 확인하고 수정 후 같은 검사에서 통과시켰습니다. Tree의 의미 구조는 [W3C Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)을 참고했습니다.

## 추가 검증

- DOM 회귀 테스트 5개: 수정 전 5개 실패 → 수정 후 5개 통과.
- 브라우저 직접 조작: 탭 삭제 후 Tab 진입과 Enter 선택, 노드 삭제 후 Tab 진입, 실패한 이미지의 새 주소 로딩(naturalWidth=1), 첫 옵션 비활성 Combobox의 Enter 선택을 확인했습니다.
- axe-core 자동 검사: 76개 컴포넌트 + 6개 패턴 × light/dark = **164건에서 위반 0건**. 각 예제 영역을 대상으로 WCAG 2 A/AA, 2.1 AA, 2.2 AA 태그 규칙을 실행했습니다. 닫힌 오버레이 내부·모든 조작 상태·문서 사이트 전체를 전수검사한 뜻은 아닙니다.
- `npm run build`: 타입 검사, UI 패키지 빌드, 82개 모션 빌드, 문서 및 독립 HTML 3개 생성 완료.
- `npm test`: 기존 11개 + 새 회귀 테스트 5개, **16/16 통과**.
- `npm run test:examples`: 다운로드 가능한 컴포넌트 예제 **76/76 타입 검사 통과**.
- `npm pack ./packages/ui --pack-destination deliverables`: `naria-ui-1.0.1.tgz` 생성 완료.
- 접근성 검사 원본: [accessibility-audit-v1.0.1.json](./accessibility-audit-v1.0.1.json).

## 재현

```sh
npm ci
npm run build
npm test
npm run test:examples
npm run dev
```

개발 서버에서 `/tests/browser/audit.html`을 열면 접근성 검사가 자동 실행됩니다. 결과 JSON 다운로드가 가능합니다. `/tests/browser/regressions.html`은 동적 상태의 수동 재현 화면입니다. 테스트 페이지는 Vite의 기본 정적 제품 빌드에 포함되지 않습니다.

이 환경에서는 별도 headless Chromium 프로세스 실행이 제한되어 제공된 브라우저 안에서 검사기를 실행했습니다. 실기기 iOS/Android와 VoiceOver/TalkBack/NVDA, 실제 브라우저 200% 확대 검증은 여전히 별도입니다. 자동 검사 통과는 제품 전체의 접근성 인증을 의미하지 않습니다.

## 다음 작업의 시작점

현재 버전은 재사용 패키지 @naria/ui 1.0.1입니다. 이후에는 실제 제품 한 화면에 연결해 서비스 색상·데이터 길이·비동기 저장·권한 상태를 검증할 수 있습니다. Figma 문서, 공용 사이트 배포, 실제 서비스 API는 이번 재개 작업에서 새로 생성하지 않았습니다.

## 추가 수정 · 검색 입력창 포커스

검색 아이콘을 포함한 바깥 프레임의 focus-within 표시와 내부 input의 focus-visible outline이 겹치던 문제를 수정했습니다. 복합 입력창은 바깥 프레임에만 포커스 테두리를 표시합니다. 지우기·비밀번호 보기 같은 내부 버튼과 단독 textarea/select의 키보드 포커스 표시는 유지합니다. 강제 색상 모드에서는 그림자 대신 바깥 outline을 사용하도록 스타일을 추가했습니다.

- 브라우저에서 수정 전 내부 outline 2px와 바깥 테두리/그림자 중복을 재현했습니다.
- 수정 후 내부 outline이 none이고 바깥 포커스 표시가 남는 것을 확인했습니다.
- 검색어 입력, Tab으로 지우기 버튼 이동, 버튼 포커스 표시, 검색어 삭제를 확인했습니다.
- 390px 화면 너비에서 가로 넘침과 겹치는 테두리가 없는 것을 확인했습니다. 실제 모바일 기기 검증은 아닙니다.
- npm run build 통과, 독립 HTML 3종과 UI 설치 패키지 재생성. 이 CSS 수정에 대해 기존 16개 테스트와 164개 접근성 검사를 재실행한 것은 아닙니다. 강제 색상 모드는 코드로 대응했으며 실제 OS 환경은 미검증입니다.
