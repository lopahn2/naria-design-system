import fs from "node:fs/promises";
import { build } from "esbuild";
await fs.mkdir("packages/ui/dist", { recursive: true });
await build({
  entryPoints: ["packages/ui/src/index.ts"],
  outfile: "packages/ui/dist/index.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  external: [
    "react",
    "react-dom",
    "react-dom/*",
    "react/*",
    "@radix-ui/react-icons",
  ],
  sourcemap: true,
});
const css = await fs.readFile("packages/ui/src/styles.css", "utf8");
const tokens = await fs.readFile("packages/ui/src/tokens.css", "utf8");
const fonts = await fs.readFile("packages/ui/src/fonts.css", "utf8");
await fs.writeFile(
  "packages/ui/dist/styles.css",
  tokens + "\n" + fonts + "\n" + css.replace(/^@import[^\n]+\n/gm, ""),
);
const radixLicense = (
  await fs.readdir("node_modules/@radix-ui/react-icons")
).find((f) => /^license/i.test(f));
await fs.writeFile(
  "packages/ui/LICENSES.md",
  "# Third-party notices\n\nRadix Icons 1.3.2 (MIT) is a peer dependency. Wanted Sans 1.0.3 (SIL Open Font License) is embedded in the stylesheet. No proprietary fonts or icons are included.\n\n## Radix Icons\n\n" +
    (await fs.readFile(
      "node_modules/@radix-ui/react-icons/" + radixLicense,
      "utf8",
    )) +
    "\n\n## Wanted Sans\n\n" +
    (await fs.readFile("packages/ui/fonts/WANTED-SANS-LICENSE", "utf8")),
);
console.log(
  "@naria/ui: ESM, declarations, embedded font styles, tokens, licenses",
);
