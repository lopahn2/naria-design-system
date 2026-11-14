import { useEffect, useRef, useState } from "react";
export const cx = (...items: (string | false | null | undefined)[]) =>
  items.filter(Boolean).join(" ");
export function useReducedMotion() {
  const [reduced, set] = useState(false);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    set(m.matches);
    const fn = () => set(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  return reduced;
}
export function useControllable<T>(
  value: T | undefined,
  initial: T,
  onChange?: (v: T) => void,
) {
  const [own, set] = useState(initial);
  return [
    value === undefined ? own : value,
    (v: T) => {
      if (value === undefined) set(v);
      onChange?.(v);
    },
  ] as const;
}
export function useOutside(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  close: () => void,
) {
  const callback = useRef(close);
  callback.current = close;
  useEffect(() => {
    if (!active) return;
    const fn = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) callback.current();
    };
    document.addEventListener("pointerdown", fn);
    return () => document.removeEventListener("pointerdown", fn);
  }, [active, ref]);
}
export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
export function nextEnabled(
  index: number,
  direction: number,
  disabled: boolean[],
) {
  if (disabled.every(Boolean)) return index;
  let next = index;
  do {
    next = (next + direction + disabled.length) % disabled.length;
  } while (disabled[next]);
  return next;
}
export function pageRange(page: number, count: number) {
  const all = new Set([1, count, page - 1, page, page + 1]);
  return [...all].filter((n) => n > 0 && n <= count).sort((a, b) => a - b);
}
