export const categories = [
  { id: "actions", label: "행동", en: "Actions" },
  { id: "forms", label: "입력과 선택", en: "Forms & selection" },
  { id: "navigation", label: "탐색", en: "Navigation" },
  { id: "surfaces", label: "표면과 콘텐츠", en: "Surfaces" },
  { id: "overlays", label: "레이어", en: "Overlays" },
  { id: "feedback", label: "상태와 피드백", en: "Feedback" },
  { id: "data", label: "데이터", en: "Data display" },
  { id: "layout", label: "레이아웃", en: "Layout & type" },
] as const;
export type Category = (typeof categories)[number]["id"];
type Entry = [string, string, string, Category, string, string];
const entries: Entry[] = [
  [
    "button",
    "Button",
    "버튼",
    "actions",
    "명확한 위계와 짧은 눌림으로 다음 행동을 안내합니다.",
    "Primary · Secondary · Outline · Ghost · Danger / S · M · L",
  ],
  [
    "icon-button",
    "IconButton",
    "아이콘 버튼",
    "actions",
    "공간이 제한된 곳에서 이름이 있는 단일 행동을 제공합니다.",
    "Ghost · Outline · Primary / S · M · L",
  ],
  [
    "link",
    "Link",
    "링크",
    "actions",
    "페이지나 외부 문서로 이동하는 목적지를 드러냅니다.",
    "내부 링크 · 새 창 링크",
  ],
  [
    "button-group",
    "ButtonGroup",
    "버튼 그룹",
    "actions",
    "관련 행동을 같은 위계와 간격으로 묶습니다.",
    "수평 · 줄바꿈 / 주 행동 + 보조 행동",
  ],
  [
    "split-button",
    "SplitButton",
    "분할 버튼",
    "actions",
    "기본 행동과 대체 행동의 메뉴를 나란히 둡니다.",
    "기본 실행 · 메뉴 열림 · 비활성",
  ],
  [
    "toggle-button",
    "ToggleButton",
    "토글 버튼",
    "actions",
    "반복해서 켜고 끌 수 있는 상태를 유지합니다.",
    "선택 전 · 선택 후 · 비활성",
  ],
  [
    "copy-button",
    "CopyButton",
    "복사 버튼",
    "actions",
    "클립보드 쓰기 결과를 실제 성공 여부에 맞게 알립니다.",
    "기본 · 복사됨 · 권한 실패",
  ],
  [
    "hold-button",
    "HoldButton",
    "길게 누르기",
    "actions",
    "의도적인 확인이 필요한 행동에 진행률과 취소 여지를 줍니다.",
    "대기 · 누르는 중 · 중단 · 확인 완료",
  ],
  [
    "field",
    "Field",
    "필드 구조",
    "forms",
    "라벨·입력·도움말·오류의 순서를 일관되게 만듭니다.",
    "필수 · 선택 · 도움말 · 오류",
  ],
  [
    "text-field",
    "TextField",
    "텍스트 필드",
    "forms",
    "읽기 쉬운 라벨과 즉각적인 오류 복구를 지원합니다.",
    "기본 · 아이콘 · 읽기 전용 · 오류",
  ],
  [
    "textarea",
    "Textarea",
    "여러 줄 입력",
    "forms",
    "긴 내용을 입력하고 길이 제한을 확인합니다.",
    "자동 줄바꿈 · 글자 수 · 크기 조절",
  ],
  [
    "password-field",
    "PasswordField",
    "비밀번호",
    "forms",
    "입력한 내용을 안전하게 숨기고 필요할 때 확인합니다.",
    "숨김 · 표시 · 자동완성 · 오류",
  ],
  [
    "search-field",
    "SearchField",
    "검색 필드",
    "forms",
    "검색어 입력과 지우기를 한 자리에서 제공합니다.",
    "비어 있음 · 입력됨 · 지우기 · 결과 없음",
  ],
  [
    "number-field",
    "NumberField",
    "수량 입력",
    "forms",
    "정해진 범위와 단위 안에서 수량을 조절합니다.",
    "증가 · 감소 · 직접 입력 · 경계값",
  ],
  [
    "select",
    "Select",
    "선택 상자",
    "forms",
    "정해진 목록에서 한 값을 네이티브 컨트롤로 고릅니다.",
    "플레이스홀더 · 선택됨 · 옵션 비활성",
  ],
  [
    "combobox",
    "Combobox",
    "검색 선택",
    "forms",
    "긴 옵션 목록을 검색과 키보드로 빠르게 좁힙니다.",
    "닫힘 · 검색 · 선택 · 빈 결과",
  ],
  [
    "multi-select",
    "MultiSelect",
    "다중 선택",
    "forms",
    "검색 가능한 옵션과 선택 태그를 함께 제공합니다.",
    "닫힘 · 펼침 · 다중 선택 · 개별 해제",
  ],
  [
    "checkbox",
    "Checkbox",
    "체크박스",
    "forms",
    "독립적인 항목의 선택과 부분 선택을 표현합니다.",
    "미선택 · 선택 · 일부 선택 · 비활성",
  ],
  [
    "radio-group",
    "RadioGroup",
    "라디오 그룹",
    "forms",
    "서로 배타적인 선택지를 한눈에 비교합니다.",
    "세로 · 가로 · 설명 포함 · 비활성",
  ],
  [
    "switch",
    "Switch",
    "스위치",
    "forms",
    "즉시 적용되는 설정을 켜고 끕니다.",
    "Off · On · 설명 포함 · 비활성",
  ],
  [
    "slider",
    "Slider",
    "슬라이더",
    "forms",
    "연속적인 값과 양 끝의 범위를 함께 보여줍니다.",
    "기본 · 값 포맷 · 단계 · 비활성",
  ],
  [
    "rating",
    "Rating",
    "별점",
    "forms",
    "네이티브 라디오 의미를 가진 1–5점 선택을 제공합니다.",
    "미선택 · 1–5점 · 비활성",
  ],
  [
    "otp-input",
    "OtpInput",
    "인증번호",
    "forms",
    "자동완성과 붙여넣기가 가능한 숫자 인증 입력입니다.",
    "숫자 정리 · 최대 길이 · 오류",
  ],
  [
    "file-upload",
    "FileUpload",
    "파일 선택",
    "forms",
    "파일을 고르고 형식·크기를 검증한 뒤 제거합니다.",
    "비어 있음 · 드래그 · 파일 목록 · 거부",
  ],
  [
    "date-picker",
    "DatePicker",
    "날짜 입력",
    "forms",
    "직접 입력과 전용 달력으로 날짜를 선택합니다.",
    "입력 · 달력 · 오늘 · 제한 날짜 · 비활성",
  ],
  [
    "date-range-picker",
    "DateRangePicker",
    "기간 입력",
    "forms",
    "시작일과 종료일의 선후 관계를 유지합니다.",
    "시작 전 · 시작 선택 · 기간 선택",
  ],
  [
    "time-picker",
    "TimePicker",
    "시간 입력",
    "forms",
    "키보드와 모바일 시간 선택기를 모두 지원합니다.",
    "시간 · 분 · 간격 · 비활성",
  ],
  [
    "color-picker",
    "ColorPicker",
    "색상 선택",
    "forms",
    "네이티브 선택기와 HEX 값을 함께 보여줍니다.",
    "기본 · 선택됨 · 비활성",
  ],
  [
    "calendar",
    "Calendar",
    "달력",
    "forms",
    "월 탐색과 하루·기간 선택을 키보드 그리드로 제공합니다.",
    "오늘 · 선택일 · 기간 · 다른 달 · 제한 날짜",
  ],
  [
    "agreement",
    "Agreement",
    "약관 동의",
    "forms",
    "필수·선택 약관과 전체 동의 상태를 구분합니다.",
    "전체 · 부분 · 미선택 · 필수 오류",
  ],
  [
    "tabs",
    "Tabs",
    "탭",
    "navigation",
    "같은 맥락의 콘텐츠를 한 영역에서 전환합니다.",
    "Line · Pill · 옵션 비활성",
  ],
  [
    "segmented-control",
    "SegmentedControl",
    "세그먼트",
    "navigation",
    "서로 가까운 보기 방식 사이를 부드럽게 전환합니다.",
    "2–4개 옵션 · 선택 배경 · 비활성",
  ],
  [
    "breadcrumb",
    "Breadcrumb",
    "경로",
    "navigation",
    "현재 위치와 상위 계층으로 돌아가는 경로를 보여줍니다.",
    "2–5단계 · 현재 페이지",
  ],
  [
    "pagination",
    "Pagination",
    "페이지 탐색",
    "navigation",
    "전체 범위와 현재 위치를 유지하며 목록을 나눕니다.",
    "처음 · 중간 · 마지막 · 생략 표시",
  ],
  [
    "stepper",
    "Stepper",
    "진행 단계",
    "navigation",
    "완료·현재·예정 단계를 구별하고 이전 단계로 돌아갑니다.",
    "완료 · 현재 · 예정",
  ],
  [
    "navigation-bar",
    "NavigationBar",
    "상단 탐색",
    "navigation",
    "브랜드·주 메뉴·보조 행동의 순서를 정리합니다.",
    "기본 · 현재 위치 · 모바일 줄바꿈",
  ],
  [
    "side-navigation",
    "SideNavigation",
    "사이드 탐색",
    "navigation",
    "정보가 많은 서비스의 지속적인 탐색을 지원합니다.",
    "현재 위치 · 아이콘 · 배지",
  ],
  [
    "bottom-navigation",
    "BottomNavigation",
    "하단 탐색",
    "navigation",
    "모바일의 핵심 목적지 3–5개를 손이 닿는 곳에 둡니다.",
    "현재 위치 · 아이콘과 라벨 · safe area",
  ],
  [
    "command-palette",
    "CommandPalette",
    "명령 검색",
    "navigation",
    "키보드로 페이지와 작업을 검색하고 실행합니다.",
    "닫힘 · 검색 · 방향키 탐색 · 빈 결과",
  ],
  [
    "card",
    "Card",
    "카드",
    "surfaces",
    "제목·내용·행동을 일관된 경계로 묶습니다.",
    "Outline · Filled · Elevated",
  ],
  [
    "list-row",
    "ListRow",
    "목록 행",
    "surfaces",
    "정보 밀도를 유지하며 설명과 다음 행동을 연결합니다.",
    "정보형 · 이동형 · 앞/뒤 슬롯",
  ],
  [
    "accordion",
    "Accordion",
    "아코디언",
    "surfaces",
    "한 번에 필요한 정보만 펼쳐 읽도록 합니다.",
    "단일 열림 · 다중 열림 · 비활성",
  ],
  [
    "divider",
    "Divider",
    "구분선",
    "surfaces",
    "정보의 관계를 끊지 않으면서 영역을 구분합니다.",
    "수평 · 세로 · 라벨",
  ],
  [
    "avatar",
    "Avatar",
    "아바타",
    "surfaces",
    "이미지 실패에도 이름으로 사용자를 구별합니다.",
    "S · M · L / 이미지 · 이름 대체",
  ],
  [
    "avatar-group",
    "AvatarGroup",
    "아바타 그룹",
    "surfaces",
    "참여자 일부와 나머지 인원수를 간결하게 보여줍니다.",
    "참여자 · 초과 인원",
  ],
  [
    "badge",
    "Badge",
    "배지",
    "surfaces",
    "짧은 상태를 색과 텍스트로 동시에 전달합니다.",
    "Neutral · Accent · Success · Warning · Danger · Info",
  ],
  [
    "tag",
    "Tag",
    "태그",
    "surfaces",
    "선택값이나 키워드를 작게 묶고 해제할 수 있게 합니다.",
    "정적 · 선택형 · 삭제형",
  ],
  [
    "tooltip",
    "Tooltip",
    "툴팁",
    "surfaces",
    "포커스나 호버에서 보조 설명을 제공합니다.",
    "숨김 · 표시 · Escape 닫기",
  ],
  [
    "scroll-area",
    "ScrollArea",
    "스크롤 영역",
    "surfaces",
    "문서 전체의 흐름을 유지하며 긴 내용을 제한합니다.",
    "세로 스크롤 · 키보드 포커스",
  ],
  [
    "carousel",
    "Carousel",
    "캐러셀",
    "surfaces",
    "사용자가 직접 다음 콘텐츠를 넘겨 비교합니다.",
    "첫 장 · 중간 · 마지막 / 자동 재생 없음",
  ],
  [
    "dialog",
    "Dialog",
    "다이얼로그",
    "overlays",
    "작업 맥락을 유지하면서 집중할 내용을 엽니다.",
    "데스크톱 중앙 · 모바일 시트 · 긴 내용",
  ],
  [
    "alert-dialog",
    "AlertDialog",
    "확인 다이얼로그",
    "overlays",
    "되돌리기 어려운 행동의 결과를 먼저 설명합니다.",
    "취소 우선 · 확인 · 처리 중",
  ],
  [
    "drawer",
    "Drawer",
    "드로어",
    "overlays",
    "보조 작업과 상세 정보를 측면에서 제공합니다.",
    "열림 · 닫힘 · 스크롤",
  ],
  [
    "bottom-sheet",
    "BottomSheet",
    "바텀 시트",
    "overlays",
    "모바일에서 짧은 선택과 보조 작업을 처리합니다.",
    "열림 · 긴 내용 · safe area",
  ],
  [
    "popover",
    "Popover",
    "팝오버",
    "overlays",
    "현재 컨트롤 곁에 작은 설정과 설명을 펼칩니다.",
    "Start · End / 열림 · 닫힘",
  ],
  [
    "dropdown-menu",
    "DropdownMenu",
    "드롭다운 메뉴",
    "overlays",
    "추가 행동을 키보드로 탐색 가능한 메뉴에 모읍니다.",
    "기본 · 위험 행동 · 비활성 항목",
  ],
  [
    "alert",
    "Alert",
    "인라인 알림",
    "feedback",
    "문제·변화·성공과 다음 행동을 같은 위치에 설명합니다.",
    "Info · Success · Warning · Danger",
  ],
  [
    "toast",
    "ToastProvider",
    "토스트",
    "feedback",
    "맥락을 방해하지 않고 작업 결과를 잠시 알립니다.",
    "자동 닫힘 · 포커스 정지 · 실행 취소",
  ],
  [
    "progress",
    "Progress",
    "진행률",
    "feedback",
    "실제 완료 비율과 알 수 없는 대기를 구분합니다.",
    "결정형 · 비결정형",
  ],
  [
    "spinner",
    "Spinner",
    "로딩 표시",
    "feedback",
    "짧은 대기 상태에 접근 가능한 이름을 제공합니다.",
    "크기 · 정지 대체",
  ],
  [
    "skeleton",
    "Skeleton",
    "스켈레톤",
    "feedback",
    "예상 레이아웃을 유지하며 콘텐츠 로딩을 알립니다.",
    "텍스트 · 사각형 · 원형",
  ],
  [
    "empty-state",
    "EmptyState",
    "빈 상태",
    "feedback",
    "아직 없는 이유와 시작할 행동을 함께 안내합니다.",
    "첫 사용 · 검색 결과 없음 · 필터 결과 없음",
  ],
  [
    "result",
    "Result",
    "결과 화면",
    "feedback",
    "흐름의 완료나 실패를 명확하게 마무리합니다.",
    "성공 · 오류 · 경고",
  ],
  [
    "banner",
    "Banner",
    "배너",
    "feedback",
    "페이지 전체에 영향을 주는 정보를 눈에 띄게 둡니다.",
    "정보 · 주의 · 행동 링크 · 닫기",
  ],
  [
    "data-table",
    "DataTable",
    "데이터 표",
    "data",
    "정렬·행 선택·페이지 이동과 모바일 카드를 제공합니다.",
    "표 · 모바일 카드 · 정렬 · 선택 · 빈 값",
  ],
  [
    "description-list",
    "DescriptionList",
    "설명 목록",
    "data",
    "속성 이름과 값을 읽는 순서대로 정렬합니다.",
    "짧은 값 · 긴 값 · 복합 값",
  ],
  [
    "stat",
    "Stat",
    "수치 요약",
    "data",
    "중요한 숫자의 단위와 비교 맥락을 함께 표시합니다.",
    "기본 · 변화량 · 기준 설명",
  ],
  [
    "timeline",
    "Timeline",
    "타임라인",
    "data",
    "시간 순서와 현재 진행 상태를 정리합니다.",
    "완료 · 현재 · 예정",
  ],
  [
    "tree",
    "Tree",
    "트리",
    "data",
    "계층적인 자료를 펼치고 키보드로 탐색합니다.",
    "접힘 · 펼침 · 선택 · 중첩",
  ],
  [
    "container",
    "Container",
    "컨테이너",
    "layout",
    "화면의 최대 너비와 좌우 여백을 일관되게 유지합니다.",
    "기본 1200 · 좁게 760",
  ],
  [
    "stack",
    "Stack",
    "스택",
    "layout",
    "수직·수평 흐름과 간격을 명시적으로 조합합니다.",
    "Column · Row · Wrap",
  ],
  [
    "grid",
    "Grid",
    "그리드",
    "layout",
    "콘텐츠 최소 너비를 기준으로 열 수를 자동 조정합니다.",
    "자동 열 · 최소 너비 · 간격",
  ],
  [
    "aspect-ratio",
    "AspectRatio",
    "비율 영역",
    "layout",
    "이미지 로딩 전에도 미디어의 공간을 예약합니다.",
    "16:9 · 4:3 · 1:1",
  ],
  [
    "bottom-cta",
    "BottomCTA",
    "하단 액션",
    "layout",
    "화면 하단의 주 행동과 안전 여백을 묶습니다.",
    "단일 행동 · 보조 행동 · 안내 문구",
  ],
  [
    "text",
    "Text",
    "텍스트",
    "layout",
    "읽는 위계에 맞는 의미 태그와 글자 스타일을 분리합니다.",
    "Display · Title · Heading · Body · Small · Caption",
  ],
  [
    "visually-hidden",
    "VisuallyHidden",
    "보조기술 텍스트",
    "layout",
    "화면에는 숨기되 보조기술에 필요한 설명을 남깁니다.",
    "아이콘 설명 · 부가 안내",
  ],
];
const behavior: Record<
  Category,
  {
    mobile: string;
    keyboard: string;
    rule: string;
    avoid: string;
    motion: string;
  }
