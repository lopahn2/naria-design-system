/** Accent palettes. Canvas, surfaces, inputs and typography stay on neutral tokens. */
export type PaletteName = "modern" | "playful";
export type PaletteHue = "blue" | "teal" | "green" | "yellow" | "orange" | "red";
export const paletteSteps = [100, 300, 500, 700, 900] as const;
export type PaletteStep = (typeof paletteSteps)[number];
export type PaletteFamily = {
  id: PaletteHue;
  name: string;
  shades: Record<PaletteStep, string>;
};
// Deliberately excludes canvas/surface/raised/subtle/text/border.
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
function luminance(hex: string) {
  const rgb = hex.slice(1).match(/.{2}/g)!.map(v => parseInt(v, 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
/** Readable labels on palette swatches, independent of the selected UI theme. */
export function paletteLabelColor(background: string) {
  return contrast(background, "#000000") >= contrast(background, "#ffffff") ? "#000000" : "#ffffff";
}
function rgbToHsl(hex: string) {
  const [r,g,b] = hex.slice(1).match(/.{2}/g)!.map(v => parseInt(v,16)/255);
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max-min, l = (max+min)/2;
  const h = d === 0 ? 0 : max === r ? ((g-b)/d+6)%6 : max === g ? (b-r)/d+2 : (r-g)/d+4;
  return [h*60, d === 0 ? 0 : d/(1-Math.abs(2*l-1)), l] as const;
}
function hslToHex(h: number, s: number, l: number) {
  const c = (1-Math.abs(2*l-1))*s, x = c*(1-Math.abs((h/60)%2-1)), m=l-c/2;
  const rgb = h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
  return "#"+rgb.map(v=>Math.round((v+m)*255).toString(16).padStart(2,"0")).join("");
}
function family(id: PaletteHue, name: string, base: string): PaletteFamily {
  const [h,s,l] = rgbToHsl(base);
  return {id,name,shades:{
    100:hslToHex(h,s*.35,.94),
    300:hslToHex(h,s*.65,.79),
    500:base.toLowerCase(),
    700:hslToHex(h,s*.9,Math.min(.34,l*.7)),
    900:hslToHex(h,s*.7,Math.min(.15,l*.36)),
  }};
}
function roles(blue: PaletteFamily): Pick<PalettePreset,"light"|"dark"> {
  const c=blue.shades;
  const primary=[c[500],c[700],c[900]].find(v=>contrast(v,"#ffffff")>=4.5)!;
  const ink=[c[500],c[700],c[900]].find(v=>contrast(v,c[100])>=4.5 && contrast(v,"#ffffff")>=4.5)!;
  return {
    light:{primary,"on-primary":"#ffffff",accent:ink,"accent-soft":c[100],focus:ink},
    dark:{primary:c[300],"on-primary":"#171c1f",accent:c[300],"accent-soft":c[900],focus:c[300]},
  };
}
function preset(meta: Omit<PalettePreset,"families"|"light"|"dark">, bases: string[]): PalettePreset {
  const names: [PaletteHue,string][] = [["blue","블루"],["teal","틸"],["green","그린"],["yellow","옐로"],["orange","오렌지"],["red","레드"]];
  const families=names.map(([id,name],i)=>family(id,name,bases[i]));
  return {...meta,families,...roles(families[0])};
}
export const palettePresets: PalettePreset[] = [
  preset({id:"modern",name:"세련된 모던",englishName:"Modern / Quiet color",
    description:"절제된 채도, 차분한 블루와 깊이 있는 포인트.",
    reference:"Stormy morning · Yacht club · Harbor haze"},
    ["#5C8DC5","#245F73","#6C8B74","#B89A3F","#B36545","#AD6464"]),
  preset({id:"playful",name:"캐주얼 & 팝",englishName:"Casual / Color pop",
    description:"또렷한 원색과 경쾌한 대비, 작은 영역에 생동감 있게.",
    reference:"Retro sunset · Burnt sienna · Golden taupe"},
    ["#2563EB","#069494","#27AE60","#FFCE1B","#F48A36","#E35336"]),
];
export function paletteVariables(palette: PaletteName, theme: "light"|"dark") {
  const preset=palettePresets.find(p=>p.id===palette) || palettePresets[0];
  return Object.fromEntries([
    ...Object.entries(preset[theme]).map(([key,value])=>[`--nds-${key}`,value]),
    ...preset.families.flatMap(f=>paletteSteps.map(step=>[`--nds-palette-${f.id}-${step}`,f.shades[step]])),
  ]);
}
