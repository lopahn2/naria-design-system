import { useId, type ReactNode, type CSSProperties } from "react";
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  ReloadIcon,
  Cross2Icon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import { IconButton } from "./actions";
import type { Tone } from "./core";
import { cx, clamp } from "./utils";
const toneIcon = (tone: Tone) =>
  tone === "success" ? (
    <CheckCircledIcon />
  ) : tone === "warning" || tone === "danger" ? (
    <ExclamationTriangleIcon />
  ) : (
    <InfoCircledIcon />
  );
export function Alert({
  title,
  children,
  tone = "info",
  onDismiss,
  action,
}: {
  title: string;
  children?: ReactNode;
  tone?: Tone;
  onDismiss?: () => void;
  action?: ReactNode;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cx("nds-alert", `nds-tone--${tone}`)}
    >
      {toneIcon(tone)}
      <div>
        <strong>{title}</strong>
        {children && <div>{children}</div>}
        {action && <div className="nds-alert-action">{action}</div>}
      </div>
      {onDismiss && (
        <IconButton label="알림 닫기" size="sm" onClick={onDismiss}>
          <Cross2Icon />
        </IconButton>
      )}
    </div>
  );
}
export function Banner({
  title,
  children,
  action,
  onDismiss,
  tone = "info",
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  tone?: Tone;
}) {
  return (
    <div className="nds-banner">
      <Alert title={title} tone={tone} action={action} onDismiss={onDismiss}>
        {children}
      </Alert>
    </div>
  );
}
export function Progress({
  value,
  label,
  indeterminate = false,
}: {
  value?: number;
  label: string;
  indeterminate?: boolean;
}) {
  const id = useId(),
    v = clamp(value || 0, 0, 100);
  return (
    <div className="nds-field">
      <div className="nds-between">
        <span id={id} className="nds-label">
          {label}
        </span>
        {!indeterminate && <span className="nds-hint">{v}%</span>}
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : v}
        className={cx("nds-progress", indeterminate && "is-indeterminate")}
      >
        <span style={{ width: indeterminate ? "30%" : `${v}%` }} />
      </div>
    </div>
  );
}
export function Spinner({
  label = "불러오는 중",
  size = 20,
}: {
  label?: string;
  size?: number;
}) {
  return (
    <span role="status" className="nds-spinner">
      <ReloadIcon width={size} height={size} className="nds-spin" aria-hidden />
      <span className="nds-sr">{label}</span>
    </span>
  );
}
export function Skeleton({
  width = "100%",
  height = 16,
  circle = false,
  label = "콘텐츠를 불러오는 중",
}: {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  label?: string;
}) {
  return (
    <span
      role="status"
      className={cx("nds-skeleton", circle && "nds-skeleton--circle")}
      style={{ width, height } as CSSProperties}
    >
      <span className="nds-sr">{label}</span>
    </span>
  );
}
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="nds-empty">
      <span className="nds-empty-icon" aria-hidden>
        {icon || <ArchiveIcon />}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Result({
  title,
  description,
  tone = "success",
  action,
}: {
  title: string;
  description: string;
  tone?: Tone;
  action?: ReactNode;
}) {
  return (
    <div className={cx("nds-result", `nds-tone--${tone}`)}>
      <span className="nds-result-icon" aria-hidden>
        {toneIcon(tone)}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
