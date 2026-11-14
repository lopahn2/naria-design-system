import { useState } from "react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  BellIcon,
  CheckIcon,
  Cross2Icon,
  DownloadIcon,
  FileTextIcon,
  HomeIcon,
  PersonIcon,
  PlusIcon,
  GearIcon,
  HeartIcon,
  StarIcon,
  MagnifyingGlassIcon,
  InfoCircledIcon,
  DashboardIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import * as UI from "../../packages/ui/src";
export type DemoState = "default" | "disabled" | "error" | "loading";
export const people = [
  {
    id: "N-001",
    name: "김나리",
    team: "Product",
    role: "관리자",
    status: "활성",
    amount: 128000,
  },
  {
    id: "N-002",
    name: "이하늘",
    team: "Engineering",
    role: "편집자",
    status: "활성",
    amount: 96000,
  },
  {
    id: "N-003",
    name: "박서준",
    team: "Design",
    role: "편집자",
    status: "초대 중",
    amount: 72000,
  },
  {
    id: "N-004",
    name: "정지우",
    team: "Marketing",
    role: "뷰어",
    status: "활성",
    amount: 48000,
  },
  {
    id: "N-005",
    name: "한유진",
    team: "Engineering",
    role: "관리자",
    status: "활성",
    amount: 168000,
  },
  {
    id: "N-006",
    name: "오시온",
    team: "Product",
    role: "뷰어",
    status: "초대 중",
    amount: 36000,
  },
];
export const options = [
  {
    value: "product",
    label: "프로덕트 디자인",
    description: "제품의 구조와 경험 설계",
  },
  {
    value: "engineering",
    label: "프론트엔드 개발",
    description: "인터랙션과 접근성 구현",
  },
  {
    value: "content",
    label: "콘텐츠 디자인",
    description: "읽기 쉽고 일관된 문장",
  },
  {
    value: "research",
    label: "사용자 리서치",
    description: "목표와 문제 이해",
  },
  { value: "archived", label: "종료된 프로젝트", disabled: true },
];
export const navigation = [
  { value: "home", label: "홈", icon: <HomeIcon /> },
  { value: "activity", label: "활동", icon: <DashboardIcon /> },
  { value: "saved", label: "저장", icon: <StarIcon /> },
  { value: "profile", label: "내 정보", icon: <PersonIcon /> },
];
export function ComponentDemo({
  id,
  state = "default",
  size = "md",
}: {
  id: string;
  state?: DemoState;
  size?: UI.Size;
}) {
  const [text, setText] = useState(""),
    [checked, setChecked] = useState(true),
    [selected, setSelected] = useState("product"),
    [tags, setTags] = useState(["product"]),
    [number, setNumber] = useState(3),
    [rating, setRating] = useState(3),
    [page, setPage] = useState(1),
    [tab, setTab] = useState("overview"),
    [nav, setNav] = useState("home"),
    [open, setOpen] = useState(false),
    [value, setValue] = useState("2026-11-18"),
    [range, setRange] = useState({ start: "2026-11-18", end: "2026-11-21" }),
    [color, setColor] = useState("#086d72"),
    [agreements, setAgreements] = useState<string[]>([]),
    [visible, setVisible] = useState(true),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState("");
  const toast = UI.useToast();
  const disabled = state === "disabled",
    loading = state === "loading",
    error = state === "error" ? "입력한 내용을 다시 확인해 주세요." : undefined;
  const announce = (title: string) => {
    setStatus(title);
    toast({ title, tone: "success" });
  };
  const menu: UI.MenuItem[] = [
    {
      id: "edit",
      label: "이름 변경",
      icon: <FileTextIcon />,
      onSelect: () => announce("이름 변경을 선택했어요."),
    },
    {
      id: "copy",
      label: "복제",
      icon: <PlusIcon />,
      onSelect: () => announce("복제했어요."),
    },
    {
      id: "download",
      label: "내보내기",
      icon: <DownloadIcon />,
      disabled: true,
      onSelect: () => {},
    },
    {
      id: "archive",
      label: "보관하기",
      icon: <ArchiveIcon />,
      danger: true,
      onSelect: () => announce("보관했어요."),
    },
  ];
  const note = (
    <p className="nds-hint" role="status">
      {status || "직접 조작해 상태 변화를 확인하세요."}
    </p>
  );
  const row = (
    <UI.ListRow
      title="공유 작업 공간"
      description="최근 수정 · 오늘 오후 2:40"
      leading={<UI.Avatar name="나리" />}
      trailing={
        <UI.Badge tone="success" dot>
          활성
        </UI.Badge>
      }
    />
  );
  switch (id) {
    case "button":
      return (
        <UI.Stack gap={18}>
          <UI.ButtonGroup label="버튼 위계">
            {(
              ["primary", "secondary", "outline", "ghost", "danger"] as const
            ).map((variant) => (
              <UI.Button
                key={variant}
                variant={variant}
                size={size}
                disabled={disabled}
                loading={loading}
                onClick={() => announce(`${variant} 버튼을 눌렀어요.`)}
              >
                {variant === "primary"
                  ? "계속하기"
                  : variant === "secondary"
                    ? "나중에"
                    : variant === "outline"
                      ? "미리 보기"
                      : variant === "ghost"
                        ? "자세히"
                        : "삭제하기"}
              </UI.Button>
            ))}
          </UI.ButtonGroup>
          <UI.ButtonGroup label="아이콘과 버튼">
            <UI.Button
              size={size}
              leading={<PlusIcon />}
              disabled={disabled}
              loading={loading}
              onClick={() => announce("새 항목을 준비했어요.")}
            >
              새로 만들기
            </UI.Button>
            <UI.Button
              variant="outline"
              size={size}
              trailing={<ArrowRightIcon />}
              disabled={disabled}
              onClick={() => announce("다음 단계예요.")}
            >
              다음 단계
            </UI.Button>
          </UI.ButtonGroup>
          {note}
        </UI.Stack>
      );
    case "icon-button":
      return (
        <UI.ButtonGroup label="아이콘 행동">
          <UI.IconButton
            label="알림 보기"
            size={size}
            variant="outline"
            disabled={disabled}
            onClick={() => announce("새 알림이 없어요.")}
          >
            <BellIcon />
          </UI.IconButton>
          <UI.IconButton
            label="항목 추가"
            size={size}
            variant="primary"
            disabled={disabled}
            onClick={() => announce("항목을 추가했어요.")}
          >
            <PlusIcon />
          </UI.IconButton>
          <UI.IconButton
            label="설정 열기"
            size={size}
            disabled={disabled}
            onClick={() => announce("설정을 열었어요.")}
          >
            <GearIcon />
          </UI.IconButton>
        </UI.ButtonGroup>
      );
    case "link":
      return (
        <UI.Stack direction="row" gap={24} wrap>
          <UI.Link href="#foundations/principles">설계 원칙 읽기</UI.Link>
          <UI.Link href="https://www.radix-ui.com/icons" external>
            아이콘 원본
          </UI.Link>
        </UI.Stack>
      );
    case "button-group":
      return (
        <UI.ButtonGroup label="편집 작업">
          <UI.Button
            variant="outline"
            onClick={() => announce("변경을 취소했어요.")}
          >
            취소
          </UI.Button>
          <UI.Button onClick={() => announce("변경을 저장했어요.")}>
            변경 사항 저장
          </UI.Button>
        </UI.ButtonGroup>
      );
    case "split-button":
      return (
        <UI.SplitButton
          label="저장"
          onClick={() => announce("저장했어요.")}
          items={menu}
          disabled={disabled}
        />
      );
    case "toggle-button":
      return (
        <UI.ToggleButton
          pressed={checked}
          onPressedChange={setChecked}
          disabled={disabled}
          leading={<HeartIcon />}
        >
          {checked ? "저장됨" : "저장하기"}
        </UI.ToggleButton>
      );
    case "copy-button":
      return (
        <UI.Stack>
          <code className="nds-demo-code">
            npm install ./naria-ui-1.0.1.tgz
          </code>
          <UI.CopyButton
            value="npm install ./naria-ui-1.0.1.tgz"
            variant="outline"
            disabled={disabled}
          />
        </UI.Stack>
      );
    case "hold-button":
      return (
        <UI.Stack>
          <UI.HoldButton
            key={visible ? "a" : "b"}
            disabled={disabled}
            onConfirm={() => announce("확인했어요.")}
          />
          <UI.Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setVisible(!visible);
              setStatus("");
            }}
          >
            다시 체험
          </UI.Button>
          {note}
        </UI.Stack>
      );
    case "field":
      return (
        <UI.Field
          label="팀 이름"
          htmlFor="demo-team"
          required
          hint="다른 팀원이 알아볼 수 있는 이름을 사용하세요."
          error={error}
          id="demo-team-hint"
        >
          <input
            id="demo-team"
            aria-describedby="demo-team-hint"
            aria-invalid={!!error}
            className="nds-input"
            value={text}
            disabled={disabled}
            onChange={(e) => setText(e.target.value)}
            placeholder="예: naria product"
          />
        </UI.Field>
      );
    case "text-field":
      return (
        <UI.Stack>
          <UI.TextField
            label="이메일"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            hint="초대 링크를 받을 이메일을 입력하세요."
            error={error}
            disabled={disabled}
          />
          <UI.TextField
            label="워크스페이스"
            value="naria-cloud"
            readOnly
            hint="읽기 전용 값은 복사할 수 있습니다."
          />
        </UI.Stack>
      );
    case "textarea":
      return (
        <UI.Textarea
          label="프로젝트 소개"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          placeholder="만들고 싶은 경험을 간단히 설명하세요."
          hint="핵심 목표를 2–3문장으로 작성하세요."
          error={error}
          disabled={disabled}
        />
      );
    case "password-field":
      return (
        <UI.PasswordField
          label="비밀번호"
          autoComplete="new-password"
          value={text}
          onChange={(e) => setText(e.target.value)}
          hint="영문·숫자를 포함해 8자 이상 사용하세요."
          error={error}
          disabled={disabled}
        />
      );
    case "search-field":
      return (
        <UI.Stack>
          <UI.SearchField
            label="멤버 검색"
            value={text}
            onValueChange={setText}
            placeholder="이름이나 팀을 검색하세요"
            disabled={disabled}
          />
          {people
            .filter((p) =>
              (p.name + p.team).toLowerCase().includes(text.toLowerCase()),
            )
            .slice(0, 3)
            .map((p) => (
              <UI.ListRow
                key={p.id}
                title={p.name}
                description={p.team}
                leading={<UI.Avatar name={p.name} />}
                trailing={<UI.Badge>{p.role}</UI.Badge>}
              />
            ))}
          {!people.some((p) =>
            (p.name + p.team).toLowerCase().includes(text.toLowerCase()),
          ) && (
            <UI.EmptyState
              title="검색 결과가 없어요"
              description="이름이나 팀을 다시 확인해 주세요."
              action={
                <UI.Button variant="outline" onClick={() => setText("")}>
                  검색어 지우기
                </UI.Button>
              }
            />
          )}
        </UI.Stack>
      );
    case "number-field":
      return (
        <UI.NumberField
          label="참여 인원"
          value={number}
          onValueChange={setNumber}
          min={1}
          max={10}
          disabled={disabled}
          hint="최대 10명까지 초대할 수 있습니다."
          error={error}
        />
      );
    case "select":
      return (
        <UI.Select
          label="역할"
          options={options}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={disabled}
          hint="역할에 맞는 접근 권한을 적용합니다."
          error={error}
        />
      );
    case "combobox":
      return (
        <UI.Combobox
          label="담당 분야"
          options={options}
          value={selected}
          onValueChange={setSelected}
          disabled={disabled}
          hint="검색하거나 방향키로 선택하세요."
          error={error}
        />
      );
    case "multi-select":
      return (
        <UI.MultiSelect
          label="관심 분야"
          options={options}
          value={tags}
          onValueChange={setTags}
          disabled={disabled}
          hint="여러 항목을 함께 선택할 수 있습니다."
          error={error}
        />
      );
    case "checkbox":
      return (
        <UI.Stack>
          <UI.Checkbox
            label="이메일로 알림 받기"
            description="중요한 변경 사항을 안내합니다."
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            disabled={disabled}
          />
          <UI.Checkbox
            label="부분 선택에서 전체 선택으로"
            checked={tags.length === 2}
            indeterminate={tags.length === 1}
            onChange={() =>
              setTags(tags.length === 2 ? [] : ["product", "engineering"])
            }
            disabled={disabled}
          />
        </UI.Stack>
      );
    case "radio-group":
      return (
        <UI.RadioGroup
          label="프로젝트 공개 범위"
          options={[
            {
              value: "product",
              label: "나만 보기",
              description: "본인만 확인할 수 있습니다.",
            },
            {
              value: "team",
              label: "팀과 공유",
              description: "초대된 팀원이 함께 볼 수 있습니다.",
            },
            { value: "public", label: "전체 공개", disabled: true },
          ]}
          value={selected}
          onValueChange={setSelected}
          disabled={disabled}
          error={error}
        />
      );
    case "switch":
      return (
        <UI.Switch
          label="업데이트 알림"
          description="새로운 기능과 개선 소식을 알려드려요."
          checked={checked}
          onCheckedChange={setChecked}
          disabled={disabled}
        />
      );
    case "slider":
      return (
        <UI.Slider
          label="알림 음량"
          value={number * 10}
          onValueChange={(v) => setNumber(v / 10)}
          format={(v) => `${v}%`}
          disabled={disabled}
        />
      );
    case "rating":
      return (
        <UI.Rating
          label="경험이 어떠셨나요?"
          value={rating}
          onValueChange={setRating}
          disabled={disabled}
        />
      );
    case "otp-input":
      return (
        <UI.Stack>
          <UI.OtpInput
            label="인증번호"
            value={text}
            onValueChange={setText}
            disabled={disabled}
            error={error}
          />
          <UI.Button
            disabled={text.length !== 6 || disabled}
            onClick={() =>
              announce(
                "6자리 입력을 확인했어요. 실제 인증은 연결하지 않았습니다.",
              )
            }
          >
            확인하기
          </UI.Button>
        </UI.Stack>
      );
    case "file-upload":
      return (
        <UI.FileUpload
          label="문서 첨부"
          accept=".pdf,.txt,.png,.jpg"
          multiple
          disabled={disabled}
          onFiles={(files) => setStatus(`${files.length}개 파일을 선택했어요.`)}
        />
      );
    case "date-picker":
      return (
        <UI.DatePicker
          label="시작 날짜"
          value={value}
          min="2026-11-01"
          max="2027-12-31"
          onValueChange={setValue}
          disabled={disabled}
          hint="2026년 11월 이후 날짜를 선택하세요."
          error={error}
        />
      );
    case "date-range-picker":
      return (
        <UI.DateRangePicker
          label="프로젝트 기간"
          {...range}
          onChange={setRange}
          disabled={disabled}
        />
      );
    case "time-picker":
      return (
        <UI.TimePicker
          label="알림 시간"
          value={text || "09:00"}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          error={error}
        />
      );
    case "color-picker":
      return (
        <UI.ColorPicker
          label="서비스 강조색"
          value={color}
          onValueChange={setColor}
          disabled={disabled}
        />
      );
    case "calendar":
      return (
        <div className="nds-calendar-examples">
          <UI.Stack gap={16}>
            <div><UI.Text as="h3" size="subheading">하루 선택</UI.Text><UI.Text size="small" muted>예약이나 일정의 날짜를 지정해요.</UI.Text></div>
            <UI.Calendar label="일정 날짜" value={value} onValueChange={setValue} min="2026-11-01" max="2027-12-31" disabled={disabled} />
            <p className="nds-hint" role="status">선택한 날짜 · {value}</p>
          </UI.Stack>
          <UI.Stack gap={16}>
            <div><UI.Text as="h3" size="subheading">기간 선택</UI.Text><UI.Text size="small" muted>시작일과 종료일을 차례로 선택해요.</UI.Text></div>
            <UI.Calendar label="기간 선택" value={range.end || range.start} range={range} disabled={disabled}
              onValueChange={(date) => setRange(!range.start || range.end || date < range.start ? {start:date,end:""} : {...range,end:date})} />
            <p className="nds-hint" role="status">{range.end ? `${range.start} — ${range.end}` : `${range.start}부터 · 종료일을 선택하세요.`}</p>
          </UI.Stack>
        </div>
      );
    case "agreement":
      return (
        <UI.Agreement
          items={[
            { id: "terms", label: "서비스 이용약관", required: true },
            { id: "privacy", label: "개인정보 처리 안내", required: true },
            { id: "marketing", label: "혜택과 새 소식 알림" },
          ]}
          value={agreements}
          onValueChange={setAgreements}
          error={error}
        />
      );
    case "tabs":
      return (
        <UI.Tabs
          label="프로젝트 정보"
          value={tab}
          onValueChange={setTab}
          items={[
            {
              value: "overview",
              label: "개요",
              content: (
                <UI.Stack>
                  <UI.Text size="subheading" weight="semibold">
                    함께 만드는 경험
                  </UI.Text>
                  <UI.Text muted>
                    원칙부터 작은 반응까지 일관된 언어로 연결합니다.
                  </UI.Text>
                </UI.Stack>
              ),
            },
            {
              value: "activity",
              label: "활동",
              badge: <UI.Badge>3</UI.Badge>,
              content: row,
            },
            {
              value: "files",
              label: "파일",
              content: (
                <UI.EmptyState
                  title="첨부된 파일이 없어요"
                  description="프로젝트에서 사용할 파일을 추가하세요."
                />
              ),
            },
            {
              value: "archive",
              label: "보관함",
              disabled: true,
              content: null,
            },
          ]}
        />
      );
    case "segmented-control":
      return (
        <UI.Stack>
          <UI.SegmentedControl
            label="청구 주기"
            options={[
              { value: "product", label: "월간" },
              { value: "yearly", label: "연간 · 20% 할인" },
            ]}
            value={selected}
            onValueChange={setSelected}
            disabled={disabled}
          />
          <UI.Stat
            label="Pro 플랜"
            value={selected === "yearly" ? "₩16,000" : "₩20,000"}
            caption={
              selected === "yearly"
                ? "월 환산 요금 · 연간 결제"
                : "월간 결제 · 언제든 변경 가능"
            }
          />
        </UI.Stack>
      );
    case "breadcrumb":
      return (
        <UI.Breadcrumb
          items={[
            { label: "워크스페이스", href: "#patterns/workspace" },
            { label: "프로젝트", href: "#components/card" },
            { label: "디자인 시스템" },
          ]}
        />
      );
    case "pagination":
      return (
        <UI.Stack>
          <UI.Pagination page={page} totalPages={12} onPageChange={setPage} />
          <p className="nds-hint" role="status">
            현재 {page} / 12페이지
          </p>
        </UI.Stack>
      );
    case "stepper":
      return (
        <UI.Stack>
          <UI.Stepper
            steps={["기본 정보", "약관 동의", "완료"]}
            current={number % 3}
            onStepChange={setNumber}
          />
          <UI.ButtonGroup label="단계 이동">
            <UI.Button
              variant="outline"
              onClick={() => setNumber(Math.max(0, (number % 3) - 1))}
            >
              이전
            </UI.Button>
            <UI.Button onClick={() => setNumber((number + 1) % 3)}>
              다음 단계
            </UI.Button>
          </UI.ButtonGroup>
        </UI.Stack>
      );
    case "navigation-bar":
      return (
        <UI.NavigationBar
          brand="naria"
          items={navigation.slice(0, 3)}
          value={nav}
          onValueChange={setNav}
          actions={<UI.Avatar name="김나리" size="sm" />}
        />
      );
    case "side-navigation":
      return (
        <UI.SideNavigation
          items={navigation}
          value={nav}
          onValueChange={setNav}
        />
      );
    case "bottom-navigation":
      return (
        <UI.BottomNavigation
          items={navigation}
          value={nav}
          onValueChange={setNav}
        />
      );
    case "command-palette":
      return (
        <>
          <UI.Button
            variant="outline"
            leading={<MagnifyingGlassIcon />}
            onClick={() => setOpen(true)}
          >
            명령 검색 열기
          </UI.Button>
          <UI.CommandPalette open={open} onOpenChange={setOpen} items={menu} />
        </>
      );
    case "card":
      return (
        <UI.Card
          title="새로운 작업 공간"
          description="프로젝트의 기록과 결정을 한곳에 모아요."
          actions={<UI.Badge tone="accent">Pro</UI.Badge>}
          footer={
            <>
              <UI.Button onClick={() => announce("작업 공간을 선택했어요.")}>
                시작하기
              </UI.Button>
              <UI.Button
                variant="ghost"
                onClick={() => announce("상세 정보를 확인했어요.")}
              >
                자세히
              </UI.Button>
            </>
          }
        >
          <UI.AvatarGroup
            names={["나리", "하늘", "서준", "지우", "유진", "시온"]}
          />
          <p className="nds-hint" style={{ marginTop: 12 }}>
            팀원 6명이 함께하고 있어요.
          </p>
        </UI.Card>
      );
    case "list-row":
      return (
        <UI.Stack gap={0}>
          {row}
          <UI.ListRow
            title="알림 설정"
            description="기기별 알림을 관리하세요."
            leading={<BellIcon />}
            onClick={() => announce("알림 설정을 선택했어요.")}
          />
          <UI.ListRow
            title="프로젝트 공유"
            description="초대된 팀원과 함께 편집합니다."
            trailing={
              <UI.Switch
                label="공유 허용"
                checked={checked}
                onCheckedChange={setChecked}
              />
            }
          />
        </UI.Stack>
      );
    case "accordion":
      return (
        <UI.Accordion
          items={[
            {
              value: "start",
              title: "어떻게 시작하나요?",
              content:
                "토큰을 불러오고 NariaProvider로 앱을 감싸면 공통 테마와 컴포넌트를 사용할 수 있습니다.",
            },
            {
              value: "theme",
              title: "서비스마다 색상을 바꿀 수 있나요?",
              content:
                "의미 토큰의 accent와 accent-soft를 교체하세요. 상태 색과 대비는 유지합니다.",
            },
            {
              value: "motion",
              title: "모션을 줄일 수 있나요?",
              content:
                "운영체제 모션 감소 설정을 따르며 Provider에서도 명시적으로 줄일 수 있습니다.",
            },
          ]}
        />
      );
    case "divider":
      return (
        <UI.Stack>
          <p>계정으로 계속하기</p>
          <UI.Divider label="또는" />
          <p>이메일로 시작하기</p>
          <UI.Divider />
        </UI.Stack>
      );
    case "avatar":
      return (
        <UI.Stack direction="row" align="center">
          <UI.Avatar name="나리" size="sm" />
          <UI.Avatar name="나리" />
          <UI.Avatar name="나리" size="lg" />
        </UI.Stack>
      );
    case "avatar-group":
      return (
        <UI.AvatarGroup
          names={["나리", "하늘", "서준", "지우", "유진", "시온", "민서"]}
        />
      );
    case "badge":
      return (
        <UI.Stack direction="row" wrap>
          {(
            [
              "neutral",
              "accent",
              "success",
              "warning",
              "danger",
              "info",
            ] as const
          ).map((tone, i) => (
            <UI.Badge key={tone} tone={tone} dot>
              {["초안", "진행 중", "완료", "확인 필요", "오류", "안내"][i]}
            </UI.Badge>
          ))}
        </UI.Stack>
      );
    case "tag":
      return (
        <UI.Stack direction="row" wrap>
          <UI.Tag selected={checked} onSelect={() => setChecked(!checked)}>
            반응형
          </UI.Tag>
          {tags.map((t) => (
            <UI.Tag
              key={t}
              onRemove={() => setTags(tags.filter((x) => x !== t))}
            >
              {t === "product" ? "디자인 시스템" : t}
            </UI.Tag>
          ))}
          <UI.Tag>React</UI.Tag>
        </UI.Stack>
      );
    case "tooltip":
      return (
        <UI.Tooltip label="팀원에게만 이 프로젝트가 표시됩니다.">
          <span className="nds-demo-tooltip">
            <InfoCircledIcon /> 공개 범위 안내
          </span>
        </UI.Tooltip>
      );
    case "scroll-area":
      return (
        <UI.ScrollArea label="프로젝트 활동" height={210}>
          {people.map((p) => (
            <UI.ListRow
              key={p.id}
              title={`${p.name} 님이 프로젝트에 참여했어요.`}
              description={`${p.team} · 오늘`}
              leading={<UI.Avatar name={p.name} size="sm" />}
            />
          ))}
        </UI.ScrollArea>
      );
    case "carousel":
      return (
        <UI.Carousel
          label="시작 안내"
          items={[
            {
              title: "하나의 언어로",
              content: <p>토큰이 컴포넌트와 화면을 연결합니다.</p>,
            },
            {
              title: "작은 화면부터",
              content: <p>엄지손가락이 닿는 곳부터 설계합니다.</p>,
            },
            {
              title: "움직임에도 이유를",
              content: <p>반응은 상태를 설명하고 맥락을 이어줍니다.</p>,
            },
          ]}
        />
      );
    case "dialog":
    case "drawer":
    case "bottom-sheet": {
      const Overlay =
        id === "drawer"
          ? UI.Drawer
          : id === "bottom-sheet"
            ? UI.BottomSheet
            : UI.Dialog;
      return (
        <>
          <UI.Button variant="outline" onClick={() => setOpen(true)}>
            {id === "dialog"
              ? "다이얼로그"
              : id === "drawer"
                ? "드로어"
                : "바텀 시트"}{" "}
            열기
          </UI.Button>
          <Overlay
            open={open}
            onOpenChange={setOpen}
            title="프로젝트 설정"
            description="변경 사항은 저장한 뒤 적용됩니다."
            footer={
              <>
                <UI.Button variant="outline" onClick={() => setOpen(false)}>
                  취소
                </UI.Button>
                <UI.Button
                  onClick={() => {
                    setOpen(false);
                    announce("설정을 저장했어요.");
                  }}
                >
                  저장하기
                </UI.Button>
              </>
            }
          >
            <UI.Stack>
              <UI.TextField
                label="프로젝트 이름"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="프로젝트 이름 입력"
              />
              <UI.Switch
                label="팀 공유"
                checked={checked}
                onCheckedChange={setChecked}
              />
            </UI.Stack>
          </Overlay>
        </>
      );
    }
    case "alert-dialog":
      return (
        <>
          <UI.Button variant="danger" onClick={() => setOpen(true)}>
            프로젝트 삭제
          </UI.Button>
          <UI.AlertDialog
            open={open}
            onOpenChange={setOpen}
            title="프로젝트를 삭제할까요?"
            description="프로젝트 안의 기록이 삭제됩니다. 이 데모는 실제 데이터를 삭제하지 않습니다."
            onConfirm={() => {
              setOpen(false);
              announce("데모 프로젝트를 삭제했어요.");
            }}
          >
            <UI.Alert title="삭제 전에 확인하세요" tone="warning">
              필요한 기록을 먼저 내보내세요.
            </UI.Alert>
          </UI.AlertDialog>
        </>
      );
    case "popover":
      return (
        <UI.Popover trigger="표시 옵션" title="화면에 표시할 내용">
          <UI.Switch
            label="담당자 표시"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <p className="nds-hint">프로젝트 목록에 바로 적용됩니다.</p>
        </UI.Popover>
      );
    case "dropdown-menu":
      return <UI.DropdownMenu label="프로젝트 메뉴" items={menu} />;
    case "alert":
      return (
        <UI.Stack>
          <UI.Alert title="변경 사항을 저장했어요" tone="success">
            팀원 모두에게 최신 내용이 표시됩니다.
          </UI.Alert>
          <UI.Alert
            title="이메일을 다시 확인해 주세요"
            tone="danger"
            action={
              <UI.Button
                size="sm"
                variant="outline"
                onClick={() => announce("수정 위치로 이동하는 예제예요.")}
              >
                이메일 수정
              </UI.Button>
            }
          >
            올바른 형식의 이메일 주소가 필요합니다.
          </UI.Alert>
        </UI.Stack>
      );
    case "toast":
      return (
        <UI.ButtonGroup label="토스트 예제">
          <UI.Button
            onClick={() =>
              toast({
                title: "변경 사항을 저장했어요.",
                description: "다른 기기에서도 최신 내용으로 표시됩니다.",
                tone: "success",
              })
            }
          >
            저장 알림
          </UI.Button>
          <UI.Button
            variant="outline"
            onClick={() =>
              toast({
                title: "보관함으로 이동했어요.",
                action: {
                  label: "실행 취소",
                  onClick: () => toast({ title: "원래 위치로 되돌렸어요." }),
                },
              })
            }
          >
            실행 취소 알림
          </UI.Button>
        </UI.ButtonGroup>
      );
    case "progress":
      return (
        <UI.Stack>
          <UI.Progress label="파일 준비" value={number * 10} />
          <UI.Slider
            label="진행률 체험"
            value={number * 10}
            onValueChange={(v) => setNumber(v / 10)}
          />
          <UI.Progress label="서버 응답을 기다리는 중" indeterminate />
        </UI.Stack>
      );
    case "spinner":
      return (
        <UI.Stack direction="row" align="center">
          <UI.Spinner />
          <span>기록을 불러오고 있어요</span>
          <UI.Spinner size={28} />
        </UI.Stack>
      );
    case "skeleton":
      return (
        <UI.Stack>
          <UI.Stack direction="row" align="center">
            <UI.Skeleton circle width={44} height={44} />
            <UI.Stack gap={8} style={{ flex: 1 }}>
              <UI.Skeleton width="60%" />
              <UI.Skeleton width="85%" height={12} />
            </UI.Stack>
          </UI.Stack>
          <UI.Skeleton height={130} />
        </UI.Stack>
      );
    case "empty-state":
      return (
        <UI.EmptyState
          title="첫 프로젝트를 만들어 보세요"
          description="기록과 자료를 한곳에 모으면 함께 일하기 쉬워져요."
          action={
            <UI.Button
              leading={<PlusIcon />}
              onClick={() => announce("새 프로젝트를 준비했어요.")}
            >
              프로젝트 만들기
            </UI.Button>
          }
        />
      );
    case "result":
      return (
        <UI.Result
          title="준비가 끝났어요"
          description="이제 팀원과 함께 프로젝트를 시작할 수 있습니다."
          action={
            <UI.Button
              onClick={() => announce("프로젝트로 이동하는 예제예요.")}
            >
              프로젝트로 이동
            </UI.Button>
          }
        />
      );
    case "banner":
      return visible ? (
        <UI.Banner
          title="새 버전이 준비되었어요"
          tone="info"
          onDismiss={() => setVisible(false)}
          action={
            <UI.Button
              variant="outline"
              size="sm"
              onClick={() => announce("최신 버전입니다.")}
            >
              변경 내용 보기
            </UI.Button>
          }
        >
          작업 중인 내용은 그대로 유지됩니다.
        </UI.Banner>
      ) : (
        <UI.Button variant="outline" onClick={() => setVisible(true)}>
          배너 다시 보기
        </UI.Button>
      );
    case "data-table":
      return (
        <UI.DataTable
          label="팀 멤버"
          rows={people}
          selectable
          pageSize={4}
          columns={[
            { key: "name", label: "이름", sortable: true },
            { key: "team", label: "팀", sortable: true },
            { key: "role", label: "역할" },
            {
              key: "status",
              label: "상태",
              render: (r) => (
                <UI.Badge tone={r.status === "활성" ? "success" : "warning"}>
                  {r.status}
                </UI.Badge>
              ),
            },
          ]}
          onSelectionChange={(ids) => setStatus(`${ids.length}개 선택`)}
        />
      );
    case "description-list":
      return (
        <UI.DescriptionList
          items={[
            { label: "프로젝트", value: "naria design system" },
            {
              label: "담당자",
              value: (
                <UI.Stack direction="row" align="center" gap={8}>
                  <UI.Avatar name="김나리" size="sm" />
                  김나리
                </UI.Stack>
              ),
            },
            { label: "생성일", value: "2026년 11월 14일" },
            {
              label: "공개 범위",
              value: <UI.Badge tone="accent">팀 공유</UI.Badge>,
            },
          ]}
        />
      );
    case "stat":
      return (
        <UI.Grid min={180}>
          <UI.Stat
            label="활성 프로젝트"
            value="24"
            change="지난달보다 4개 증가"
            caption="지난 30일 기준"
          />
          <UI.Stat
            label="작업 완료율"
            value="86.4%"
            change="지난달보다 8.2%p 증가"
            caption="완료한 작업 / 전체 작업"
          />
        </UI.Grid>
      );
    case "timeline":
      return (
        <UI.Timeline
          items={[
            {
              title: "프로젝트 생성",
              time: "11월 14일 09:00",
              status: "complete",
              description: "기본 설정을 완료했어요.",
            },
            {
              title: "팀원 초대",
              time: "11월 14일 10:30",
              status: "current",
              description: "3명의 응답을 기다리고 있어요.",
            },
            { title: "첫 작업 시작", status: "pending" },
          ]}
        />
      );
    case "tree":
      return (
        <UI.Stack>
          <UI.Tree
            label="프로젝트 문서"
            nodes={[
              {
                id: "design",
                label: "디자인 시스템",
                children: [
                  { id: "tokens", label: "토큰" },
                  {
                    id: "components",
                    label: "컴포넌트",
                    children: [
                      { id: "button", label: "Button" },
                      { id: "field", label: "TextField" },
                    ],
                  },
                ],
              },
              { id: "research", label: "리서치" },
              { id: "archive", label: "보관함" },
            ]}
            value={selected}
            onValueChange={setSelected}
          />
          <p className="nds-hint" role="status">
            선택: {selected === "product" ? "없음" : selected}
          </p>
        </UI.Stack>
      );
    case "container":
      return (
        <UI.Container narrow>
          <div className="nds-demo-block">
            max-width: 760px
            <br />
            화면에 맞춰 줄어드는 콘텐츠 영역
          </div>
        </UI.Container>
      );
    case "stack":
      return (
        <UI.Stack gap={12}>
          <div className="nds-demo-block">첫 번째 영역</div>
          <UI.Stack direction="row" gap={12} wrap>
            <div className="nds-demo-block">두 번째</div>
            <div className="nds-demo-block">세 번째</div>
          </UI.Stack>
        </UI.Stack>
      );
    case "grid":
      return (
        <UI.Grid min={140} gap={12}>
          {["토큰", "컴포넌트", "패턴", "가이드"].map((x) => (
            <div className="nds-demo-block" key={x}>
              {x}
            </div>
          ))}
        </UI.Grid>
      );
    case "aspect-ratio":
      return (
        <UI.Grid min={140}>
          <UI.AspectRatio ratio={16 / 9}>
            <span>16 : 9</span>
          </UI.AspectRatio>
          <UI.AspectRatio ratio={1}>
            <span>1 : 1</span>
          </UI.AspectRatio>
        </UI.Grid>
      );
    case "bottom-cta":
      return (
        <UI.BottomCTA description="설정은 언제든 변경할 수 있어요.">
          <UI.Button
            variant="outline"
            onClick={() => announce("이전 단계예요.")}
          >
            이전
          </UI.Button>
          <UI.Button onClick={() => announce("다음 단계예요.")}>
            동의하고 계속하기
          </UI.Button>
        </UI.BottomCTA>
      );
    case "text":
      return (
        <UI.Stack gap={14}>
          <UI.Text as="h2" size="title">
            명확한 정보, 편안한 읽기
          </UI.Text>
          <UI.Text size="body">
            일관된 크기와 간격은 콘텐츠를 빠르게 이해하도록 도와줍니다.
          </UI.Text>
          <UI.Text size="small" muted>
            본문과 보조 설명의 위계는 색과 크기를 함께 사용합니다.
          </UI.Text>
          <UI.Text size="caption" muted>
            Outfit + Wanted Sans · 12 / 16 / 24 / 40
          </UI.Text>
        </UI.Stack>
      );
    case "visually-hidden":
      return (
        <UI.Stack>
          <UI.Button onClick={() => announce("저장했어요.")}>
            <CheckIcon aria-hidden />
            <UI.VisuallyHidden>변경 사항 저장</UI.VisuallyHidden>
          </UI.Button>
          <p className="nds-hint">
            화면에는 체크 아이콘이, 보조기술에는 “변경 사항 저장”이 전달됩니다.
          </p>
        </UI.Stack>
      );
    default:
      return (
        <UI.Alert title="예제를 찾을 수 없습니다." tone="warning">
          컴포넌트 ID를 확인하세요.
        </UI.Alert>
      );
  }
}
