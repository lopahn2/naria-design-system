import {
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ComponentPropsWithRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { CheckIcon, CopyIcon, ReloadIcon } from "@radix-ui/react-icons";
import { cx } from "./utils";
import type { Size } from "./core";
export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: Size;
  loading?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  fullWidth?: boolean;
};
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leading,
  trailing,
  fullWidth = false,
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cx(
        "nds-button",
        `nds-button--${variant}`,
        `nds-control--${size}`,
        fullWidth && "nds-full",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <ReloadIcon className="nds-spin" aria-hidden /> : leading}
      <span>{children}</span>
      {!loading && trailing}
    </button>
  );
}
export function IconButton({
  label,
  children,
  size = "md",
  variant = "ghost",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}: Omit<ButtonProps, "leading" | "trailing"> & { label: string }) {
  return (
    <button
      {...props}
      type={props.type || "button"}
      aria-label={label}
      title={label}
      aria-busy={loading || undefined}
      className={cx(
        "nds-button",
        "nds-icon-button",
        `nds-button--${variant}`,
        `nds-control--${size}`,
        className,
      )}
      disabled={disabled || loading}
    >
      {loading ? <ReloadIcon className="nds-spin" aria-hidden /> : children}
    </button>
  );
}
export function Link({
  external = false,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean }) {
  return (
    <a
      {...props}
      className={cx("nds-link", className)}
      target={external ? "_blank" : props.target}
      rel={external ? "noopener noreferrer" : props.rel}
    >
      {children}
      {external && <span className="nds-sr"> (새 창)</span>}
    </a>
  );
}
export function ButtonGroup({
  label,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { label: string }) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={cx("nds-button-group", className)}
    >
      {children}
    </div>
  );
}
export function ToggleButton({
  pressed,
  onPressedChange,
  ...props
}: ButtonProps & {
  pressed: boolean;
  onPressedChange: (value: boolean) => void;
}) {
  return (
    <Button
      {...props}
      variant={pressed ? "secondary" : "ghost"}
      aria-pressed={pressed}
      onClick={(e) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) onPressedChange(!pressed);
      }}
    />
  );
}
export function CopyButton({
  value,
  onCopied,
  children = "복사",
  ...props
}: Omit<ButtonProps, "onClick"> & { value: string; onCopied?: () => void }) {
  const [status, set] = useState<"idle" | "done" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <span className="nds-copy">
      <Button
        {...props}
        leading={status === "done" ? <CheckIcon /> : <CopyIcon />}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            set("done");
            onCopied?.();
          } catch {
            set("error");
          }
          clearTimeout(timer.current);
          timer.current = setTimeout(() => set("idle"), 2200);
        }}
      >
        {status === "done" ? "복사됨" : children}
      </Button>
      <span
        role="status"
        className={status === "error" ? "nds-error" : "nds-sr"}
      >
        {status === "error"
          ? "복사가 제한되었습니다. 텍스트를 직접 선택해 주세요."
          : status === "done"
            ? "클립보드에 복사했습니다."
            : ""}
      </span>
    </span>
  );
}
export function HoldButton({
  duration = 900,
  onConfirm,
  children = "길게 눌러 확인",
  ...props
}: Omit<ButtonProps, "onClick"> & {
  duration?: number;
  onConfirm: () => void;
}) {
  const [progress, set] = useState(0),
    [done, setDone] = useState(false);
  const start = useRef(0),
    raf = useRef(0),
    holding = useRef(false);
  const stop = () => {
    holding.current = false;
    cancelAnimationFrame(raf.current);
    set(0);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const begin = () => {
    if (holding.current || props.disabled || done) return;
    holding.current = true;
    start.current = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - start.current) / duration);
      set(p);
      if (p < 1 && holding.current) raf.current = requestAnimationFrame(tick);
      else if (holding.current) {
        holding.current = false;
        setDone(true);
        onConfirm();
      }
    };
    raf.current = requestAnimationFrame(tick);
  };
  return (
    <Button
      {...props}
      className={cx("nds-hold", props.className)}
      aria-label={
        done
          ? "확인 완료"
          : `${typeof children === "string" ? children : "확인"}. Space 또는 Enter 키를 ${duration / 1000}초간 누르세요.`
      }
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        begin();
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onBlur={stop}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (!e.repeat) begin();
        }
        if (e.key === "Escape") stop();
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          stop();
        }
      }}
    >
      <span
        className="nds-hold-fill"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />
      {done ? "확인 완료" : children}
      <span className="nds-sr" role="status">
        {done ? "작업을 확인했습니다." : ""}
      </span>
    </Button>
  );
}
