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

## 색상 조합과 날짜 선택

`<NariaProvider theme="dark" palette="modern">`처럼 `palette`를 지정합니다. 시안은 `modern`(절제된 모던), `playful`(선명한 캐주얼)의 두 가지입니다. 각 시안은 blue / teal / green / yellow / orange / red의 기준색 6개와 100·300·500·700·900 다섯 단계로 구성합니다. `palettePresets`로 색상 데이터를, `--nds-palette-orange-500`처럼 CSS 변수로 각 단계를 사용합니다.

**배경과 기본 텍스트 영역은 공통 무채색입니다.** 팔레트는 canvas / surface / raised / subtle / text / border를 덮어쓰지 않습니다. 입력창·코드박스·본문 카드는 중립 표면을 유지하고, 주요 버튼·포커스·선택·카테고리 표시만 컬러를 사용합니다. 상태의 의미 색도 그대로 유지합니다. 밝은 기준색을 버튼 바탕으로 무조건 사용하지 않고, 본문 및 행동 레이블 대비를 만족하는 단계를 선택합니다.

중첩 Provider는 지정하지 않은 theme·palette·density·reducedMotion을 부모로부터 이어받습니다. light/dark는 공통 중립 배경을 전환하며, 팔레트별 배경 틴트를 만들지 않습니다.

```tsx
const [date, setDate] = useState('2026-11-18');
<DatePicker label="예약 날짜" value={date} onValueChange={setDate}
  min="2026-11-01" max="2027-12-31" />
```

DatePicker는 날짜 직접 입력과 디자인 시스템 달력을 연결합니다. 전용 달력은 데스크톱에서 Dialog, 모바일에서 하단 시트로 표시됩니다. 날짜 선택 후 입력값을 갱신하고 열기 버튼으로 포커스를 되돌립니다. `DateRangePicker`는 시작/종료일 입력과 달력의 기간 강조를 연결합니다. `Calendar`는 화면에 항상 펼쳐둘 달력이며 `range={{start,end}}`로 선택 기간을 표시할 수 있습니다.

이 버전의 DatePicker 값 변경 API는 `onValueChange(date)`입니다. 이전 `onChange(event)` 사용 코드는 `onValueChange`로 변경하세요. min/max를 벗어난 직접 입력은 폼 제출 시 네이티브 유효성 검사로 검증하고, 서비스의 업무 규칙은 별도로 검증해야 합니다.

## 패키지 내용

- `dist/index.js`: React·React DOM·Radix Icons를 제외한 ESM 번들
- `dist/*.d.ts`: 공개 컴포넌트와 타입 선언
- `dist/styles.css`: 기본·상태·모션·반응형 스타일, light/dark 토큰, 한국어 서체 포함
- `tokens.json`: 색상·간격·곡률·타입·모션·컨트롤·레이어·브레이크포인트
- `LICENSES.md`: 공식 Radix Icons와 Wanted Sans 고지

문서화된 84개 구성요소 외에 NariaProvider, useNaria, useToast 등의 지원 API를 제공합니다. 컴포넌트의 값과 업무 상태는 소비 화면이 관리합니다. 서비스 API 호출·인증·결제·파일 전송은 포함하지 않습니다.

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
