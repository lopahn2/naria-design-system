import { type AnchorHTMLAttributes, type ComponentPropsWithRef, type HTMLAttributes, type ReactNode } from "react";
import type { Size } from "./core";
export type ButtonProps = ComponentPropsWithRef<"button"> & {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: Size;
    loading?: boolean;
    leading?: ReactNode;
    trailing?: ReactNode;
    fullWidth?: boolean;
};
export declare function Button({ children, variant, size, loading, leading, trailing, fullWidth, className, disabled, type, ...props }: ButtonProps): import("react").JSX.Element;
export declare function IconButton({ label, children, size, variant, loading, fullWidth, disabled, className, ...props }: Omit<ButtonProps, "leading" | "trailing"> & {
    label: string;
}): import("react").JSX.Element;
export declare function Link({ external, className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    external?: boolean;
}): import("react").JSX.Element;
export declare function ButtonGroup({ label, children, className, ...props }: HTMLAttributes<HTMLDivElement> & {
    label: string;
}): import("react").JSX.Element;
export declare function ToggleButton({ pressed, onPressedChange, ...props }: ButtonProps & {
    pressed: boolean;
    onPressedChange: (value: boolean) => void;
}): import("react").JSX.Element;
export declare function CopyButton({ value, onCopied, children, ...props }: Omit<ButtonProps, "onClick"> & {
    value: string;
    onCopied?: () => void;
}): import("react").JSX.Element;
export declare function HoldButton({ duration, onConfirm, children, ...props }: Omit<ButtonProps, "onClick"> & {
    duration?: number;
    onConfirm: () => void;
}): import("react").JSX.Element;
