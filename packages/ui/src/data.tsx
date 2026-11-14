import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { Button, IconButton } from "./actions";
import { Checkbox, Select } from "./forms";
import { Pagination } from "./navigation";
import { cx } from "./utils";
export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "right";
  sortValue?: (row: T) => string | number;
};
export function sortRows<T>(
  rows: T[],
  column: Column<T> | undefined,
  direction: "asc" | "desc",
) {
  if (!column) return rows;
  return [...rows].sort((a, b) => {
    const av = column.sortValue ? column.sortValue(a) : a[column.key],
      bv = column.sortValue ? column.sortValue(b) : b[column.key];
    const result =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av ?? "").localeCompare(String(bv ?? ""), "ko", {
            numeric: true,
          });
    return direction === "asc" ? result : -result;
  });
}
export function DataTable<T extends { id: string }>({
  label,
  columns,
  rows,
  pageSize = 5,
  selectable = false,
  onSelectionChange,
  emptyMessage = "표시할 데이터가 없습니다.",
}: {
  label: string;
  columns: Column<T>[];
  rows: T[];
  pageSize?: number;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  emptyMessage?: string;
}) {
  const [sort, setSort] = useState<keyof T | undefined>(undefined),
    [direction, setDirection] = useState<"asc" | "desc">("asc"),
    [page, setPage] = useState(1),
    [storedSelection, setSelected] = useState<string[]>([]);
  const selected = storedSelection.filter((id) =>
    rows.some((row) => row.id === id),
  );
  const safePageSize = Math.max(1, pageSize),
    pages = Math.max(1, Math.ceil(rows.length / safePageSize)),
    current = Math.min(page, pages);
  const sorted = useMemo(
    () =>
      sortRows(
        rows,
        columns.find((c) => c.key === sort),
        direction,
      ),
    [rows, columns, sort, direction],
  );
  const visible = sorted.slice(
    (current - 1) * safePageSize,
    current * safePageSize,
  );
  const checked =
      visible.length > 0 && visible.every((r) => selected.includes(r.id)),
    some = visible.some((r) => selected.includes(r.id));
  const choose = (ids: string[]) => {
    setSelected(ids);
    onSelectionChange?.(ids);
  };
  const validSelected = selected.filter((id) =>
    rows.some((row) => row.id === id),
  );
  const toggle = (id: string) =>
    choose(
      validSelected.includes(id)
        ? validSelected.filter((x) => x !== id)
        : [...validSelected, id],
    );
  const order = (key: keyof T) => {
    setDirection(sort === key && direction === "asc" ? "desc" : "asc");
    setSort(key);
  };
  return (
    <section className="nds-data-table" aria-label={label}>
      <div className="nds-table-mobile-sort">
        <Select
          label="정렬 기준"
          value={sort ? String(sort) : ""}
          options={[
            { value: "", label: "기본 순서" },
            ...columns
              .filter((c) => c.sortable)
              .map((c) => ({ value: String(c.key), label: c.label })),
          ]}
          onChange={(e) =>
            setSort(e.target.value ? (e.target.value as keyof T) : undefined)
          }
        />
        <Button
          variant="outline"
          onClick={() => setDirection(direction === "asc" ? "desc" : "asc")}
        >
          {direction === "asc" ? "오름차순" : "내림차순"}
        </Button>
      </div>
      <div
        className="nds-table-scroll"
        role="region"
        aria-label={`${label} 표`}
        tabIndex={0}
      >
        <table>
          <caption>{label}</caption>
          <thead>
            <tr>
              {selectable && (
                <th scope="col">
                  <Checkbox
                    label="현재 페이지 전체 선택"
                    checked={checked}
                    indeterminate={some && !checked}
                    onChange={() =>
                      choose(
                        checked
                          ? validSelected.filter(
                              (id) => !visible.some((r) => r.id === id),
                            )
                          : [
                              ...new Set([
                                ...validSelected,
                                ...visible.map((r) => r.id),
                              ]),
                            ],
                      )
                    }
                  />
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  scope="col"
                  aria-sort={
                    sort === c.key
                      ? direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  style={{ textAlign: c.align }}
                >
                  {c.sortable ? (
                    <button type="button" onClick={() => order(c.key)}>
                      {c.label}
                      {sort === c.key ? (
                        direction === "asc" ? (
                          <ArrowUpIcon />
                        ) : (
                          <ArrowDownIcon />
                        )
                      ) : (
                        <ChevronDownIcon />
                      )}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} data-selected={selected.includes(row.id)}>
                {selectable && (
                  <td>
                    <Checkbox
                      label={`${row.id} 선택`}
                      checked={selected.includes(row.id)}
                      onChange={() => toggle(row.id)}
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={String(c.key)} style={{ textAlign: c.align }}>
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="nds-table-empty">{emptyMessage}</p>}
      </div>
      <ul className="nds-table-cards" aria-label={`${label} 목록`}>
        {visible.map((row) => (
          <li key={row.id}>
            {selectable && (
              <Checkbox
                label={`${row.id} 선택`}
                checked={selected.includes(row.id)}
                onChange={() => toggle(row.id)}
              />
            )}
            <dl>
              {columns.map((c) => (
                <div key={String(c.key)}>
                  <dt>{c.label}</dt>
                  <dd>{c.render ? c.render(row) : String(row[c.key] ?? "")}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      {!rows.length && <p className="nds-table-mobile-empty">{emptyMessage}</p>}
      <footer>
        <span className="nds-hint" aria-live="polite">
          전체 {rows.length}개
          {selected.length > 0 &&
            ` · ${selected.filter((id) => rows.some((r) => r.id === id)).length}개 선택`}
        </span>
        <Pagination page={current} totalPages={pages} onPageChange={setPage} />
      </footer>
    </section>
  );
}
export function DescriptionList({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="nds-description-list">
      {items.map((x, i) => (
        <div key={i}>
          <dt>{x.label}</dt>
          <dd>{x.value}</dd>
        </div>
      ))}
    </dl>
  );
}
export function Stat({
  label,
  value,
  change,
  caption,
}: {
  label: string;
  value: string;
  change?: string;
  caption?: string;
}) {
  return (
    <div className="nds-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {change && <small>{change}</small>}
      {caption && <p>{caption}</p>}
    </div>
  );
}
export function Timeline({
  items,
}: {
  items: {
    title: string;
    description?: string;
    time?: string;
    status?: "complete" | "current" | "pending";
  }[];
}) {
  return (
    <ol className="nds-timeline">
      {items.map((x, i) => (
        <li key={i} className={`is-${x.status || "pending"}`}>
          <span className="nds-timeline-dot" aria-hidden>
            {x.status === "complete" && <CheckIcon />}
          </span>
          <div>
            <strong>{x.title}</strong>
            {x.time && <time>{x.time}</time>}
            {x.description && <p>{x.description}</p>}
            <span className="nds-sr">
              {x.status === "complete"
                ? "완료"
                : x.status === "current"
                  ? "진행 중"
                  : "예정"}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
export type TreeNode = { id: string; label: string; children?: TreeNode[] };
export function Tree({
  label,
  nodes,
  value,
  onValueChange,
}: {
  label: string;
  nodes: TreeNode[];
  value: string;
  onValueChange: (v: string) => void;
}) {
  const [expanded, setExpanded] = useState<string[]>([]),
    [focused, setFocused] = useState(nodes[0]?.id),
    refs = useRef<Record<string, HTMLDivElement | null>>({});
  const visible: { node: TreeNode; parent?: string; level: number; position: number; setSize: number }[] = [];
  function walk(list: TreeNode[], level = 1, parent?: string) {
    for (const [index,node] of list.entries()) {
      visible.push({ node, level, parent, position: index + 1, setSize: list.length });
      if (expanded.includes(node.id))
        walk(node.children || [], level + 1, node.id);
    }
  }
  walk(nodes);
  const tabStop = visible.some(item => item.node.id === focused)
    ? focused
    : visible.find(item => item.node.id === value)?.node.id || visible[0]?.node.id;
  const focus = (id?: string) => {
    if (id) {
      setFocused(id);
      refs.current[id]?.focus();
    }
  };
  const toggle = (id: string) =>
    setExpanded((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  return (
    <div role="tree" aria-label={label} className="nds-tree">
      {visible.map(({ node, parent, level, position, setSize }, i) => (
        <div
          key={node.id}
          ref={(el) => {
            refs.current[node.id] = el;
          }}
          role="treeitem"
          aria-level={level}
          aria-posinset={position}
          aria-setsize={setSize}
          aria-expanded={
            node.children?.length ? expanded.includes(node.id) : undefined
          }
          aria-selected={value === node.id}
          tabIndex={tabStop === node.id ? 0 : -1}
          style={{ paddingLeft: (level - 1) * 20 + 10 }}
          onFocus={() => setFocused(node.id)}
          onClick={() => {
            focus(node.id);
            onValueChange(node.id);
            if (node.children?.length) toggle(node.id);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              focus(visible[Math.min(i + 1, visible.length - 1)]?.node.id);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              focus(visible[Math.max(i - 1, 0)]?.node.id);
            } else if (e.key === "Home") {
              e.preventDefault();
              focus(visible[0]?.node.id);
            } else if (e.key === "End") {
              e.preventDefault();
              focus(visible.at(-1)?.node.id);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              if (node.children?.length) {
                if (!expanded.includes(node.id)) toggle(node.id);
                else focus(node.children[0].id);
              }
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              if (expanded.includes(node.id)) toggle(node.id);
              else focus(parent);
            } else if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onValueChange(node.id);
              if (node.children?.length) toggle(node.id);
            }
          }}
        >
          {node.children?.length ? (
            <ChevronRightIcon
              aria-hidden
              style={{
                transform: expanded.includes(node.id) ? "rotate(90deg)" : "",
              }}
            />
          ) : (
            <span className="nds-tree-leaf" aria-hidden />
          )}
          {node.label}
        </div>
      ))}
    </div>
  );
}
export function calendarCells(month: string) {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) =>
    new Date(Date.UTC(y, m - 1, 1 - offset + i)).toISOString().slice(0, 10),
  );
}
export function shiftCalendarMonth(date: string, delta: number) {
  const [year, month, day] = date.split("-").map(Number);
  const target = new Date(Date.UTC(year, month - 1 + delta, 1));
  const end = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(day, end)),
  )
    .toISOString()
    .slice(0, 10);
}
function moveDate(date: string, days: number) {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function Calendar({
  label,
  value,
  onValueChange,
  min,
  max,
  disabled = false,
  range,
  autoFocus = false,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  range?: { start: string; end: string };
  autoFocus?: boolean;
}) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const initial = value || (min && today < min ? min : max && today > max ? max : today);
  const [month, setMonth] = useState(initial.slice(0, 7)),
    [focusDate, setFocusDate] = useState(initial);
  useEffect(() => {
    if (value) {
      setMonth(value.slice(0, 7));
      setFocusDate(value);
    }
  }, [value]);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({}),
    id = useId(),
    cells = calendarCells(month);
  useEffect(() => {
    if (!autoFocus || disabled) return;
    const frame = requestAnimationFrame(() => refs.current[initial]?.focus());
    return () => cancelAnimationFrame(frame);
  }, [autoFocus, disabled]);
  const shift = (delta: number) => {
    const [y, m] = month.split("-").map(Number);
    setMonth(new Date(Date.UTC(y, m - 1 + delta, 1)).toISOString().slice(0, 7));
  };
  const focus = (date: string) => {
    if ((min && date < min) || (max && date > max)) return;
    setFocusDate(date);
    if (!date.startsWith(month)) setMonth(date.slice(0, 7));
    requestAnimationFrame(() => refs.current[date]?.focus());
  };
  return (
    <div className="nds-calendar">
      <div className="nds-between">
        <IconButton
          label="이전 달"
          size="sm"
          disabled={disabled || !!(min && month <= min.slice(0, 7))}
          onClick={() => shift(-1)}
        >
          <ChevronLeftIcon />
        </IconButton>
        <strong id={id} aria-live="polite">
          {Number(month.slice(0,4))}년 {Number(month.slice(5))}월
        </strong>
        <IconButton
          label="다음 달"
          size="sm"
          disabled={disabled || !!(max && month >= max.slice(0, 7))}
          onClick={() => shift(1)}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
      <table role="grid" aria-label={`${label} · ${month}`} aria-multiselectable={range ? true : undefined}>
        <thead>
          <tr>
            {["월", "화", "수", "목", "금", "토", "일"].map((x) => (
              <th key={x} scope="col">
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, week) => (
            <tr key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((date) => {
                const unavailable =
                  disabled || !!((min && date < min) || (max && date > max));
                return (
                  <td key={date} aria-selected={date === value || !!(range?.start && range.end && date >= range.start && date <= range.end)}
                    className={cx(!!(range?.start && range.end && date >= range.start && date <= range.end) && "is-in-range", date === range?.start && "is-range-start", date === range?.end && "is-range-end")}>
                    <button
                      type="button"
                      ref={(el) => {
                        refs.current[date] = el;
                      }}
                      aria-label={new Intl.DateTimeFormat("ko-KR", {
                        dateStyle: "full",
                        timeZone: "UTC",
                      }).format(new Date(date + "T12:00:00Z"))}
                      aria-current={date === today ? "date" : undefined}
                      disabled={unavailable}
                      tabIndex={
                        date ===
                        (cells.includes(focusDate) &&
                        (!min || focusDate >= min) &&
                        (!max || focusDate <= max)
                          ? focusDate
                          : cells.find(
                              (d) =>
                                d.startsWith(month) &&
                                (!min || d >= min) &&
                                (!max || d <= max),
                            ))
                          ? 0
                          : -1
                      }
                      className={cx(
                        !date.startsWith(month) && "is-outside",
                        (date === value || date === range?.start || date === range?.end) && "is-selected",
                      )}
                      onClick={() => {
                        onValueChange(date);
                        setFocusDate(date);
                        if (!date.startsWith(month)) setMonth(date.slice(0, 7));
                      }}
                      onKeyDown={(e) => {
                        const offsets: Record<string, number> = {
                          ArrowLeft: -1,
                          ArrowRight: 1,
                          ArrowUp: -7,
                          ArrowDown: 7,
                          Home: -(
                            (new Date(date + "T12:00:00Z").getUTCDay() + 6) %
                            7
                          ),
                          End:
                            6 -
                            ((new Date(date + "T12:00:00Z").getUTCDay() + 6) %
                              7),
                        };
                        if (e.key in offsets) {
                          e.preventDefault();
                          focus(moveDate(date, offsets[e.key]));
                        } else if (e.key === "PageUp" || e.key === "PageDown") {
                          e.preventDefault();
                          focus(
                            shiftCalendarMonth(
                              date,
                              e.key === "PageDown" ? 1 : -1,
                            ),
                          );
                        }
                      }}
                    >
                      {Number(date.slice(-2))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="nds-calendar-legend"><span><i />오늘</span><span><i className="is-selected" />선택일</span>{range && <span><i className="is-range" />선택 기간</span>}</div>
    </div>
  );
}
