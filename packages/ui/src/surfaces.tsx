import { useId, useState, type HTMLAttributes, type ReactNode } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Cross2Icon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { IconButton } from "./actions";
import { cx } from "./utils";
import type { Size, Tone } from "./core";
export function Card({
  title,
  description,
  children,
  footer,
  actions,
  variant = "outline",
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title?: ReactNode;
  description?: string;
  footer?: ReactNode;
  actions?: ReactNode;
  variant?: "outline" | "filled" | "elevated";
}) {
  return (
    <article
      {...props}
      className={cx("nds-card", `nds-card--${variant}`, className)}
    >
      {(title || actions) && (
        <header>
          <div>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children && <div className="nds-card-body">{children}</div>}
      {footer && <footer>{footer}</footer>}
    </article>
  );
}
export function ListRow({
  title,
  description,
  leading,
  trailing,
  onClick,
  disabled = false,
}: {
  title: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const content = (
    <>
      {leading && <span className="nds-list-leading">{leading}</span>}
      <span className="nds-list-copy">
        <strong>{title}</strong>
        {description && <small>{description}</small>}
      </span>
      {(trailing || onClick) && (
        <span className="nds-list-trailing">
          {trailing || <ChevronRightIcon aria-hidden />}
        </span>
      )}
    </>
  );
  return onClick ? (
    <button
      type="button"
      className="nds-list-row"
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  ) : (
    <div className="nds-list-row">{content}</div>
  );
}
export function Accordion({
  items,
  multiple = false,
  defaultValue = [],
}: {
  items: {
    value: string;
    title: string;
    content: ReactNode;
    disabled?: boolean;
  }[];
  multiple?: boolean;
  defaultValue?: string[];
}) {
  const [open, set] = useState(defaultValue),
    id = useId();
  return (
    <div className="nds-accordion">
      {items.map((x, i) => {
        const active = open.includes(x.value);
        return (
          <section key={x.value}>
            <h3>
              <button
                type="button"
                id={`${id}-trigger-${i}`}
                aria-expanded={active}
                aria-controls={`${id}-panel-${i}`}
                disabled={x.disabled}
                onClick={() =>
                  set(
                    active
                      ? open.filter((v) => v !== x.value)
                      : multiple
                        ? [...open, x.value]
                        : [x.value],
                  )
                }
              >
                {x.title}
                <ChevronDownIcon
                  aria-hidden
                  style={{ transform: active ? "rotate(180deg)" : "" }}
                />
              </button>
            </h3>
            <div
              id={`${id}-panel-${i}`}
              role="region"
              aria-labelledby={`${id}-trigger-${i}`}
              hidden={!active}
              className="nds-accordion-content"
            >
              {x.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}
export function Divider({
  label,
  vertical = false,
}: {
  label?: string;
  vertical?: boolean;
}) {
  return (
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={cx("nds-divider", vertical && "nds-divider--vertical")}
    >
      {label && <span>{label}</span>}
    </div>
  );
}
export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: Size;
}) {
  const [failedSource, setFailedSource] = useState<string | undefined>(undefined);
  return (
    <span
      className={cx("nds-avatar", `nds-avatar--${size}`)}
      role="img"
      aria-label={name}
    >
      {src && failedSource !== src ? (
        <img key={src} src={src} alt="" onError={() => setFailedSource(src)} />
      ) : name ? (
        name.trim().slice(0, 2)
      ) : (
        <PersonIcon />
      )}
    </span>
  );
}
export function AvatarGroup({
  names,
  max = 4,
}: {
  names: string[];
  max?: number;
}) {
  return (
    <div className="nds-avatar-group" aria-label={`참여자 ${names.length}명`}>
      {names.slice(0, max).map((name, i) => (
        <Avatar name={name} key={`${name}-${i}`} />
      ))}
      {names.length > max && (
        <span
          className="nds-avatar nds-avatar--md"
          aria-label={`외 ${names.length - max}명`}
        >
          +{names.length - max}
        </span>
      )}
    </div>
  );
}
export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span className={cx("nds-badge", `nds-tone--${tone}`)}>
      {dot && <i aria-hidden />}
      {children}
    </span>
  );
}
export function Tag({
  children,
  onRemove,
  selected,
  onSelect,
  disabled = false,
}: {
  children: string;
  onRemove?: () => void;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}) {
  return (
    <span className={cx("nds-tag", selected && "is-selected")}>
      {onSelect ? (
        <button
          type="button"
          aria-pressed={!!selected}
          disabled={disabled}
          onClick={onSelect}
        >
          {children}
        </button>
      ) : (
        children
      )}
      {onRemove && (
        <IconButton
          size="sm"
          label={`${children} 제거`}
          disabled={disabled}
          onClick={onRemove}
        >
          <Cross2Icon />
        </IconButton>
      )}
    </span>
  );
}
export function ScrollArea({
  children,
  label,
  height = 200,
}: {
  children: ReactNode;
  label: string;
  height?: number;
}) {
  return (
    <div
      className="nds-scroll-area"
      role="region"
      aria-label={label}
      tabIndex={0}
      style={{ maxHeight: height }}
    >
      {children}
    </div>
  );
}
export function Carousel({
  items,
  label = "슬라이드",
}: {
  items: { title: string; content: ReactNode }[];
  label?: string;
}) {
  const [index, set] = useState(0),
    id = useId();
  return (
    <section
      className="nds-carousel"
      aria-roledescription="캐러셀"
      aria-label={label}
    >
      <div
        id={id}
        className="nds-carousel-slide"
        role="group"
        aria-roledescription="슬라이드"
        aria-label={`${index + 1} / ${items.length}`}
      >
        <h3>{items[index]?.title}</h3>
        {items[index]?.content}
      </div>
      <div className="nds-between">
        <IconButton
          label="이전 슬라이드"
          variant="outline"
          disabled={index === 0}
          onClick={() => set((v) => v - 1)}
        >
          <ChevronRightIcon style={{ transform: "rotate(180deg)" }} />
        </IconButton>
        <span aria-live="polite">
          {index + 1} / {items.length}
        </span>
        <IconButton
          label="다음 슬라이드"
          variant="outline"
          disabled={index >= items.length - 1}
          onClick={() => set((v) => v + 1)}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </section>
  );
}
