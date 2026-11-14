import { type HTMLAttributes, type ReactNode } from "react";
import type { Size, Tone } from "./core";
export declare function Card({ title, description, children, footer, actions, variant, className, ...props }: Omit<HTMLAttributes<HTMLElement>, "title"> & {
    title?: ReactNode;
    description?: string;
    footer?: ReactNode;
    actions?: ReactNode;
    variant?: "outline" | "filled" | "elevated";
}): import("react").JSX.Element;
export declare function ListRow({ title, description, leading, trailing, onClick, disabled, }: {
    title: string;
    description?: string;
    leading?: ReactNode;
    trailing?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function Accordion({ items, multiple, defaultValue, }: {
    items: {
        value: string;
        title: string;
        content: ReactNode;
        disabled?: boolean;
    }[];
    multiple?: boolean;
    defaultValue?: string[];
}): import("react").JSX.Element;
export declare function Divider({ label, vertical, }: {
    label?: string;
    vertical?: boolean;
}): import("react").JSX.Element;
export declare function Avatar({ name, src, size, }: {
    name: string;
    src?: string;
    size?: Size;
}): import("react").JSX.Element;
export declare function AvatarGroup({ names, max, }: {
    names: string[];
    max?: number;
}): import("react").JSX.Element;
export declare function Badge({ children, tone, dot, }: {
    children: ReactNode;
    tone?: Tone;
    dot?: boolean;
}): import("react").JSX.Element;
export declare function Tag({ children, onRemove, selected, onSelect, disabled, }: {
    children: string;
    onRemove?: () => void;
    selected?: boolean;
    onSelect?: () => void;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function ScrollArea({ children, label, height, }: {
    children: ReactNode;
    label: string;
    height?: number;
}): import("react").JSX.Element;
export declare function Carousel({ items, label, }: {
    items: {
        title: string;
        content: ReactNode;
    }[];
    label?: string;
}): import("react").JSX.Element;
