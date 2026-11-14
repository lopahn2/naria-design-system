import { type ReactNode } from "react";
import type { Tone } from "./core";
/** Raw text, logs and identifiers shown verbatim. The scroll region is keyboard reachable. */
export declare function CodeBlock({ children, title, meta, wrap, maxHeight, copy, }: {
    children: string;
    title?: string;
    meta?: ReactNode;
    wrap?: boolean;
    maxHeight?: number;
    copy?: boolean;
}): import("react").JSX.Element;
export type StatusKind = "ok" | "warning" | "danger" | "info" | "neutral" | "unknown";
/** A state as a dot plus wording. "unknown" is drawn hollow so it never reads as healthy. */
export declare function StatusIndicator({ status, children, pulse, }: {
    status?: StatusKind;
    children: ReactNode;
    pulse?: boolean;
}): import("react").JSX.Element;
/** A measured amount against a capacity. A null value is "not observed", never zero. */
export declare function Meter({ label, value, max, valueText, warningAt, dangerAt, unknownText, }: {
    label: string;
    value: number | null;
    max?: number;
    valueText?: string;
    warningAt?: number;
    dangerAt?: number;
    unknownText?: string;
}): import("react").JSX.Element;
/** One entry in a conversation: who said it, when, and the content. */
export declare function ChatMessage({ role, author, time, status, actions, highlighted, children, }: {
    role?: "user" | "assistant" | "system";
    author: string;
    time?: string;
    status?: ReactNode;
    actions?: ReactNode;
    highlighted?: boolean;
    children: ReactNode;
}): import("react").JSX.Element;
/** Message input pinned under a conversation. Enter sends, Shift+Enter breaks the line. */
export declare function Composer({ label, value, onValueChange, onSubmit, placeholder, notice, submitLabel, disabled, busy, maxLength, rows, }: {
    label?: string;
    value: string;
    onValueChange: (v: string) => void;
    onSubmit: (v: string) => void;
    placeholder?: string;
    notice?: ReactNode;
    submitLabel?: string;
    disabled?: boolean;
    busy?: boolean;
    maxLength?: number;
    rows?: number;
}): import("react").JSX.Element;
export type LegendItem = {
    label: string;
    kind?: "dot" | "line" | "dashed" | "box";
    tone?: Tone;
};
/** Explains the marks used in a diagram or chart. Every mark is paired with wording. */
export declare function Legend({ label, items, }: {
    label?: string;
    items: LegendItem[];
}): import("react").JSX.Element;
/** Zoom out, zoom in and fit-to-view for a canvas. Sits beside the canvas, never over it. */
export declare function ZoomControls({ label, value, min, max, onZoomIn, onZoomOut, onFit, }: {
    label?: string;
    value: number;
    min?: number;
    max?: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFit?: () => void;
}): import("react").JSX.Element;
/** A node on a topology or flow canvas: step number, icon, name, one line of meta and a state. */
export declare function DiagramNode({ title, meta, icon, index, status, tone, selected, dashed, disabled, onSelect, }: {
    title: string;
    meta?: string;
    icon?: ReactNode;
    index?: number | string;
    status?: ReactNode;
    tone?: Tone;
    selected?: boolean;
    dashed?: boolean;
    disabled?: boolean;
    onSelect?: () => void;
}): import("react").JSX.Element;
