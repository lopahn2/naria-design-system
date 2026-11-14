import type { ReactNode } from "react";
export declare function BottomCTA({ children, description, }: {
    children: ReactNode;
    description?: string;
}): import("react").JSX.Element;
export declare function Agreement({ items, value, onValueChange, error, }: {
    items: {
        id: string;
        label: string;
        required?: boolean;
        href?: string;
    }[];
    value: string[];
    onValueChange: (v: string[]) => void;
    error?: string;
}): import("react").JSX.Element;
