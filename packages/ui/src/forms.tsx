import {
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  CheckIcon,
  Cross2Icon,
  EyeOpenIcon,
  EyeClosedIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  StarFilledIcon,
  StarIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { cx, clamp, useControllable } from "./utils";
import { Button, IconButton } from "./actions";
export type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
};
export function Field({
  label,
  hint,
  error,
  required,
  optional,
  htmlFor,
  children,
  id,
}: FieldProps & { htmlFor?: string; children: ReactNode; id?: string }) {
  return (
    <div className={cx("nds-field", !!error && "nds-field--error")}>
      <label htmlFor={htmlFor} className="nds-label">
        {label}
        {required && (
          <span className="nds-required" aria-label="필수">
            {" "}
            *
          </span>
        )}
        {optional && <span className="nds-muted"> (선택)</span>}
      </label>
      {children}
      {(error || hint) && (
        <p
          id={id}
          className={error ? "nds-error" : "nds-hint"}
          role={error ? "alert" : undefined}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> &
  FieldProps & { leading?: ReactNode; trailing?: ReactNode };
export function TextField({
  label,
  hint,
  error,
  optional,
  leading,
  trailing,
  className,
  id: given,
  ...props
}: TextFieldProps) {
  const own = useId(),
    id = given || own,
    desc = `${id}-hint`;
  return (
    <Field
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={props.required}
      optional={optional}
      id={desc}
    >
      <div
        className={cx("nds-input-wrap", props.disabled && "is-disabled")}
        data-invalid={!!error}
      >
        {leading && (
          <span className="nds-input-leading" aria-hidden>
            {leading}
          </span>
        )}
        <input
          {...props}
          id={id}
          className={cx("nds-input", className)}
          aria-invalid={!!error || undefined}
          aria-describedby={
            [props["aria-describedby"], error || hint ? desc : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
        />
        {trailing && <span className="nds-input-trailing">{trailing}</span>}
      </div>
    </Field>
  );
}
export function Textarea({
  label,
  hint,
  error,
  optional,
  id: given,
  className,
  maxLength,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps) {
  const own = useId(),
    id = given || own;
  const [ownValue, setOwnValue] = useState(String(props.defaultValue ?? ""));
  const count = String(props.value ?? ownValue).length;
  return (
    <Field
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={props.required}
      optional={optional}
      id={`${id}-hint`}
    >
      <textarea
        {...props}
        id={id}
        onChange={(e) => {
          setOwnValue(e.target.value);
          props.onChange?.(e);
        }}
        maxLength={maxLength}
        className={cx("nds-input", "nds-textarea", className)}
        aria-invalid={!!error || undefined}
        aria-describedby={error || hint ? `${id}-hint` : undefined}
      />
      {maxLength && (
        <span className="nds-field-count">
          {count} / {maxLength}
        </span>
      )}
    </Field>
  );
}
export function PasswordField(props: TextFieldProps) {
  const [visible, set] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <IconButton
          label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
          aria-pressed={visible}
          size="sm"
          disabled={props.disabled}
          onClick={() => set(!visible)}
        >
          {visible ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </IconButton>
      }
    />
  );
}
export function SearchField({
  value,
  onValueChange,
  ...props
}: Omit<TextFieldProps, "value" | "onChange" | "type"> & {
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <TextField
      {...props}
      type="search"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      leading={<MagnifyingGlassIcon />}
      trailing={
        value ? (
          <IconButton
            label="검색어 지우기"
            size="sm"
            disabled={props.disabled}
            onClick={() => onValueChange("")}
          >
            <Cross2Icon />
          </IconButton>
        ) : undefined
      }
    />
  );
}
export function NumberField({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  hint,
  error,
}: {
  value: number;
  onValueChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
} & FieldProps) {
  const id = useId();
  const change = (v: number) =>
    onValueChange(clamp(Number(v.toFixed(8)), min, max));
  return (
    <Field
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      id={`${id}-hint`}
    >
      <div className="nds-number">
        <IconButton
          variant="outline"
          label={`${label} 감소`}
          disabled={disabled || value <= min}
          onClick={() => change(value - step)}
        >
          <MinusIcon />
        </IconButton>
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={hint || error ? `${id}-hint` : undefined}
          onChange={(e) => {
            if (
              e.target.value !== "" &&
              Number.isFinite(e.target.valueAsNumber)
            )
              change(e.target.valueAsNumber);
          }}
        />
        <IconButton
          variant="outline"
          label={`${label} 증가`}
          disabled={disabled || value >= max}
          onClick={() => change(value + step)}
        >
          <PlusIcon />
        </IconButton>
      </div>
    </Field>
  );
}
export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
};
export function Select({
  label,
  hint,
  error,
  optional,
  options,
  id: given,
  className,
  placeholder,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> &
  FieldProps & { options: Option[]; placeholder?: string }) {
  const own = useId(),
    id = given || own;
  return (
    <Field
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      optional={optional}
      required={props.required}
      id={`${id}-hint`}
    >
      <select
        {...props}
        id={id}
        className={cx("nds-input", "nds-select", className)}
        aria-invalid={!!error || undefined}
        aria-describedby={error || hint ? `${id}-hint` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
export function Checkbox({
  label,
  description,
  indeterminate = false,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  description?: string;
  indeterminate?: boolean;
}) {
  return (
    <label
      className={cx("nds-choice", props.disabled && "is-disabled", className)}
    >
      <input
        {...props}
        type="checkbox"
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
      />
      <span className="nds-check-mark" aria-hidden>
        {indeterminate ? <MinusIcon /> : <CheckIcon />}
      </span>
      <span>
        {label}
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}
export function RadioGroup({
  label,
  options,
  value,
  onValueChange,
  name,
  disabled = false,
  hint,
  error,
  orientation = "vertical",
}: FieldProps & {
  options: Option[];
  value: string;
  onValueChange: (v: string) => void;
  name?: string;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
}) {
  const id = useId();
  return (
    <fieldset
      className={cx("nds-fieldset", `nds-radio--${orientation}`)}
      disabled={disabled}
      aria-describedby={hint || error ? `${id}-hint` : undefined}
    >
      <legend className="nds-label">{label}</legend>
      <div className="nds-choices">
        {options.map((o) => (
          <label
            key={o.value}
            className={cx(
              "nds-choice",
              (disabled || o.disabled) && "is-disabled",
            )}
          >
            <input
              type="radio"
              name={name || id}
              value={o.value}
              checked={value === o.value}
              onChange={() => onValueChange(o.value)}
              disabled={o.disabled}
            />
            <span className="nds-radio-mark" aria-hidden />
            <span>
              {o.label}
              {o.description && <small>{o.description}</small>}
            </span>
          </label>
        ))}
      </div>
      {(hint || error) && (
        <p id={`${id}-hint`} className={error ? "nds-error" : "nds-hint"}>
          {error || hint}
        </p>
      )}
    </fieldset>
  );
}
export function Switch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={cx("nds-switch-row", disabled && "is-disabled")}>
      <span>
        {label}
        {description && <small>{description}</small>}
      </span>
      <span className="nds-switch">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
        <span aria-hidden />
      </span>
    </label>
  );
}
export function Slider({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  format = String,
  disabled = false,
}: {
  label: string;
  value: number;
  onValueChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="nds-field">
      <label className="nds-label nds-between" htmlFor={id}>
        {label}
        <output htmlFor={id}>{format(value)}</output>
      </label>
      <input
        id={id}
        className="nds-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        disabled={disabled}
        onChange={(e) => onValueChange(Number(e.target.value))}
        style={
          {
            "--nds-fill": `${((value - min) / (max - min || 1)) * 100}%`,
          } as CSSProperties
        }
      />
      <div className="nds-between nds-hint">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
export function Rating({
  label,
  value,
  onValueChange,
  max = 5,
  disabled = false,
}: {
  label: string;
  value: number;
  onValueChange: (v: number) => void;
  max?: number;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <fieldset className="nds-fieldset" disabled={disabled}>
      <legend className="nds-label">{label}</legend>
      <div className="nds-rating">
        {Array.from({ length: max }, (_, i) => (
          <label key={i}>
            <input
              type="radio"
              name={id}
              value={i + 1}
              checked={value === i + 1}
              onChange={() => onValueChange(i + 1)}
              aria-label={`${i + 1}점`}
            />
            {i < value ? (
              <StarFilledIcon aria-hidden />
            ) : (
              <StarIcon aria-hidden />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function OtpInput({
  label,
  value,
  onValueChange,
  length = 6,
  disabled = false,
  error,
  hint,
}: FieldProps & {
  value: string;
  onValueChange: (v: string) => void;
  length?: number;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <Field
      label={label}
      htmlFor={id}
      hint={hint || `${length}자리 숫자를 입력하세요.`}
      error={error}
      id={`${id}-hint`}
    >
      <input
        id={id}
        className="nds-input nds-otp"
        value={value}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern={`[0-9]{${length}}`}
        maxLength={length}
        disabled={disabled}
        aria-invalid={!!error || undefined}
        aria-describedby={`${id}-hint`}
        onChange={(e) =>
          onValueChange(e.target.value.replace(/\D/g, "").slice(0, length))
        }
      />
    </Field>
  );
}
export function FileUpload({
  label,
  onFiles,
  accept,
  maxBytes = 5 * 1024 * 1024,
  multiple = false,
  disabled = false,
}: {
  label: string;
  onFiles: (files: File[]) => void;
  accept?: string;
  maxBytes?: number;
  multiple?: boolean;
  disabled?: boolean;
}) {
  const [files, set] = useState<File[]>([]),
    [error, setError] = useState(""),
    [over, setOver] = useState(false);
  const id = useId();
  const receive = (input: FileList | null) => {
    if (!input) return;
    const next = Array.from(input);
    const types = (accept || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const valid = next.every(
      (f) =>
        f.size <= maxBytes &&
        (!types.length ||
          types.some((t) =>
            t.startsWith(".")
              ? f.name.toLowerCase().endsWith(t.toLowerCase())
              : t.endsWith("/*")
                ? f.type.startsWith(t.slice(0, -1))
                : f.type === t,
          )),
    );
    if (!valid || (!multiple && next.length > 1)) {
      setError("파일 형식, 개수 또는 크기를 확인해 주세요.");
      return;
    }
    setError("");
    set(next);
    onFiles(next);
  };
  return (
    <div className="nds-field">
      <label htmlFor={id} className="nds-label">
        {label}
      </label>
      <div
        className={cx(
          "nds-upload",
          over && "is-over",
          disabled && "is-disabled",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (!disabled) receive(e.dataTransfer.files);
        }}
      >
        <UploadIcon aria-hidden />
        <strong>파일을 선택하거나 끌어 놓으세요</strong>
        <span className="nds-hint">
          {accept || "모든 형식"} · 파일당 최대{" "}
          {Math.round(maxBytes / 1024 / 1024)}MB
        </span>
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            receive(e.target.files);
            e.target.value = "";
          }}
          aria-describedby={`${id}-status`}
        />
      </div>
      <div id={`${id}-status`} aria-live="polite">
        {error ? (
          <p className="nds-error">{error}</p>
        ) : (
          files.map((f) => (
            <div className="nds-file-item" key={`${f.name}-${f.size}`}>
              <CheckIcon />
              {f.name}
              <small>{Math.ceil(f.size / 1024)} KB</small>
              <IconButton
                size="sm"
                label={`${f.name} 제거`}
                disabled={disabled}
                onClick={() => {
                  const next = files.filter((x) => x !== f);
                  set(next);
                  onFiles(next);
                }}
              >
                <Cross2Icon />
              </IconButton>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export function DatePicker(props: Omit<TextFieldProps, "type">) {
  return <TextField {...props} type="date" />;
}
export function TimePicker(props: Omit<TextFieldProps, "type">) {
  return <TextField {...props} type="time" />;
}
export function DateRangePicker({
  label,
  start,
  end,
  onChange,
  min,
  max,
  disabled = false,
}: {
  label: string;
  start: string;
  end: string;
  onChange: (v: { start: string; end: string }) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
}) {
  return (
    <fieldset className="nds-fieldset">
      <legend className="nds-label">{label}</legend>
      <div className="nds-date-range">
        <DatePicker
          label="시작일"
          value={start}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) =>
            onChange({
              start: e.target.value,
              end: end && end < e.target.value ? "" : end,
            })
          }
        />
        <DatePicker
          label="종료일"
          value={end}
          min={start || min}
          max={max}
          disabled={disabled}
          onChange={(e) => onChange({ start, end: e.target.value })}
        />
      </div>
    </fieldset>
  );
}
export function ColorPicker({
  label,
  value,
  onValueChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="nds-field">
      <label className="nds-label" htmlFor={id}>
        {label}
      </label>
      <div className="nds-color-input">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={disabled}
        />
        <code>{value.toUpperCase()}</code>
      </div>
    </div>
  );
}
