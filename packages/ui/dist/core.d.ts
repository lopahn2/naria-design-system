import { type HTMLAttributes, type ReactNode } from "react";
import { type PaletteName } from "./palettes";
export type Theme = "light" | "dark";
export type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";
export type Size = "sm" | "md" | "lg";
type SystemContext = {
    theme: Theme;
    palette: PaletteName;
    density: "comfortable" | "compact";
    reducedMotion: boolean;
};
export declare const useNaria: () => SystemContext;
export declare function NariaProvider({ children, theme: givenTheme, palette: givenPalette, density: givenDensity, reducedMotion: givenReducedMotion, accent, className, ...props }: {
    children: ReactNode;
    theme?: Theme;
    palette?: PaletteName;
    density?: "comfortable" | "compact";
    reducedMotion?: boolean;
    accent?: {
        color: string;
        soft: string;
    };
    className?: string;
} & HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export declare function Container({ children, narrow, className, ...props }: HTMLAttributes<HTMLDivElement> & {
    narrow?: boolean;
}): import("react").JSX.Element;
export declare function Stack({ gap, direction, align, wrap, className, style, ...props }: HTMLAttributes<HTMLDivElement> & {
    gap?: number;
    direction?: "row" | "column";
    align?: "start" | "center" | "end" | "stretch";
    wrap?: boolean;
}): import("react").JSX.Element;
export declare function Grid({ min, gap, className, style, ...props }: HTMLAttributes<HTMLDivElement> & {
    min?: number;
    gap?: number;
}): import("react").JSX.Element;
export declare function AspectRatio({ ratio, className, style, ...props }: HTMLAttributes<HTMLDivElement> & {
    ratio?: number;
}): import("react").JSX.Element;
export declare function VisuallyHidden(props: HTMLAttributes<HTMLSpanElement>): import("react").JSX.Element;
export declare function Text({ as: Tag, size, muted, weight, className, ...props }: HTMLAttributes<HTMLElement> & {
    as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "label";
    size?: "display" | "title" | "heading" | "subheading" | "body" | "small" | "caption";
    muted?: boolean;
    weight?: "regular" | "semibold";
}): import("react").JSX.Element;
export {};
