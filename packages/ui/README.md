# @naria/ui 1.0.1

React 19 + TypeScript용 웹·모바일웹 컴포넌트 패키지입니다. 문서 사이트와 동일한 원본을 사용합니다. npm registry에는 게시하지 않았습니다.

## 설치

```sh
npm install ./naria-ui-1.0.1.tgz
npm install react react-dom @radix-ui/react-icons
```

```tsx
import {useState} from 'react';
import {NariaProvider, ToastProvider, TextField, Button, useToast} from '@naria/ui';
import '@naria/ui/styles.css';

function Profile() {
  const [name, setName] = useState('');
  const notify = useToast();
  return <>
    <TextField label="이름" value={name} onChange={e => setName(e.target.value)} />
    <Button onClick={() => notify({title: `${name} 님의 입력을 확인했어요.`})}>확인</Button>
  </>;
}
export function App() {
  return <NariaProvider theme="light" density="comfortable">
    <ToastProvider><Profile /></ToastProvider>
  </NariaProvider>;
}
```

`NariaProvider`가 CSS 토큰·색상·밀도·모션 환경을 제공합니다. Provider 밖의 요소에는 이 스타일이 적용되지 않습니다. `theme`은 light/dark, `density`는 comfortable/compact입니다. `reducedMotion`을 켜거나 운영체제에서 모션 감소를 설정하면 움직임을 줄입니다. OS 설정을 강제로 무시하지 않습니다.

서비스 색상은 `accent={{color:'#086d72',soft:'#e2f4f1'}}` 또는 CSS 변수를 통해 바꿀 수 있습니다. 라이트/다크에 맞는 대비를 서비스가 확인해야 합니다. 기본 색의 검증 결과를 사용자 정의 테마에 그대로 적용하지 마세요.

## 패키지 내용

- `dist/index.js`: React·React DOM·Radix Icons를 제외한 ESM 번들
- `dist/*.d.ts`: 공개 컴포넌트와 타입 선언
- `dist/styles.css`: 기본·상태·모션·반응형 스타일, light/dark 토큰, 한국어 서체 포함
- `tokens.json`: 색상·간격·곡률·타입·모션·컨트롤·레이어·브레이크포인트
- `LICENSES.md`: 공식 Radix Icons와 IBM Plex Sans KR 고지

문서화된 76개 구성요소 외에 NariaProvider, useNaria, useToast 등의 지원 API를 제공합니다. 컴포넌트의 값과 업무 상태는 소비 화면이 관리합니다. 서비스 API 호출·인증·결제·파일 전송은 포함하지 않습니다.

## 반응형 계약

| 범위 | 기본 동작 |
| --- | --- |
| 320–599px | 한 열 양식, 표를 카드 목록으로 전환, responsive Dialog를 하단 시트로 전환 |
| 600–899px | 콘텐츠 기준 자동 그리드, 태블릿 간격 |
| 900–1199px | 넓은 콘텐츠와 사이드 탐색 조합 |
| 1200px 이상 | 컨테이너 최대 너비 1200px, 화면 패턴의 다열 배치 |

컴포넌트가 자동으로 서비스 전체 내비게이션을 바꾸지는 않습니다. 작은 화면에서는 SideNavigation을 Drawer에 넣는 등의 화면 조합이 필요합니다. BottomNavigation과 BottomCTA의 고정 위치도 화면이 결정합니다. 터치 입력에서는 작은 버튼도 최소 높이 44px로 확대합니다.

## 접근성·브라우저

- 네이티브 button/input/select/radio/range/date/time과 dialog를 우선 사용합니다.
- Tabs·Combobox·Menu·Tree·Calendar에는 별도 키보드 규칙이 있습니다. 문서의 각 구성요소에 설명합니다.
- Dialog는 showModal(), 배경 스크롤 잠금, Escape, 트리거 포커스 복귀를 사용합니다. Popover는 비모달입니다.
- 포커스 표시, 상태 live region, 오류 연결, 모션 감소를 포함합니다.
- Clipboard API는 HTTPS 또는 localhost에서 사용하며, 실패 시 오류를 표시합니다.
- 최신 Chromium/Safari/Firefox의 CSS color-mix, container queries, native dialog 지원을 전제로 합니다. 이번 검증은 제공된 Chromium 브라우저에서 수행했습니다. 실제 iOS/Android 및 보조기술 검증은 별도입니다.

## 범위

일반 제품 UI의 기반과 조합 패턴을 제공합니다. 고급 차트·지도·리치 텍스트 편집기·가상화 대용량 그리드는 별도 전문 라이브러리를 결합하세요. 문서 사이트의 기존 82개 모션 원본은 이 재사용 패키지에 포함하지 않습니다. 해당 비교 갤러리의 원본별 라이선스는 루트 THIRD_PARTY_NOTICES.md를 확인하세요.
