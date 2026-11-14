export declare const cx: (...items: (string | false | null | undefined)[]) => string;
export declare function useReducedMotion(): boolean;
export declare function useControllable<T>(value: T | undefined, initial: T, onChange?: (v: T) => void): readonly [T, (v: T) => void];
export declare function useOutside(ref: React.RefObject<HTMLElement | null>, active: boolean, close: () => void): void;
export declare const clamp: (v: number, min: number, max: number) => number;
export declare function nextEnabled(index: number, direction: number, disabled: boolean[]): number;
export declare function pageRange(page: number, count: number): number[];
