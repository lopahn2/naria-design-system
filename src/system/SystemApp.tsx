import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightIcon,
  ArrowTopRightIcon,
  CheckIcon,
  ChevronRightIcon,
  CodeIcon,
  CubeIcon,
  DashboardIcon,
  DownloadIcon,
  FileTextIcon,
  GearIcon,
  HamburgerMenuIcon,
  HomeIcon,
  LayersIcon,
  LightningBoltIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  PlusIcon,
  PersonIcon,
  MobileIcon,
  DesktopIcon,
  CheckCircledIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import * as UI from "../../packages/ui/src";
import { NariaMark } from "./Brand";
import {
  categories,
  components,
  componentById,
  foundations,
  patterns,
  type ComponentDoc,
} from "./catalog";
import { ComponentDemo, type DemoState } from "./Demos";
import { Foundation, Section, Rules } from "./Foundations";
import { PatternDemo } from "./Patterns";
import { MotionLab } from "../components/MotionLab";
import api from "./api.generated.json";
import tokens from "../../packages/ui/tokens.json";
import "../../packages/ui/src/styles.css";
import "./system.css";
const read = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};
const routeNow = () => location.hash.slice(1) || "system";
function saveFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function SystemApp() {
  const [route, setRoute] = useState(routeNow),
    [theme, setTheme] = useState<UI.Theme>(() =>
      read("naria:system:theme", "light") === "dark" ? "dark" : "light",
    ),
    [palette, setPalette] = useState<UI.PaletteName>(() =>
      UI.palettePresets.find((p) => p.id === read("naria:system:palette", "modern"))?.id || "modern",
    ),
    [density, setDensity] = useState<"comfortable" | "compact">("comfortable"),
    [reduced, setReduced] = useState(false),
    [menu, setMenu] = useState(false),
    [command, setCommand] = useState(false),
    [filter, setFilter] = useState("");
  useEffect(() => {
    const change = () => {
      setRoute(routeNow());
      setMenu(false);
      setFilter("");
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.title = "naria — Design System";
    try {
      localStorage.setItem("naria:system:theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    try { localStorage.setItem("naria:system:palette", palette); } catch {}
  }, [palette]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const [section, id] = route.split("/");
  const doc = section === "components" ? componentById[id] : undefined;
  const foundation = foundations.find((x) => x.id === id),
    pattern = patterns.find((x) => x.id === id);
  const category = categories.find((c) => c.id === doc?.category);
  const title = doc
    ? doc.name
    : section === "foundations"
      ? foundation?.name
      : section === "patterns"
        ? pattern?.name
        : route === "components"
          ? "컴포넌트"
          : route === "patterns"
            ? "화면 패턴"
            : route === "start"
              ? "시작하기"
              : route === "release"
                ? "릴리스와 적용"
                : route === "motion-lab"
                  ? "모션 갤러리"
                  : "naria design system";
  const commandItems = [
    {
      id: "home",
      label: "시스템 둘러보기",
      onSelect: () => (location.hash = "system"),
      icon: <HomeIcon />,
    },
    {
      id: "start",
      label: "시작하기 · 설치와 사용",
      onSelect: () => (location.hash = "start"),
      icon: <CodeIcon />,
    },
    {
      id: "motion-lab",
      label: "모션 갤러리 · 82개 인터랙션",
      onSelect: () => (location.hash = "motion-lab"),
      icon: <LightningBoltIcon />,
    },
    ...components.map((c) => ({
      id: c.id,
      label: `${c.name} · ${c.ko}`,
      onSelect: () => (location.hash = `components/${c.id}`),
      icon: <CubeIcon />,
    })),
    ...foundations.map((f) => ({
      id: f.id,
      label: `기반 · ${f.name}`,
      onSelect: () => (location.hash = `foundations/${f.id}`),
      icon: <LayersIcon />,
    })),
  ];
  const navigation = (
    <>
      <a className="nds-doc-brand" href="#system">
        <span>
          <NariaMark height={26} />
        </span>
        <strong>
          naria<small>DESIGN SYSTEM</small>
        </strong>
        <UI.Badge>1.0</UI.Badge>
      </a>
      <div className="nds-doc-nav-main">
        <NavLink href="system" current={route} icon={<HomeIcon />}>
          Overview
        </NavLink>
        <NavLink href="start" current={route} icon={<CodeIcon />}>
          시작하기
        </NavLink>
      </div>
      <div className="nds-doc-nav-group">
        <span>FOUNDATIONS</span>
        {foundations.map((f) => (
          <NavLink href={`foundations/${f.id}`} current={route} key={f.id}>
            {f.name}
          </NavLink>
        ))}
      </div>
      <div className="nds-doc-nav-group">
        <span>
          COMPONENTS <b>{components.length}</b>
        </span>
        <NavLink href="components" current={route} icon={<DashboardIcon />}>
          전체 컴포넌트
        </NavLink>
        {categories.map((c) => (
          <details key={c.id} open={category?.id === c.id || undefined}>
            <summary>
              {c.label}
              <small>
                {components.filter((x) => x.category === c.id).length}
              </small>
              <ChevronRightIcon />
            </summary>
            <div>
              {components
                .filter((x) => x.category === c.id)
                .map((x) => (
                  <NavLink
                    key={x.id}
                    href={`components/${x.id}`}
                    current={route}
                  >
                    {x.name}
                  </NavLink>
                ))}
            </div>
          </details>
        ))}
      </div>
      <div className="nds-doc-nav-group">
        <span>PATTERNS</span>
        {patterns.map((p) => (
          <NavLink key={p.id} href={`patterns/${p.id}`} current={route}>
            {p.name}
          </NavLink>
        ))}
      </div>
      <div className="nds-doc-nav-group">
        <span>RESOURCES</span>
        <NavLink href="motion-lab" current={route} icon={<LightningBoltIcon />}>
          모션 갤러리 <small>82</small>
        </NavLink>
        <NavLink href="all" current={route} icon={<BookmarkIcon />}>
          이전 디자인 탐색
        </NavLink>
        <NavLink href="release" current={route} icon={<FileTextIcon />}>
          릴리스와 적용
        </NavLink>
      </div>
      <div className="nds-doc-sidebar-footer">
        <span className="nds-status-dot" /> WEB + MOBILE WEB
        <br />
        <small>코드로 연결되는 디자인 언어</small>
      </div>
    </>
  );
  return (
    <UI.NariaProvider
      theme={theme}
      palette={palette}
      density={density}
      reducedMotion={reduced}
      className="nds-documentation"
    >
      <UI.ToastProvider>
        <a
          className="nds-doc-skip"
          href="#nds-main"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("nds-main")?.focus();
          }}
        >
          본문으로 건너뛰기
        </a>
        <aside className="nds-doc-sidebar" aria-label="디자인 시스템 탐색">
          {navigation}
        </aside>
        <div className="nds-doc-shell">
          <header className="nds-doc-topbar">
            <div className="nds-doc-breadcrumb">
              <UI.IconButton
                label="문서 메뉴 열기"
                className="nds-doc-menu-toggle"
                onClick={() => setMenu(true)}
              >
                <HamburgerMenuIcon />
              </UI.IconButton>
              <span>Design System</span>
              <ChevronRightIcon />
              <strong>{route === "system" ? "Overview" : title}</strong>
            </div>
            <div className="nds-doc-topbar-tools">
              <button
                type="button"
                className="nds-doc-search"
                onClick={() => setCommand(true)}
              >
                <MagnifyingGlassIcon />
                <span>문서 검색</span>
                <kbd>⌘ K</kbd>
              </button>
              <UI.IconButton
                label={
                  theme === "light" ? "다크 테마로 전환" : "라이트 테마로 전환"
                }
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
              </UI.IconButton>
              <a className="nds-doc-version" href="#release">
                v1.0
              </a>
            </div>
          </header>
          <main id="nds-main" tabIndex={-1} className="nds-doc-main">
            {route === "system" ? (
              <Overview />
            ) : route === "start" ? (
              <GettingStarted />
            ) : route === "release" ? (
              <Release />
            ) : route === "motion-lab" ? (
              <div className="nds-motion-page">
                <PageTitle
                  eyebrow="MOTION LIBRARY"
                  title="모션 갤러리"
                  description="디자인 시스템 안에서 82개 모션을 비교하고, 화면에 어울리는 반응을 골라보세요."
                />
                <div className="nds-motion-search">
                  <UI.SearchField
                    label="모션 검색"
                    placeholder="이름, 분류, 출처로 검색"
                    value={filter}
                    onValueChange={setFilter}
                  />
                </div>
                <MotionLab query={filter} theme={theme} forceReduced={reduced} />
              </div>
            ) : doc ? (
              <ComponentPage key={doc.id} doc={doc} />
            ) : section === "foundations" && foundation ? (
              <>
                <PageTitle
                  eyebrow={`FOUNDATIONS / ${foundation.en.toUpperCase()}`}
                  title={foundation.name}
                  description="모든 컴포넌트와 화면이 공유하는 설계의 기준입니다."
                />
                <Foundation id={id} onPaletteChange={setPalette} onThemeChange={setTheme} />
              </>
            ) : section === "patterns" && pattern ? (
              <>
                <PageTitle
                  eyebrow="PATTERN / WEB + MOBILE"
                  title={pattern.name}
                  description={pattern.description}
                />
                <div className="nds-pattern-intro">
                  <UI.Badge tone="accent">조합 예제</UI.Badge>
                  <p>
                    공통 컴포넌트로 구성한 실제 흐름입니다. 입력과 선택을
                    바꿔보고 작은 화면에서도 확인하세요.
                  </p>
                </div>
                <div className="nds-pattern-stage">
                  <PatternDemo id={id} />
                </div>
                <Section title="적용 규칙">
                  <Rules
                    good="상태를 소유한 화면이 검증·저장·비즈니스 규칙을 담당하고, 컴포넌트는 전달된 값과 콜백을 따릅니다."
                    bad="컴포넌트 안에 서비스 API, 결제, 권한 정책을 고정하지 않습니다."
                  />
                </Section>
              </>
            ) : route === "patterns" ? (
              <>
                <PageTitle
                  eyebrow="PATTERNS"
                  title="흐름으로 연결하기"
                  description="컴포넌트를 함께 사용할 때의 정보 구조와 반응형 동작을 확인하세요."
                />
                <PatternCards />
              </>
            ) : (
              <>
                <PageTitle
                  eyebrow="COMPONENT LIBRARY"
                  title="모든 구성요소"
                  description={`${components.length}개 구성요소의 상태, 사용 기준, 접근성, React API를 한곳에서 확인하세요.`}
                />
                <Catalog filter={filter} setFilter={setFilter} />
              </>
            )}
            <footer className="nds-doc-footer">
              <span>naria design system · 1.0.1</span>
              <span>하나의 언어, 다양한 화면.</span>
              <a href="#foundations/accessibility">
                접근성 기준 <ArrowTopRightIcon />
              </a>
            </footer>
          </main>
        </div>
        <UI.Drawer open={menu} onOpenChange={setMenu} title="문서 탐색">
          <nav className="nds-mobile-doc-nav">{navigation}</nav>
        </UI.Drawer>
        <UI.CommandPalette
          open={command}
          onOpenChange={setCommand}
          items={commandItems}
        />
        <details className="nds-doc-display-options">
          <summary>
            <GearIcon /> 표시 설정
          </summary>
          <UI.Switch
            label="모션 줄이기"
            checked={reduced}
            onCheckedChange={setReduced}
          />
          <UI.Select
            label="색상 시안"
            value={palette}
            onChange={(e) => setPalette(e.target.value as UI.PaletteName)}
            options={UI.palettePresets.map((p) => ({ value: p.id, label: p.name }))}
          />
          <a className="nds-palette-settings-link" href="#foundations/color">팔레트 나란히 비교하기</a>
          <UI.SegmentedControl
            label="정보 밀도"
            options={[
              { value: "comfortable", label: "편안하게" },
              { value: "compact", label: "조밀하게" },
            ]}
            value={density}
            onValueChange={(v) => setDensity(v as typeof density)}
          />
        </details>
      </UI.ToastProvider>
    </UI.NariaProvider>
  );
}
function NavLink({
  href,
  current,
  children,
  icon,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={`#${href}`}
      className="nds-doc-nav-link"
      aria-current={href === current ? "page" : undefined}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="nds-doc-page-title">
      <p className="nds-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
function Overview() {
  const [view, setView] = useState("month"),
    [enabled, setEnabled] = useState(true),
    [saved, setSaved] = useState(false);
  return (
    <>
      <div className="nds-overview-hero">
        <div>
          <div className="nds-overview-kicker">
            <span className="nds-status-dot" /> NARIA DESIGN SYSTEM{" "}
            <span>/ 1.0</span>
          </div>
          <h1>
            작은 반응까지,
            <br />
            하나의 언어로.
          </h1>
          <p>
            웹에서 모바일까지 이어지는
            <br />
            naria의 컴포넌트와 설계 기준.
          </p>
          <div className="nds-hero-actions">
            <a className="nds-button" href="#components">
              컴포넌트 살펴보기 <ArrowRightIcon />
            </a>
            <a className="nds-button nds-button--ghost" href="#start">
              시작하기 <ChevronRightIcon />
            </a>
          </div>
          <div className="nds-overview-numbers">
            <span>
              <b>{components.length}</b> 구성요소
            </span>
            <span>
              <b>9</b> 기반 규칙
            </span>
            <span>
              <b>6</b> 화면 패턴
            </span>
          </div>
        </div>
        <div className="nds-hero-composition">
          <div className="nds-hero-card-label">
            <span>DESIGNED TO WORK TOGETHER</span>
            <span>01 / SYSTEM</span>
          </div>
          <UI.Card
            title="나의 작업 공간"
            description="좋은 경험을 함께 만들어 가요."
            actions={<UI.Avatar name="나리" />}
          >
            <UI.Stack gap={20}>
              <UI.SegmentedControl
                label="요약 기간"
                options={[
                  { value: "week", label: "이번 주" },
                  { value: "month", label: "이번 달" },
                ]}
                value={view}
                onValueChange={setView}
              />
              <div className="nds-hero-metric">
                <div>
                  <span>완료한 작업</span>
                  <strong>
                    {view === "month" ? "128" : "32"}
                    <small>건</small>
                  </strong>
                </div>
                <UI.Badge tone="success">+12.4%</UI.Badge>
              </div>
              <UI.Progress
                label="주간 목표"
                value={view === "month" ? 76 : 64}
              />
              <UI.Divider />
              <UI.Switch
                label="활동 알림"
                description="중요한 소식만 간결하게"
                checked={enabled}
                onCheckedChange={setEnabled}
              />
              <UI.Button
                fullWidth
                leading={saved ? <CheckIcon /> : <PlusIcon />}
                onClick={() => setSaved(!saved)}
              >
                {saved ? "프로젝트를 만들었어요" : "프로젝트 만들기"}
              </UI.Button>
            </UI.Stack>
          </UI.Card>
          <div className="nds-hero-footnote">
            <span>
              <CheckCircledIcon /> Light & dark
            </span>
            <span>
              <CheckCircledIcon /> Responsive
            </span>
            <span>
              <CheckCircledIcon /> Keyboard
            </span>
          </div>
        </div>
      </div>
      <div className="nds-overview-strip">
        <span>명확한 위계</span>
        <i />
        <span>일관된 상태</span>
        <i />
        <span>의미 있는 모션</span>
        <i />
        <span>코드와 문서의 연결</span>
      </div>
      <Section title="시스템을 이루는 세 가지">
        <div className="nds-entry-cards">
          {[
            [
              "foundations/principles",
              "01",
              "Foundations",
              "모든 화면이 공유하는 기준",
              "색상·타입·간격·반응형·모션",
              LayersIcon,
            ],
            [
              "components",
              "02",
              "Components",
              "작동하는 재사용 구성요소",
              "변형·상태·API·키보드",
              CubeIcon,
            ],
            [
              "patterns",
              "03",
              "Patterns",
              "하나의 흐름으로 연결하기",
              "가입·설정·검색·관리·주문",
              DashboardIcon,
            ],
          ].map(([href, n, title, description, meta, Icon]) => (
            <a href={`#${href}`} key={String(n)}>
              <span className="nds-entry-number">
                {String(n)}
                <ArrowTopRightIcon />
              </span>
              {typeof Icon !== "string" && <Icon width={22} height={22} />}
              <h3>{String(title)}</h3>
              <p>{String(description)}</p>
              <small>{String(meta)}</small>
            </a>
          ))}
        </div>
      </Section>
      <Section title="무엇을 만들고 있나요?">
        <div className="nds-category-links">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#components/${components.find((x) => x.category === c.id)?.id}`}
            >
              <span>
                {c.label}
                <small>{c.en}</small>
              </span>
              <b>{components.filter((x) => x.category === c.id).length}</b>
              <ArrowRightIcon />
            </a>
          ))}
        </div>
      </Section>
      <Section title="화면으로 확인하기">
        <PatternCards />
      </Section>
      <div className="nds-motion-callout">
        <div>
          <p className="nds-eyebrow">MOTION, WITH PURPOSE</p>
          <h2>움직임에도 공통의 기준을.</h2>
          <p>82개 모션을 바탕으로 정리한 6가지 반응 규칙.</p>
        </div>
        <a
          className="nds-button nds-button--outline"
          href="#foundations/motion"
        >
          모션 가이드 <ArrowRightIcon />
        </a>
      </div>
    </>
  );
}
function PatternCards() {
  return (
    <div className="nds-pattern-cards">
      {patterns.map((p, i) => (
        <a href={`#patterns/${p.id}`} key={p.id}>
          <div
            className={`nds-pattern-mini nds-pattern-mini--${i}`}
            aria-hidden
          >
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="nds-between">
            <strong>{p.name}</strong>
            <ArrowTopRightIcon />
          </span>
          <p>{p.description}</p>
        </a>
      ))}
    </div>
  );
}
function Catalog({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (v: string) => void;
}) {
  const [category, setCategory] = useState("all");
  const filtered = components.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      `${c.name} ${c.ko} ${c.summary}`
        .toLowerCase()
        .includes(filter.toLowerCase()),
  );
  return (
    <>
      <div className="nds-catalog-tools">
        <UI.SearchField
          label="컴포넌트 검색"
          value={filter}
          onValueChange={setFilter}
          placeholder="이름 또는 기능 검색"
        />
        <UI.Select
          label="영역"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { value: "all", label: "전체 영역" },
            ...categories.map((x) => ({ value: x.id, label: x.label })),
          ]}
        />
      </div>
      <p className="nds-hint" role="status" style={{ margin: "20px 0" }}>
        총 {filtered.length}개 구성요소
      </p>
      <div className="nds-component-index">
        {filtered.map((c) => (
          <a href={`#components/${c.id}`} key={c.id}>
            <span className="nds-component-symbol">
              <CubeIcon />
            </span>
            <div>
              <strong>{c.name}</strong>
              <span>{c.ko}</span>
              <p>{c.summary}</p>
            </div>
            <ArrowTopRightIcon />
          </a>
        ))}
      </div>
      {!filtered.length && (
        <UI.EmptyState
          title="일치하는 구성요소가 없어요"
          description="검색어나 영역을 바꿔보세요."
          action={
            <UI.Button
              variant="outline"
              onClick={() => {
                setFilter("");
                setCategory("all");
              }}
            >
              초기화
            </UI.Button>
          }
        />
      )}
    </>
  );
}
const disableIds = new Set([
  "button",
  "icon-button",
  "split-button",
  "toggle-button",
  "copy-button",
  "hold-button",
  "field",
  "text-field",
  "textarea",
  "password-field",
  "search-field",
  "number-field",
  "select",
  "combobox",
  "multi-select",
  "checkbox",
  "radio-group",
  "switch",
  "slider",
  "rating",
  "otp-input",
  "file-upload",
  "date-picker",
  "date-range-picker",
  "time-picker",
  "color-picker",
  "calendar",
  "segmented-control",
]);
const errorIds = new Set([
  "field",
  "text-field",
  "textarea",
  "password-field",
  "number-field",
  "select",
  "combobox",
  "multi-select",
  "radio-group",
  "otp-input",
  "date-picker",
  "time-picker",
  "agreement",
]);
function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const [state, setState] = useState<DemoState>("default"),
    [size, setSize] = useState<UI.Size>("md"),
    [width, setWidth] = useState("fluid"),
    [tab, setTab] = useState("usage"),
    [revision, setRevision] = useState(0);
  const data = api[doc.id as keyof typeof api];
  const states = [
    { value: "default", label: "기본" },
    ...(disableIds.has(doc.id) ? [{ value: "disabled", label: "비활성" }] : []),
    ...(errorIds.has(doc.id) ? [{ value: "error", label: "오류" }] : []),
    ...(doc.id === "button" ? [{ value: "loading", label: "처리 중" }] : []),
  ];
  const controls = ["button", "icon-button"].includes(doc.id);
  return (
    <>
      <PageTitle
        eyebrow={`${categories.find((c) => c.id === doc.category)?.en.toUpperCase()} / ${doc.ko}`}
        title={doc.name}
        description={doc.summary}
      />
      <div className="nds-component-meta">
        <UI.Badge tone="success" dot>
          React + TypeScript
        </UI.Badge>
        <span>Light / Dark</span>
        <span>Web / Mobile web</span>
        <code>{doc.motion}</code>
      </div>
      <div className="nds-example">
        <div className="nds-example-toolbar">
          <span>
            <span className="nds-status-dot" /> LIVE PREVIEW
          </span>
          <div>
            <button
              type="button"
              aria-label="가변 너비"
              aria-pressed={width === "fluid"}
              onClick={() => setWidth("fluid")}
            >
              <DesktopIcon />
            </button>
            <button
              type="button"
              aria-label="390px 너비"
              aria-pressed={width === "390"}
              onClick={() => setWidth("390")}
            >
              <MobileIcon />
            </button>
            <UI.Button
              size="sm"
              variant="ghost"
              onClick={() => setRevision((v) => v + 1)}
            >
              초기화
            </UI.Button>
          </div>
        </div>
        <div className="nds-example-body">
          <div
            className="nds-example-surface"
            style={{
              width: width === "fluid" ? "100%" : 390,
              maxWidth: "100%",
            }}
          >
            <ComponentDemo
              key={`${doc.id}-${state}-${revision}`}
              id={doc.id}
              state={state}
              size={size}
            />
          </div>
        </div>
        {(states.length > 1 || controls) && (
          <div className="nds-example-controls">
            {states.length > 1 && (
              <UI.Select
                label="상태"
                value={state}
                options={states}
                onChange={(e) => setState(e.target.value as DemoState)}
              />
            )}{" "}
            {controls && (
              <UI.Select
                label="크기"
                value={size}
                options={[
                  { value: "sm", label: "Small · 36" },
                  { value: "md", label: "Medium · 44" },
                  { value: "lg", label: "Large · 52" },
                ]}
                onChange={(e) => setSize(e.target.value as UI.Size)}
              />
            )}
          </div>
        )}
      </div>
      <UI.Tabs
        label="컴포넌트 문서"
        value={tab}
        onValueChange={setTab}
        items={[
          {
            value: "usage",
            label: "사용 기준",
            content: (
              <>
                <Section title="변형과 구성">
                  <div className="nds-variant-tags">
                    {doc.variants.map((v) => (
                      <UI.Badge key={v}>{v}</UI.Badge>
                    ))}
                  </div>
                  <Rules good={doc.rule} bad={doc.avoid} />
                </Section>
                <Section title="반응형 동작">
                  <UI.Text size="body" muted>
                    {doc.mobile}
                  </UI.Text>
                  <div className="nds-responsive-contract">
                    <span>
                      <MobileIcon /> 모바일 · 320–599
                    </span>
                    <span>
                      <DesktopIcon /> 데스크톱 · 900+
                    </span>
                  </div>
                </Section>
                <Section title="상태를 설계하는 순서">
                  <UI.DescriptionList
                    items={[
                      {
                        label: "기본",
                        value: "목적과 현재 값을 명확하게 표시합니다.",
                      },
                      { label: "상호작용", value: doc.keyboard },
                      {
                        label: "오류와 예외",
                        value:
                          doc.category === "forms"
                            ? "입력값을 보존하고 수정 가능한 오류를 라벨 아래에 표시합니다."
                            : "빈 값·로딩·비활성 상태에서도 의미와 읽는 순서를 유지합니다.",
                      },
                      {
                        label: "모션",
                        value:
                          doc.motion +
                          " · 감소 모션에서는 시각 전환을 줄이고 실행·검증 조건은 유지합니다.",
                      },
                    ]}
                  />
                </Section>
              </>
            ),
          },
          {
            value: "api",
            label: "React API",
            content: (
              <Section title="Props">
                <p className="nds-hint">
                  아래 표는 실제 TypeScript export에서 생성합니다. 표준 HTML
                  속성과 이벤트는 해당 네이티브 요소에 전달됩니다.
                </p>
                <div className="nds-doc-table-wrap">
                  <table className="nds-doc-table nds-api-table">
                    <thead>
                      <tr>
                        <th>속성</th>
                        <th>타입</th>
                        <th>필수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.props.map((p) => (
                        <tr key={p.name}>
                          <td>
                            <code>{p.name}</code>
                          </td>
                          <td>
                            <code>{p.type}</code>
                          </td>
                          <td>{p.required ? "필수" : "선택"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {doc.id === "toast" && (
                  <p className="nds-hint">
                    useToast()는 title, description, tone, duration, action을
                    받는 함수를 반환합니다. action이 있으면 자동으로 닫히지
                    않습니다.
                  </p>
                )}
              </Section>
            ),
          },
          {
            value: "code",
            label: "실행 예제 코드",
            content: (
              <Section title="실제 데모의 소스">
                <p className="nds-hint">
                  NariaProvider와 ToastProvider 내부에서 사용하세요.
                  상태·이벤트를 포함한 현재 데모 코드를 다운로드할 수 있습니다.
                </p>
                <div className="nds-code-actions">
                  <UI.CopyButton
                    variant="outline"
                    size="sm"
                    value={data.code}
                  />
                  <UI.Button
                    variant="outline"
                    size="sm"
                    leading={<DownloadIcon />}
                    onClick={() =>
                      saveFile(
                        `${doc.name}.example.tsx`,
                        data.code,
                        "text/plain",
                      )
                    }
                  >
                    TSX 다운로드
                  </UI.Button>
                </div>
                <pre className="nds-code-block nds-example-code">
                  <code>{data.code}</code>
                </pre>
              </Section>
            ),
          },
          {
            value: "accessibility",
            label: "접근성",
            content: (
              <>
                <Section title="키보드와 의미 구조">
                  <UI.Text size="body" muted>
                    {doc.keyboard}
                  </UI.Text>
                </Section>
                <Rules
                  good="이름·역할·상태를 보조기술에 전달하고 포커스를 항상 표시합니다. 실제 제품 내용으로 키보드·터치·확대·스크린 리더를 검증하세요."
                  bad="이 문서의 예제가 제품 전체의 접근성 인증을 대신한다고 가정하지 않습니다."
                />
                <Section title="검증할 상황">
                  <UI.Checkbox label="키보드만으로 사용하고 상태를 확인할 수 있다" />
                  <UI.Checkbox label="라이트·다크에서 텍스트와 경계 대비를 확인했다" />
                  <UI.Checkbox label="작은 화면·긴 텍스트·200% 확대에서 내용이 잘리지 않는다" />
                  <UI.Checkbox label="감소 모션에서도 의미와 결과가 유지된다" />
                </Section>
              </>
            ),
          },
        ]}
      />
      <div className="nds-component-pagination">
        {components.indexOf(doc) > 0 && (
          <a href={`#components/${components[components.indexOf(doc) - 1].id}`}>
            이전 · {components[components.indexOf(doc) - 1].name}
          </a>
        )}
        {components.indexOf(doc) < components.length - 1 && (
          <a href={`#components/${components[components.indexOf(doc) + 1].id}`}>
            다음 · {components[components.indexOf(doc) + 1].name}{" "}
            <ArrowRightIcon />
          </a>
        )}
      </div>
    </>
  );
}
function GettingStarted() {
  return (
    <>
      <PageTitle
        eyebrow="GET STARTED"
        title="코드에서 시작하기"
        description="토큰·컴포넌트·화면을 같은 원본으로 관리합니다. React 19와 TypeScript를 기준으로 구성했습니다."
      />
      <Section title="1. 패키지 연결">
        <p>
          현재 제공한 소스의 <code>packages/ui</code>가 컴포넌트 패키지입니다.
          루트에서 <code>npm run build:ui</code>로 번들·타입·스타일을 생성한 뒤
          로컬 패키지로 설치하세요.
        </p>
        <pre className="nds-code-block">{`# 디자인 시스템 저장소\nnpm ci\nnpm run build:ui\ncd packages/ui\nnpm pack\n\n# 사용할 React 프로젝트\nnpm install /path/to/naria-ui-1.0.1.tgz\nnpm install @radix-ui/react-icons`}</pre>
        <UI.Alert title="npm 공개 배포 전 단계" tone="info">
          @naria/ui 이름의 레지스트리 배포는 수행하지 않았습니다. 제공한 패키지
          파일 또는 워크스페이스 경로로 설치하세요.
        </UI.Alert>
      </Section>
      <Section title="2. 공통 환경 적용">
        <pre className="nds-code-block">{`import { NariaProvider, ToastProvider, Button } from '@naria/ui';\nimport '@naria/ui/styles.css';\n\nexport function App() {\n  return (\n    <NariaProvider theme="light" density="comfortable">\n      <ToastProvider>\n        <Button onClick={() => console.log('continue')}>\n          계속하기\n        </Button>\n      </ToastProvider>\n    </NariaProvider>\n  );\n}`}</pre>
      </Section>
      <Section title="3. 상태는 화면이 소유합니다">
        <pre className="nds-code-block">{`const [email, setEmail] = useState('');\n\n<TextField\n  label="이메일"\n  type="email"\n  value={email}\n  onChange={event => setEmail(event.target.value)}\n  error={errors.email}\n  required\n/>`}</pre>
        <p>
          API 요청과 비즈니스 검증은 화면이나 도메인 계층에서 처리합니다.
          컴포넌트는 값·상태·콜백을 받아 표시와 상호작용을 담당합니다.
        </p>
      </Section>
      <Section title="4. 토큰 재사용">
        <div className="nds-code-actions">
          <UI.Button
            variant="outline"
            leading={<DownloadIcon />}
            onClick={() =>
              saveFile(
                "naria-tokens.json",
                JSON.stringify(tokens, null, 2),
                "application/json",
              )
            }
          >
            토큰 JSON 다운로드
          </UI.Button>
        </div>
        <pre className="nds-code-block">{`.product-panel {\n  background: var(--nds-surface);\n  color: var(--nds-text);\n  border: 1px solid var(--nds-border);\n  border-radius: var(--nds-radius-card);\n  padding: var(--nds-space-24);\n}`}</pre>
      </Section>
      <UI.Link href="#patterns">전체 화면 조합 예제로 이동 →</UI.Link>
    </>
  );
}
function Release() {
  return (
    <>
      <PageTitle
        eyebrow="RELEASE / 1.0.1"
        title="적용 가능한 하나의 체계"
        description="비교용 탐색판에서 재사용 가능한 웹·모바일웹 시스템으로 발전시킨 첫 통합 버전입니다."
      />
      <Section title="이번 버전의 범위">
        <UI.DescriptionList
          items={[
            {
              label: "기반",
              value:
                "원시·의미 토큰, light/dark, 서비스 테마, 밀도, Outfit + Wanted Sans, Radix Icons",
            },
            {
              label: "구성요소",
              value: `8개 영역 · ${components.length}개 문서화된 React 구성요소`,
            },
            {
              label: "화면 패턴",
              value: "가입, 설정, 검색, 데이터 관리, 주문 요약, 대시보드",
            },
            {
              label: "모션",
              value: "기존 82개 모션 보존 + 제품용 6가지 역할과 감소 모션 정책",
            },
            {
              label: "산출물",
              value:
                "웹 문서, 재사용 패키지, 타입 선언, 토큰 JSON/CSS, 오프라인 HTML, 전체 소스",
            },
          ]}
        />
      </Section>
      <Section title="제품과 연결할 부분">
        <UI.Alert title="실제 서비스 기능은 연결 지점으로 남깁니다" tone="info">
          인증, 결제, 파일 업로드 서버, 권한 정책, 메일 발송은 이 디자인
          시스템의 UI 범위와 분리합니다. 화면 예제는 실제 외부 작업을 수행하지
          않습니다.
        </UI.Alert>
      </Section>
      <Section title="사용 전에 확인하세요">
        <Rules
          good="제공된 컴포넌트 API를 유지하고 서비스별 테마·도메인 로직을 외부에서 조합합니다. 패키지 버전을 고정하고 변경 내역을 관리하세요."
          bad="특수 차트·지도·리치 텍스트 편집기까지 범용 UI 하나에 무리하게 넣지 않습니다."
        />
        <p className="nds-hint">
          타입·논리·렌더링 및 핵심 브라우저 흐름의 검증 결과는 전달 소스의
          docs/system/VALIDATION.md에 기록합니다. 실제 기기·보조기술·장기간 제품
          검증은 별도로 수행해야 합니다.
        </p>
      </Section>
    </>
  );
}
