import { useId, useRef, type ReactNode } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { Button, IconButton } from "./actions";
import { cx, nextEnabled, pageRange } from "./utils";
export type TabItem = {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
};
export function Tabs({
  label,
  items,
  value,
  onValueChange,
  variant = "line",
}: {
  label: string;
  items: TabItem[];
  value: string;
  onValueChange: (v: string) => void;
  variant?: "line" | "pill";
}) {
  const id = useId(),
    refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = items.findIndex(item => item.value === value && !item.disabled);
  const tabStop = selectedIndex >= 0 ? selectedIndex : items.findIndex(item => !item.disabled);
  return (
    <div className="nds-tabs">
      <div
        role="tablist"
        aria-label={label}
        className={cx("nds-tablist", `nds-tablist--${variant}`)}
      >
        {items.map((item, i) => (
          <button
            type="button"
            key={item.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-controls={`${id}-panel-${i}`}
            aria-selected={item.value === value}
            tabIndex={i === tabStop ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onValueChange(item.value)}
            onKeyDown={(e) => {
              const disabled = items.map((x) => !!x.disabled);
              let next = i;
              if (e.key === "ArrowRight" || e.key === "ArrowLeft")
                next = nextEnabled(
                  i,
                  e.key === "ArrowRight" ? 1 : -1,
                  disabled,
                );
              else if (e.key === "Home") next = disabled.findIndex((x) => !x);
              else if (e.key === "End") next = disabled.lastIndexOf(false);
              else return;
              e.preventDefault();
              if (next >= 0) {
                onValueChange(items[next].value);
                refs.current[next]?.focus();
              }
            }}
          >
            {item.label}
            {item.badge}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={item.value !== value}
          tabIndex={0}
          className="nds-tabpanel"
        >
          {item.value === value ? item.content : null}
        </div>
      ))}
    </div>
  );
}
export function SegmentedControl({
  label,
  options,
  value,
  onValueChange,
  disabled = false,
}: {
  label: string;
  options: { value: string; label: string; disabled?: boolean }[];
  value: string;
  onValueChange: (v: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const index = options.findIndex((x) => x.value === value);
  return (
    <fieldset className="nds-segmented" disabled={disabled}>
      <legend className="nds-sr">{label}</legend>
      <span
        className="nds-segmented-indicator"
        aria-hidden
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${Math.max(0, index) * 100}%)`,
        }}
      />
      {options.map((o) => (
        <label
          key={o.value}
          className={cx(
            o.value === value && "is-selected",
            o.disabled && "is-disabled",
          )}
        >
          <input
            type="radio"
            name={id}
            value={o.value}
            checked={o.value === value}
            disabled={o.disabled}
            onChange={() => onValueChange(o.value)}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
export function Breadcrumb({
  items,
  label = "현재 위치",
}: {
  items: { label: string; href?: string }[];
  label?: string;
}) {
  return (
    <nav aria-label={label} className="nds-breadcrumb">
      <ol>
        {items.map((x, i) => (
          <li key={i}>
            {i > 0 && <ChevronRightIcon aria-hidden />}
            {i === items.length - 1 ? (
              <span aria-current="page">{x.label}</span>
            ) : (
              <a href={x.href || "#"}>{x.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (v: number) => void;
}) {
  const count = Math.max(1, totalPages),
    pages = pageRange(page, count);
  return (
    <nav aria-label="페이지 탐색" className="nds-pagination">
      <IconButton
        label="이전 페이지"
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon />
      </IconButton>
      {pages.map((n, i) => (
        <span key={n}>
          {i > 0 && n - pages[i - 1] > 1 && (
            <span className="nds-pagination-gap" aria-hidden>
              …
            </span>
          )}
          <Button
            size="sm"
            variant={page === n ? "primary" : "ghost"}
            aria-label={`${n}페이지`}
            aria-current={page === n ? "page" : undefined}
            onClick={() => onPageChange(n)}
          >
            {n}
          </Button>
        </span>
      ))}
      <IconButton
        label="다음 페이지"
        variant="outline"
        disabled={page >= count}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon />
      </IconButton>
    </nav>
  );
}
export function Stepper({
  steps,
  current,
  onStepChange,
}: {
  steps: string[];
  current: number;
  onStepChange?: (v: number) => void;
}) {
  return (
    <ol className="nds-stepper" aria-label="진행 단계">
      {steps.map((s, i) => (
        <li
          key={s}
          aria-current={i === current ? "step" : undefined}
          className={cx(
            i < current && "is-complete",
            i === current && "is-current",
          )}
        >
          <button
            type="button"
            disabled={!onStepChange || i > current}
            onClick={() => onStepChange?.(i)}
            aria-label={`${i + 1}단계 ${s}${i < current ? " 완료" : ""}`}
          >
            <span className="nds-step-dot">
              {i < current ? <CheckIcon /> : i + 1}
            </span>
            <span>{s}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
export type NavItem = {
  value: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
};
function NavItems({
  items,
  value,
  onValueChange,
}: {
  items: NavItem[];
  value: string;
  onValueChange?: (v: string) => void;
}) {
  return (
    <>
      {items.map((x) =>
        x.href ? (
          <a
            key={x.value}
            href={x.href}
            aria-current={value === x.value ? "page" : undefined}
          >
            {x.icon}
            <span>{x.label}</span>
            {x.badge}
          </a>
        ) : (
          <button
            type="button"
            key={x.value}
            disabled={x.disabled}
            aria-current={value === x.value ? "page" : undefined}
            onClick={() => onValueChange?.(x.value)}
          >
            {x.icon}
            <span>{x.label}</span>
            {x.badge}
          </button>
        ),
      )}
    </>
  );
}
export function NavigationBar({
  brand,
  items,
  value,
  onValueChange,
  actions,
}: {
  brand: ReactNode;
  items: NavItem[];
  value: string;
  onValueChange?: (v: string) => void;
  actions?: ReactNode;
}) {
  return (
    <header className="nds-navigation-bar">
      <strong>{brand}</strong>
      <nav aria-label="주 메뉴">
        <NavItems items={items} value={value} onValueChange={onValueChange} />
      </nav>
      {actions && <div>{actions}</div>}
    </header>
  );
}
export function SideNavigation({
  label = "섹션 탐색",
  items,
  value,
  onValueChange,
}: {
  label?: string;
  items: NavItem[];
  value: string;
  onValueChange?: (v: string) => void;
}) {
  return (
    <nav className="nds-side-navigation" aria-label={label}>
      <NavItems items={items} value={value} onValueChange={onValueChange} />
    </nav>
  );
}
export function BottomNavigation({
  label = "하단 탐색",
  items,
  value,
  onValueChange,
}: {
  label?: string;
  items: NavItem[];
  value: string;
  onValueChange?: (v: string) => void;
}) {
  return (
    <nav className="nds-bottom-navigation" aria-label={label}>
      <NavItems
        items={items.slice(0, 5)}
        value={value}
        onValueChange={onValueChange}
      />
    </nav>
  );
}
