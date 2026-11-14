import { type ReactNode } from "react";
import { type ButtonProps } from "./actions";
import type { Tone } from "./core";
export type DialogProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    dismissible?: boolean;
    variant?: "dialog" | "drawer" | "sheet" | "responsive";
    role?: "dialog" | "alertdialog";
};
export declare function Dialog({ open, onOpenChange, title, description, children, footer, dismissible, variant, role, }: DialogProps): import("react").JSX.Element;
export declare const Drawer: (p: DialogProps) => import("react").JSX.Element;
export declare const BottomSheet: (p: DialogProps) => import("react").JSX.Element;
export declare function AlertDialog({ onConfirm, confirmLabel, cancelLabel, loading, ...p }: Omit<DialogProps, "footer" | "role" | "variant"> & {
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
}): import("react").JSX.Element;
export declare function Popover({ trigger, title, children, align, }: {
    trigger: string;
    title?: string;
    children: ReactNode;
    align?: "start" | "end";
}): import("react").JSX.Element;
export type MenuItem = {
    id: string;
    label: string;
    onSelect: () => void;
    icon?: ReactNode;
    disabled?: boolean;
    danger?: boolean;
    shortcut?: string;
};
export declare function DropdownMenu({ label, items, variant, iconOnly, disabled, }: {
    label: string;
    items: MenuItem[];
    variant?: ButtonProps["variant"];
    iconOnly?: boolean;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function SplitButton({ label, onClick, items, disabled, }: {
    label: string;
    onClick: () => void;
    items: MenuItem[];
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function Tooltip({ label, children, }: {
    label: string;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function CommandPalette({ open, onOpenChange, items, }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    items: MenuItem[];
}): import("react").JSX.Element;
export type ToastOptions = {
    title: string;
    description?: string;
    tone?: Tone;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
};
export declare function ToastProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare const useToast: () => (options: ToastOptions) => void;
