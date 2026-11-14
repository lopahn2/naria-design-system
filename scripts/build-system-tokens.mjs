import fs from "node:fs/promises";
const data = JSON.parse(await fs.readFile("packages/ui/tokens.json", "utf8"));
const resolve = (v) =>
  typeof v === "string" && v.startsWith("{")
    ? data.color[v.slice(7, -1)].$value
    : v;
let css =
  "/* Generated from tokens.json. Edit the source tokens, not this file. */\n";
for (const [theme, tokens] of Object.entries(data.semantic))
  css += `.nds-theme${theme === "dark" ? '[data-nds-theme="dark"]' : ""}{\n${Object.entries(
    tokens,
  )
    .map(([k, v]) => `  --nds-${k}:${resolve(v.$value)};`)
    .join("\n")}\n  color-scheme:${theme};\n}\n`;
css += ".nds-theme{\n";
for (const group of ["space", "radius", "motion", "control"])
  for (const [k, v] of Object.entries(data[group]))
    css += `--nds-${group}-${k}:${v.$value.value}${v.$value.unit};\n`;
for (const [name, token] of Object.entries(data.typography)) {
  const v = token.$value;
  css += `--nds-type-${name}-size:${v.fontSize.value}px;--nds-type-${name}-line:${v.lineHeight};--nds-type-${name}-tracking:${v.letterSpacing.value}px;\n`;
}
css +=
  '--nds-font:"Wanted Sans",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",system-ui,sans-serif;--nds-mono:ui-monospace,SFMono-Regular,Consolas,monospace;--nds-ease:cubic-bezier(.22,.8,.22,1);--nds-spring:cubic-bezier(.2,1.25,.35,1);--nds-control-height:44px;--nds-control-padding:14px;--nds-shadow:0 2px 4px #13202005,0 8px 24px #13202008;--nds-shadow-overlay:0 16px 64px #0002;--nds-layer-sticky:20;--nds-layer-popover:40;--nds-layer-toast:100;--nds-page-gutter:24px;\n}\n';
css +=
  '.nds-theme[data-density="compact"]{--nds-control-height:36px;--nds-control-padding:10px}.nds-theme[data-nds-theme="dark"]{--nds-shadow:0 4px 24px #0002;--nds-shadow-overlay:0 16px 64px #0006}\n';
await fs.writeFile("packages/ui/src/tokens.css", css);
// Wanted Sans covers Hangul, Latin and digits in one family.
let fonts = "/* Wanted Sans · SIL OFL 1.1 · wanted-sans 1.0.3 */\n";
for (const weight of [400, 600])
  fonts += `@font-face{font-family:"Wanted Sans";font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${(await fs.readFile(`packages/ui/fonts/wanted-sans-${weight}-normal.woff2`)).toString("base64")}) format("woff2");}\n`;
await fs.writeFile("packages/ui/src/fonts.css", fonts);
console.log("naria tokens and offline Wanted Sans generated");
