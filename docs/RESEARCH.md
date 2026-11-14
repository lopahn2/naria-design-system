# 조사 기록과 적용 범위

확인일: 2026-11-14

## 근거의 구분

공식 문서에서 확인한 원칙, 원문 진입점만 확인한 자료, 독립적으로 재해석한 UI를 구분했습니다. 전체 인터넷·비공개 디자인 시스템·모든 하위 문서를 완독했다는 주장은 하지 않습니다. 샘플의 픽셀 값은 원본 서비스의 측정값이 아닙니다.

## 주요 출처

| 출처 | 읽은 범위 / 다음 단계 |
| --- | --- |
| [OpenAI UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines.md), [Apps SDK UI](https://github.com/openai/apps-sdk-ui) | 공식 UI 가이드와 README. ChatGPT 내부 UI용 원칙을 독립 웹에 그대로 강제하지 않음. 컴포넌트 전체 소스 감사는 미수행. |
| [Apple HIG](https://developer.apple.com/design/human-interface-guidelines) | 개요·원칙·색·레이아웃·재질·타이포·아이콘·접근성·버튼·입력·시트·탭의 주요 지침. 플랫폼별 전체 HIG, 전체 SF Symbols, 모든 부속 문서는 검토하지 않음. motion.md는 접근 실패. |
| [Toss TDS](https://tossmini-docs.toss.im/tds-mobile/) | 공식 소개와 시작·마이그레이션 가이드. 개별 컴포넌트 페이지 접근 일부 실패. 수치·폰트·브랜드 에셋을 추정해 복제하지 않음. |
| [당근 SEED](https://seed-design.io/get-started) | 소개, Foundations와 React 진입점. 색·타이포·상태·피드백으로 연결되는 분류 참고. |
| [Adobe Spectrum](https://spectrum.adobe.com/page/design-tokens/) | 의미 중심의 디자인 토큰 구조. |
| [IBM Carbon](https://www.carbondesignsystem.com/building-blocks/foundations/accessibility/overview) | 공식 접근성 지침. |
| [Radix](https://www.radix-ui.com/primitives/docs/overview/accessibility), [W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/) | 키보드·포커스·명시적 이름·네이티브 의미, 패턴 종류. |
| [Fluent 2](https://fluent2.microsoft.design/), [Atlassian](https://atlassian.design/) | 공식 개요와 관련 자료 인덱스. 상세 컴포넌트 연구는 선택 후 심화. |
| [Polaris](https://shopify.dev/docs/api/polaris) | 현행 공식 개요. 현행 Web Components를 React 라이브러리라고 표기하지 않음. |
| [Material 3](https://m3.material.io/), [Uber Base](https://base.uber.com/) | 공식 사이트 주소는 확인했으나 본문 자동 열람이 제한됨. 세부 규격을 확정 근거로 사용하지 않음. |
| [NAVER D2](https://d2.naver.com/helloworld/3442203) | 기술 발표 진입점 확인, 본문 열람 제한. 내부 시스템 규칙 미확정. |
| [Kakao 로그인 디자인 가이드](https://developers.kakao.com/docs/ko/kakaologin/design-guide) | 로그인 버튼 적용 지침만 확인. 카카오 전체 DS 공개 문서로 간주하지 않음. |

## DesignBookmark

[skills 목록](https://designbookmark.com/skills)의 50개 항목 전체를 확인하고, 각 항목의 SKILL.md 47개와 저장소 README 3개를 가져와 역할과 핵심 항목을 검토했습니다. 상세 참조 파일과 연결된 외부 문서를 재귀적으로 모두 읽지는 않았습니다. 파일별 URL·SHA·유형은 `references/skill-review-manifest.json`에 있습니다.

50개를 동시에 설치하거나 실행한 것이 아닙니다. 방향 설정 / 비교 / 검토 / 모션 / 플랫폼 / 그래픽으로 역할을 분류했습니다. 예를 들어 모션 추가와 모션 제거 지침은 사용 빈도와 목적에 따라 결정해야 하므로 하나의 스타일 규칙으로 무조건 합치지 않습니다.

## 인수인계 원본

- design-work-handoff.zip
- design-reference-atlas.zip

파일 존재는 확인했지만 실행 환경의 외부 다운로드 제한으로 원본을 읽지 못했습니다. 이 탐색판은 해당 ZIP 내용을 근거로 하지 않습니다. 원본이 현재 프로젝트 폴더에 제공되면 구조와 누락 자료를 대조할 수 있습니다.

## 독립적인 샘플 구현

폰트는 플랫폼 시스템 폰트, 아이콘은 Lucide를 사용합니다. Apple 전용 폰트나 SF Symbols, 토스·카카오·네이버 로고/독점 자산을 복사하지 않았습니다. 참고 출처 표시는 원칙의 배경을 가리키며, 공식 서비스와 동일한 UI라는 뜻이 아닙니다.
