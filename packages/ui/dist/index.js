// packages/ui/src/core.tsx
import {
  createContext,
  useContext,
  useEffect as useEffect2,
  useState as useState2
} from "react";

// packages/ui/src/utils.ts
import { useEffect, useRef, useState } from "react";
var cx = (...items) => items.filter(Boolean).join(" ");
function useOutside(ref, active, close) {
  const callback = useRef(close);
  callback.current = close;
  useEffect(() => {
    if (!active) return;
    const fn = (e) => {
      if (!ref.current?.contains(e.target)) callback.current();
    };
    document.addEventListener("pointerdown", fn);
    return () => document.removeEventListener("pointerdown", fn);
  }, [active, ref]);
}
var clamp = (v, min, max) => Math.min(max, Math.max(min, v));
function nextEnabled(index, direction, disabled) {
  if (disabled.every(Boolean)) return index;
  let next = index;
  do {
    next = (next + direction + disabled.length) % disabled.length;
  } while (disabled[next]);
  return next;
}
function pageRange(page, count) {
  const all = /* @__PURE__ */ new Set([1, count, page - 1, page, page + 1]);
  return [...all].filter((n) => n > 0 && n <= count).sort((a, b) => a - b);
}

// packages/ui/src/core.tsx
import { jsx } from "react/jsx-runtime";
var Context = createContext({
  theme: "light",
  density: "comfortable",
  reducedMotion: false
});
var useNaria = () => useContext(Context);
function NariaProvider({
  children,
  theme = "light",
  density = "comfortable",
  reducedMotion = false,
  accent,
  className = "",
  ...props
}) {
  const [systemReduced, setReduced] = useState2(false);
  useEffect2(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  return /* @__PURE__ */ jsx(
    Context.Provider,
    {
      value: { theme, density, reducedMotion: reducedMotion || systemReduced },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          ...props,
          className: cx("nds-theme", className),
          "data-nds-theme": theme,
          "data-density": density,
          "data-reduced": reducedMotion || systemReduced,
          style: {
            ...props.style,
            ...accent ? {
              "--nds-accent": accent.color,
              "--nds-accent-soft": accent.soft
            } : {}
          },
          children
        }
      )
    }
  );
}
function Container({
  children,
  narrow = false,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: cx(
        "nds-container",
        narrow && "nds-container--narrow",
        className
      ),
      children
    }
  );
}
function Stack({
  gap = 16,
  direction = "column",
  align = "stretch",
  wrap = false,
  className,
  style,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: cx("nds-stack", className),
      style: {
        display: "flex",
        gap,
        flexDirection: direction,
        alignItems: align,
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style
      }
    }
  );
}
function Grid({
  min = 240,
  gap = 16,
  className,
  style,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: cx("nds-grid", className),
      style: { "--nds-grid-min": `${min}px`, gap, ...style }
    }
  );
}
function AspectRatio({
  ratio = 16 / 9,
  className,
  style,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...props,
      className: cx("nds-aspect", className),
      style: { aspectRatio: ratio, ...style }
    }
  );
}
function VisuallyHidden(props) {
  return /* @__PURE__ */ jsx("span", { ...props, className: cx("nds-sr", props.className) });
}
function Text({
  as: Tag2 = "p",
  size = "body",
  muted = false,
  weight = "regular",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Tag2,
    {
      ...props,
      className: cx(
        "nds-text",
        `nds-text--${size}`,
        muted && "nds-muted",
        weight === "semibold" && "nds-semibold",
        className
      )
    }
  );
}

// packages/ui/src/actions.tsx
import {
  useEffect as useEffect3,
  useRef as useRef2,
  useState as useState3
} from "react";
import { CheckIcon, CopyIcon, ReloadIcon } from "@radix-ui/react-icons";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function Button({
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
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ...props,
      type,
      className: cx(
        "nds-button",
        `nds-button--${variant}`,
        `nds-control--${size}`,
        fullWidth && "nds-full",
        className
      ),
      disabled: disabled || loading,
      "aria-busy": loading || void 0,
      children: [
        loading ? /* @__PURE__ */ jsx2(ReloadIcon, { className: "nds-spin", "aria-hidden": true }) : leading,
        /* @__PURE__ */ jsx2("span", { children }),
        !loading && trailing
      ]
    }
  );
}
function IconButton({
  label,
  children,
  size = "md",
  variant = "ghost",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx2(
    "button",
    {
      ...props,
      type: props.type || "button",
      "aria-label": label,
      title: label,
      "aria-busy": loading || void 0,
      className: cx(
        "nds-button",
        "nds-icon-button",
        `nds-button--${variant}`,
        `nds-control--${size}`,
        className
      ),
      disabled: disabled || loading,
      children: loading ? /* @__PURE__ */ jsx2(ReloadIcon, { className: "nds-spin", "aria-hidden": true }) : children
    }
  );
}
function Link({
  external = false,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "a",
    {
      ...props,
      className: cx("nds-link", className),
      target: external ? "_blank" : props.target,
      rel: external ? "noopener noreferrer" : props.rel,
      children: [
        children,
        external && /* @__PURE__ */ jsx2("span", { className: "nds-sr", children: " (\uC0C8 \uCC3D)" })
      ]
    }
  );
}
function ButtonGroup({
  label,
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      ...props,
      role: "group",
      "aria-label": label,
      className: cx("nds-button-group", className),
      children
    }
  );
}
function ToggleButton({
  pressed,
  onPressedChange,
  ...props
}) {
  return /* @__PURE__ */ jsx2(
    Button,
    {
      ...props,
      variant: pressed ? "secondary" : "ghost",
      "aria-pressed": pressed,
      onClick: (e) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) onPressedChange(!pressed);
      }
    }
  );
}
function CopyButton({
  value,
  onCopied,
  children = "\uBCF5\uC0AC",
  ...props
}) {
  const [status, set] = useState3("idle");
  const timer = useRef2(void 0);
  useEffect3(() => () => clearTimeout(timer.current), []);
  return /* @__PURE__ */ jsxs("span", { className: "nds-copy", children: [
    /* @__PURE__ */ jsx2(
      Button,
      {
        ...props,
        leading: status === "done" ? /* @__PURE__ */ jsx2(CheckIcon, {}) : /* @__PURE__ */ jsx2(CopyIcon, {}),
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(value);
            set("done");
            onCopied?.();
          } catch {
            set("error");
          }
          clearTimeout(timer.current);
          timer.current = setTimeout(() => set("idle"), 2200);
        },
        children: status === "done" ? "\uBCF5\uC0AC\uB428" : children
      }
    ),
    /* @__PURE__ */ jsx2(
      "span",
      {
        role: "status",
        className: status === "error" ? "nds-error" : "nds-sr",
        children: status === "error" ? "\uBCF5\uC0AC\uAC00 \uC81C\uD55C\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uD14D\uC2A4\uD2B8\uB97C \uC9C1\uC811 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694." : status === "done" ? "\uD074\uB9BD\uBCF4\uB4DC\uC5D0 \uBCF5\uC0AC\uD588\uC2B5\uB2C8\uB2E4." : ""
      }
    )
  ] });
}
function HoldButton({
  duration = 900,
  onConfirm,
  children = "\uAE38\uAC8C \uB20C\uB7EC \uD655\uC778",
  ...props
}) {
  const [progress, set] = useState3(0), [done, setDone] = useState3(false);
  const start = useRef2(0), raf = useRef2(0), holding = useRef2(false);
  const stop = () => {
    holding.current = false;
    cancelAnimationFrame(raf.current);
    set(0);
  };
  useEffect3(() => () => cancelAnimationFrame(raf.current), []);
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
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ...props,
      className: cx("nds-hold", props.className),
      "aria-label": done ? "\uD655\uC778 \uC644\uB8CC" : `${typeof children === "string" ? children : "\uD655\uC778"}. Space \uB610\uB294 Enter \uD0A4\uB97C ${duration / 1e3}\uCD08\uAC04 \uB204\uB974\uC138\uC694.`,
      onPointerDown: (e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        begin();
      },
      onPointerUp: stop,
      onPointerCancel: stop,
      onLostPointerCapture: stop,
      onBlur: stop,
      onKeyDown: (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (!e.repeat) begin();
        }
        if (e.key === "Escape") stop();
      },
      onKeyUp: (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          stop();
        }
      },
      children: [
        /* @__PURE__ */ jsx2(
          "span",
          {
            className: "nds-hold-fill",
            style: { transform: `scaleX(${progress})` },
            "aria-hidden": true
          }
        ),
        done ? "\uD655\uC778 \uC644\uB8CC" : children,
        /* @__PURE__ */ jsx2("span", { className: "nds-sr", role: "status", children: done ? "\uC791\uC5C5\uC744 \uD655\uC778\uD588\uC2B5\uB2C8\uB2E4." : "" })
      ]
    }
  );
}

