import { type ReactNode } from "react";
export type TabItem = {
    value: string;
    label: string;
    content: ReactNode;
    disabled?: boolean;
    badge?: ReactNode;
};
export declare function Tabs({ label, items, value, onValueChange, variant, }: {
    label: string;
    items: TabItem[];
    value: string;
    onValueChange: (v: string) => void;
    variant?: "line" | "pill";
}): import("react").JSX.Element;
export declare function SegmentedControl({ label, options, value, onValueChange, disabled, }: {
    label: string;
    options: {
        value: string;
        label: string;
        disabled?: boolean;
    }[];
    value: string;
    onValueChange: (v: string) => void;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function Breadcrumb({ items, label, }: {
    items: {
        label: string;
        href?: string;
    }[];
    label?: string;
}): import("react").JSX.Element;
export declare function Pagination({ page, totalPages, onPageChange, }: {
    page: number;
    totalPages: number;
    onPageChange: (v: number) => void;
}): import("react").JSX.Element;
export declare function Stepper({ steps, current, onStepChange, }: {
    steps: string[];
    current: number;
    onStepChange?: (v: number) => void;
}): import("react").JSX.Element;
export type NavItem = {
    value: string;
    label: string;
    href?: string;
    icon?: ReactNode;
    badge?: ReactNode;
    disabled?: boolean;
};
export declare function NavigationBar({ brand, items, value, onValueChange, actions, }: {
    brand: ReactNode;
    items: NavItem[];
    value: string;
    onValueChange?: (v: string) => void;
    actions?: ReactNode;
}): import("react").JSX.Element;
export declare function SideNavigation({ label, items, value, onValueChange, }: {
    label?: string;
    items: NavItem[];
    value: string;
    onValueChange?: (v: string) => void;
}): import("react").JSX.Element;
export declare function BottomNavigation({ label, items, value, onValueChange, }: {
    label?: string;
    items: NavItem[];
    value: string;
    onValueChange?: (v: string) => void;
}): import("react").JSX.Element;
