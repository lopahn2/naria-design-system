import { useId, useState, type FormEvent } from "react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FileTextIcon,
  PersonIcon,
  BellIcon,
  CheckIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import * as UI from "../../packages/ui/src";
import { people, options } from "./Demos";
export function PatternDemo({ id }: { id: string }) {
  switch (id) {
    case "onboarding":
      return <Onboarding />;
    case "settings":
      return <Settings />;
    case "search":
      return <Search />;
    case "workspace":
      return <Workspace />;
    case "checkout":
      return <Checkout />;
    default:
      return <Dashboard />;
  }
}
function Onboarding() {
  const [step, setStep] = useState(0),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [agree, setAgree] = useState<string[]>([]),
    [errors, setErrors] = useState<Record<string, string>>({});
  const uid = useId();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 0) {
      const next: Record<string, string> = {};
      if (!name.trim()) next.name = "이름을 입력해 주세요.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        next.email = "올바른 이메일 주소를 입력해 주세요.";
      setErrors(next);
      if (Object.keys(next).length) {
        requestAnimationFrame(() =>
          document.getElementById(`${uid}-${Object.keys(next)[0]}`)?.focus(),
        );
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!["terms", "privacy"].every((x) => agree.includes(x))) {
        setErrors({ agree: "필수 약관 두 항목에 동의해 주세요." });
        return;
      }
      setStep(2);
    }
  };
  return (
    <div className="nds-pattern-onboarding">
      <UI.Stepper
        steps={["기본 정보", "약관 동의", "준비 완료"]}
        current={step}
        onStepChange={(v) => {
          setErrors({});
          setStep(v);
        }}
      />
      {step === 2 ? (
        <UI.Result
          title={`${name} 님, 준비가 끝났어요`}
          description="이 예제에서 가입 흐름을 완료했습니다. 실제 계정은 생성되지 않습니다."
          action={
            <UI.Button
              variant="outline"
              onClick={() => {
                setStep(0);
                setErrors({});
              }}
            >
              처음부터 체험
            </UI.Button>
          }
        />
      ) : (
        <form noValidate onSubmit={submit}>
          <UI.Stack gap={24}>
            <div>
              <p className="nds-eyebrow">GET STARTED</p>
              <UI.Text as="h2" size="heading">
                {step === 0
                  ? "함께할 준비를 해볼까요?"
                  : "몇 가지만 확인해 주세요"}
              </UI.Text>
              <UI.Text muted size="small">
                {step === 0
                  ? "프로젝트에서 사용할 이름과 이메일을 알려주세요."
                  : "필수 동의와 선택 동의를 구분해 안내합니다."}
              </UI.Text>
            </div>
            {step === 0 ? (
              <>
                <UI.TextField
                  id={`${uid}-name`}
                  label="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  error={errors.name}
                  placeholder="홍길동"
                />
                <UI.TextField
                  id={`${uid}-email`}
                  label="이메일"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  error={errors.email}
                  placeholder="name@example.com"
                  hint="입력한 주소로 프로젝트 초대를 받을 수 있어요."
                />
              </>
            ) : (
              <UI.Agreement
                items={[
                  { id: "terms", label: "서비스 이용약관", required: true },
                  {
                    id: "privacy",
                    label: "개인정보 처리 안내",
                    required: true,
                  },
                  { id: "marketing", label: "소식과 혜택 알림" },
                ]}
                value={agree}
                onValueChange={setAgree}
                error={errors.agree}
              />
            )}
            <UI.BottomCTA description="현재 화면에서만 체험하는 가입 예제입니다.">
              {step === 1 && (
                <UI.Button
                  variant="outline"
                  onClick={() => {
                    setStep(0);
                    setErrors({});
                  }}
                >
                  이전
                </UI.Button>
              )}
              <UI.Button type="submit" trailing={<ArrowRightIcon />}>
                {step === 0 ? "다음" : "동의하고 시작하기"}
              </UI.Button>
            </UI.BottomCTA>
          </UI.Stack>
        </form>
      )}
    </div>
  );
}
function Settings() {
  const [profile, setProfile] = useState({
      name: "김나리",
      email: "nari@example.com",
      role: "product",
      updates: true,
      weekly: false,
    }),
    [saved, setSaved] = useState(profile),
    [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const toast = UI.useToast(),
    dirty = JSON.stringify(profile) !== JSON.stringify(saved);
  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      setError("표시 이름을 입력해 주세요.");
      return;
    }
    setError("");
    setSaved(profile);
    try {
      localStorage.setItem("naria:settings-demo", JSON.stringify(profile));
    } catch {}
    toast({
      title: "설정을 저장했어요.",
      description: "이 브라우저에 예제 설정을 저장했습니다.",
      tone: "success",
    });
  };
  return (
    <form onSubmit={save} noValidate>
      <UI.Stack gap={24}>
        <div className="nds-between">
          <div>
            <UI.Text as="h2" size="heading">
              내 계정
            </UI.Text>
            <UI.Text muted size="small">
              프로필과 알림을 관리하세요.
            </UI.Text>
          </div>
          <UI.Avatar name={profile.name || "사용자"} size="lg" />
        </div>
        <UI.Card title="기본 정보" description="팀원에게 표시되는 정보예요.">
          <UI.Stack>
            <UI.TextField
              label="표시 이름"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              error={error}
              required
            />
            <UI.TextField
              label="이메일"
              value={profile.email}
              readOnly
              hint="이메일 변경은 별도 인증 후 적용하세요."
            />
            <UI.Combobox
              label="담당 분야"
              options={options}
              value={profile.role}
              onValueChange={(role) => setProfile({ ...profile, role })}
            />
          </UI.Stack>
        </UI.Card>
        <UI.Card title="알림">
          <UI.Stack gap={24}>
            <UI.Switch
              label="업데이트 소식"
              description="프로젝트의 주요 변경 사항을 알려드려요."
              checked={profile.updates}
              onCheckedChange={(updates) => setProfile({ ...profile, updates })}
            />
            <UI.Divider />
            <UI.Switch
              label="주간 요약"
              description="매주 월요일 활동을 정리해서 보내드려요."
              checked={profile.weekly}
              onCheckedChange={(weekly) => setProfile({ ...profile, weekly })}
            />
          </UI.Stack>
        </UI.Card>
        {dirty && (
          <UI.Alert title="아직 저장하지 않은 변경이 있어요" tone="warning">
            화면을 나가기 전에 저장해 주세요.
          </UI.Alert>
        )}
        <UI.ButtonGroup label="설정 저장">
          <UI.Button type="submit" disabled={!dirty}>
            변경 사항 저장
          </UI.Button>
          <UI.Button
            variant="outline"
            disabled={!dirty}
            onClick={() => {
              setProfile(saved);
              setError("");
            }}
          >
            되돌리기
          </UI.Button>
          <UI.Button variant="ghost" onClick={() => setOpen(true)}>
            계정 비활성화
          </UI.Button>
        </UI.ButtonGroup>
        <UI.AlertDialog
          open={open}
          onOpenChange={setOpen}
          title="계정을 비활성화할까요?"
          confirmLabel="비활성화"
          onConfirm={() => {
            setOpen(false);
            toast({ title: "데모 확인을 마쳤어요." });
          }}
        >
          <p>
            프로젝트 접근 권한이 중지됩니다. 이 예제는 실제 계정 상태를 바꾸지
            않습니다.
          </p>
        </UI.AlertDialog>
      </UI.Stack>
    </form>
  );
}
const projects = [
  {
    name: "Design system",
    category: "product",
    description: "서비스 전체의 토큰과 컴포넌트",
    members: 6,
  },
  {
    name: "Web platform",
    category: "engineering",
    description: "일관된 인터랙션과 화면 기반",
    members: 8,
  },
  {
    name: "Content guide",
    category: "content",
    description: "도움이 되는 언어와 메시지",
    members: 3,
  },
  {
    name: "Research notes",
    category: "research",
    description: "사용자의 맥락과 관찰 기록",
    members: 4,
  },
  {
    name: "Mobile experience",
    category: "product",
    description: "손안에서 자연스러운 경험",
    members: 5,
  },
  {
    name: "Component QA",
    category: "engineering",
    description: "회귀 검사와 접근성 검증",
    members: 2,
  },
];
function Search() {
  const [q, setQ] = useState(""),
    [filter, setFilter] = useState<string[]>([]),
    [sort, setSort] = useState("name"),
    [selected, setSelected] = useState<(typeof projects)[number] | null>(null);
  const filtered = projects
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.includes(q),
    )
    .filter((p) => !filter.length || filter.includes(p.category))
    .sort((a, b) =>
      sort === "members" ? b.members - a.members : a.name.localeCompare(b.name),
    );
  return (
    <UI.Stack gap={24}>
      <div>
        <UI.Text as="h2" size="heading">
          프로젝트 탐색
        </UI.Text>
        <UI.Text muted size="small">
          팀의 작업과 기록을 찾아보세요.
        </UI.Text>
      </div>
      <div className="nds-pattern-searchbar">
        <UI.SearchField
          label="프로젝트 검색"
          value={q}
          onValueChange={setQ}
          placeholder="이름이나 설명 검색"
        />
        <UI.Select
          label="정렬"
          options={[
            { value: "name", label: "이름순" },
            { value: "members", label: "참여자순" },
          ]}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        />
      </div>
      <UI.Stack direction="row" gap={8} wrap>
        {options
          .filter((o) => !o.disabled)
          .map((o) => (
            <UI.Tag
              key={o.value}
              selected={filter.includes(o.value)}
              onSelect={() =>
                setFilter(
                  filter.includes(o.value)
                    ? filter.filter((x) => x !== o.value)
                    : [...filter, o.value],
                )
              }
            >
              {o.label}
            </UI.Tag>
          ))}
      </UI.Stack>
      <p className="nds-hint" role="status">
        검색 결과 {filtered.length}개
      </p>
      {filtered.length ? (
        <UI.Grid min={240}>
          {filtered.map((p) => (
            <UI.Card
              key={p.name}
              title={p.name}
              description={p.description}
              footer={
                <UI.Button
                  variant="ghost"
                  trailing={<ArrowRightIcon />}
                  onClick={() => setSelected(p)}
                >
                  프로젝트 보기
                </UI.Button>
              }
            >
              <UI.Stack direction="row" align="center">
                <UI.AvatarGroup
                  names={["나리", "하늘", "지우"].slice(
                    0,
                    Math.min(p.members, 3),
                  )}
                />
                <span className="nds-hint">{p.members}명 참여</span>
              </UI.Stack>
            </UI.Card>
          ))}
        </UI.Grid>
      ) : (
        <UI.EmptyState
          title="일치하는 프로젝트가 없어요"
          description="검색어를 바꾸거나 적용한 필터를 초기화해 보세요."
          action={
            <UI.Button
              variant="outline"
              onClick={() => {
                setQ("");
                setFilter([]);
              }}
            >
              검색과 필터 초기화
            </UI.Button>
          }
        />
      )}
      <UI.Drawer
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
        title={selected?.name || "프로젝트"}
        description={selected?.description}
      >
        {selected && (
          <UI.DescriptionList
            items={[
              { label: "참여 인원", value: `${selected.members}명` },
              {
                label: "담당 분야",
                value: options.find((x) => x.value === selected.category)
                  ?.label,
              },
              {
                label: "상태",
                value: <UI.Badge tone="success">진행 중</UI.Badge>,
              },
            ]}
          />
        )}
      </UI.Drawer>
    </UI.Stack>
  );
}
function Workspace() {
  const [rows, setRows] = useState(people),
    [selected, setSelected] = useState<string[]>([]),
    [confirm, setConfirm] = useState(false),
    [q, setQ] = useState("");
  const toast = UI.useToast();
  return (
    <UI.Stack gap={24}>
      <div className="nds-between">
        <div>
          <UI.Text as="h2" size="heading">
            팀 멤버
          </UI.Text>
          <UI.Text muted size="small">
            역할과 접근 범위를 한눈에 관리하세요.
          </UI.Text>
        </div>
        <UI.Button
          leading={<PlusIcon />}
          onClick={() => {
            const id = `N-${String(rows.length + 1).padStart(3, "0")}`;
            setRows([
              ...rows,
              {
                id,
                name: `새 멤버 ${rows.length + 1}`,
                team: "Product",
                role: "뷰어",
                status: "초대 중",
                amount: 0,
              },
            ]);
            toast({ title: "새 멤버 행을 추가했어요." });
          }}
        >
          데모 멤버 추가
        </UI.Button>
      </div>
      <UI.SearchField
        label="멤버 검색"
        value={q}
        onValueChange={setQ}
        placeholder="이름 검색"
      />
      {selected.length > 0 && (
        <UI.Alert
          title={`${selected.length}명을 선택했어요`}
          tone="info"
          action={
            <UI.Button
              size="sm"
              variant="danger"
              onClick={() => setConfirm(true)}
            >
              선택 멤버 삭제
            </UI.Button>
          }
        >
          삭제 전에 대상과 결과를 다시 확인합니다.
        </UI.Alert>
      )}
      <UI.DataTable
        label="팀 멤버 관리"
        rows={rows.filter((r) => r.name.includes(q))}
        selectable
        onSelectionChange={setSelected}
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
      />
      <UI.AlertDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={`${selected.length}명의 접근을 해제할까요?`}
        onConfirm={() => {
          setRows(rows.filter((r) => !selected.includes(r.id)));
          setSelected([]);
          setConfirm(false);
          toast({ title: "선택한 예제 멤버를 삭제했어요." });
        }}
      >
        <p>
          현재 예제 목록에서만 삭제됩니다. 실제 사용자 계정은 변경되지 않습니다.
        </p>
      </UI.AlertDialog>
    </UI.Stack>
  );
}
function Checkout() {
  const [quantity, setQuantity] = useState(1),
    [delivery, setDelivery] = useState("standard"),
    [name, setName] = useState(""),
    [address, setAddress] = useState(""),
    [complete, setComplete] = useState(false),
    [error, setError] = useState(false);
  const fee = delivery === "express" ? 5000 : 0,
    total = 24000 * quantity + fee;
  return complete ? (
    <UI.Result
      title="주문 정보를 확인했어요"
      description="결제 흐름의 화면 예제입니다. 실제 결제나 주문은 발생하지 않았습니다."
      action={
        <UI.Button variant="outline" onClick={() => setComplete(false)}>
          다시 체험
        </UI.Button>
      }
    />
  ) : (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !address.trim()) {
          setError(true);
          return;
        }
        setError(false);
        setComplete(true);
      }}
    >
      <div className="nds-pattern-checkout">
        <UI.Stack gap={24}>
          <div>
            <UI.Text as="h2" size="heading">
              주문 정보
            </UI.Text>
            <UI.Text muted size="small">
              선택한 상품과 배송 정보를 확인하세요.
            </UI.Text>
          </div>
          <UI.Card
            title="데스크 노트"
            description="차분하게 기록하는 하루의 시작"
          >
            <UI.NumberField
              label="수량"
              value={quantity}
              onValueChange={setQuantity}
              min={1}
              max={9}
            />
          </UI.Card>
          <UI.TextField
            label="받는 분"
            autoComplete="shipping name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={
              error && !name.trim()
                ? "받는 분 이름을 입력해 주세요."
                : undefined
            }
          />
          <UI.TextField
            label="배송 주소"
            autoComplete="shipping street-address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={
              error && !address.trim()
                ? "배송 주소를 입력해 주세요."
                : undefined
            }
          />
          <UI.RadioGroup
            label="배송 방법"
            value={delivery}
            onValueChange={setDelivery}
            options={[
              {
                value: "standard",
                label: "일반 배송",
                description: "무료 · 2–3일 소요",
              },
              {
                value: "express",
                label: "빠른 배송",
                description: "5,000원 · 다음 날 도착",
              },
            ]}
          />
        </UI.Stack>
        <UI.Card
          title="결제 예정 금액"
          footer={
            <UI.Button fullWidth type="submit" trailing={<ArrowRightIcon />}>
              주문 정보 확인
            </UI.Button>
          }
        >
          <UI.DescriptionList
            items={[
              {
                label: "상품 금액",
                value: `${(24000 * quantity).toLocaleString()}원`,
              },
              {
                label: "배송비",
                value: fee ? `${fee.toLocaleString()}원` : "무료",
              },
              {
                label: "총 금액",
                value: <strong>{total.toLocaleString()}원</strong>,
              },
            ]}
          />
          <p className="nds-hint" style={{ marginTop: 16 }}>
            실제 결제가 없는 화면 예제입니다.
          </p>
        </UI.Card>
      </div>
    </form>
  );
}
function Dashboard() {
  const [period, setPeriod] = useState("month");
  return (
    <UI.Stack gap={28}>
      <div className="nds-between">
        <div>
          <p className="nds-eyebrow">YOUR WORKSPACE</p>
          <UI.Text as="h2" size="heading">
            좋은 흐름을 만들고 있어요
          </UI.Text>
        </div>
        <UI.SegmentedControl
          label="조회 기간"
          options={[
            { value: "week", label: "이번 주" },
            { value: "month", label: "이번 달" },
          ]}
          value={period}
          onValueChange={setPeriod}
        />
      </div>
      <UI.Grid min={180}>
        <UI.Stat
          label="완료한 작업"
          value={period === "month" ? "128" : "32"}
          change="이전 기간 대비 12% 증가"
        />
        <UI.Stat
          label="활성 프로젝트"
          value="24"
          caption="진행 중인 프로젝트"
        />
        <UI.Stat
          label="팀 참여율"
          value="92.8%"
          caption="최근 7일에 활동한 팀원 비율"
        />
      </UI.Grid>
      <UI.Grid min={280}>
        <UI.Card title="최근 활동">
          <UI.Timeline
            items={[
              {
                title: "컴포넌트 검토 완료",
                time: "오후 2:40",
                status: "complete",
                description: "Button과 TextField의 상태를 확인했어요.",
              },
              {
                title: "접근성 검증 진행",
                time: "오후 3:10",
                status: "current",
                description: "키보드와 작은 화면을 점검하고 있어요.",
              },
              { title: "다음 버전 공유", status: "pending" },
            ]}
          />
        </UI.Card>
        <UI.Card
          title="이번 주 목표"
          description="작은 단위로 완성도를 높여요."
        >
          <UI.Stack gap={20}>
            <UI.Progress label="핵심 흐름 검증" value={72} />
            <UI.ListRow
              title="모바일 화면 검증"
              description="320 · 390 · 768px"
              trailing={<UI.Badge tone="warning">진행 중</UI.Badge>}
            />
            <UI.ListRow
              title="컴포넌트 문서"
              description="변형·상태·사용 기준"
              trailing={<UI.Badge tone="success">완료</UI.Badge>}
            />
          </UI.Stack>
        </UI.Card>
      </UI.Grid>
    </UI.Stack>
  );
}
