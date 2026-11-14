import {
  useId,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  EnterFullScreenIcon,
  MinusIcon,
  PaperPlaneIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Button, CopyButton, IconButton } from "./actions";
import type { Tone } from "./core";
import { cx } from "./utils";

/** Raw text, logs and identifiers shown verbatim. The scroll region is keyboard reachable. */
export function CodeBlock({
  children,
  title,
  meta,
  wrap = true,
  maxHeight,
  copy = true,
}: {
  children: string;
  title?: string;
  meta?: ReactNode;
  wrap?: boolean;
  maxHeight?: number;
  copy?: boolean;
}) {
  const head = title || meta || copy;
  return (
    <figure className="nds-code">
      {head && (
        <figcaption>
          {title && <strong>{title}</strong>}
          {meta && <span>{meta}</span>}
          {copy && (
            <CopyButton value={children} size="sm" variant="ghost">
              복사
            </CopyButton>
          )}
        </figcaption>
      )}
      <pre
        tabIndex={0}
        aria-label={title || "원문"}
        className={cx(wrap && "is-wrap")}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export type StatusKind =
  "ok" | "warning" | "danger" | "info" | "neutral" | "unknown";
const statusTone: Record<StatusKind, Tone> = {
  ok: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  neutral: "neutral",
  unknown: "neutral",
};
/** A state as a dot plus wording. "unknown" is drawn hollow so it never reads as healthy. */
export function StatusIndicator({
  status = "neutral",
  children,
  pulse = false,
}: {
  status?: StatusKind;
  children: ReactNode;
  pulse?: boolean;
}) {
  return (
    <span
      className={cx(
        "nds-status",
        `nds-tone--${statusTone[status]}`,
        status === "unknown" && "is-unknown",
        pulse && "is-pulse",
      )}
    >
      <i aria-hidden />
      {children}
    </span>
  );
}

/** A measured amount against a capacity. A null value is "not observed", never zero. */
export function Meter({
  label,
  value,
  max = 100,
  valueText,
  warningAt,
  dangerAt,
  unknownText = "미관측",
}: {
  label: string;
  value: number | null;
  max?: number;
  valueText?: string;
  warningAt?: number;
  dangerAt?: number;
  unknownText?: string;
}) {
  const id = useId();
  const known = value !== null && Number.isFinite(value) && max > 0;
  const ratio = known ? Math.min(1, Math.max(0, (value as number) / max)) : 0;
  const tone =
    known && dangerAt !== undefined && ratio >= dangerAt
      ? "danger"
      : known && warningAt !== undefined && ratio >= warningAt
        ? "warning"
        : "accent";
  const text = known
    ? (valueText ?? `${Math.round(ratio * 100)}%`)
    : unknownText;
  return (
    <div className={cx("nds-meter", `nds-tone--${tone}`, !known && "is-unknown")}>
      <div className="nds-meter-head">
        <span id={id}>{label}</span>
        <strong>{text}</strong>
      </div>
      <div
        className="nds-meter-track"
        role="meter"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={known ? (value as number) : undefined}
        aria-valuetext={text}
      >
        <span style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}

/** One entry in a conversation: who said it, when, and the content. */
export function ChatMessage({
  role = "assistant",
  author,
  time,
  status,
  actions,
  highlighted = false,
  children,
}: {
  role?: "user" | "assistant" | "system";
  author: string;
  time?: string;
  status?: ReactNode;
  actions?: ReactNode;
  highlighted?: boolean;
  children: ReactNode;
}) {
  return (
    <article
      className={cx(
        "nds-chat-message",
        `is-${role}`,
        highlighted && "is-highlighted",
      )}
    >
      <header>
        <strong>{author}</strong>
        {time && <time>{time}</time>}
        {status && <span className="nds-chat-message-status">{status}</span>}
      </header>
      <div className="nds-chat-message-body">{children}</div>
      {actions && <footer>{actions}</footer>}
    </article>
  );
}

/** Message input pinned under a conversation. Enter sends, Shift+Enter breaks the line. */
export function Composer({
  label = "메시지",
  value,
  onValueChange,
  onSubmit,
  placeholder,
  notice,
  submitLabel = "보내기",
  disabled = false,
  busy = false,
  maxLength,
  rows = 2,
}: {
  label?: string;
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: (v: string) => void;
  placeholder?: string;
  notice?: ReactNode;
  submitLabel?: string;
  disabled?: boolean;
  busy?: boolean;
  maxLength?: number;
  rows?: number;
}) {
  const id = useId();
  const ready = value.trim().length > 0 && !disabled && !busy;
  const send = () => {
    if (ready) onSubmit(value.trim());
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };
  const key = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Hangul composition also fires Enter; sending then would cut the last syllable.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };
  return (
    <form className="nds-composer" onSubmit={submit}>
      {notice && (
        <p className="nds-composer-notice" id={`${id}-notice`}>
          {notice}
        </p>
      )}
      <div className="nds-composer-row">
        <label className="nds-sr" htmlFor={id}>
          {label}
        </label>
        <textarea
          id={id}
          className="nds-input"
          rows={rows}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          aria-describedby={notice ? `${id}-notice` : undefined}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={key}
        />
        <Button
          type="submit"
          disabled={!ready}
          loading={busy}
          trailing={<PaperPlaneIcon aria-hidden />}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export type LegendItem = {
  label: string;
  kind?: "dot" | "line" | "dashed" | "box";
  tone?: Tone;
};
/** Explains the marks used in a diagram or chart. Every mark is paired with wording. */
export function Legend({
  label = "범례",
  items,
}: {
  label?: string;
  items: LegendItem[];
}) {
  return (
    <ul className="nds-legend" aria-label={label}>
      {items.map((x) => (
        <li key={x.label} className={`nds-tone--${x.tone || "neutral"}`}>
          <i className={`is-${x.kind || "dot"}`} aria-hidden />
          {x.label}
        </li>
      ))}
    </ul>
  );
}

/** Zoom out, zoom in and fit-to-view for a canvas. Sits beside the canvas, never over it. */
export function ZoomControls({
  label = "확대 제어",
  value,
  min = 0.25,
  max = 2,
  onZoomIn,
  onZoomOut,
  onFit,
}: {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit?: () => void;
}) {
  return (
    <div className="nds-zoom" role="group" aria-label={label}>
      <IconButton
        label="축소"
        size="sm"
        variant="outline"
        disabled={value <= min}
        onClick={onZoomOut}
      >
        <MinusIcon aria-hidden />
      </IconButton>
      <output aria-live="polite">{Math.round(value * 100)}%</output>
      <IconButton
        label="확대"
        size="sm"
        variant="outline"
        disabled={value >= max}
        onClick={onZoomIn}
      >
        <PlusIcon aria-hidden />
      </IconButton>
      {onFit && (
        <Button
          size="sm"
          variant="outline"
          leading={<EnterFullScreenIcon aria-hidden />}
          onClick={onFit}
        >
          전체 보기
        </Button>
      )}
    </div>
  );
}

/** A node on a topology or flow canvas: step number, icon, name, one line of meta and a state. */
export function DiagramNode({
  title,
  meta,
  icon,
  index,
  status,
  tone = "neutral",
  selected = false,
  dashed = false,
  disabled = false,
  onSelect,
}: {
  title: string;
  meta?: string;
  icon?: ReactNode;
  index?: number | string;
  status?: ReactNode;
  tone?: Tone;
  selected?: boolean;
  dashed?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  const className = cx(
    "nds-diagram-node",
    `nds-tone--${tone}`,
    selected && "is-selected",
    dashed && "is-dashed",
  );
  const content = (
    <>
      {index !== undefined && (
        <span className="nds-diagram-node-index">{index}</span>
      )}
      {icon && (
        <span className="nds-diagram-node-icon" aria-hidden>
          {icon}
        </span>
      )}
      <span className="nds-diagram-node-text">
        <strong>{title}</strong>
        {meta && <small title={meta}>{meta}</small>}
      </span>
      {status && <span className="nds-diagram-node-status">{status}</span>}
    </>
  );
  return onSelect ? (
    <button
      type="button"
      className={className}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
    >
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}

/** Console frame: fixed navigation, a top bar and a main area that owns its own scrolling. */
export function AppShell({
  brand,
  navigation,
  topbar,
  children,
  navigationLabel = "주 탐색",
}: {
  brand: ReactNode;
  navigation: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
  navigationLabel?: string;
}) {
  return (
    <div className="nds-app-shell">
      <aside className="nds-app-shell-side" aria-label={navigationLabel}>
        <div className="nds-app-shell-brand">{brand}</div>
        {navigation}
      </aside>
      {topbar && <header className="nds-app-shell-bar">{topbar}</header>}
      <main className="nds-app-shell-main">{children}</main>
    </div>
  );
}

/** A titled work area that scrolls on its own, with an optional footer that stays in view. */
export function Pane({
  title,
  index,
  actions,
  footer,
  children,
  scroll = true,
}: {
  title: string;
  index?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
}) {
  const id = useId();
  return (
    <section className="nds-pane" aria-labelledby={id}>
      <header>
        {index && <span className="nds-pane-index">{index}</span>}
        <h2 id={id}>{title}</h2>
        {actions && <div className="nds-pane-actions">{actions}</div>}
      </header>
      <div
        className={cx("nds-pane-body", scroll && "is-scroll")}
        tabIndex={scroll ? 0 : undefined}
        role={scroll ? "region" : undefined}
        aria-labelledby={scroll ? id : undefined}
      >
        {children}
      </div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}