// packages/ui/src/forms.tsx
import {
  useId,
  useState as useState4
} from "react";
import {
  CheckIcon as CheckIcon2,
  Cross2Icon,
  EyeOpenIcon,
  EyeClosedIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  StarFilledIcon,
  StarIcon,
  UploadIcon
} from "@radix-ui/react-icons";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Field({
  label,
  hint,
  error,
  required,
  optional,
  htmlFor,
  children,
  id
}) {
  return /* @__PURE__ */ jsxs2("div", { className: cx("nds-field", !!error && "nds-field--error"), children: [
    /* @__PURE__ */ jsxs2("label", { htmlFor, className: "nds-label", children: [
      label,
      required && /* @__PURE__ */ jsxs2("span", { className: "nds-required", "aria-label": "\uD544\uC218", children: [
        " ",
        "*"
      ] }),
      optional && /* @__PURE__ */ jsx3("span", { className: "nds-muted", children: " (\uC120\uD0DD)" })
    ] }),
    children,
    (error || hint) && /* @__PURE__ */ jsx3(
      "p",
      {
        id,
        className: error ? "nds-error" : "nds-hint",
        role: error ? "alert" : void 0,
        children: error || hint
      }
    )
  ] });
}
function TextField({
  label,
  hint,
  error,
  optional,
  leading,
  trailing,
  className,
  id: given,
  ...props
}) {
  const own = useId(), id = given || own, desc = `${id}-hint`;
  return /* @__PURE__ */ jsx3(
    Field,
    {
      label,
      htmlFor: id,
      hint,
      error,
      required: props.required,
      optional,
      id: desc,
      children: /* @__PURE__ */ jsxs2(
        "div",
        {
          className: cx("nds-input-wrap", props.disabled && "is-disabled"),
          "data-invalid": !!error,
          children: [
            leading && /* @__PURE__ */ jsx3("span", { className: "nds-input-leading", "aria-hidden": true, children: leading }),
            /* @__PURE__ */ jsx3(
              "input",
              {
                ...props,
                id,
                className: cx("nds-input", className),
                "aria-invalid": !!error || void 0,
                "aria-describedby": [props["aria-describedby"], error || hint ? desc : ""].filter(Boolean).join(" ") || void 0
              }
            ),
            trailing && /* @__PURE__ */ jsx3("span", { className: "nds-input-trailing", children: trailing })
          ]
        }
      )
    }
  );
}
function Textarea({
  label,
  hint,
  error,
  optional,
  id: given,
  className,
  maxLength,
  ...props
}) {
  const own = useId(), id = given || own;
  const [ownValue, setOwnValue] = useState4(String(props.defaultValue ?? ""));
  const count = String(props.value ?? ownValue).length;
  return /* @__PURE__ */ jsxs2(
    Field,
    {
      label,
      htmlFor: id,
      hint,
      error,
      required: props.required,
      optional,
      id: `${id}-hint`,
      children: [
        /* @__PURE__ */ jsx3(
          "textarea",
          {
            ...props,
            id,
            onChange: (e) => {
              setOwnValue(e.target.value);
              props.onChange?.(e);
            },
            maxLength,
            className: cx("nds-input", "nds-textarea", className),
            "aria-invalid": !!error || void 0,
            "aria-describedby": error || hint ? `${id}-hint` : void 0
          }
        ),
        maxLength && /* @__PURE__ */ jsxs2("span", { className: "nds-field-count", children: [
          count,
          " / ",
          maxLength
        ] })
      ]
    }
  );
}
function PasswordField(props) {
  const [visible, set] = useState4(false);
  return /* @__PURE__ */ jsx3(
    TextField,
    {
      ...props,
      type: visible ? "text" : "password",
      trailing: /* @__PURE__ */ jsx3(
        IconButton,
        {
          label: visible ? "\uBE44\uBC00\uBC88\uD638 \uC228\uAE30\uAE30" : "\uBE44\uBC00\uBC88\uD638 \uBCF4\uAE30",
          "aria-pressed": visible,
          size: "sm",
          disabled: props.disabled,
          onClick: () => set(!visible),
          children: visible ? /* @__PURE__ */ jsx3(EyeClosedIcon, {}) : /* @__PURE__ */ jsx3(EyeOpenIcon, {})
        }
      )
    }
  );
}
function SearchField({
  value,
  onValueChange,
  ...props
}) {
  return /* @__PURE__ */ jsx3(
    TextField,
    {
      ...props,
      type: "search",
      value,
      onChange: (e) => onValueChange(e.target.value),
      leading: /* @__PURE__ */ jsx3(MagnifyingGlassIcon, {}),
      trailing: value ? /* @__PURE__ */ jsx3(
        IconButton,
        {
          label: "\uAC80\uC0C9\uC5B4 \uC9C0\uC6B0\uAE30",
          size: "sm",
          disabled: props.disabled,
          onClick: () => onValueChange(""),
          children: /* @__PURE__ */ jsx3(Cross2Icon, {})
        }
      ) : void 0
    }
  );
}
function NumberField({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  hint,
  error
}) {
  const id = useId();
  const change = (v) => onValueChange(clamp(Number(v.toFixed(8)), min, max));
  return /* @__PURE__ */ jsx3(
    Field,
    {
      label,
      htmlFor: id,
      hint,
      error,
      id: `${id}-hint`,
      children: /* @__PURE__ */ jsxs2("div", { className: "nds-number", children: [
        /* @__PURE__ */ jsx3(
          IconButton,
          {
            variant: "outline",
            label: `${label} \uAC10\uC18C`,
            disabled: disabled || value <= min,
            onClick: () => change(value - step),
            children: /* @__PURE__ */ jsx3(MinusIcon, {})
          }
        ),
        /* @__PURE__ */ jsx3(
          "input",
          {
            id,
            type: "number",
            min,
            max,
            step,
            value,
            disabled,
            "aria-invalid": !!error || void 0,
            "aria-describedby": hint || error ? `${id}-hint` : void 0,
            onChange: (e) => {
              if (e.target.value !== "" && Number.isFinite(e.target.valueAsNumber))
                change(e.target.valueAsNumber);
            }
          }
        ),
        /* @__PURE__ */ jsx3(
          IconButton,
          {
            variant: "outline",
            label: `${label} \uC99D\uAC00`,
            disabled: disabled || value >= max,
            onClick: () => change(value + step),
            children: /* @__PURE__ */ jsx3(PlusIcon, {})
          }
        )
      ] })
    }
  );
}
function Select({
  label,
  hint,
  error,
  optional,
  options,
  id: given,
  className,
  placeholder,
  ...props
}) {
  const own = useId(), id = given || own;
  return /* @__PURE__ */ jsx3(
    Field,
    {
      label,
      htmlFor: id,
      hint,
      error,
      optional,
      required: props.required,
      id: `${id}-hint`,
      children: /* @__PURE__ */ jsxs2(
        "select",
        {
          ...props,
          id,
          className: cx("nds-input", "nds-select", className),
          "aria-invalid": !!error || void 0,
          "aria-describedby": error || hint ? `${id}-hint` : void 0,
          children: [
            placeholder && /* @__PURE__ */ jsx3("option", { value: "", disabled: true, children: placeholder }),
            options.map((o) => /* @__PURE__ */ jsx3("option", { value: o.value, disabled: o.disabled, children: o.label }, o.value))
          ]
        }
      )
    }
  );
}
function Checkbox({
  label,
  description,
  indeterminate = false,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs2(
    "label",
    {
      className: cx("nds-choice", props.disabled && "is-disabled", className),
      children: [
        /* @__PURE__ */ jsx3(
          "input",
          {
            ...props,
            type: "checkbox",
            ref: (el) => {
              if (el) el.indeterminate = indeterminate;
            }
          }
        ),
        /* @__PURE__ */ jsx3("span", { className: "nds-check-mark", "aria-hidden": true, children: indeterminate ? /* @__PURE__ */ jsx3(MinusIcon, {}) : /* @__PURE__ */ jsx3(CheckIcon2, {}) }),
        /* @__PURE__ */ jsxs2("span", { children: [
          label,
          description && /* @__PURE__ */ jsx3("small", { children: description })
        ] })
      ]
    }
  );
}
function RadioGroup({
  label,
  options,
  value,
  onValueChange,
  name,
  disabled = false,
  hint,
  error,
  orientation = "vertical"
}) {
  const id = useId();
  return /* @__PURE__ */ jsxs2(
    "fieldset",
    {
      className: cx("nds-fieldset", `nds-radio--${orientation}`),
      disabled,
      "aria-describedby": hint || error ? `${id}-hint` : void 0,
      children: [
        /* @__PURE__ */ jsx3("legend", { className: "nds-label", children: label }),
        /* @__PURE__ */ jsx3("div", { className: "nds-choices", children: options.map((o) => /* @__PURE__ */ jsxs2(
          "label",
          {
            className: cx(
              "nds-choice",
              (disabled || o.disabled) && "is-disabled"
            ),
            children: [
              /* @__PURE__ */ jsx3(
                "input",
                {
                  type: "radio",
                  name: name || id,
                  value: o.value,
                  checked: value === o.value,
                  onChange: () => onValueChange(o.value),
                  disabled: o.disabled
                }
              ),
              /* @__PURE__ */ jsx3("span", { className: "nds-radio-mark", "aria-hidden": true }),
              /* @__PURE__ */ jsxs2("span", { children: [
                o.label,
                o.description && /* @__PURE__ */ jsx3("small", { children: o.description })
              ] })
            ]
          },
          o.value
        )) }),
        (hint || error) && /* @__PURE__ */ jsx3("p", { id: `${id}-hint`, className: error ? "nds-error" : "nds-hint", children: error || hint })
      ]
    }
  );
}
function Switch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false
}) {
  return /* @__PURE__ */ jsxs2("label", { className: cx("nds-switch-row", disabled && "is-disabled"), children: [
    /* @__PURE__ */ jsxs2("span", { children: [
      label,
      description && /* @__PURE__ */ jsx3("small", { children: description })
    ] }),
    /* @__PURE__ */ jsxs2("span", { className: "nds-switch", children: [
      /* @__PURE__ */ jsx3(
        "input",
        {
          type: "checkbox",
          role: "switch",
          checked,
          disabled,
          onChange: (e) => onCheckedChange(e.target.checked)
        }
      ),
      /* @__PURE__ */ jsx3("span", { "aria-hidden": true })
    ] })
  ] });
}
function Slider({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  format = String,
  disabled = false
}) {
  const id = useId();
  return /* @__PURE__ */ jsxs2("div", { className: "nds-field", children: [
    /* @__PURE__ */ jsxs2("label", { className: "nds-label nds-between", htmlFor: id, children: [
      label,
      /* @__PURE__ */ jsx3("output", { htmlFor: id, children: format(value) })
    ] }),
    /* @__PURE__ */ jsx3(
      "input",
      {
        id,
        className: "nds-slider",
        type: "range",
        min,
        max,
        step,
        value,
        "aria-valuetext": format(value),
        disabled,
        onChange: (e) => onValueChange(Number(e.target.value)),
        style: {
          "--nds-fill": `${(value - min) / (max - min || 1) * 100}%`
        }
      }
    ),
    /* @__PURE__ */ jsxs2("div", { className: "nds-between nds-hint", children: [
      /* @__PURE__ */ jsx3("span", { children: format(min) }),
      /* @__PURE__ */ jsx3("span", { children: format(max) })
    ] })
  ] });
}
function Rating({
  label,
  value,
  onValueChange,
  max = 5,
  disabled = false
}) {
  const id = useId();
  return /* @__PURE__ */ jsxs2("fieldset", { className: "nds-fieldset", disabled, children: [
    /* @__PURE__ */ jsx3("legend", { className: "nds-label", children: label }),
    /* @__PURE__ */ jsx3("div", { className: "nds-rating", children: Array.from({ length: max }, (_, i) => /* @__PURE__ */ jsxs2("label", { children: [
      /* @__PURE__ */ jsx3(
        "input",
        {
          type: "radio",
          name: id,
          value: i + 1,
          checked: value === i + 1,
          onChange: () => onValueChange(i + 1),
          "aria-label": `${i + 1}\uC810`
        }
      ),
      i < value ? /* @__PURE__ */ jsx3(StarFilledIcon, { "aria-hidden": true }) : /* @__PURE__ */ jsx3(StarIcon, { "aria-hidden": true })
    ] }, i)) })
  ] });
}
function OtpInput({
  label,
  value,
  onValueChange,
  length = 6,
  disabled = false,
  error,
  hint
}) {
  const id = useId();
  return /* @__PURE__ */ jsx3(
    Field,
    {
      label,
      htmlFor: id,
      hint: hint || `${length}\uC790\uB9AC \uC22B\uC790\uB97C \uC785\uB825\uD558\uC138\uC694.`,
      error,
      id: `${id}-hint`,
      children: /* @__PURE__ */ jsx3(
        "input",
        {
          id,
          className: "nds-input nds-otp",
          value,
          type: "text",
          inputMode: "numeric",
          autoComplete: "one-time-code",
          pattern: `[0-9]{${length}}`,
          maxLength: length,
          disabled,
          "aria-invalid": !!error || void 0,
          "aria-describedby": `${id}-hint`,
          onChange: (e) => onValueChange(e.target.value.replace(/\D/g, "").slice(0, length))
        }
      )
    }
  );
}
function FileUpload({
  label,
  onFiles,
  accept,
  maxBytes = 5 * 1024 * 1024,
  multiple = false,
  disabled = false
}) {
  const [files, set] = useState4([]), [error, setError] = useState4(""), [over, setOver] = useState4(false);
  const id = useId();
  const receive = (input) => {
    if (!input) return;
    const next = Array.from(input);
    const types = (accept || "").split(",").map((s) => s.trim()).filter(Boolean);
    const valid = next.every(
      (f) => f.size <= maxBytes && (!types.length || types.some(
        (t) => t.startsWith(".") ? f.name.toLowerCase().endsWith(t.toLowerCase()) : t.endsWith("/*") ? f.type.startsWith(t.slice(0, -1)) : f.type === t
      ))
    );
    if (!valid || !multiple && next.length > 1) {
      setError("\uD30C\uC77C \uD615\uC2DD, \uAC1C\uC218 \uB610\uB294 \uD06C\uAE30\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    setError("");
    set(next);
    onFiles(next);
  };
  return /* @__PURE__ */ jsxs2("div", { className: "nds-field", children: [
    /* @__PURE__ */ jsx3("label", { htmlFor: id, className: "nds-label", children: label }),
    /* @__PURE__ */ jsxs2(
      "div",
      {
        className: cx(
          "nds-upload",
          over && "is-over",
          disabled && "is-disabled"
        ),
        onDragOver: (e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        },
        onDragLeave: () => setOver(false),
        onDrop: (e) => {
          e.preventDefault();
          setOver(false);
          if (!disabled) receive(e.dataTransfer.files);
        },
        children: [
          /* @__PURE__ */ jsx3(UploadIcon, { "aria-hidden": true }),
          /* @__PURE__ */ jsx3("strong", { children: "\uD30C\uC77C\uC744 \uC120\uD0DD\uD558\uAC70\uB098 \uB04C\uC5B4 \uB193\uC73C\uC138\uC694" }),
          /* @__PURE__ */ jsxs2("span", { className: "nds-hint", children: [
            accept || "\uBAA8\uB4E0 \uD615\uC2DD",
            " \xB7 \uD30C\uC77C\uB2F9 \uCD5C\uB300",
            " ",
            Math.round(maxBytes / 1024 / 1024),
            "MB"
          ] }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              id,
              type: "file",
              accept,
              multiple,
              disabled,
              onChange: (e) => {
                receive(e.target.files);
                e.target.value = "";
              },
              "aria-describedby": `${id}-status`
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx3("div", { id: `${id}-status`, "aria-live": "polite", children: error ? /* @__PURE__ */ jsx3("p", { className: "nds-error", children: error }) : files.map((f) => /* @__PURE__ */ jsxs2("div", { className: "nds-file-item", children: [
      /* @__PURE__ */ jsx3(CheckIcon2, {}),
      f.name,
      /* @__PURE__ */ jsxs2("small", { children: [
        Math.ceil(f.size / 1024),
        " KB"
      ] }),
      /* @__PURE__ */ jsx3(
        IconButton,
        {
          size: "sm",
          label: `${f.name} \uC81C\uAC70`,
          disabled,
          onClick: () => {
            const next = files.filter((x) => x !== f);
            set(next);
            onFiles(next);
          },
          children: /* @__PURE__ */ jsx3(Cross2Icon, {})
        }
      )
    ] }, `${f.name}-${f.size}`)) })
  ] });
}
function DatePicker(props) {
  return /* @__PURE__ */ jsx3(TextField, { ...props, type: "date" });
}
function TimePicker(props) {
  return /* @__PURE__ */ jsx3(TextField, { ...props, type: "time" });
}
function DateRangePicker({
  label,
  start,
  end,
  onChange,
  min,
  max,
  disabled = false
}) {
  return /* @__PURE__ */ jsxs2("fieldset", { className: "nds-fieldset", children: [
    /* @__PURE__ */ jsx3("legend", { className: "nds-label", children: label }),
    /* @__PURE__ */ jsxs2("div", { className: "nds-date-range", children: [
      /* @__PURE__ */ jsx3(
        DatePicker,
        {
          label: "\uC2DC\uC791\uC77C",
          value: start,
          min,
          max,
          disabled,
          onChange: (e) => onChange({
            start: e.target.value,
            end: end && end < e.target.value ? "" : end
          })
        }
      ),
      /* @__PURE__ */ jsx3(
        DatePicker,
        {
          label: "\uC885\uB8CC\uC77C",
          value: end,
          min: start || min,
          max,
          disabled,
          onChange: (e) => onChange({ start, end: e.target.value })
        }
      )
    ] })
  ] });
}
function ColorPicker({
  label,
  value,
  onValueChange,
  disabled = false
}) {
  const id = useId();
  return /* @__PURE__ */ jsxs2("div", { className: "nds-field", children: [
    /* @__PURE__ */ jsx3("label", { className: "nds-label", htmlFor: id, children: label }),
    /* @__PURE__ */ jsxs2("div", { className: "nds-color-input", children: [
      /* @__PURE__ */ jsx3(
        "input",
        {
          id,
          type: "color",
          value,
          onChange: (e) => onValueChange(e.target.value),
          disabled
        }
      ),
      /* @__PURE__ */ jsx3("code", { children: value.toUpperCase() })
    ] })
  ] });
}

// packages/ui/src/combobox.tsx
import { useEffect as useEffect4, useId as useId2, useRef as useRef4, useState as useState5 } from "react";
import { CheckIcon as CheckIcon3, ChevronDownIcon, Cross2Icon as Cross2Icon2 } from "@radix-ui/react-icons";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function Combobox({
  label,
  options,
  value,
  onValueChange,
  placeholder = "\uAC80\uC0C9\uD574\uC11C \uC120\uD0DD\uD558\uC138\uC694",
  disabled = false,
  hint,
  error,
  required = false
}) {
  const [open, setOpen] = useState5(false), [query, setQuery] = useState5(""), [active, setActive] = useState5(0), ref = useRef4(null), input = useRef4(null), id = useId2();
  const selected = options.find((x) => x.value === value);
  const filtered = options.filter(
    (x) => x.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  );
  const activeIndex = filtered[active] && !filtered[active].disabled ? active : filtered.findIndex((option) => !option.disabled);
  const close = () => {
    setOpen(false);
    setQuery("");
  };
  useOutside(ref, open, close);
  const choose = (index) => {
    const o = filtered[index];
    if (o && !o.disabled) {
      onValueChange(o.value);
      close();
      input.current?.focus();
    }
  };
  useEffect4(() => {
    if (open)
      document.getElementById(`${id}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, id]);
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      ref,
      className: "nds-combobox",
      onBlur: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) close();
      },
      children: [
        /* @__PURE__ */ jsx4(
          Field,
          {
            label,
            htmlFor: id,
            hint,
            error,
            required,
            id: `${id}-hint`,
            children: /* @__PURE__ */ jsxs3("div", { className: "nds-input-wrap", "data-invalid": !!error, children: [
              /* @__PURE__ */ jsx4(
                "input",
                {
                  ref: input,
                  id,
                  className: "nds-input",
                  role: "combobox",
                  "aria-expanded": open,
                  "aria-controls": open ? `${id}-list` : void 0,
                  "aria-autocomplete": "list",
                  "aria-activedescendant": open && activeIndex >= 0 ? `${id}-${activeIndex}` : void 0,
                  "aria-invalid": !!error || void 0,
                  "aria-required": required,
                  "aria-describedby": hint || error ? `${id}-hint` : void 0,
                  autoComplete: "off",
                  placeholder,
                  disabled,
                  value: open ? query : selected?.label || "",
                  onChange: (e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                    setActive(0);
                  },
                  onClick: () => {
                    setOpen(true);
                    setQuery("");
                  },
                  onKeyDown: (e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                      e.preventDefault();
                      setOpen(true);
                      const enabled = filtered.map((x, i) => x.disabled ? -1 : i).filter((x) => x >= 0);
                      if (enabled.length) {
                        const pos = enabled.indexOf(activeIndex);
                        setActive(
                          enabled[clamp(
                            pos + (open ? e.key === "ArrowDown" ? 1 : -1 : 0),
                            0,
                            enabled.length - 1
                          )]
                        );
                      }
                    } else if (e.key === "Enter" && open) {
                      e.preventDefault();
                      choose(activeIndex);
                    } else if (e.key === "Escape" && open) {
                      e.stopPropagation();
                      close();
                    } else if (e.key === "Tab") close();
                  }
                }
              ),
              /* @__PURE__ */ jsx4("span", { className: "nds-input-trailing", children: /* @__PURE__ */ jsx4(
                IconButton,
                {
                  label: `${label} \uC635\uC158 ${open ? "\uB2EB\uAE30" : "\uC5F4\uAE30"}`,
                  size: "sm",
                  tabIndex: -1,
                  disabled,
                  onMouseDown: (e) => e.preventDefault(),
                  onClick: () => {
                    setOpen(!open);
                    setQuery("");
                    input.current?.focus();
                  },
                  children: /* @__PURE__ */ jsx4(ChevronDownIcon, {})
                }
              ) })
            ] })
          }
        ),
        open && /* @__PURE__ */ jsxs3("div", { className: "nds-combobox-popup", children: [
          /* @__PURE__ */ jsx4("div", { role: "listbox", id: `${id}-list`, "aria-label": label, children: filtered.map((o, i) => /* @__PURE__ */ jsxs3(
            "div",
            {
              id: `${id}-${i}`,
              role: "option",
              "aria-selected": value === o.value,
              "aria-disabled": o.disabled || void 0,
              className: cx("nds-option", activeIndex === i && "is-active"),
              onMouseDown: (e) => e.preventDefault(),
              onPointerMove: () => {
                if (!o.disabled) setActive(i);
              },
              onClick: () => choose(i),
              children: [
                /* @__PURE__ */ jsxs3("span", { children: [
                  o.label,
                  o.description && /* @__PURE__ */ jsx4("small", { children: o.description })
                ] }),
                value === o.value && /* @__PURE__ */ jsx4(CheckIcon3, {})
              ]
            },
            o.value
          )) }),
          !filtered.length && /* @__PURE__ */ jsx4("p", { role: "status", className: "nds-hint", children: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." })
        ] })
      ]
    }
  );
}
function MultiSelect({
  label,
  options,
  value,
  onValueChange,
  disabled = false,
  hint,
  error
}) {
  const [open, setOpen] = useState5(false), [query, setQuery] = useState5("");
  const id = useId2();
  return /* @__PURE__ */ jsxs3("div", { className: "nds-field", children: [
    /* @__PURE__ */ jsx4("span", { className: "nds-label", id: `${id}-label`, children: label }),
    /* @__PURE__ */ jsx4(
      Button,
      {
        variant: "outline",
        fullWidth: true,
        disabled,
        "aria-labelledby": `${id}-label ${id}-value`,
        "aria-expanded": open,
        "aria-controls": open ? `${id}-options` : void 0,
        trailing: /* @__PURE__ */ jsx4(ChevronDownIcon, {}),
        onClick: () => setOpen(!open),
        children: /* @__PURE__ */ jsx4("span", { id: `${id}-value`, children: value.length ? `${value.length}\uAC1C \uC120\uD0DD\uB428` : "\uD56D\uBAA9\uC744 \uC120\uD0DD\uD558\uC138\uC694" })
      }
    ),
    value.length > 0 && /* @__PURE__ */ jsx4("div", { className: "nds-tag-list", children: value.map((v) => /* @__PURE__ */ jsxs3("span", { className: "nds-tag", children: [
      options.find((o) => o.value === v)?.label || v,
      /* @__PURE__ */ jsx4(
        IconButton,
        {
          size: "sm",
          label: `${options.find((o) => o.value === v)?.label || v} \uC120\uD0DD \uD574\uC81C`,
          disabled,
          onClick: () => onValueChange(value.filter((x) => x !== v)),
          children: /* @__PURE__ */ jsx4(Cross2Icon2, {})
        }
      )
    ] }, v)) }),
    open && /* @__PURE__ */ jsxs3(
      "fieldset",
      {
        className: "nds-multi-options",
        id: `${id}-options`,
        disabled,
        children: [
          /* @__PURE__ */ jsx4("legend", { className: "nds-sr", children: label }),
          /* @__PURE__ */ jsx4(
            "input",
            {
              type: "search",
              className: "nds-input",
              "aria-label": `${label} \uAC80\uC0C9`,
              placeholder: "\uD56D\uBAA9 \uAC80\uC0C9",
              value: query,
              onChange: (e) => setQuery(e.target.value)
            }
          ),
          options.filter((o) => o.label.includes(query)).map((o) => /* @__PURE__ */ jsx4(
            Checkbox,
            {
              label: o.label,
              disabled: o.disabled,
              checked: value.includes(o.value),
              onChange: () => onValueChange(
                value.includes(o.value) ? value.filter((v) => v !== o.value) : [...value, o.value]
              )
            },
            o.value
          )),
          !options.some((o) => o.label.includes(query)) && /* @__PURE__ */ jsx4("p", { role: "status", children: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." })
        ]
      }
    ),
    (hint || error) && /* @__PURE__ */ jsx4("p", { className: error ? "nds-error" : "nds-hint", children: error || hint })
  ] });
}

// packages/ui/src/navigation.tsx
import { useId as useId3, useRef as useRef5 } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon as CheckIcon4
} from "@radix-ui/react-icons";
import { Fragment, jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function Tabs({
  label,
  items,
  value,
  onValueChange,
  variant = "line"
}) {
  const id = useId3(), refs = useRef5([]);
  const selectedIndex = items.findIndex((item) => item.value === value && !item.disabled);
  const tabStop = selectedIndex >= 0 ? selectedIndex : items.findIndex((item) => !item.disabled);
  return /* @__PURE__ */ jsxs4("div", { className: "nds-tabs", children: [
    /* @__PURE__ */ jsx5(
      "div",
      {
        role: "tablist",
        "aria-label": label,
        className: cx("nds-tablist", `nds-tablist--${variant}`),
        children: items.map((item, i) => /* @__PURE__ */ jsxs4(
          "button",
          {
            type: "button",
            ref: (el) => {
              refs.current[i] = el;
            },
            role: "tab",
            id: `${id}-tab-${i}`,
            "aria-controls": `${id}-panel-${i}`,
            "aria-selected": item.value === value,
            tabIndex: i === tabStop ? 0 : -1,
            disabled: item.disabled,
            onClick: () => onValueChange(item.value),
            onKeyDown: (e) => {
              const disabled = items.map((x) => !!x.disabled);
              let next = i;
              if (e.key === "ArrowRight" || e.key === "ArrowLeft")
                next = nextEnabled(
                  i,
                  e.key === "ArrowRight" ? 1 : -1,
                  disabled
                );
              else if (e.key === "Home") next = disabled.findIndex((x) => !x);
              else if (e.key === "End") next = disabled.lastIndexOf(false);
              else return;
              e.preventDefault();
              if (next >= 0) {
                onValueChange(items[next].value);
                refs.current[next]?.focus();
              }
            },
            children: [
              item.label,
              item.badge
            ]
          },
          item.value
        ))
      }
    ),
    items.map((item, i) => /* @__PURE__ */ jsx5(
      "div",
      {
        role: "tabpanel",
        id: `${id}-panel-${i}`,
        "aria-labelledby": `${id}-tab-${i}`,
        hidden: item.value !== value,
        tabIndex: 0,
        className: "nds-tabpanel",
        children: item.value === value ? item.content : null
      },
      item.value
    ))
  ] });
}
function SegmentedControl({
  label,
  options,
  value,
  onValueChange,
  disabled = false
}) {
  const id = useId3();
  const index = options.findIndex((x) => x.value === value);
  return /* @__PURE__ */ jsxs4("fieldset", { className: "nds-segmented", disabled, children: [
    /* @__PURE__ */ jsx5("legend", { className: "nds-sr", children: label }),
    /* @__PURE__ */ jsx5(
      "span",
      {
        className: "nds-segmented-indicator",
        "aria-hidden": true,
        style: {
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${Math.max(0, index) * 100}%)`
        }
      }
    ),
    options.map((o) => /* @__PURE__ */ jsxs4(
      "label",
      {
        className: cx(
          o.value === value && "is-selected",
          o.disabled && "is-disabled"
        ),
        children: [
          /* @__PURE__ */ jsx5(
            "input",
            {
              type: "radio",
              name: id,
              value: o.value,
              checked: o.value === value,
              disabled: o.disabled,
              onChange: () => onValueChange(o.value)
            }
          ),
          /* @__PURE__ */ jsx5("span", { children: o.label })
        ]
      },
      o.value
    ))
  ] });
}
function Breadcrumb({
  items,
  label = "\uD604\uC7AC \uC704\uCE58"
}) {
  return /* @__PURE__ */ jsx5("nav", { "aria-label": label, className: "nds-breadcrumb", children: /* @__PURE__ */ jsx5("ol", { children: items.map((x, i) => /* @__PURE__ */ jsxs4("li", { children: [
    i > 0 && /* @__PURE__ */ jsx5(ChevronRightIcon, { "aria-hidden": true }),
    i === items.length - 1 ? /* @__PURE__ */ jsx5("span", { "aria-current": "page", children: x.label }) : /* @__PURE__ */ jsx5("a", { href: x.href || "#", children: x.label })
  ] }, i)) }) });
}
function Pagination({
  page,
  totalPages,
  onPageChange
}) {
  const count = Math.max(1, totalPages), pages = pageRange(page, count);
  return /* @__PURE__ */ jsxs4("nav", { "aria-label": "\uD398\uC774\uC9C0 \uD0D0\uC0C9", className: "nds-pagination", children: [
    /* @__PURE__ */ jsx5(
      IconButton,
      {
        label: "\uC774\uC804 \uD398\uC774\uC9C0",
        variant: "outline",
        disabled: page <= 1,
        onClick: () => onPageChange(page - 1),
        children: /* @__PURE__ */ jsx5(ChevronLeftIcon, {})
      }
    ),
    pages.map((n, i) => /* @__PURE__ */ jsxs4("span", { children: [
      i > 0 && n - pages[i - 1] > 1 && /* @__PURE__ */ jsx5("span", { className: "nds-pagination-gap", "aria-hidden": true, children: "\u2026" }),
      /* @__PURE__ */ jsx5(
        Button,
        {
          size: "sm",
          variant: page === n ? "primary" : "ghost",
          "aria-label": `${n}\uD398\uC774\uC9C0`,
          "aria-current": page === n ? "page" : void 0,
          onClick: () => onPageChange(n),
          children: n
        }
      )
    ] }, n)),
    /* @__PURE__ */ jsx5(
      IconButton,
      {
        label: "\uB2E4\uC74C \uD398\uC774\uC9C0",
        variant: "outline",
        disabled: page >= count,
        onClick: () => onPageChange(page + 1),
        children: /* @__PURE__ */ jsx5(ChevronRightIcon, {})
      }
    )
  ] });
}
function Stepper({
  steps,
  current,
  onStepChange
}) {
  return /* @__PURE__ */ jsx5("ol", { className: "nds-stepper", "aria-label": "\uC9C4\uD589 \uB2E8\uACC4", children: steps.map((s, i) => /* @__PURE__ */ jsx5(
    "li",
    {
      "aria-current": i === current ? "step" : void 0,
      className: cx(
        i < current && "is-complete",
        i === current && "is-current"
      ),
      children: /* @__PURE__ */ jsxs4(
        "button",
        {
          type: "button",
          disabled: !onStepChange || i > current,
          onClick: () => onStepChange?.(i),
          "aria-label": `${i + 1}\uB2E8\uACC4 ${s}${i < current ? " \uC644\uB8CC" : ""}`,
          children: [
            /* @__PURE__ */ jsx5("span", { className: "nds-step-dot", children: i < current ? /* @__PURE__ */ jsx5(CheckIcon4, {}) : i + 1 }),
            /* @__PURE__ */ jsx5("span", { children: s })
          ]
        }
      )
    },
    s
  )) });
}
function NavItems({
  items,
  value,
  onValueChange
}) {
  return /* @__PURE__ */ jsx5(Fragment, { children: items.map(
    (x) => x.href ? /* @__PURE__ */ jsxs4(
      "a",
      {
        href: x.href,
        "aria-current": value === x.value ? "page" : void 0,
        children: [
          x.icon,
          /* @__PURE__ */ jsx5("span", { children: x.label }),
          x.badge
        ]
      },
      x.value
    ) : /* @__PURE__ */ jsxs4(
      "button",
      {
        type: "button",
        disabled: x.disabled,
        "aria-current": value === x.value ? "page" : void 0,
        onClick: () => onValueChange?.(x.value),
        children: [
          x.icon,
          /* @__PURE__ */ jsx5("span", { children: x.label }),
          x.badge
        ]
      },
      x.value
    )
  ) });
}
function NavigationBar({
  brand,
  items,
  value,
  onValueChange,
  actions
}) {
  return /* @__PURE__ */ jsxs4("header", { className: "nds-navigation-bar", children: [
    /* @__PURE__ */ jsx5("strong", { children: brand }),
    /* @__PURE__ */ jsx5("nav", { "aria-label": "\uC8FC \uBA54\uB274", children: /* @__PURE__ */ jsx5(NavItems, { items, value, onValueChange }) }),
    actions && /* @__PURE__ */ jsx5("div", { children: actions })
  ] });
}
function SideNavigation({
  label = "\uC139\uC158 \uD0D0\uC0C9",
  items,
  value,
  onValueChange
}) {
  return /* @__PURE__ */ jsx5("nav", { className: "nds-side-navigation", "aria-label": label, children: /* @__PURE__ */ jsx5(NavItems, { items, value, onValueChange }) });
}
function BottomNavigation({
  label = "\uD558\uB2E8 \uD0D0\uC0C9",
  items,
  value,
  onValueChange
}) {
  return /* @__PURE__ */ jsx5("nav", { className: "nds-bottom-navigation", "aria-label": label, children: /* @__PURE__ */ jsx5(
    NavItems,
    {
      items: items.slice(0, 5),
      value,
      onValueChange
    }
  ) });
}

// packages/ui/src/surfaces.tsx
import { useId as useId4, useState as useState6 } from "react";
import {
  ChevronDownIcon as ChevronDownIcon2,
  ChevronRightIcon as ChevronRightIcon2,
  Cross2Icon as Cross2Icon3,
  PersonIcon
} from "@radix-ui/react-icons";
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function Card({
  title,
  description,
  children,
  footer,
  actions,
  variant = "outline",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs5(
    "article",
    {
      ...props,
      className: cx("nds-card", `nds-card--${variant}`, className),
      children: [
        (title || actions) && /* @__PURE__ */ jsxs5("header", { children: [
          /* @__PURE__ */ jsxs5("div", { children: [
            title && /* @__PURE__ */ jsx6("h3", { children: title }),
            description && /* @__PURE__ */ jsx6("p", { children: description })
          ] }),
          actions
        ] }),
        children && /* @__PURE__ */ jsx6("div", { className: "nds-card-body", children }),
        footer && /* @__PURE__ */ jsx6("footer", { children: footer })
      ]
    }
  );
}
function ListRow({
  title,
  description,
  leading,
  trailing,
  onClick,
  disabled = false
}) {
  const content = /* @__PURE__ */ jsxs5(Fragment2, { children: [
    leading && /* @__PURE__ */ jsx6("span", { className: "nds-list-leading", children: leading }),
    /* @__PURE__ */ jsxs5("span", { className: "nds-list-copy", children: [
      /* @__PURE__ */ jsx6("strong", { children: title }),
      description && /* @__PURE__ */ jsx6("small", { children: description })
    ] }),
    trailing || onClick && /* @__PURE__ */ jsx6(ChevronRightIcon2, { "aria-hidden": true })
  ] });
  return onClick ? /* @__PURE__ */ jsx6(
    "button",
    {
      type: "button",
      className: "nds-list-row",
      onClick,
      disabled,
      children: content
    }
  ) : /* @__PURE__ */ jsx6("div", { className: "nds-list-row", children: content });
}
function Accordion({
  items,
  multiple = false,
  defaultValue = []
}) {
  const [open, set] = useState6(defaultValue), id = useId4();
  return /* @__PURE__ */ jsx6("div", { className: "nds-accordion", children: items.map((x, i) => {
    const active = open.includes(x.value);
    return /* @__PURE__ */ jsxs5("section", { children: [
      /* @__PURE__ */ jsx6("h3", { children: /* @__PURE__ */ jsxs5(
        "button",
        {
          type: "button",
          id: `${id}-trigger-${i}`,
          "aria-expanded": active,
          "aria-controls": `${id}-panel-${i}`,
          disabled: x.disabled,
          onClick: () => set(
            active ? open.filter((v) => v !== x.value) : multiple ? [...open, x.value] : [x.value]
          ),
          children: [
            x.title,
            /* @__PURE__ */ jsx6(
              ChevronDownIcon2,
              {
                "aria-hidden": true,
                style: { transform: active ? "rotate(180deg)" : "" }
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsx6(
        "div",
        {
          id: `${id}-panel-${i}`,
          role: "region",
          "aria-labelledby": `${id}-trigger-${i}`,
          hidden: !active,
          className: "nds-accordion-content",
          children: x.content
        }
      )
    ] }, x.value);
  }) });
}
function Divider({
  label,
  vertical = false
}) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      role: "separator",
      "aria-orientation": vertical ? "vertical" : "horizontal",
      className: cx("nds-divider", vertical && "nds-divider--vertical"),
      children: label && /* @__PURE__ */ jsx6("span", { children: label })
    }
  );
}
function Avatar({
  name,
  src,
  size = "md"
}) {
  const [failedSource, setFailedSource] = useState6(void 0);
  return /* @__PURE__ */ jsx6(
    "span",
    {
      className: cx("nds-avatar", `nds-avatar--${size}`),
      role: "img",
      "aria-label": name,
      children: src && failedSource !== src ? /* @__PURE__ */ jsx6("img", { src, alt: "", onError: () => setFailedSource(src) }, src) : name ? name.trim().slice(0, 2) : /* @__PURE__ */ jsx6(PersonIcon, {})
    }
  );
}
function AvatarGroup({
  names,
  max = 4
}) {
  return /* @__PURE__ */ jsxs5("div", { className: "nds-avatar-group", "aria-label": `\uCC38\uC5EC\uC790 ${names.length}\uBA85`, children: [
    names.slice(0, max).map((name, i) => /* @__PURE__ */ jsx6(Avatar, { name }, `${name}-${i}`)),
    names.length > max && /* @__PURE__ */ jsxs5(
      "span",
      {
        className: "nds-avatar nds-avatar--md",
        "aria-label": `\uC678 ${names.length - max}\uBA85`,
        children: [
          "+",
          names.length - max
        ]
      }
    )
  ] });
}
function Badge({
  children,
  tone = "neutral",
  dot = false
}) {
  return /* @__PURE__ */ jsxs5("span", { className: cx("nds-badge", `nds-tone--${tone}`), children: [
    dot && /* @__PURE__ */ jsx6("i", { "aria-hidden": true }),
    children
  ] });
}
function Tag({
  children,
  onRemove,
  selected,
  onSelect,
  disabled = false
}) {
  return /* @__PURE__ */ jsxs5("span", { className: cx("nds-tag", selected && "is-selected"), children: [
    onSelect ? /* @__PURE__ */ jsx6(
      "button",
      {
        type: "button",
        "aria-pressed": !!selected,
        disabled,
        onClick: onSelect,
        children
      }
    ) : children,
    onRemove && /* @__PURE__ */ jsx6(
      IconButton,
      {
        size: "sm",
        label: `${children} \uC81C\uAC70`,
        disabled,
        onClick: onRemove,
        children: /* @__PURE__ */ jsx6(Cross2Icon3, {})
      }
    )
  ] });
}
function ScrollArea({
  children,
  label,
  height = 200
}) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      className: "nds-scroll-area",
      role: "region",
      "aria-label": label,
      tabIndex: 0,
      style: { maxHeight: height },
      children
    }
  );
}
function Carousel({
  items,
  label = "\uC2AC\uB77C\uC774\uB4DC"
}) {
  const [index, set] = useState6(0), id = useId4();
  return /* @__PURE__ */ jsxs5(
    "section",
    {
      className: "nds-carousel",
      "aria-roledescription": "\uCE90\uB7EC\uC140",
      "aria-label": label,
      children: [
        /* @__PURE__ */ jsxs5(
          "div",
          {
            id,
            className: "nds-carousel-slide",
            role: "group",
            "aria-roledescription": "\uC2AC\uB77C\uC774\uB4DC",
            "aria-label": `${index + 1} / ${items.length}`,
            children: [
              /* @__PURE__ */ jsx6("h3", { children: items[index]?.title }),
              items[index]?.content
            ]
          }
        ),
        /* @__PURE__ */ jsxs5("div", { className: "nds-between", children: [
          /* @__PURE__ */ jsx6(
            IconButton,
            {
              label: "\uC774\uC804 \uC2AC\uB77C\uC774\uB4DC",
              variant: "outline",
              disabled: index === 0,
              onClick: () => set((v) => v - 1),
              children: /* @__PURE__ */ jsx6(ChevronRightIcon2, { style: { transform: "rotate(180deg)" } })
            }
          ),
          /* @__PURE__ */ jsxs5("span", { "aria-live": "polite", children: [
            index + 1,
            " / ",
            items.length
          ] }),
          /* @__PURE__ */ jsx6(
            IconButton,
            {
              label: "\uB2E4\uC74C \uC2AC\uB77C\uC774\uB4DC",
              variant: "outline",
              disabled: index >= items.length - 1,
              onClick: () => set((v) => v + 1),
              children: /* @__PURE__ */ jsx6(ChevronRightIcon2, {})
            }
          )
        ] })
      ]
    }
  );
}

// packages/ui/src/overlays.tsx
import {
  createContext as createContext2,
  useContext as useContext2,
  useEffect as useEffect5,
  useId as useId5,
  useRef as useRef6,
  useState as useState7
} from "react";
import {
  Cross2Icon as Cross2Icon4,
  ChevronDownIcon as ChevronDownIcon3,
  MagnifyingGlassIcon as MagnifyingGlassIcon2,
  InfoCircledIcon
} from "@radix-ui/react-icons";
import { Fragment as Fragment3, jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var locks = 0;
var previousOverflow = "";
function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dismissible = true,
  variant = "responsive",
  role = "dialog"
}) {
  const ref = useRef6(null), id = useId5();
  useEffect5(() => {
    const el = ref.current;
    if (!el || !open) return;
    const previous = document.activeElement;
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
  return /* @__PURE__ */ jsxs6(
    "dialog",
    {
      ref,
      role,
      "aria-modal": "true",
      "aria-labelledby": `${id}-title`,
      "aria-describedby": description ? `${id}-desc` : void 0,
      className: cx("nds-dialog", `nds-dialog--${variant}`),
      onCancel: (e) => {
        e.preventDefault();
        if (dismissible) onOpenChange(false);
      },
      onClick: (e) => {
        if (!dismissible || e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
          onOpenChange(false);
      },
      children: [
        /* @__PURE__ */ jsxs6("div", { className: "nds-dialog-heading", children: [
          /* @__PURE__ */ jsx7("h2", { id: `${id}-title`, tabIndex: -1, children: title }),
          dismissible && /* @__PURE__ */ jsx7(IconButton, { label: "\uB2EB\uAE30", onClick: () => onOpenChange(false), children: /* @__PURE__ */ jsx7(Cross2Icon4, {}) })
        ] }),
        description && /* @__PURE__ */ jsx7("p", { className: "nds-dialog-description", id: `${id}-desc`, children: description }),
        /* @__PURE__ */ jsx7("div", { className: "nds-dialog-content", children: open ? children : null }),
        footer && /* @__PURE__ */ jsx7("div", { className: "nds-dialog-footer", children: footer })
      ]
    }
  );
}
var Drawer = (p) => /* @__PURE__ */ jsx7(Dialog, { ...p, variant: "drawer" });
var BottomSheet = (p) => /* @__PURE__ */ jsx7(Dialog, { ...p, variant: "sheet" });
function AlertDialog({
  onConfirm,
  confirmLabel = "\uC0AD\uC81C",
  cancelLabel = "\uCDE8\uC18C",
  loading = false,
  ...p
}) {
  return /* @__PURE__ */ jsx7(
    Dialog,
    {
      ...p,
      role: "alertdialog",
      variant: "dialog",
      dismissible: !loading,
      footer: /* @__PURE__ */ jsxs6(Fragment3, { children: [
        /* @__PURE__ */ jsx7(
          Button,
          {
            variant: "secondary",
            autoFocus: true,
            disabled: loading,
            onClick: () => p.onOpenChange(false),
            children: cancelLabel
          }
        ),
        /* @__PURE__ */ jsx7(Button, { variant: "danger", loading, onClick: onConfirm, children: confirmLabel })
      ] })
    }
  );
}
function Popover({
  trigger,
  title,
  children,
  align = "start"
}) {
  const [open, set] = useState7(false), ref = useRef6(null), button = useRef6(null), id = useId5();
  useOutside(ref, open, () => set(false));
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      className: "nds-popover-root",
      ref,
      onKeyDown: (e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          set(false);
          button.current?.focus();
        }
      },
      onBlur: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) set(false);
      },
      children: [
        /* @__PURE__ */ jsx7(
          Button,
          {
            ref: button,
            variant: "outline",
            "aria-expanded": open,
            "aria-controls": open ? id : void 0,
            onClick: () => set(!open),
            children: trigger
          }
        ),
        open && /* @__PURE__ */ jsxs6(
          "div",
          {
            className: cx("nds-popover", align === "end" && "nds-popover--end"),
            id,
            children: [
              title && /* @__PURE__ */ jsx7("strong", { children: title }),
              children
            ]
          }
        )
      ]
    }
  );
}
function DropdownMenu({
  label,
  items,
  variant = "outline",
  iconOnly = false,
  disabled = false
}) {
  const [open, set] = useState7(false), ref = useRef6(null), button = useRef6(null), refs = useRef6([]), id = useId5();
  useOutside(ref, open, () => set(false));
  useEffect5(() => {
    if (open) refs.current.find((r) => r && !r.disabled)?.focus();
  }, [open]);
  const close = (restore = true) => {
    set(false);
    if (restore) button.current?.focus();
  };
  const keys = (e, index) => {
    let next = index;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const enabled = items.map((x, i) => !x.disabled ? i : -1).filter((i) => i >= 0);
      if (!enabled.length) return;
      next = e.key === "Home" ? enabled[0] : e.key === "End" ? enabled.at(-1) : enabled[(enabled.indexOf(index) + (e.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length];
      refs.current[next]?.focus();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") close(false);
    else if (e.key.length === 1) {
      const next2 = items.findIndex(
        (x) => !x.disabled && x.label.toLowerCase().startsWith(e.key.toLowerCase())
      );
      if (next2 >= 0) refs.current[next2]?.focus();
    }
  };
  return /* @__PURE__ */ jsxs6("div", { className: "nds-popover-root", ref, children: [
    /* @__PURE__ */ jsx7(
      Button,
      {
        ref: button,
        variant,
        disabled,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? id : void 0,
        "aria-label": iconOnly ? label : void 0,
        onClick: () => set(!open),
        onKeyDown: (e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            set(true);
          }
        },
        children: iconOnly ? /* @__PURE__ */ jsx7(ChevronDownIcon3, {}) : label
      }
    ),
    open && /* @__PURE__ */ jsx7(
      "div",
      {
        role: "menu",
        "aria-label": label,
        id,
        className: "nds-menu",
        onBlur: (e) => {
          if (!ref.current?.contains(e.relatedTarget)) close(false);
        },
        children: items.map((item, i) => /* @__PURE__ */ jsxs6(
          "button",
          {
            type: "button",
            role: "menuitem",
            ref: (el) => {
              refs.current[i] = el;
            },
            tabIndex: -1,
            disabled: item.disabled,
            className: item.danger ? "nds-danger-text" : "",
            onKeyDown: (e) => keys(e, i),
            onClick: () => {
              close();
              item.onSelect();
            },
            children: [
              item.icon,
              /* @__PURE__ */ jsx7("span", { children: item.label }),
              item.shortcut && /* @__PURE__ */ jsx7("kbd", { children: item.shortcut })
            ]
          },
          item.id
        ))
      }
    )
  ] });
}
function SplitButton({
  label,
  onClick,
  items,
  disabled = false
}) {
  return /* @__PURE__ */ jsxs6("div", { className: "nds-split", children: [
    /* @__PURE__ */ jsx7(Button, { onClick, disabled, children: label }),
    /* @__PURE__ */ jsx7(
      DropdownMenu,
      {
        label: `${label} \uCD94\uAC00 \uC791\uC5C5`,
        variant: "primary",
        iconOnly: true,
        disabled,
        items: items.map((x) => ({ ...x, disabled: disabled || x.disabled }))
      }
    )
  ] });
}
function Tooltip({
  label,
  children
}) {
  const id = useId5(), [open, set] = useState7(false);
  return /* @__PURE__ */ jsxs6(
    "span",
    {
      className: "nds-tooltip-root",
      onMouseEnter: () => set(true),
      onMouseLeave: () => set(false),
      onFocus: () => set(true),
      onBlur: () => set(false),
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          set(false);
          e.stopPropagation();
        }
      },
      children: [
        /* @__PURE__ */ jsx7("span", { tabIndex: 0, "aria-describedby": open ? id : void 0, children }),
        open && /* @__PURE__ */ jsx7("span", { role: "tooltip", id, className: "nds-tooltip", children: label })
      ]
    }
  );
}
function CommandPalette({
  open,
  onOpenChange,
  items
}) {
  const [query, set] = useState7(""), [active, setActive] = useState7(0), id = useId5();
  useEffect5(() => {
    if (open)
      document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, id]);
  const filtered = items.filter(
    (x) => !x.disabled && x.label.toLowerCase().includes(query.toLowerCase())
  );
  useEffect5(() => {
    if (open) {
      set("");
      setActive(0);
    }
  }, [open]);
  const select = (i) => {
    if (filtered[i]) {
      onOpenChange(false);
      filtered[i].onSelect();
    }
  };
  return /* @__PURE__ */ jsxs6(
    Dialog,
    {
      open,
      onOpenChange,
      title: "\uBE60\uB978 \uC774\uB3D9",
      variant: "dialog",
      children: [
        /* @__PURE__ */ jsxs6("div", { className: "nds-command-search", children: [
          /* @__PURE__ */ jsx7(MagnifyingGlassIcon2, {}),
          /* @__PURE__ */ jsx7(
            "input",
            {
              autoFocus: true,
              "aria-label": "\uBA85\uB839 \uAC80\uC0C9",
              role: "combobox",
              "aria-expanded": true,
              "aria-controls": `${id}-list`,
              "aria-autocomplete": "list",
              "aria-activedescendant": filtered[active] ? `${id}-${active}` : void 0,
              value: query,
              onChange: (e) => {
                set(e.target.value);
                setActive(0);
              },
              placeholder: "\uCEF4\uD3EC\uB10C\uD2B8\uB098 \uC791\uC5C5 \uAC80\uC0C9",
              onKeyDown: (e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive(
                    clamp(
                      active + (e.key === "ArrowDown" ? 1 : -1),
                      0,
                      Math.max(0, filtered.length - 1)
                    )
                  );
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  select(active);
                }
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsx7(
          "div",
          {
            role: "listbox",
            id: `${id}-list`,
            "aria-label": "\uAC80\uC0C9 \uACB0\uACFC",
            className: "nds-command-results",
            children: filtered.map((x, i) => /* @__PURE__ */ jsxs6(
              "div",
              {
                role: "option",
                id: `${id}-${i}`,
                "aria-selected": active === i,
                onPointerMove: () => setActive(i),
                onMouseDown: (e) => e.preventDefault(),
                onClick: () => select(i),
                children: [
                  x.icon,
                  /* @__PURE__ */ jsx7("span", { children: x.label }),
                  x.shortcut && /* @__PURE__ */ jsx7("kbd", { children: x.shortcut })
                ]
              },
              x.id
            ))
          }
        ),
        !filtered.length && /* @__PURE__ */ jsx7("p", { className: "nds-hint", role: "status", children: "\uC77C\uCE58\uD558\uB294 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." })
      ]
    }
  );
}
var ToastContext = createContext2(() => {
  throw Error("ToastProvider\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.");
});
function ToastProvider({ children }) {
  const [toasts, set] = useState7([]), serial = useRef6(0);
  const show = (options) => set((v) => [...v, { ...options, id: ++serial.current }].slice(-3));
  return /* @__PURE__ */ jsxs6(ToastContext.Provider, { value: show, children: [
    children,
    /* @__PURE__ */ jsx7("section", { className: "nds-toasts", "aria-label": "\uC54C\uB9BC", children: toasts.map((t) => /* @__PURE__ */ jsx7(
      ToastItem,
      {
        toast: t,
        close: () => set((v) => v.filter((x) => x.id !== t.id))
      },
      t.id
    )) })
  ] });
}
function ToastItem({
  toast,
  close
}) {
  const [paused, set] = useState7(false);
  const remaining = useRef6(toast.duration ?? 5e3), closeRef = useRef6(close);
  closeRef.current = close;
  useEffect5(() => {
    if (paused || toast.action || remaining.current <= 0) return;
    const begin = Date.now(), timer = setTimeout(() => closeRef.current(), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - begin;
    };
  }, [paused, toast.action]);
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      className: cx("nds-toast", `nds-tone--${toast.tone || "neutral"}`),
      onMouseEnter: () => set(true),
      onMouseLeave: () => set(false),
      onFocus: () => set(true),
      onBlur: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) set(false);
      },
      children: [
        /* @__PURE__ */ jsx7(InfoCircledIcon, {}),
        /* @__PURE__ */ jsxs6("div", { role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ jsx7("strong", { children: toast.title }),
          toast.description && /* @__PURE__ */ jsx7("p", { children: toast.description })
        ] }),
        toast.action && /* @__PURE__ */ jsx7(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => {
              toast.action?.onClick();
              close();
            },
            children: toast.action.label
          }
        ),
        /* @__PURE__ */ jsx7(IconButton, { label: "\uC54C\uB9BC \uB2EB\uAE30", size: "sm", onClick: close, children: /* @__PURE__ */ jsx7(Cross2Icon4, {}) })
      ]
    }
  );
}
var useToast = () => useContext2(ToastContext);

