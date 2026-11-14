import { type ReactNode } from "react";
export type Column<T> = {
    key: keyof T;
    label: string;
    render?: (row: T) => ReactNode;
    sortable?: boolean;
    align?: "left" | "right";
    sortValue?: (row: T) => string | number;
};
export declare function sortRows<T>(rows: T[], column: Column<T> | undefined, direction: "asc" | "desc"): T[];
export declare function DataTable<T extends {
    id: string;
}>({ label, columns, rows, pageSize, selectable, onSelectionChange, emptyMessage, }: {
    label: string;
    columns: Column<T>[];
    rows: T[];
    pageSize?: number;
    selectable?: boolean;
    onSelectionChange?: (ids: string[]) => void;
    emptyMessage?: string;
}): import("react").JSX.Element;
export declare function DescriptionList({ items, }: {
    items: {
        label: string;
        value: ReactNode;
    }[];
}): import("react").JSX.Element;
export declare function Stat({ label, value, change, caption, }: {
    label: string;
    value: string;
    change?: string;
    caption?: string;
}): import("react").JSX.Element;
export declare function Timeline({ items, }: {
    items: {
        title: string;
        description?: string;
        time?: string;
        status?: "complete" | "current" | "pending";
    }[];
}): import("react").JSX.Element;
export type TreeNode = {
    id: string;
    label: string;
    children?: TreeNode[];
};
export declare function Tree({ label, nodes, value, onValueChange, }: {
    label: string;
    nodes: TreeNode[];
    value: string;
    onValueChange: (v: string) => void;
}): import("react").JSX.Element;
export declare function calendarCells(month: string): string[];
export declare function shiftCalendarMonth(date: string, delta: number): string;
export declare function Calendar({ label, value, onValueChange, min, max, disabled, }: {
    label: string;
    value: string;
    onValueChange: (v: string) => void;
    min?: string;
    max?: string;
    disabled?: boolean;
}): import("react").JSX.Element;
