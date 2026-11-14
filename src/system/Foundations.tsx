import { useState } from "react";
import {
  CheckIcon,
  Cross2Icon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  PlusIcon,
  GearIcon,
  HomeIcon,
  BellIcon,
  DownloadIcon,
  FileTextIcon,
  HeartIcon,
  StarIcon,
  InfoCircledIcon,
  ChevronRightIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import * as UI from "../../packages/ui/src";
import tokens from "../../packages/ui/tokens.json";
import { motionRecipes } from "./catalog";
import { NariaMark } from "./Brand";
import { PaletteChooser, PaletteScales, PaletteApplication } from "./PaletteChooser";
const sources = [
  [
    "IBM · Carbon",
    "명확한 타입 위계와 정보 밀도",
    "https://www.carbondesignsystem.com/building-blocks/foundations/typography/overview",
  ],
  [
    "Toss · TDS Mobile",
    "입력·상태·모바일 흐름의 문서 구조",
    "https://tossmini-docs.toss.im/tds-mobile/",
  ],
  [
    "Radix Icons",
    "직접 그리지 않은 공식 아이콘",
    "https://www.radix-ui.com/icons",
  ],
  [
    "WAI-ARIA APG",
    "키보드·상태·포커스 모델",
    "https://www.w3.org/WAI/ARIA/apg/",
  ],
  [
    "DesignBookmark Motion",
    "82개 모션의 비교와 역할 분류",
    "https://designbookmark.com/motion",
  ],
];
export function Foundation({ id, onPaletteChange, onThemeChange }: { id: string; onPaletteChange?: (value: UI.PaletteName) => void; onThemeChange?: (value: UI.Theme) => void }) {
  const { theme, palette } = UI.useNaria();
  const preset = UI.palettePresets.find((p) => p.id === palette)!;
  const [replay, setReplay] = useState(0),
    [width, setWidth] = useState(390),
    [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  if (id === "principles")
    return (
      <>
        <div className="nds-principles">
          {[
            [
              "01",
              "명확하게 읽힌다",
              "IBM의 정보 위계를 바탕으로 제목·본문·보조 정보를 구분합니다. 장식보다 내용과 다음 행동이 먼저 보입니다.",
            ],
            [
              "02",
              "한 번에 이해된다",
              "Apple·IBM의 행동 위계와 Toss·Adobe의 입력 흐름을 연결합니다. 상태를 숨기지 않고, 실수한 자리에서 복구할 수 있게 합니다.",
            ],
            [
              "03",
              "작은 화면에서도 같다",
              "기능과 정보의 우선순위는 유지합니다. 탐색 위치, 표의 표현, 모달 형태는 화면의 공간과 입력 방식에 맞춰 바꿉니다.",
            ],
            [
              "04",
              "움직임에 이유가 있다",
              "선택·펼침·완료가 왜 바뀌었는지 설명합니다. 짧은 반응을 기본으로 하고 반복 연출은 대기 상태에만 사용합니다.",
            ],
          ].map(([n, title, body]) => (
            <article key={n}>
              <span>{n}</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <Section title="선호에서 공통 규칙으로">
          <UI.DescriptionList
            items={[
              {
                label: "버튼 · Apple / IBM",
                value:
                  "주요 행동은 짙은 중립색, 보조 행동은 낮은 대비의 표면으로 구분합니다.",
              },
              {
                label: "타이포 · IBM",
                value:
                  "Wanted Sans 400/600. 컴포넌트는 고정 타입, 페이지 제목은 유동 타입을 사용합니다.",
              },
              {
                label: "입력 · Toss / Adobe",
                value:
                  "라벨·도움말·오류를 같은 순서로 구성합니다. 입력에 필요한 정보를 미리 제공합니다.",
              },
              {
                label: "카드 · Toss / Apple 개선",
                value:
                  "과한 카드 중첩을 줄이고 내용·메타 정보·행동의 간격을 나눕니다.",
              },
              {
                label: "상태 · Apple / Microsoft / IBM",
                value:
                  "문제의 원인과 수정 행동을 같은 영역에 둡니다. 색과 아이콘에만 의존하지 않습니다.",
              },
              {
                label: "아이콘 · Radix / OpenAI 취향",
                value:
                  "이번 구현은 공식 Radix Icons를 사용합니다. 임의로 그린 브랜드 아이콘은 사용하지 않습니다.",
              },
            ]}
          />
        </Section>
        <Section title="참고한 공식 자료">
          <div className="nds-source-list">
            {sources.map(([name, description, url]) => (
              <a href={url} key={name} target="_blank" rel="noreferrer">
                <strong>{name}</strong>
                <span>{description}</span>
                <ArrowRightIcon />
              </a>
            ))}
          </div>
          <p className="nds-hint" style={{ marginTop: 16 }}>
            TDS는 문서의 체계와 모바일 범위에 대한 참고입니다. 언급한 Figma 파일
            자체는 제공되지 않아 공개 문서를 참고했으며, TDS 자산이나 코드를
            복제하지 않았습니다.
          </p>
        </Section>
      </>
    );
  if (id === "color")
    return (
      <>
        {onPaletteChange && <Section title="두 가지 색상 시안">
          <div className="nds-palette-intro">
            <p>배경은 흰색과 회색으로, 색은 필요한 포인트에. 모던과 캐주얼의 6색 팔레트를 실제 컴포넌트에 적용해 비교하세요.</p>
            {onThemeChange && <UI.SegmentedControl label="팔레트 색상 모드" value={theme} onValueChange={(v) => onThemeChange(v as UI.Theme)} options={[{value:"light",label:"라이트"},{value:"dark",label:"다크"}]} />}
          </div>
          <PaletteChooser value={palette} onChange={onPaletteChange} />
          <p className="nds-palette-current" role="status">현재 시안: {preset.name} · {theme === "light" ? "라이트" : "다크"} · 선택은 이 브라우저에 저장됩니다.</p>
        </Section>}
        <Section title="로고">
          <p className="nds-palette-scale-intro">소문자 n과 a가 한 획을 공유합니다. 글자는 본문색(--nds-text)을 따르고, 겹친 부분만 선택한 시안의 블루 500을 사용합니다. 라이트·다크와 시안 변경에 함께 반응합니다.</p>
          <div className="nds-brand-specimen">
            <div><NariaMark height={72} title="naria 로고" /><code>canvas</code></div>
            <div className="nds-brand-specimen-inverse"><NariaMark height={72} title="naria 로고, 반전" /><code>inverse</code></div>
            <div className="nds-brand-specimen-small"><NariaMark height={32} /><NariaMark height={20} /><NariaMark height={12} /><code>32 · 20 · 12px</code></div>
          </div>
        </Section>
        <Section title="공통 무채색 베이스">
          <p className="nds-palette-scale-intro">기본 청록에서 사용하던 흰색·회색 표면을 두 시안이 공유합니다. 입력창, 코드박스, 카드, 본문 영역은 같은 무채색을 사용하고, 다크 모드에서는 같은 어두운 회색으로 전환합니다.</p>
          <div className="nds-palette-neutral">{[["canvas","화면 배경"],["surface","입력 · 카드"],["subtle","코드 · 보조 영역"],["border","기본 경계선"]].map(([token,label])=><div key={token}>
            <i style={{background:`var(--nds-${token})`}} aria-hidden /><strong>{label}</strong><code>--nds-{token}</code>
          </div>)}</div>
        </Section>
        <Section title={`${preset.name} · 6색 팔레트`}>
          <p className="nds-palette-scale-intro">500이 기준색입니다. 100·300은 채도를 낮추고 밝게, 700·900은 깊이를 더해 구성했습니다. 연한 색도 배경 전체를 채우지 않고 선택 상태와 작은 배지에 사용합니다.</p>
          <PaletteScales palette={palette} />
        </Section>
        <Section title="컴포넌트 적용 미리 보기">
          <PaletteApplication />
        </Section>
        <Section title="사용 기준">
          <UI.DescriptionList items={[
            {term:"기본 표면",description:"화면 배경·입력·코드·본문 카드에는 canvas / surface / subtle만 사용합니다."},
            {term:"컬러 포인트",description:"주요 버튼, 포커스, 선택 상태, 카테고리 표시처럼 의미 있는 작은 영역에만 사용합니다."},
            {term:"텍스트 대비",description:"밝은 기준색을 그대로 흰 글자와 조합하지 않습니다. 버튼과 링크에는 대비를 만족하는 진한 단계를 적용합니다."},
          ].map(x=>({label:x.term,value:x.description}))} />
        </Section>
        <details className="nds-palette-token-details"><summary>의미 색상 토큰과 상태 예제 펼치기</summary>
          <Section title="의미 색상">
            <div className="nds-swatch-grid">
              {Object.entries(tokens.semantic[theme]).map(([name, value]) => (
                <div className="nds-swatch" key={name}>
                  <div style={{ background: `var(--nds-${name})` }} />
                  <strong>{name}</strong><code>--nds-{name}</code>
                  <small>{preset[theme][name as keyof UI.PaletteRoles] || tokens.color[value.$value.slice(7,-1) as keyof typeof tokens.color]?.$value || value.$value}</small>
                </div>
              ))}
            </div>
          </Section>
          <Section title="상태의 의미는 유지합니다">
            <UI.Stack gap={12}>
              <UI.Alert title="정상 처리" tone="success">요청한 변경을 저장했습니다.</UI.Alert>
              <UI.Alert title="확인 필요" tone="warning">기존 설정에 영향을 주는 변경입니다.</UI.Alert>
              <UI.Alert title="입력 수정" tone="danger">이메일 형식을 확인하고 다시 입력해 주세요.</UI.Alert>
            </UI.Stack>
          </Section>
        </details>
        <Section title="서비스에 적용하기">
          <pre className="nds-code-block">{`<NariaProvider\n  theme="${theme}"\n  palette="${palette}"\n>\n  <App />\n</NariaProvider>\n\n/* 2개 시안 · 6색 × 5단계 / 기본 표면은 공통 무채색 */\n.category-dot {\n  background: var(--nds-palette-orange-500);\n}`}</pre>
          <p className="nds-hint">오류·성공·경고의 의미 색은 시안과 독립적으로 유지합니다. 기본 표면 토큰은 팔레트가 변경하지 않습니다.</p>
        </Section>
      </>
    );
  if (id === "typography")
    return (
      <>
        <div className="nds-type-intro">
          <span>WANTED SANS</span>
          <h2>
            생각을 명확하게,
            <br />
            경험은 자연스럽게.
          </h2>
          <p>한글과 영문을 같은 리듬으로 읽는 제품 타이포그래피.</p>
        </div>
        <Section title="타입 스케일">
          <div className="nds-type-table">
            {(
              [
                ["display", "32 → 56", "1.18", "큰 시작 화면"],
                ["title", "28 → 40", "1.30", "페이지 제목"],
                ["heading", "24", "1.40", "섹션 제목"],
                ["subheading", "18", "1.50", "그룹 제목"],
                ["body", "16", "1.70", "본문과 입력"],
                ["small", "14", "1.65", "컨트롤과 표"],
                ["caption", "12", "1.60", "보조 설명"],
              ] as const
            ).map(([size, px, line, use]) => (
              <div key={size}>
                <code>{size}</code>
                <UI.Text
                  size={size}
                  weight={
                    size === "body" || size === "small" || size === "caption"
                      ? "regular"
                      : "semibold"
                  }
                >
                  좋은 경험의 기준 Aa 123
                </UI.Text>
                <small>
                  {px}px / {line} · {use}
                </small>
              </div>
            ))}
          </div>
        </Section>
        <Rules
          good="본문은 45–75자 정도의 읽기 너비를 유지하고 한국어 문장 단위로 줄바꿈합니다."
          bad="화면을 맞추려고 본문을 12px 이하로 줄이거나 줄 높이를 압축하지 않습니다."
        />
      </>
    );
  if (id === "spacing")
    return (
      <>
        <Section title="4px 기반, 필요한 곳에 2px">
          <div className="nds-space-list">
            {Object.keys(tokens.space).map((v) => (
              <div key={v}>
                <code>space-{v}</code>
                <span style={{ width: `${Number(v) * 3}px` }} />
                <b>{v}px</b>
              </div>
            ))}
          </div>
        </Section>
        <Section title="편안함과 밀도">
          <UI.SegmentedControl
            label="밀도 체험"
            options={[
              { value: "comfortable", label: "편안한 간격" },
              { value: "compact", label: "조밀한 간격" },
            ]}
            value={density}
            onValueChange={(v) => setDensity(v as typeof density)}
          />
          <UI.NariaProvider density={density}>
            <div className="nds-density-demo">
              <UI.TextField
                label="프로젝트 이름"
                placeholder="naria design system"
              />
              <UI.Button>저장하기</UI.Button>
            </div>
          </UI.NariaProvider>
          <p className="nds-hint">
            기본 컨트롤은 44px, 조밀한 데스크톱은 36px입니다. 터치 기기에서는
            작은 컨트롤도 최소 44px 영역을 확보합니다. 모바일 기본 입력 높이는
            48px입니다.
          </p>
        </Section>
        <Rules
          good="콘텐츠와 라벨은 8px, 관련 컨트롤은 12–16px, 섹션은 32–48px 간격을 사용합니다."
          bad="모든 영역에 동일한 여백을 사용해 정보의 그룹을 흐리지 않습니다."
        />
      </>
    );
  if (id === "responsive")
    return (
      <>
        <UI.Alert title="공간에 맞춰 구조를 바꿉니다" tone="info">
          같은 화면을 축소하는 방식보다, 핵심 작업을 유지하며 탐색·정보
          배열·레이어를 전환합니다.
        </UI.Alert>
        <Section title="화면 규칙">
          <div className="nds-doc-table-wrap">
            <table className="nds-doc-table">
              <thead>
                <tr>
                  <th>구간</th>
                  <th>너비</th>
                  <th>그리드 / 여백</th>
                  <th>동작</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Compact",
                    "320–599",
                    "4열 / 16px",
                    "하단 탐색 · 표→카드 · 모달→시트",
                  ],
                  [
                    "Medium",
                    "600–899",
                    "8열 / 24px",
                    "콘텐츠 1–2열 · 접힌 사이드바",
                  ],
                  [
                    "Wide",
                    "900–1199",
                    "12열 / 24px",
                    "고정 사이드바 · 주요 영역 확장",
                  ],
                  [
                    "Desktop",
                    "1200+",
                    "12열 / 32px",
                    "목차 표시 · 콘텐츠 최대 1200px",
                  ],
                ].map((r) => (
                  <tr key={r[0]}>
                    {r.map((x) => (
                      <td key={x}>{x}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
        <Section title="콘텐츠 너비 체험">
          <UI.Slider
            label="컨테이너 너비"
            value={width}
            onValueChange={setWidth}
            min={280}
            max={920}
            step={10}
            format={(v) => `${v}px`}
          />
          <div
            className="nds-responsive-preview"
            style={{ width, maxWidth: "100%" }}
          >
            <UI.Grid min={180} gap={12}>
              {["핵심 정보", "최근 활동", "빠른 행동", "알림"].map((x) => (
                <UI.Card key={x} title={x}>
                  <p className="nds-hint">
                    콘텐츠의 최소 너비로 열 수를 결정합니다.
                  </p>
                </UI.Card>
              ))}
            </UI.Grid>
          </div>
        </Section>
        <Rules
          good="320·390·768·1440px에서 실제 입력, 긴 한국어, 오류, 확대 상태를 확인합니다."
          bad="마우스 호버에만 기능을 숨기거나 고정 높이로 내용을 잘라내지 않습니다."
        />
      </>
    );
  if (id === "radius")
    return (
      <>
        <Section title="곡률에는 역할이 있습니다">
          <div className="nds-radius-grid">
            {Object.entries(tokens.radius).map(([name, t]) => (
              <div key={name}>
                <span style={{ borderRadius: t.$value.value }} />
                <strong>{name}</strong>
                <code>{t.$value.value}px</code>
              </div>
            ))}
          </div>
        </Section>
        <Section title="표면의 깊이">
          <UI.Grid min={220}>
            {(["outline", "filled", "elevated"] as const).map((v) => (
              <UI.Card key={v} title={v} variant={v}>
                <p className="nds-hint">
                  경계와 표면으로 정보의 그룹을 만듭니다. 그림자는 떠 있는
                  영역에 제한적으로 사용합니다.
                </p>
              </UI.Card>
            ))}
          </UI.Grid>
        </Section>
        <UI.DescriptionList
          items={[
            {
              label: "기본 표면",
              value: "배경과 경계선으로 그룹을 구분합니다.",
            },
            {
              label: "떠 있는 영역",
              value: "팝오버·메뉴·토스트에 overlay shadow를 적용합니다.",
            },
            {
              label: "레이어 순서",
              value:
                "본문 → sticky 20 → popover 40 → toast 100. 모달은 브라우저 top layer를 사용합니다.",
            },
          ]}
        />
      </>
    );
  if (id === "iconography") {
    const icons = [
      ["Home", HomeIcon],
      ["Search", MagnifyingGlassIcon],
      ["Person", PersonIcon],
      ["Settings", GearIcon],
      ["Bell", BellIcon],
      ["Add", PlusIcon],
      ["Close", Cross2Icon],
      ["Check", CheckIcon],
      ["Arrow", ArrowRightIcon],
      ["Chevron", ChevronRightIcon],
      ["Download", DownloadIcon],
      ["Document", FileTextIcon],
      ["Heart", HeartIcon],
      ["Star", StarIcon],
      ["Info", InfoCircledIcon],
      ["Archive", ArchiveIcon],
    ] as const;
    return (
      <>
        <UI.Alert title="공식 Radix Icons를 사용합니다" tone="info">
          15px 원본 그리드의 시각적 일관성을 유지하며 제품 문맥에서는
          16·20·24px로 사용합니다. 장식용 아이콘은 aria-hidden, 아이콘 버튼에는
          label을 제공합니다.
        </UI.Alert>
        <Section title="공통 아이콘">
          <div className="nds-icon-grid">
            {icons.map(([name, Icon]) => (
              <div key={name}>
                <Icon width={24} height={24} />
                <code>{name}</code>
              </div>
            ))}
          </div>
        </Section>
        <pre className="nds-code-block">{`import { PlusIcon } from '@radix-ui/react-icons';\nimport { IconButton } from '@naria/ui';\n\n<IconButton label="프로젝트 추가">\n  <PlusIcon aria-hidden />\n</IconButton>`}</pre>
        <Rules
          good="행동을 설명하는 텍스트 또는 접근 가능한 이름을 함께 제공합니다."
          bad="브랜드 로고나 플랫폼 전용 심벌을 임의로 그려 쓰지 않습니다."
        />
      </>
    );
  }
  if (id === "motion")
    return (
      <>
        <UI.Alert title="82개 예제에서 6개 역할로" tone="info">
          갤러리는 영감과 비교를 위한 원본 모음입니다. 제품 컴포넌트는
          눌림·선택·펼침·진입·피드백·제스처로 정리된 공통 규칙을 사용합니다.
        </UI.Alert>
        <Section title="모션 레시피">
          <div className="nds-motion-recipes">
            {motionRecipes.map((m) => (
              <article key={m.id}>
                <div className="nds-between">
                  <code>{m.id}</code>
                  <UI.Badge>{m.duration}ms</UI.Badge>
                </div>
                <h2>{m.name}</h2>
                <div className="nds-motion-track">
                  <span
                    key={`${m.id}-${replay}`}
                    style={{ animationDuration: `${m.duration}ms` }}
                  />
                </div>
                <p>{m.rule}</p>
                <small>{m.use}</small>
                <code>{m.source}</code>
              </article>
            ))}
          </div>
          <UI.Button variant="outline" onClick={() => setReplay(replay + 1)}>
            모션 다시 재생
          </UI.Button>
        </Section>
        <Section title="감소 모션">
          <UI.Text muted>
            운영체제 설정을 자동으로 따릅니다. NariaProvider의 reducedMotion을
            켜면 이동·크기 변화·반복 애니메이션을 제거하고 결과 상태는 즉시
            보여줍니다. 대기 중이라는 의미는 텍스트와 정적인 표시로 유지합니다.
          </UI.Text>
        </Section>
        <UI.Link href="#motion-lab">82개 원본 모션 갤러리 열기 →</UI.Link>
      </>
    );
  return (
    <>
      <UI.Alert title="접근성은 상태와 동작의 일부입니다" tone="info">
        이 시스템은 네이티브 의미와 키보드 흐름을 우선합니다. 자동 검사만으로
        모든 접근성을 보장하지 않으며, 제품에 적용한 뒤 실제 보조기술로 검증해야
        합니다.
      </UI.Alert>
      <Section title="컴포넌트 계약">
        <UI.DescriptionList
          items={[
            {
              label: "이름",
              value:
                "모든 컨트롤에 라벨. 아이콘 버튼은 목적을 설명하는 접근 가능한 이름.",
            },
            {
              label: "키보드",
              value:
                "Tab 순서, 방향키 그룹 탐색, Escape 닫기, Enter/Space 실행.",
            },
            {
              label: "포커스",
              value:
                "항상 보이는 링. 모달 내부 진입·순환·복귀. 오류 후 수정 위치로 이동.",
            },
            {
              label: "상태",
              value:
                "선택·확장·현재 위치·진행률을 ARIA 또는 네이티브 속성으로 노출.",
            },
            {
              label: "색과 대비",
              value:
                "텍스트 4.5:1, 큰 텍스트/주요 경계 3:1 목표. 색과 텍스트를 함께 사용.",
            },
            {
              label: "터치",
              value: "최소 44px 목표 영역. 제스처에는 버튼·키보드 대안 제공.",
            },
            {
              label: "모션",
              value: "prefers-reduced-motion과 명시적인 감소 설정을 지원.",
            },
            {
              label: "내용",
              value: "200% 확대, 긴 한국어, 빈 값, 오류, 느린 응답을 확인.",
            },
          ]}
        />
      </Section>
      <Section title="제품 적용 전 확인">
        <UI.Checkbox label="키보드만으로 핵심 흐름을 완료할 수 있다" />
        <UI.Checkbox label="VoiceOver 또는 TalkBack에서 이름·역할·상태가 전달된다" />
        <UI.Checkbox label="실제 iOS/Android 키보드와 안전 영역을 확인했다" />
        <UI.Checkbox label="사용자 지정 테마의 모든 상태 대비를 확인했다" />
      </Section>
      <UI.Link href="https://www.w3.org/WAI/ARIA/apg/" external>
        WAI-ARIA Authoring Practices 읽기
      </UI.Link>
    </>
  );
}
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="nds-doc-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
export function Rules({ good, bad }: { good: string; bad: string }) {
  return (
    <div className="nds-rules">
      <div>
        <span>
          <CheckIcon /> 이렇게 사용하세요
        </span>
        <p>{good}</p>
      </div>
      <div>
        <span>
          <Cross2Icon /> 피해주세요
        </span>
        <p>{bad}</p>
      </div>
    </div>
  );
}