// packages/ui/src/feedback.tsx
import { useId as useId6 } from "react";
import {
  CheckCircledIcon as CheckCircledIcon2,
  ExclamationTriangleIcon as ExclamationTriangleIcon2,
  InfoCircledIcon as InfoCircledIcon2,
  ReloadIcon as ReloadIcon2,
  Cross2Icon as Cross2Icon5,
  ArchiveIcon
} from "@radix-ui/react-icons";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var toneIcon = (tone) => tone === "success" ? /* @__PURE__ */ jsx8(CheckCircledIcon2, {}) : tone === "warning" || tone === "danger" ? /* @__PURE__ */ jsx8(ExclamationTriangleIcon2, {}) : /* @__PURE__ */ jsx8(InfoCircledIcon2, {});
function Alert({
  title,
  children,
  tone = "info",
  onDismiss,
  action
}) {
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      role: tone === "danger" ? "alert" : "status",
      className: cx("nds-alert", `nds-tone--${tone}`),
      children: [
        toneIcon(tone),
        /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsx8("strong", { children: title }),
          children && /* @__PURE__ */ jsx8("div", { children }),
          action && /* @__PURE__ */ jsx8("div", { className: "nds-alert-action", children: action })
        ] }),
        onDismiss && /* @__PURE__ */ jsx8(IconButton, { label: "\uC54C\uB9BC \uB2EB\uAE30", size: "sm", onClick: onDismiss, children: /* @__PURE__ */ jsx8(Cross2Icon5, {}) })
      ]
    }
  );
}
function Banner({
  title,
  children,
  action,
  onDismiss,
  tone = "info"
}) {
  return /* @__PURE__ */ jsx8("div", { className: "nds-banner", children: /* @__PURE__ */ jsx8(Alert, { title, tone, action, onDismiss, children }) });
}
function Progress({
  value,
  label,
  indeterminate = false
}) {
  const id = useId6(), v = clamp(value || 0, 0, 100);
  return /* @__PURE__ */ jsxs7("div", { className: "nds-field", children: [
    /* @__PURE__ */ jsxs7("div", { className: "nds-between", children: [
      /* @__PURE__ */ jsx8("span", { id, className: "nds-label", children: label }),
      !indeterminate && /* @__PURE__ */ jsxs7("span", { className: "nds-hint", children: [
        v,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx8(
      "div",
      {
        role: "progressbar",
        "aria-labelledby": id,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": indeterminate ? void 0 : v,
        className: cx("nds-progress", indeterminate && "is-indeterminate"),
        children: /* @__PURE__ */ jsx8("span", { style: { width: indeterminate ? "30%" : `${v}%` } })
      }
    )
  ] });
}
function Spinner({
  label = "\uBD88\uB7EC\uC624\uB294 \uC911",
  size = 20
}) {
  return /* @__PURE__ */ jsxs7("span", { role: "status", className: "nds-spinner", children: [
    /* @__PURE__ */ jsx8(ReloadIcon2, { width: size, height: size, className: "nds-spin", "aria-hidden": true }),
    /* @__PURE__ */ jsx8("span", { className: "nds-sr", children: label })
  ] });
}
function Skeleton({
  width = "100%",
  height = 16,
  circle = false,
  label = "\uCF58\uD150\uCE20\uB97C \uBD88\uB7EC\uC624\uB294 \uC911"
}) {
  return /* @__PURE__ */ jsx8(
    "span",
    {
      role: "status",
      className: cx("nds-skeleton", circle && "nds-skeleton--circle"),
      style: { width, height },
      children: /* @__PURE__ */ jsx8("span", { className: "nds-sr", children: label })
    }
  );
}
function EmptyState({
  title,
  description,
  action,
  icon
}) {
  return /* @__PURE__ */ jsxs7("div", { className: "nds-empty", children: [
    /* @__PURE__ */ jsx8("span", { className: "nds-empty-icon", "aria-hidden": true, children: icon || /* @__PURE__ */ jsx8(ArchiveIcon, {}) }),
    /* @__PURE__ */ jsx8("h3", { children: title }),
    /* @__PURE__ */ jsx8("p", { children: description }),
    action
  ] });
}
function Result({
  title,
  description,
  tone = "success",
  action
}) {
  return /* @__PURE__ */ jsxs7("div", { className: cx("nds-result", `nds-tone--${tone}`), children: [
    /* @__PURE__ */ jsx8("span", { className: "nds-result-icon", "aria-hidden": true, children: toneIcon(tone) }),
    /* @__PURE__ */ jsx8("h3", { children: title }),
    /* @__PURE__ */ jsx8("p", { children: description }),
    action
  ] });
}

// packages/ui/src/data.tsx
import {
  useEffect as useEffect6,
  useId as useId7,
  useMemo,
  useRef as useRef7,
  useState as useState8
} from "react";
import {
  ChevronDownIcon as ChevronDownIcon4,
  ChevronRightIcon as ChevronRightIcon3,
  ChevronLeftIcon as ChevronLeftIcon2,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon as CheckIcon5
} from "@radix-ui/react-icons";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
function sortRows(rows, column, direction) {
  if (!column) return rows;
  return [...rows].sort((a, b) => {
    const av = column.sortValue ? column.sortValue(a) : a[column.key], bv = column.sortValue ? column.sortValue(b) : b[column.key];
    const result = typeof av === "number" && typeof bv === "number" ? av - bv : String(av ?? "").localeCompare(String(bv ?? ""), "ko", {
      numeric: true
    });
    return direction === "asc" ? result : -result;
  });
}
function DataTable({
  label,
  columns,
  rows,
  pageSize = 5,
  selectable = false,
  onSelectionChange,
  emptyMessage = "\uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."
}) {
  const [sort, setSort] = useState8(void 0), [direction, setDirection] = useState8("asc"), [page, setPage] = useState8(1), [storedSelection, setSelected] = useState8([]);
  const selected = storedSelection.filter(
    (id) => rows.some((row) => row.id === id)
  );
  const safePageSize = Math.max(1, pageSize), pages = Math.max(1, Math.ceil(rows.length / safePageSize)), current = Math.min(page, pages);
  const sorted = useMemo(
    () => sortRows(
      rows,
      columns.find((c) => c.key === sort),
      direction
    ),
    [rows, columns, sort, direction]
  );
  const visible = sorted.slice(
    (current - 1) * safePageSize,
    current * safePageSize
  );
  const checked = visible.length > 0 && visible.every((r) => selected.includes(r.id)), some = visible.some((r) => selected.includes(r.id));
  const choose = (ids) => {
    setSelected(ids);
    onSelectionChange?.(ids);
  };
  const validSelected = selected.filter(
    (id) => rows.some((row) => row.id === id)
  );
  const toggle = (id) => choose(
    validSelected.includes(id) ? validSelected.filter((x) => x !== id) : [...validSelected, id]
  );
  const order = (key) => {
    setDirection(sort === key && direction === "asc" ? "desc" : "asc");
    setSort(key);
  };
  return /* @__PURE__ */ jsxs8("section", { className: "nds-data-table", "aria-label": label, children: [
    /* @__PURE__ */ jsxs8("div", { className: "nds-table-mobile-sort", children: [
      /* @__PURE__ */ jsx9(
        Select,
        {
          label: "\uC815\uB82C \uAE30\uC900",
          value: sort ? String(sort) : "",
          options: [
            { value: "", label: "\uAE30\uBCF8 \uC21C\uC11C" },
            ...columns.filter((c) => c.sortable).map((c) => ({ value: String(c.key), label: c.label }))
          ],
          onChange: (e) => setSort(e.target.value ? e.target.value : void 0)
        }
      ),
      /* @__PURE__ */ jsx9(
        Button,
        {
          variant: "outline",
          onClick: () => setDirection(direction === "asc" ? "desc" : "asc"),
          children: direction === "asc" ? "\uC624\uB984\uCC28\uC21C" : "\uB0B4\uB9BC\uCC28\uC21C"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs8(
      "div",
      {
        className: "nds-table-scroll",
        role: "region",
        "aria-label": `${label} \uD45C`,
        tabIndex: 0,
        children: [
          /* @__PURE__ */ jsxs8("table", { children: [
            /* @__PURE__ */ jsx9("caption", { children: label }),
            /* @__PURE__ */ jsx9("thead", { children: /* @__PURE__ */ jsxs8("tr", { children: [
              selectable && /* @__PURE__ */ jsx9("th", { scope: "col", children: /* @__PURE__ */ jsx9(
                Checkbox,
                {
                  label: "\uD604\uC7AC \uD398\uC774\uC9C0 \uC804\uCCB4 \uC120\uD0DD",
                  checked,
                  indeterminate: some && !checked,
                  onChange: () => choose(
                    checked ? validSelected.filter(
                      (id) => !visible.some((r) => r.id === id)
                    ) : [
                      .../* @__PURE__ */ new Set([
                        ...validSelected,
                        ...visible.map((r) => r.id)
                      ])
                    ]
                  )
                }
              ) }),
              columns.map((c) => /* @__PURE__ */ jsx9(
                "th",
                {
                  scope: "col",
                  "aria-sort": sort === c.key ? direction === "asc" ? "ascending" : "descending" : void 0,
                  style: { textAlign: c.align },
                  children: c.sortable ? /* @__PURE__ */ jsxs8("button", { type: "button", onClick: () => order(c.key), children: [
                    c.label,
                    sort === c.key ? direction === "asc" ? /* @__PURE__ */ jsx9(ArrowUpIcon, {}) : /* @__PURE__ */ jsx9(ArrowDownIcon, {}) : /* @__PURE__ */ jsx9(ChevronDownIcon4, {})
                  ] }) : c.label
                },
                String(c.key)
              ))
            ] }) }),
            /* @__PURE__ */ jsx9("tbody", { children: visible.map((row) => /* @__PURE__ */ jsxs8("tr", { "data-selected": selected.includes(row.id), children: [
              selectable && /* @__PURE__ */ jsx9("td", { children: /* @__PURE__ */ jsx9(
                Checkbox,
                {
                  label: `${row.id} \uC120\uD0DD`,
                  checked: selected.includes(row.id),
                  onChange: () => toggle(row.id)
                }
              ) }),
              columns.map((c) => /* @__PURE__ */ jsx9("td", { style: { textAlign: c.align }, children: c.render ? c.render(row) : String(row[c.key] ?? "") }, String(c.key)))
            ] }, row.id)) })
          ] }),
          !rows.length && /* @__PURE__ */ jsx9("p", { className: "nds-table-empty", children: emptyMessage })
        ]
      }
    ),
    /* @__PURE__ */ jsx9("ul", { className: "nds-table-cards", "aria-label": `${label} \uBAA9\uB85D`, children: visible.map((row) => /* @__PURE__ */ jsxs8("li", { children: [
      selectable && /* @__PURE__ */ jsx9(
        Checkbox,
        {
          label: `${row.id} \uC120\uD0DD`,
          checked: selected.includes(row.id),
          onChange: () => toggle(row.id)
        }
      ),
      /* @__PURE__ */ jsx9("dl", { children: columns.map((c) => /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsx9("dt", { children: c.label }),
        /* @__PURE__ */ jsx9("dd", { children: c.render ? c.render(row) : String(row[c.key] ?? "") })
      ] }, String(c.key))) })
    ] }, row.id)) }),
    !rows.length && /* @__PURE__ */ jsx9("p", { className: "nds-table-mobile-empty", children: emptyMessage }),
    /* @__PURE__ */ jsxs8("footer", { children: [
      /* @__PURE__ */ jsxs8("span", { className: "nds-hint", "aria-live": "polite", children: [
        "\uC804\uCCB4 ",
        rows.length,
        "\uAC1C",
        selected.length > 0 && ` \xB7 ${selected.filter((id) => rows.some((r) => r.id === id)).length}\uAC1C \uC120\uD0DD`
      ] }),
      /* @__PURE__ */ jsx9(Pagination, { page: current, totalPages: pages, onPageChange: setPage })
    ] })
  ] });
}
function DescriptionList({
  items
}) {
  return /* @__PURE__ */ jsx9("dl", { className: "nds-description-list", children: items.map((x, i) => /* @__PURE__ */ jsxs8("div", { children: [
    /* @__PURE__ */ jsx9("dt", { children: x.label }),
    /* @__PURE__ */ jsx9("dd", { children: x.value })
  ] }, i)) });
}
function Stat({
  label,
  value,
  change,
  caption
}) {
  return /* @__PURE__ */ jsxs8("div", { className: "nds-stat", children: [
    /* @__PURE__ */ jsx9("span", { children: label }),
    /* @__PURE__ */ jsx9("strong", { children: value }),
    change && /* @__PURE__ */ jsx9("small", { children: change }),
    caption && /* @__PURE__ */ jsx9("p", { children: caption })
  ] });
}
function Timeline({
  items
}) {
  return /* @__PURE__ */ jsx9("ol", { className: "nds-timeline", children: items.map((x, i) => /* @__PURE__ */ jsxs8("li", { className: `is-${x.status || "pending"}`, children: [
    /* @__PURE__ */ jsx9("span", { className: "nds-timeline-dot", "aria-hidden": true, children: x.status === "complete" && /* @__PURE__ */ jsx9(CheckIcon5, {}) }),
    /* @__PURE__ */ jsxs8("div", { children: [
      /* @__PURE__ */ jsx9("strong", { children: x.title }),
      x.time && /* @__PURE__ */ jsx9("time", { children: x.time }),
      x.description && /* @__PURE__ */ jsx9("p", { children: x.description }),
      /* @__PURE__ */ jsx9("span", { className: "nds-sr", children: x.status === "complete" ? "\uC644\uB8CC" : x.status === "current" ? "\uC9C4\uD589 \uC911" : "\uC608\uC815" })
    ] })
  ] }, i)) });
}
function Tree({
  label,
  nodes,
  value,
  onValueChange
}) {
  const [expanded, setExpanded] = useState8([]), [focused, setFocused] = useState8(nodes[0]?.id), refs = useRef7({});
  const visible = [];
  function walk(list, level = 1, parent) {
    for (const [index, node] of list.entries()) {
      visible.push({ node, level, parent, position: index + 1, setSize: list.length });
      if (expanded.includes(node.id))
        walk(node.children || [], level + 1, node.id);
    }
  }
  walk(nodes);
  const tabStop = visible.some((item) => item.node.id === focused) ? focused : visible.find((item) => item.node.id === value)?.node.id || visible[0]?.node.id;
  const focus = (id) => {
    if (id) {
      setFocused(id);
      refs.current[id]?.focus();
    }
  };
  const toggle = (id) => setExpanded(
    (p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
  );
  return /* @__PURE__ */ jsx9("div", { role: "tree", "aria-label": label, className: "nds-tree", children: visible.map(({ node, parent, level, position, setSize }, i) => /* @__PURE__ */ jsxs8(
    "div",
    {
      ref: (el) => {
        refs.current[node.id] = el;
      },
      role: "treeitem",
      "aria-level": level,
      "aria-posinset": position,
      "aria-setsize": setSize,
      "aria-expanded": node.children?.length ? expanded.includes(node.id) : void 0,
      "aria-selected": value === node.id,
      tabIndex: tabStop === node.id ? 0 : -1,
      style: { paddingLeft: (level - 1) * 20 + 10 },
      onFocus: () => setFocused(node.id),
      onClick: () => {
        focus(node.id);
        onValueChange(node.id);
        if (node.children?.length) toggle(node.id);
      },
      onKeyDown: (e) => {
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
      },
      children: [
        node.children?.length ? /* @__PURE__ */ jsx9(
          ChevronRightIcon3,
          {
            "aria-hidden": true,
            style: {
              transform: expanded.includes(node.id) ? "rotate(90deg)" : ""
            }
          }
        ) : /* @__PURE__ */ jsx9("span", { className: "nds-tree-leaf", "aria-hidden": true }),
        node.label
      ]
    },
    node.id
  )) });
}
function calendarCells(month) {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  return Array.from(
    { length: 42 },
    (_, i) => new Date(Date.UTC(y, m - 1, 1 - offset + i)).toISOString().slice(0, 10)
  );
}
function shiftCalendarMonth(date, delta) {
  const [year, month, day] = date.split("-").map(Number);
  const target = new Date(Date.UTC(year, month - 1 + delta, 1));
  const end = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
  ).getUTCDate();
  return new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(day, end))
  ).toISOString().slice(0, 10);
}
function moveDate(date, days) {
  const d = /* @__PURE__ */ new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function Calendar({
  label,
  value,
  onValueChange,
  min,
  max,
  disabled = false
}) {
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const [month, setMonth] = useState8((value || today).slice(0, 7)), [focusDate, setFocusDate] = useState8(value || today);
  useEffect6(() => {
    if (value) {
      setMonth(value.slice(0, 7));
      setFocusDate(value);
    }
  }, [value]);
  const refs = useRef7({}), id = useId7(), cells = calendarCells(month);
  const shift = (delta) => {
    const [y, m] = month.split("-").map(Number);
    setMonth(new Date(Date.UTC(y, m - 1 + delta, 1)).toISOString().slice(0, 7));
  };
  const focus = (date) => {
    if (min && date < min || max && date > max) return;
    setFocusDate(date);
    if (!date.startsWith(month)) setMonth(date.slice(0, 7));
    requestAnimationFrame(() => refs.current[date]?.focus());
  };
  return /* @__PURE__ */ jsxs8("div", { className: "nds-calendar", children: [
    /* @__PURE__ */ jsxs8("div", { className: "nds-between", children: [
      /* @__PURE__ */ jsx9(
        IconButton,
        {
          label: "\uC774\uC804 \uB2EC",
          size: "sm",
          disabled,
          onClick: () => shift(-1),
          children: /* @__PURE__ */ jsx9(ChevronLeftIcon2, {})
        }
      ),
      /* @__PURE__ */ jsxs8("strong", { id, "aria-live": "polite", children: [
        month.replace("-", "\uB144 "),
        "\uC6D4"
      ] }),
      /* @__PURE__ */ jsx9(
        IconButton,
        {
          label: "\uB2E4\uC74C \uB2EC",
          size: "sm",
          disabled,
          onClick: () => shift(1),
          children: /* @__PURE__ */ jsx9(ChevronRightIcon3, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsxs8("table", { role: "grid", "aria-label": label, "aria-labelledby": id, children: [
      /* @__PURE__ */ jsx9("thead", { children: /* @__PURE__ */ jsx9("tr", { children: ["\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0", "\uC77C"].map((x) => /* @__PURE__ */ jsx9("th", { scope: "col", children: x }, x)) }) }),
      /* @__PURE__ */ jsx9("tbody", { children: Array.from({ length: 6 }, (_, week) => /* @__PURE__ */ jsx9("tr", { children: cells.slice(week * 7, week * 7 + 7).map((date) => {
        const unavailable = disabled || !!(min && date < min || max && date > max);
        return /* @__PURE__ */ jsx9("td", { "aria-selected": date === value, children: /* @__PURE__ */ jsx9(
          "button",
          {
            type: "button",
            ref: (el) => {
              refs.current[date] = el;
            },
            "aria-label": new Intl.DateTimeFormat("ko-KR", {
              dateStyle: "full",
              timeZone: "UTC"
            }).format(/* @__PURE__ */ new Date(date + "T12:00:00Z")),
            "aria-current": date === today ? "date" : void 0,
            disabled: unavailable,
            tabIndex: date === (cells.includes(focusDate) && (!min || focusDate >= min) && (!max || focusDate <= max) ? focusDate : cells.find(
              (d) => d.startsWith(month) && (!min || d >= min) && (!max || d <= max)
            )) ? 0 : -1,
            className: cx(
              !date.startsWith(month) && "is-outside",
              date === value && "is-selected"
            ),
            onClick: () => {
              onValueChange(date);
              setFocusDate(date);
              if (!date.startsWith(month)) setMonth(date.slice(0, 7));
            },
            onKeyDown: (e) => {
              const offsets = {
                ArrowLeft: -1,
                ArrowRight: 1,
                ArrowUp: -7,
                ArrowDown: 7,
                Home: -(((/* @__PURE__ */ new Date(date + "T12:00:00Z")).getUTCDay() + 6) % 7),
                End: 6 - ((/* @__PURE__ */ new Date(date + "T12:00:00Z")).getUTCDay() + 6) % 7
              };
              if (e.key in offsets) {
                e.preventDefault();
                focus(moveDate(date, offsets[e.key]));
              } else if (e.key === "PageUp" || e.key === "PageDown") {
                e.preventDefault();
                focus(
                  shiftCalendarMonth(
                    date,
                    e.key === "PageDown" ? 1 : -1
                  )
                );
              }
            },
            children: Number(date.slice(-2))
          }
        ) }, date);
      }) }, week)) })
    ] })
  ] });
}

// packages/ui/src/pattern-primitives.tsx
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
function BottomCTA({
  children,
  description
}) {
  return /* @__PURE__ */ jsxs9("div", { className: "nds-bottom-cta", children: [
    description && /* @__PURE__ */ jsx10("p", { children: description }),
    /* @__PURE__ */ jsx10("div", { children })
  ] });
}
function Agreement({
  items,
  value,
  onValueChange,
  error
}) {
  const all = items.length > 0 && items.every((x) => value.includes(x.id));
  return /* @__PURE__ */ jsxs9("fieldset", { className: "nds-agreement", children: [
    /* @__PURE__ */ jsx10("legend", { className: "nds-label", children: "\uC57D\uAD00 \uB3D9\uC758" }),
    /* @__PURE__ */ jsx10(
      Checkbox,
      {
        label: "\uBAA8\uB450 \uB3D9\uC758",
        checked: all,
        indeterminate: value.length > 0 && !all,
        onChange: () => onValueChange(all ? [] : items.map((x) => x.id))
      }
    ),
    /* @__PURE__ */ jsx10("div", { children: items.map((item) => /* @__PURE__ */ jsxs9("div", { className: "nds-between", children: [
      /* @__PURE__ */ jsx10(
        Checkbox,
        {
          label: `${item.required ? "[\uD544\uC218]" : "[\uC120\uD0DD]"} ${item.label}`,
          checked: value.includes(item.id),
          onChange: () => onValueChange(
            value.includes(item.id) ? value.filter((x) => x !== item.id) : [...value, item.id]
          )
        }
      ),
      item.href && /* @__PURE__ */ jsx10(
        "a",
        {
          className: "nds-link",
          href: item.href,
          target: "_blank",
          rel: "noreferrer",
          "aria-label": `${item.label} \uBCF4\uAE30 (\uC0C8 \uCC3D)`,
          children: "\uBCF4\uAE30"
        }
      )
    ] }, item.id)) }),
    error && /* @__PURE__ */ jsx10("p", { role: "alert", className: "nds-error", children: error })
  ] });
}
export {
  Accordion,
  Agreement,
  Alert,
  AlertDialog,
  AspectRatio,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  BottomCTA,
  BottomNavigation,
  BottomSheet,
  Breadcrumb,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  Carousel,
  Checkbox,
  ColorPicker,
  Combobox,
  CommandPalette,
  Container,
  CopyButton,
  DataTable,
  DatePicker,
  DateRangePicker,
  DescriptionList,
  Dialog,
  Divider,
  Drawer,
  DropdownMenu,
  EmptyState,
  Field,
  FileUpload,
  Grid,
  HoldButton,
  IconButton,
  Link,
  ListRow,
  MultiSelect,
  NariaProvider,
  NavigationBar,
  NumberField,
  OtpInput,
  Pagination,
  PasswordField,
  Popover,
  Progress,
  RadioGroup,
  Rating,
  Result,
  ScrollArea,
  SearchField,
  SegmentedControl,
  Select,
  SideNavigation,
  Skeleton,
  Slider,
  Spinner,
  SplitButton,
  Stack,
  Stat,
  Stepper,
  Switch,
  Tabs,
  Tag,
  Text,
  TextField,
  Textarea,
  TimePicker,
  Timeline,
  ToastProvider,
  ToggleButton,
  Tooltip,
  Tree,
  VisuallyHidden,
  calendarCells,
  shiftCalendarMonth,
  sortRows,
  useNaria,
  useToast
};
//# sourceMappingURL=index.js.map
