import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";
export type FieldProps = {
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    optional?: boolean;
};
export declare function Field({ label, hint, error, required, optional, htmlFor, children, id, }: FieldProps & {
    htmlFor?: string;
    children: ReactNode;
    id?: string;
}): import("react").JSX.Element;
export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & FieldProps & {
    leading?: ReactNode;
    trailing?: ReactNode;
};
export declare function TextField({ label, hint, error, optional, leading, trailing, className, id: given, ...props }: TextFieldProps): import("react").JSX.Element;
export declare function Textarea({ label, hint, error, optional, id: given, className, maxLength, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps): import("react").JSX.Element;
export declare function PasswordField(props: TextFieldProps): import("react").JSX.Element;
export declare function SearchField({ value, onValueChange, ...props }: Omit<TextFieldProps, "value" | "onChange" | "type"> & {
    value: string;
    onValueChange: (v: string) => void;
}): import("react").JSX.Element;
export declare function NumberField({ label, value, onValueChange, min, max, step, disabled, hint, error, }: {
    value: number;
    onValueChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
} & FieldProps): import("react").JSX.Element;
export type Option = {
    value: string;
    label: string;
    disabled?: boolean;
    description?: string;
};
export declare function Select({ label, hint, error, optional, options, id: given, className, placeholder, ...props }: SelectHTMLAttributes<HTMLSelectElement> & FieldProps & {
    options: Option[];
    placeholder?: string;
}): import("react").JSX.Element;
export declare function Checkbox({ label, description, indeterminate, className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    label: string;
    description?: string;
    indeterminate?: boolean;
}): import("react").JSX.Element;
export declare function RadioGroup({ label, options, value, onValueChange, name, disabled, hint, error, orientation, }: FieldProps & {
    options: Option[];
    value: string;
    onValueChange: (v: string) => void;
    name?: string;
    disabled?: boolean;
    orientation?: "vertical" | "horizontal";
}): import("react").JSX.Element;
export declare function Switch({ label, description, checked, onCheckedChange, disabled, }: {
    label: string;
    description?: string;
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function Slider({ label, value, onValueChange, min, max, step, format, disabled, }: {
    label: string;
    value: number;
    onValueChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    format?: (v: number) => string;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function Rating({ label, value, onValueChange, max, disabled, }: {
    label: string;
    value: number;
    onValueChange: (v: number) => void;
    max?: number;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function OtpInput({ label, value, onValueChange, length, disabled, error, hint, }: FieldProps & {
    value: string;
    onValueChange: (v: string) => void;
    length?: number;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function FileUpload({ label, onFiles, accept, maxBytes, multiple, disabled, }: {
    label: string;
    onFiles: (files: File[]) => void;
    accept?: string;
    maxBytes?: number;
    multiple?: boolean;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function DatePicker(props: Omit<TextFieldProps, "type">): import("react").JSX.Element;
export declare function TimePicker(props: Omit<TextFieldProps, "type">): import("react").JSX.Element;
export declare function DateRangePicker({ label, start, end, onChange, min, max, disabled, }: {
    label: string;
    start: string;
    end: string;
    onChange: (v: {
        start: string;
        end: string;
    }) => void;
    min?: string;
    max?: string;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function ColorPicker({ label, value, onValueChange, disabled, }: {
    label: string;
    value: string;
    onValueChange: (v: string) => void;
    disabled?: boolean;
}): import("react").JSX.Element;