> = {
  actions: {
    mobile:
      "터치 영역은 최소 44px이며, 주요 행동은 좁은 화면에서 전체 너비로 확장합니다. 같은 그룹의 순서를 유지하고 줄바꿈합니다.",
    keyboard:
      "Tab으로 이동하고 Enter/Space로 실행합니다. disabled 상태는 실행되지 않습니다. 링크는 Enter로 이동합니다.",
    rule: "화면의 주요 행동은 하나로 정하고, 실행 결과를 알립니다.",
    avoid: "아이콘만 두고 접근 가능한 이름을 생략하지 않습니다.",
    motion: "press · 120ms",
  },
  forms: {
    mobile:
      "입력 글자는 16px 이상을 유지합니다. 라벨을 위에 두고 작은 화면에서 한 열로 배치합니다. 모바일 키보드와 자동완성을 활용합니다.",
    keyboard:
      "네이티브 입력의 Tab, 방향키, 붙여넣기를 보존합니다. 오류를 라벨과 도움말에 연결하고 잘못된 값은 수정할 수 있게 둡니다.",
    rule: "입력 전에 필요한 형식과 필수 여부를 알려줍니다.",
    avoid: "플레이스홀더를 라벨 대신 쓰거나 색상만으로 오류를 알리지 않습니다.",
    motion: "select · 220ms",
  },
  navigation: {
    mobile:
      "핵심 목적지는 유지하며 하단 탐색 또는 접을 수 있는 메뉴로 전환합니다. 탭은 줄바꿈하지 않고 가로 스크롤합니다.",
    keyboard:
      "탭은 좌우 방향키/Home/End로, 메뉴는 상하 방향키로 이동합니다. 현재 위치는 aria-current 또는 aria-selected로 노출합니다.",
    rule: "이동과 상태 변경을 구별하고 현재 위치를 유지합니다.",
    avoid:
      "탭마다 서로 관계없는 페이지를 넣거나 필수 목적지를 아이콘만으로 숨기지 않습니다.",
    motion: "select · 220ms",
  },
  surfaces: {
    mobile:
      "고정 너비 대신 컨테이너 너비를 따릅니다. 카드 간 간격을 줄여도 내부 정보의 위계와 읽는 순서를 유지합니다.",
    keyboard:
      "상호작용이 있는 부분만 Tab 순서에 포함합니다. 펼침은 Enter/Space로, 보조 설명은 Escape로 닫을 수 있어야 합니다.",
    rule: "관련 정보를 묶고 하나의 주된 목적을 표현합니다.",
    avoid:
      "카드 전체 클릭과 내부 버튼을 중첩하거나 모든 정보에 카드를 사용하지 않습니다.",
    motion: "expand · 240ms",
  },
  overlays: {
    mobile:
      "다이얼로그는 작은 화면에서 시트로 전환하며, 최대 높이와 내부 스크롤을 제한합니다. 하단 safe area를 유지합니다.",
    keyboard:
      "열 때 내부로 포커스 이동, Tab 순환, Escape 닫기, 닫힌 뒤 트리거로 복귀합니다. 위험 확인은 취소가 초기 포커스입니다.",
    rule: "현재 작업과 직접 관련된 보조 흐름에만 사용합니다.",
    avoid:
      "여러 모달을 연속으로 중첩하거나 사용자가 빠져나갈 길을 없애지 않습니다.",
    motion: "enter · 280ms",
  },
  feedback: {
    mobile:
      "텍스트를 잘라내지 않고 줄바꿈합니다. 토스트는 안전 여백 안에 표시하고 하단 고정 행동과 겹치지 않게 배치합니다.",
    keyboard:
      "상태 메시지는 live region으로 알립니다. 닫기와 실행 취소는 키보드로 접근하며 포커스 중 자동 닫힘을 멈춥니다.",
    rule: "무슨 일이 일어났고 다음에 무엇을 할 수 있는지 설명합니다.",
    avoid:
      "실제 진행률이 없는데 임의 숫자를 보여주거나 사라지는 토스트에 필수 오류를 담지 않습니다.",
    motion: "feedback · 320ms",
  },
  data: {
    mobile:
      "표는 600px 아래에서 레이블이 있는 카드로 전환합니다. 숫자는 단위를 유지하고 긴 문자열은 줄바꿈합니다.",
    keyboard:
      "정렬 헤더와 행 선택은 키보드로 조작합니다. 트리는 상하/좌우/Home/End로 탐색하며 상태를 읽을 수 있어야 합니다.",
    rule: "값, 단위, 비교 기준을 함께 제공합니다.",
    avoid: "색이나 아이콘만으로 증감·선택을 구별하지 않습니다.",
    motion: "select · 220ms",
  },
  layout: {
    mobile:
      "320px부터 1600px 이상까지 콘텐츠 너비를 기준으로 재배치합니다. safe area와 긴 한국어, 확대된 텍스트를 고려합니다.",
    keyboard:
      "시각적 순서와 DOM 순서를 일치시키고, 제목 단계·읽는 순서를 유지합니다.",
    rule: "레이아웃에는 간격 토큰을 쓰고 의미 구조와 시각 스타일을 분리합니다.",
    avoid:
      "고정 높이로 텍스트를 자르거나 순서 변경으로 키보드 흐름을 꼬지 않습니다.",
    motion: "없음 · 레이아웃 안정성 우선",
  },
};
const contracts: Record<string, Partial<(typeof behavior)[Category]>> = {
  "hold-button": {
    motion: "press · 120ms / 확인 유지 · 900ms",
    keyboard:
      "Space/Enter를 900ms 유지하면 한 번 실행됩니다. 키를 떼거나 Escape·포커스 이탈 시 취소합니다.",
    rule: "실수 방지가 필요할 때만 사용하고 별도의 일반 버튼/확인 다이얼로그 경로를 제공합니다. 모션 감소는 확인 시간을 바꾸지 않습니다.",
  },
  "copy-button": {
    rule: "Clipboard API 성공 후에만 복사됨을 표시합니다. HTTPS 또는 localhost가 필요하며 실패 시 직접 선택할 수 있는 원문을 함께 제공합니다.",
  },
  button: {
    mobile:
      "S 36px · M 44px · L 52px. 터치 기기에서는 최소 높이 44px로 확대합니다. fullWidth는 화면이 명시적으로 선택합니다.",
  },
  "icon-button": {
    rule: "label은 필수입니다. 아이콘 모양만으로 의미를 추론하게 하지 않으며 상태 버튼에는 aria-pressed를 추가합니다.",
  },
  textarea: {
    keyboard:
      "일반 여러 줄 입력과 Enter 줄바꿈을 보존합니다. maxLength를 전달하면 입력 길이와 제한을 함께 표시합니다.",
  },
  "number-field": {
    keyboard:
      "숫자를 직접 입력하거나 위/아래 방향키와 증가·감소 버튼을 사용합니다. 최소·최대 경계에서는 해당 버튼을 비활성화합니다.",
    rule: "수량처럼 범위가 분명한 값에 사용합니다. 전화번호·계좌번호는 TextField를 사용합니다.",
  },
  combobox: {
    keyboard:
      "입력으로 검색, 위/아래 방향키로 후보 이동, Enter로 선택, Escape로 취소합니다. DOM 포커스는 입력에 유지하며 활성 후보를 aria-activedescendant로 전달합니다.",
    mobile:
      "입력은 16px입니다. 옵션은 44px 이상 행과 내부 스크롤을 사용하며, 선택 후 검색어를 선택 라벨로 정리합니다.",
  },
  "multi-select": {
    keyboard:
      "트리거로 펼친 뒤 Tab으로 검색과 네이티브 체크박스를 탐색합니다. Space로 선택, Escape로 닫습니다. 태그의 삭제 버튼으로 개별 해제합니다.",
    rule: "복수 선택이 필요한 경우만 사용합니다. 선택 결과를 태그로 유지하고 체크박스의 선택 상태를 숨기지 않습니다.",
  },
  checkbox: {
    keyboard:
      "Space로 선택을 전환합니다. indeterminate는 일부만 선택한 집합 상태이며 다음 동작은 화면이 결정합니다.",
  },
  "radio-group": {
    keyboard:
      "Tab으로 그룹에 진입하고 방향키로 값을 바꾸며 Space로 선택합니다. 그룹의 name을 공유하고 선택 결과를 하나만 유지합니다.",
  },
  switch: {
    keyboard:
      "Tab으로 이동하고 Space로 On/Off를 전환합니다. role=switch와 checked 상태를 전달합니다.",
    rule: "즉시 반영되는 설정에 사용하고, 제출 시 반영되는 선택은 Checkbox를 사용합니다.",
  },
  slider: {
    keyboard:
      "좌우/상하 방향키로 한 단계 이동하고 Home/End로 범위 끝에 도달합니다. 네이티브 range와 aria-valuetext를 사용합니다.",
  },
  rating: {
    keyboard:
      "라디오 그룹으로 탐색합니다. 방향키와 Space로 점수를 선택하며 각 별은 점수 이름을 가집니다.",
  },
  "otp-input": {
    keyboard:
      "단일 입력으로 붙여넣기·전체 선택·자동완성을 보존합니다. 숫자 외 문자를 제거하며 요청 길이 이상은 받지 않습니다.",
    mobile:
      "inputMode=numeric과 autoComplete=one-time-code를 사용합니다. 여러 개의 분리된 입력으로 포커스를 강제 이동하지 않습니다.",
  },
  "file-upload": {
    keyboard:
      "파일 선택 버튼으로 OS 선택기를 열고 제거 버튼으로 취소합니다. 드래그만을 유일한 입력 경로로 두지 않습니다.",
    rule: "선택 단계에서 형식과 최대 크기를 검증합니다. 실제 전송, 바이러스 검사, 서버 검증은 서비스에서 구현합니다.",
  },
  "date-picker": {
    keyboard:
      "날짜를 직접 입력하거나 달력 버튼을 누릅니다. 달력 안에서 방향키·Home/End·PageUp/PageDown으로 이동하고 Enter로 선택합니다. Escape로 닫으면 열기 버튼으로 포커스가 돌아옵니다.",
    mobile: "전용 달력은 모바일에서 하단 시트로 표시됩니다. 날짜 입력 자체는 기기의 숫자·날짜 입력 기능을 유지합니다.",
    rule: "value와 onValueChange로 YYYY-MM-DD 값을 연결합니다. min/max 밖의 날짜는 달력에서 비활성화되며 직접 입력은 네이티브 폼 유효성 검사를 사용합니다.",
  },
  "time-picker": {
    keyboard:
      "네이티브 time 입력의 키보드·OS 선택기 동작을 유지합니다. step은 초 단위로 전달합니다.",
  },
  "date-range-picker": {
    keyboard:
      "시작/종료일은 각각 라벨이 있는 date 입력입니다. 시작일을 종료일 뒤로 옮기면 종료일을 비워 다시 선택하게 합니다.",
  },
  calendar: {
    keyboard:
      "날짜는 한 개의 Tab 진입점입니다. 방향키로 일/주 이동, Home/End로 주 시작/끝, PageUp/PageDown으로 월 이동, Enter/Space로 선택합니다.",
    mobile:
      "7열 달력은 컨테이너에 맞게 줄어들고 이전·다음 달 버튼을 유지합니다. 모바일 날짜 입력은 DatePicker도 고려합니다.",
  },
  agreement: {
    keyboard:
      "개별 동의는 네이티브 체크박스입니다. 전체 선택은 미선택/부분 선택/전체 선택의 세 상태를 연결합니다.",
    rule: "필수와 선택을 문구로 분리합니다. 필수 동의가 빠지면 완료하지 않고 같은 영역에서 오류를 알립니다.",
  },
  tabs: {
    keyboard:
      "Tab은 선택 탭에 진입하고 좌우/Home/End로 탭을 바꾸며 비활성 항목을 건너뜁니다. tabpanel과 aria-controls를 연결합니다.",
  },
  "segmented-control": {
    keyboard:
      "네이티브 radio 그룹입니다. Tab 진입과 방향키 선택을 사용하며 선택 표시의 이동 중에도 값은 즉시 반영합니다.",
  },
  pagination: {
    keyboard:
      "각 페이지와 이전·다음은 버튼입니다. 현재 페이지는 aria-current=page이며 경계에서 이동 버튼을 비활성화합니다.",
    mobile:
      "첫·마지막·현재 주변 페이지를 유지하고 생략점을 사용합니다. 페이지 번호를 임의로 감추지 않습니다.",
  },
  stepper: {
    keyboard:
      "현재 단계와 완료된 단계로만 이동할 수 있습니다. 앞으로의 미완료 단계는 비활성화합니다.",
    mobile:
      "단계 수는 짧게 유지합니다. 긴 제목은 줄바꿈하며 단계 번호와 현재 상태를 보존합니다.",
  },
  breadcrumb: {
    keyboard:
      "상위 경로는 링크이며 마지막 항목은 현재 위치 텍스트입니다. 링크에만 Tab 포커스를 둡니다.",
  },
  "navigation-bar": {
    mobile:
      "주 메뉴가 한 줄에 들어가지 않으면 다음 줄로 이동합니다. 실제 서비스에서 항목이 많으면 Drawer 메뉴와 조합합니다.",
  },
  "side-navigation": {
    mobile:
      "화면이 SideNavigation을 Drawer 안에 배치합니다. 이 구성요소 자체가 자동으로 Drawer를 생성하지 않습니다.",
  },
  "bottom-navigation": {
    mobile:
      "3–5개 핵심 목적지를 동일한 너비로 배치하고 하단 safe area를 유지합니다. 고정 배치는 사용 화면에서 지정합니다.",
  },
  "command-palette": {
    keyboard:
      "검색 입력에 초기 포커스를 두고 상하 방향키로 활성 결과를 이동합니다. Enter로 실행, Escape로 닫고 원래 트리거로 복귀합니다. 문서 사이트에서는 Ctrl/⌘+K로 열 수 있습니다.",
  },
  accordion: {
    keyboard:
      "제목 버튼은 Enter/Space로 펼칩니다. aria-expanded와 aria-controls를 연결하며 닫힌 내용은 Tab 순서에 포함하지 않습니다.",
  },
  tooltip: {
    keyboard:
      "호버 또는 포커스로 표시하고 Escape로 닫습니다. 현재 구현은 설명용 텍스트에 포커스 래퍼를 제공합니다.",
    rule: "비대화형 보조 설명에만 사용합니다. 버튼·링크 같은 필수 행동은 툴팁 안에 넣지 않습니다.",
  },
  carousel: {
    keyboard:
      "이전·다음과 페이지 선택 버튼으로 전환합니다. 새 콘텐츠를 상태 영역에서 알립니다. 자동 재생은 없습니다.",
  },
  popover: {
    keyboard:
      "트리거로 열고 Tab으로 내부 컨트롤에 이동합니다. 포커스는 가두지 않으며 Escape·외부 클릭·영역 밖 포커스로 닫습니다.",
    mobile:
      "콘텐츠는 viewport 너비를 넘지 않게 제한합니다. 많은 입력이나 긴 작업은 Dialog/BottomSheet로 전환합니다.",
  },
  "dropdown-menu": {
    keyboard:
      "Enter/Space/방향키로 열고 위/아래/Home/End로 메뉴를 탐색합니다. 비활성 항목을 건너뛰며 Enter로 실행, Escape로 닫고 트리거로 복귀합니다.",
    mobile:
      "각 행동은 터치할 수 있는 행입니다. 긴 옵션 목록의 값 선택에는 Select/Combobox를 사용합니다.",
  },
  toast: {
    keyboard:
      "결과는 role=status로 전달합니다. 닫기·실행 취소는 Tab으로 접근하고 포커스/호버 중 타이머를 멈춥니다. 행동이 있는 토스트는 자동 닫히지 않습니다.",
  },
  "data-table": {
    keyboard:
      "정렬 헤더 버튼에 aria-sort를 연결합니다. 행 선택과 현재 페이지 전체 선택은 체크박스이며 페이지 이동 후 선택을 유지합니다.",
    mobile:
      "600px 이하에서 각 열의 레이블이 붙은 카드로 전환합니다. 모바일에는 별도 정렬 컨트롤과 동일한 페이지 이동을 제공합니다.",
  },
  tree: {
    keyboard:
      "상하/Home/End로 현재 보이는 노드를 이동하고 오른쪽으로 펼침/자식 이동, 왼쪽으로 접기/부모 이동합니다. Enter/Space로 선택합니다.",
  },
  stat: {
    mobile:
      "값·단위·비교 기준을 함께 줄바꿈합니다. 숫자를 줄이더라도 의미를 잃는 약어는 피합니다.",
  },
  "description-list": {
    mobile:
      "작은 화면에서는 레이블과 값을 위아래로 전환하고 긴 문자열도 줄바꿈합니다.",
  },
  timeline: {
    keyboard:
      "시간 순서대로 읽는 정적 목록입니다. 완료·현재·예정은 텍스트로도 제공합니다. 기본적으로 포커스 대상이 아닙니다.",
  },
  "bottom-cta": {
    mobile:
      "하단 safe area를 유지하며, 모바일의 콘텐츠·키보드·다른 고정 영역과 겹치지 않도록 화면에서 배치합니다.",
  },
};
export const components = entries.map(
  ([id, name, ko, category, summary, variants]) => ({
    id,
    name,
    ko,
    category,
    summary,
    variants: variants.split(" / "),
    ...behavior[category],
    ...contracts[id],
  }),
);
export type ComponentDoc = (typeof components)[number];
export const componentById = Object.fromEntries(
  components.map((x) => [x.id, x]),
);
export const motionRecipes = [
  {
    id: "press",
    name: "눌림",
    duration: 120,
    easing: "ease-out",
    source: "M10 · M31 · M34",
    use: "Button · IconButton · ToggleButton",
    rule: "scale .97 → 1. 이동이나 반복을 추가하지 않습니다.",
  },
  {
    id: "select",
    name: "선택 이동",
    duration: 220,
    easing: "spring",
    source: "M35 · M38 · M44",
    use: "SegmentedControl · Tabs · Switch",
    rule: "선택 배경과 핸들이 새 값으로 이어집니다. 콘텐츠 의미는 즉시 갱신합니다.",
  },
  {
    id: "expand",
    name: "정보 펼침",
    duration: 240,
    easing: "ease-out",
    source: "M05 · M27 · M39",
    use: "Accordion · Combobox · DropdownMenu",
    rule: "내용이 트리거 가까이에서 나타납니다. 포커스 이동을 지연하지 않습니다.",
  },
  {
    id: "enter",
    name: "레이어 진입",
    duration: 280,
    easing: "ease-out",
    source: "M07 · M41 · M62",
    use: "Dialog · BottomSheet · CommandPalette",
    rule: "opacity + 6–24px 이동. 모션 감소에서는 이동을 생략합니다.",
  },
  {
    id: "feedback",
    name: "결과 확인",
    duration: 320,
    easing: "spring",
    source: "M32 · M33 · M72",
    use: "CopyButton · Result · Toast · Progress",
    rule: "실제 결과가 도착했을 때만 성공을 표시합니다.",
  },
  {
    id: "gesture",
    name: "의도 확인",
    duration: 360,
    easing: "ease-out",
    source: "M10 · M55 · M68",
    use: "Slider · HoldButton · NumberField",
    rule: "드래그/길게 누르기에 키보드 대안을 제공합니다. 위험 작업에는 최종 확인도 필요합니다.",
  },
];
export const foundations = [
  { id: "principles", name: "설계 원칙", en: "Principles" },
  { id: "color", name: "색상과 테마", en: "Color" },
  { id: "typography", name: "타이포그래피", en: "Typography" },
  { id: "spacing", name: "간격과 크기", en: "Spacing" },
  { id: "responsive", name: "반응형", en: "Responsive" },
  { id: "radius", name: "곡률과 깊이", en: "Radius & elevation" },
  { id: "iconography", name: "아이콘", en: "Iconography" },
  { id: "motion", name: "모션", en: "Motion" },
  { id: "accessibility", name: "접근성", en: "Accessibility" },
];
export const patterns = [
  {
    id: "onboarding",
    name: "가입과 동의",
    description: "필수 정보 → 약관 → 입력 검증 → 완료",
  },
  {
    id: "settings",
    name: "계정과 설정",
    description: "기본 정보 · 알림 · 저장 · 미저장 상태",
  },
  {
    id: "search",
    name: "검색과 필터",
    description: "검색어 · 필터 · 결과 · 빈 상태",
  },
  {
    id: "workspace",
    name: "데이터 관리",
    description: "선택 · 정렬 · 페이지 · 상세 · 삭제 확인",
  },
  {
    id: "checkout",
    name: "주문 요약",
    description: "상품 수량 · 배송 정보 · 합계 · 확인",
  },
  {
    id: "dashboard",
    name: "대시보드",
    description: "주요 지표 · 활동 이력 · 상태 카드",
  },
];
