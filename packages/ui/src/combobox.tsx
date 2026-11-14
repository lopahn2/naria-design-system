import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Field, Checkbox, type FieldProps, type Option } from "./forms";
import { Button, IconButton } from "./actions";
import { cx, clamp, useOutside } from "./utils";
export function Combobox({
  label,
  options,
  value,
  onValueChange,
  placeholder = "검색해서 선택하세요",
  disabled = false,
  hint,
  error,
  required = false,
}: FieldProps & {
  options: Option[];
  value: string;
  onValueChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [active, setActive] = useState(0),
    ref = useRef<HTMLDivElement>(null),
    input = useRef<HTMLInputElement>(null),
    id = useId();
  const selected = options.find((x) => x.value === value);
  const filtered = options.filter((x) =>
    x.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const activeIndex = filtered[active] && !filtered[active].disabled
    ? active : filtered.findIndex(option => !option.disabled);
  const close = () => {
    setOpen(false);
    setQuery("");
  };
  useOutside(ref, open, close);
  const choose = (index: number) => {
    const o = filtered[index];
    if (o && !o.disabled) {
      onValueChange(o.value);
      close();
      input.current?.focus();
    }
  };
  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-${activeIndex}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, id]);
  return (
    <div
      ref={ref}
      className="nds-combobox"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) close();
      }}
    >
      <Field
        label={label}
        htmlFor={id}
        hint={hint}
        error={error}
        required={required}
        id={`${id}-hint`}
      >
        <div className="nds-input-wrap" data-invalid={!!error}>
          <input
            ref={input}
            id={id}
            className="nds-input"
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? `${id}-list` : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              open && activeIndex >= 0 ? `${id}-${activeIndex}` : undefined
            }
            aria-invalid={!!error || undefined}
            aria-required={required}
            aria-describedby={hint || error ? `${id}-hint` : undefined}
            autoComplete="off"
            placeholder={placeholder}
            disabled={disabled}
            value={open ? query : selected?.label || ""}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onClick={() => {
              setOpen(true);
              setQuery("");
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                setOpen(true);
                const enabled = filtered
                  .map((x, i) => (x.disabled ? -1 : i))
                  .filter((x) => x >= 0);
                if (enabled.length) {
                  const pos = enabled.indexOf(activeIndex);
                  setActive(
                    enabled[
                      clamp(
                        pos + (open ? (e.key === "ArrowDown" ? 1 : -1) : 0),
                        0,
                        enabled.length - 1,
                      )
                    ],
                  );
                }
              } else if (e.key === "Enter" && open) {
                e.preventDefault();
                choose(activeIndex);
              } else if (e.key === "Escape" && open) {
                e.stopPropagation();
                close();
              } else if (e.key === "Tab") close();
            }}
          />
          <span className="nds-input-trailing">
            <IconButton
              label={`${label} 옵션 ${open ? "닫기" : "열기"}`}
              size="sm"
              tabIndex={-1}
              disabled={disabled}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setOpen(!open);
                setQuery("");
                input.current?.focus();
              }}
            >
              <ChevronDownIcon />
            </IconButton>
          </span>
        </div>
      </Field>
      {open && (
        <div className="nds-combobox-popup">
          <div role="listbox" id={`${id}-list`} aria-label={label}>
            {filtered.map((o, i) => (
              <div
                key={o.value}
                id={`${id}-${i}`}
                role="option"
                aria-selected={value === o.value}
                aria-disabled={o.disabled || undefined}
                className={cx("nds-option", activeIndex === i && "is-active")}
                onMouseDown={(e) => e.preventDefault()}
                onPointerMove={() => {
                  if (!o.disabled) setActive(i);
                }}
                onClick={() => choose(i)}
              >
                <span>
                  {o.label}
                  {o.description && <small>{o.description}</small>}
                </span>
                {value === o.value && <CheckIcon />}
              </div>
            ))}
          </div>
          {!filtered.length && (
            <p role="status" className="nds-hint">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
export function MultiSelect({
  label,
  options,
  value,
  onValueChange,
  disabled = false,
  hint,
  error,
}: FieldProps & {
  options: Option[];
  value: string[];
  onValueChange: (v: string[]) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState("");
  const id = useId();
  return (
    <div className="nds-field">
      <span className="nds-label" id={`${id}-label`}>
        {label}
      </span>
      <Button
        variant="outline"
        fullWidth
        disabled={disabled}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-expanded={open}
        aria-controls={open ? `${id}-options` : undefined}
        trailing={<ChevronDownIcon />}
        onClick={() => setOpen(!open)}
      >
        <span id={`${id}-value`}>
          {value.length ? `${value.length}개 선택됨` : "항목을 선택하세요"}
        </span>
      </Button>
      {value.length > 0 && (
        <div className="nds-tag-list">
          {value.map((v) => (
            <span className="nds-tag" key={v}>
              {options.find((o) => o.value === v)?.label || v}
              <IconButton
                size="sm"
                label={`${options.find((o) => o.value === v)?.label || v} 선택 해제`}
                disabled={disabled}
                onClick={() => onValueChange(value.filter((x) => x !== v))}
              >
                <Cross2Icon />
              </IconButton>
            </span>
          ))}
        </div>
      )}
      {open && (
        <fieldset
          className="nds-multi-options"
          id={`${id}-options`}
          disabled={disabled}
        >
          <legend className="nds-sr">{label}</legend>
          <input
            type="search"
            className="nds-input"
            aria-label={`${label} 검색`}
            placeholder="항목 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {options
            .filter((o) => o.label.includes(query))
            .map((o) => (
              <Checkbox
                key={o.value}
                label={o.label}
                disabled={o.disabled}
                checked={value.includes(o.value)}
                onChange={() =>
                  onValueChange(
                    value.includes(o.value)
                      ? value.filter((v) => v !== o.value)
                      : [...value, o.value],
                  )
                }
              />
            ))}
          {!options.some((o) => o.label.includes(query)) && (
            <p role="status">검색 결과가 없습니다.</p>
          )}
        </fieldset>
      )}
      {(hint || error) && (
        <p className={error ? "nds-error" : "nds-hint"}>{error || hint}</p>
      )}
    </div>
  );
}
