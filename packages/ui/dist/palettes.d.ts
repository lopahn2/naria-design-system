/** Accent palettes. Canvas, surfaces, inputs and typography stay on neutral tokens. */
export type PaletteName = "modern" | "playful";
export type PaletteHue = "blue" | "teal" | "green" | "yellow" | "orange" | "red";
export declare const paletteSteps: readonly [100, 300, 500, 700, 900];
export type PaletteStep = (typeof paletteSteps)[number];
export type PaletteFamily = {
    id: PaletteHue;
    name: string;
    shades: Record<PaletteStep, string>;
};
export type PaletteRoles = Record<"primary" | "on-primary" | "accent" | "accent-soft" | "focus", string>;
export type PalettePreset = {
    id: PaletteName;
    name: string;
    englishName: string;
    description: string;
    reference: string;
    families: PaletteFamily[];
    light: PaletteRoles;
    dark: PaletteRoles;
};
/** Readable labels on palette swatches, independent of the selected UI theme. */
export declare function paletteLabelColor(background: string): "#000000" | "#ffffff";
export declare const palettePresets: PalettePreset[];
export declare function paletteVariables(palette: PaletteName, theme: "light" | "dark"): any;
