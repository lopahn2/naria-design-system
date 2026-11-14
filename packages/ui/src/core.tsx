import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "./utils";
import { paletteVariables, type PaletteName } from "./palettes";
export type Theme = "light" | "dark";
export type Tone =
  "neutral" | "accent" | "success" | "warning" | "danger" | "info";
export type Size = "sm" | "md" | "lg";
type SystemContext = {
  theme: Theme;
  palette: PaletteName;
  density: "comfortable" | "compact";
  reducedMotion: boolean;
};
const Context = createContext<SystemContext>({
  theme: "light",
  palette: "modern",
  density: "comfortable",
  reducedMotion: false,
});
export const useNaria = () => useContext(Context);
export function NariaProvider({
  children,
  theme: givenTheme,
  palette: givenPalette,
  density: givenDensity,
  reducedMotion: givenReducedMotion,
  accent,
  className = "",
  ...props
}: {
  children: ReactNode;
  theme?: Theme;
  palette?: PaletteName;
  density?: "comfortable" | "compact";
  reducedMotion?: boolean;
  accent?: { color: string; soft: string };
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const parent = useNaria();
  const theme = givenTheme ?? parent.theme,
    palette = givenPalette ?? parent.palette,
    density = givenDensity ?? parent.density,
    reducedMotion = givenReducedMotion ?? parent.reducedMotion;
  const [systemReduced, setReduced] = useState(false);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  return (
    <Context.Provider
      value={{ theme, palette, density, reducedMotion: reducedMotion || systemReduced }}
    >
      <div
        {...props}
        className={cx("nds-theme", className)}
        data-nds-theme={theme}
        data-palette={palette}
        data-density={density}
        data-reduced={reducedMotion || systemReduced}
        style={
          {
            ...paletteVariables(palette, theme),
            ...props.style,
            ...(accent
              ? {
                  "--nds-accent": accent.color,
                  "--nds-accent-soft": accent.soft,
                }
              : {}),
          } as CSSProperties
        }
      >
        {children}
      </div>
    </Context.Provider>
  );
}
export function Container({
  children,
  narrow = false,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { narrow?: boolean }) {
  return (
    <div
      {...props}
      className={cx(
        "nds-container",
        narrow && "nds-container--narrow",
        className,
      )}
    >
      {children}
    </div>
  );
}
export function Stack({
  gap = 16,
  direction = "column",
  align = "stretch",
  wrap = false,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  gap?: number;
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch";
  wrap?: boolean;
}) {
  return (
    <div
      {...props}
      className={cx("nds-stack", className)}
      style={{
        display: "flex",
        gap,
        flexDirection: direction,
        alignItems: align,
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
    />
  );
}
export function Grid({
  min = 240,
  gap = 16,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & { min?: number; gap?: number }) {
  return (
    <div
      {...props}
      className={cx("nds-grid", className)}
      style={{ "--nds-grid-min": `${min}px`, gap, ...style } as CSSProperties}
    />
  );
}
export function AspectRatio({
  ratio = 16 / 9,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & { ratio?: number }) {
  return (
    <div
      {...props}
      className={cx("nds-aspect", className)}
      style={{ aspectRatio: ratio, ...style }}
    />
  );
}
export function VisuallyHidden(props: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={cx("nds-sr", props.className)} />;
}
export function Text({
  as: Tag = "p",
  size = "body",
  muted = false,
  weight = "regular",
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "label";
  size?:
    | "display"
    | "title"
    | "heading"
    | "subheading"
    | "body"
    | "small"
    | "caption";
  muted?: boolean;
  weight?: "regular" | "semibold";
}) {
  return (
    <Tag
      {...props}
      className={cx(
        "nds-text",
        `nds-text--${size}`,
        muted && "nds-muted",
        weight === "semibold" && "nds-semibold",
        className,
      )}
    />
  );
}
