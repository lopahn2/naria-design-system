import { type ReactNode } from "react";
import type { Tone } from "./core";
export declare function Alert({ title, children, tone, onDismiss, action, }: {
    title: string;
    children?: ReactNode;
    tone?: Tone;
    onDismiss?: () => void;
    action?: ReactNode;
}): import("react").JSX.Element;
export declare function Banner({ title, children, action, onDismiss, tone, }: {
    title: string;
    children?: ReactNode;
    action?: ReactNode;
    onDismiss?: () => void;
    tone?: Tone;
}): import("react").JSX.Element;
export declare function Progress({ value, label, indeterminate, }: {
    value?: number;
    label: string;
    indeterminate?: boolean;
}): import("react").JSX.Element;
export declare function Spinner({ label, size, }: {
    label?: string;
    size?: number;
}): import("react").JSX.Element;
export declare function Skeleton({ width, height, circle, label, }: {
    width?: number | string;
    height?: number | string;
    circle?: boolean;
    label?: string;
}): import("react").JSX.Element;
export declare function EmptyState({ title, description, action, icon, }: {
    title: string;
    description: string;
    action?: ReactNode;
    icon?: ReactNode;
}): import("react").JSX.Element;
export declare function Result({ title, description, tone, action, }: {
    title: string;
    description: string;
    tone?: Tone;
    action?: ReactNode;
}): import("react").JSX.Element;
