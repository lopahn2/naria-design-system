import { type FieldProps, type Option } from "./forms";
export declare function Combobox({ label, options, value, onValueChange, placeholder, disabled, hint, error, required, }: FieldProps & {
    options: Option[];
    value: string;
    onValueChange: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function MultiSelect({ label, options, value, onValueChange, disabled, hint, error, }: FieldProps & {
    options: Option[];
    value: string[];
    onValueChange: (v: string[]) => void;
    disabled?: boolean;
}): import("react").JSX.Element;
