import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import {
  Cross2Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Button, IconButton, type ButtonProps } from "./actions";
import { cx, useOutside, clamp } from "./utils";
import type { Tone } from "./core";
let locks = 0,
  previousOverflow = "";
export type DialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  dismissible?: boolean;
  variant?: "dialog" | "drawer" | "sheet" | "responsive";
  role?: "dialog" | "alertdialog";
};
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dismissible = true,
  variant = "responsive",
  role = "dialog",
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId();
  useEffect(() => {
    const el = ref.current;
    if (!el || !open) return;
    const previous = document.activeElement as HTMLElement | null;
    if (!el.open) el.showModal();
    if (locks++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      el.close();
      if (--locks === 0) document.body.style.overflow = previousOverflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      role={role}
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-desc` : undefined}
      className={cx("nds-dialog", `nds-dialog--${variant}`)}
      onCancel={(e) => {
        e.preventDefault();
        if (dismissible) onOpenChange(false);
      }}
      onClick={(e) => {
        if (!dismissible || e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          onOpenChange(false);
      }}
    >
      <div className="nds-dialog-heading">
        <h2 id={`${id}-title`} tabIndex={-1}>
          {title}
        </h2>
        {dismissible && (
          <IconButton label="닫기" onClick={() => onOpenChange(false)}>
            <Cross2Icon />
          </IconButton>
        )}
      </div>
      {description && (
        <p className="nds-dialog-description" id={`${id}-desc`}>
          {description}
        </p>
      )}
      <div className="nds-dialog-content">{open ? children : null}</div>
      {footer && <div className="nds-dialog-footer">{footer}</div>}
    </dialog>
  );
}
export const Drawer = (p: DialogProps) => <Dialog {...p} variant="drawer" />;
export const BottomSheet = (p: DialogProps) => (
  <Dialog {...p} variant="sheet" />
);
export function AlertDialog({
  onConfirm,
  confirmLabel = "삭제",
  cancelLabel = "취소",
  loading = false,
  ...p
}: Omit<DialogProps, "footer" | "role" | "variant"> & {
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}) {
  return (
    <Dialog
      {...p}
      role="alertdialog"
      variant="dialog"
      dismissible={!loading}
      footer={
        <>
          <Button
            variant="secondary"
            autoFocus
            disabled={loading}
            onClick={() => p.onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
export function Popover({
  trigger,
  title,
  children,
  align = "start",
}: {
  trigger: string;
  title?: string;
  children: ReactNode;
  align?: "start" | "end";
}) {
  const [open, set] = useState(false),
    ref = useRef<HTMLDivElement>(null),
    button = useRef<HTMLButtonElement>(null),
    id = useId();
  useOutside(ref, open, () => set(false));
  return (
    <div
      className="nds-popover-root"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          set(false);
          button.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) set(false);
      }}
    >
      <Button
        ref={button}
        variant="outline"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => set(!open)}
      >
        {trigger}
      </Button>
      {open && (
        <div
          className={cx("nds-popover", align === "end" && "nds-popover--end")}
          id={id}
        >
          {title && <strong>{title}</strong>}
          {children}
        </div>
      )}
    </div>
  );
}
export type MenuItem = {
  id: string;
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  shortcut?: string;
};
export function DropdownMenu({
  label,
  items,
  variant = "outline",
  iconOnly = false,
  disabled = false,
}: {
  label: string;
  items: MenuItem[];
  variant?: ButtonProps["variant"];
  iconOnly?: boolean;
  disabled?: boolean;
}) {
  const [open, set] = useState(false),
    ref = useRef<HTMLDivElement>(null),
    button = useRef<HTMLButtonElement>(null),
    refs = useRef<(HTMLButtonElement | null)[]>([]),
    id = useId();
  useOutside(ref, open, () => set(false));
  useEffect(() => {
    if (open) refs.current.find((r) => r && !r.disabled)?.focus();
  }, [open]);
  const close = (restore = true) => {
    set(false);
    if (restore) button.current?.focus();
  };
  const keys = (e: KeyboardEvent, index: number) => {
    let next = index;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const enabled = items
        .map((x, i) => (!x.disabled ? i : -1))
        .filter((i) => i >= 0);
      if (!enabled.length) return;
      next =
        e.key === "Home"
          ? enabled[0]
          : e.key === "End"
            ? enabled.at(-1)!
            : enabled[
                (enabled.indexOf(index) +
                  (e.key === "ArrowDown" ? 1 : -1) +
                  enabled.length) %
                  enabled.length
              ];
      refs.current[next]?.focus();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") close(false);
    else if (e.key.length === 1) {
      const next = items.findIndex(
        (x) =>
          !x.disabled && x.label.toLowerCase().startsWith(e.key.toLowerCase()),
      );
      if (next >= 0) refs.current[next]?.focus();
    }
  };
  return (
    <div className="nds-popover-root" ref={ref}>
      <Button
        ref={button}
        variant={variant}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={iconOnly ? label : undefined}
        onClick={() => set(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            set(true);
          }
        }}
      >
        {iconOnly ? <ChevronDownIcon /> : label}
      </Button>
      {open && (
        <div
          role="menu"
          aria-label={label}
          id={id}
          className="nds-menu"
          onBlur={(e) => {
            if (!ref.current?.contains(e.relatedTarget as Node)) close(false);
          }}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              ref={(el) => {
                refs.current[i] = el;
              }}
              tabIndex={-1}
              disabled={item.disabled}
              className={item.danger ? "nds-danger-text" : ""}
              onKeyDown={(e) => keys(e, i)}
              onClick={() => {
                close();
                item.onSelect();
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.shortcut && <kbd>{item.shortcut}</kbd>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function SplitButton({
  label,
  onClick,
  items,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  items: MenuItem[];
  disabled?: boolean;
}) {
  return (
    <div className="nds-split">
      <Button onClick={onClick} disabled={disabled}>
        {label}
      </Button>
      <DropdownMenu
        label={`${label} 추가 작업`}
        variant="primary"
        iconOnly
        disabled={disabled}
        items={items.map((x) => ({ ...x, disabled: disabled || x.disabled }))}
      />
    </div>
  );
}
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const id = useId(),
    [open, set] = useState(false);
  return (
    <span
      className="nds-tooltip-root"
      onMouseEnter={() => set(true)}
      onMouseLeave={() => set(false)}
      onFocus={() => set(true)}
      onBlur={() => set(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          set(false);
          e.stopPropagation();
        }
      }}
    >
      <span tabIndex={0} aria-describedby={open ? id : undefined}>
        {children}
      </span>
      {open && (
        <span role="tooltip" id={id} className="nds-tooltip">
          {label}
        </span>
      )}
    </span>
  );
}
export function CommandPalette({
  open,
  onOpenChange,
  items,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: MenuItem[];
}) {
  const [query, set] = useState(""),
    [active, setActive] = useState(0),
    id = useId();
  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, open, id]);
  const filtered = items.filter(
    (x) => !x.disabled && x.label.toLowerCase().includes(query.toLowerCase()),
  );
  useEffect(() => {
    if (open) {
      set("");
      setActive(0);
    }
  }, [open]);
  const select = (i: number) => {
    if (filtered[i]) {
      onOpenChange(false);
      filtered[i].onSelect();
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="빠른 이동"
      variant="dialog"
    >
      <div className="nds-command-search">
        <MagnifyingGlassIcon />
        <input
          autoFocus
          aria-label="명령 검색"
          role="combobox"
          aria-expanded={true}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            filtered[active] ? `${id}-${active}` : undefined
          }
          value={query}
          onChange={(e) => {
            set(e.target.value);
            setActive(0);
          }}
          placeholder="컴포넌트나 작업 검색"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setActive(
                clamp(
                  active + (e.key === "ArrowDown" ? 1 : -1),
                  0,
                  Math.max(0, filtered.length - 1),
                ),
              );
            }
            if (e.key === "Enter") {
              e.preventDefault();
              select(active);
            }
          }}
        />
      </div>
      <div
        role="listbox"
        id={`${id}-list`}
        aria-label="검색 결과"
        className="nds-command-results"
      >
        {filtered.map((x, i) => (
          <div
            role="option"
            id={`${id}-${i}`}
            aria-selected={active === i}
            key={x.id}
            onPointerMove={() => setActive(i)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => select(i)}
          >
            {x.icon}
            <span>{x.label}</span>
            {x.shortcut && <kbd>{x.shortcut}</kbd>}
          </div>
        ))}
      </div>
      {!filtered.length && (
        <p className="nds-hint" role="status">
          일치하는 결과가 없습니다.
        </p>
      )}
    </Dialog>
  );
}
export type ToastOptions = {
  title: string;
  description?: string;
  tone?: Tone;
  duration?: number;
  action?: { label: string; onClick: () => void };
};
type ToastRecord = ToastOptions & { id: number };
const ToastContext = createContext<(options: ToastOptions) => void>(() => {
  throw Error("ToastProvider가 필요합니다.");
});
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, set] = useState<ToastRecord[]>([]),
    serial = useRef(0);
  const show = (options: ToastOptions) =>
    set((v) => [...v, { ...options, id: ++serial.current }].slice(-3));
  return (
    <ToastContext.Provider value={show}>
      {children}
      <section className="nds-toasts" aria-label="알림">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            close={() => set((v) => v.filter((x) => x.id !== t.id))}
          />
        ))}
      </section>
    </ToastContext.Provider>
  );
}
function ToastItem({
  toast,
  close,
}: {
  toast: ToastRecord;
  close: () => void;
}) {
  const [paused, set] = useState(false);
  const remaining = useRef(toast.duration ?? 5000),
    closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (paused || toast.action || remaining.current <= 0) return;
    const begin = Date.now(),
      timer = setTimeout(() => closeRef.current(), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - begin;
    };
  }, [paused, toast.action]);
  return (
    <div
      className={cx("nds-toast", `nds-tone--${toast.tone || "neutral"}`)}
      onMouseEnter={() => set(true)}
      onMouseLeave={() => set(false)}
      onFocus={() => set(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) set(false);
      }}
    >
      <InfoCircledIcon />
      <div role="status" aria-live="polite">
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>
      {toast.action && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            toast.action?.onClick();
            close();
          }}
        >
          {toast.action.label}
        </Button>
      )}
      <IconButton label="알림 닫기" size="sm" onClick={close}>
        <Cross2Icon />
      </IconButton>
    </div>
  );
}
export const useToast = () => useContext(ToastContext);
