import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { build } from "esbuild";
import React from "react";
import { renderToString } from "react-dom/server";
import * as UI from "../packages/ui/dist/index.js";
import { contrastRatio } from "../src/lib/selection.ts";
const tokens = JSON.parse(await fs.readFile("packages/ui/tokens.json", "utf8"));
const resolve = (v) =>
  v.startsWith("{") ? tokens.color[v.slice(7, -1)].$value : v;
await build({
  entryPoints: ["src/system/Demos.tsx"],
  bundle: true,
  format: "esm",
  platform: "node",
  jsx: "automatic",
  external: ["react", "react-dom", "react/*", "@radix-ui/react-icons"],
  outfile: "node_modules/.cache/naria-demo-test.mjs",
});
const { ComponentDemo } =
  await import("../node_modules/.cache/naria-demo-test.mjs");
const api = JSON.parse(
  await fs.readFile("src/system/api.generated.json", "utf8"),
);
test("76 exported components render in light/dark and all demo states", () => {
  assert.equal(Object.keys(api).length, 76);
  for (const [id, meta] of Object.entries(api)) {
    assert.equal(typeof UI[meta.exportName], "function", id);
    for (const theme of ["light", "dark"])
      for (const state of ["default", "disabled", "error", "loading"]) {
        const html = renderToString(
          React.createElement(
            UI.NariaProvider,
            { theme },
            React.createElement(
              UI.ToastProvider,
              null,
              React.createElement(ComponentDemo, { id, state }),
            ),
          ),
        );
        assert.ok(html.includes("nds-theme"), `${id}/${theme}/${state}`);
      }
  }
});
test("semantic color aliases resolve and label/status text meets 4.5:1", () => {
  for (const [name, theme] of Object.entries(tokens.semantic)) {
    const c = Object.fromEntries(
      Object.entries(theme).map(([k, v]) => [k, resolve(v.$value)]),
    );
    for (const [fg, bg] of [
      ["text", "surface"],
      ["text", "canvas"],
      ["muted", "surface"],
      ["muted", "canvas"],
      ["on-primary", "primary"],
      ["accent", "accent-soft"],
      ...["danger", "success", "warning", "info"].map((x) => [x, x + "-soft"]),
    ])
      assert.ok(
        contrastRatio(c[fg], c[bg]) >= 4.5,
        `${name} ${fg}/${bg}: ${contrastRatio(c[fg], c[bg])}`,
      );
    assert.ok(contrastRatio(c["strong-border"], c.surface) >= 3);
  }
});
test("two six-hue palettes preserve neutral surfaces and readable accent roles", () => {
  assert.deepEqual(UI.palettePresets.map(p=>p.id), ["modern","playful"]);
  for (const palette of UI.palettePresets) {
    assert.equal(palette.families.length,6);
    assert.equal(new Set(palette.families.map(f=>f.id)).size,6);
    for (const family of palette.families) {
      assert.deepEqual(Object.keys(family.shades).map(Number),[100,300,500,700,900]);
      for (const color of Object.values(family.shades)) {
        assert.ok(contrastRatio(UI.paletteLabelColor(color),color)>=4.5,`${palette.id}/${family.id} swatch`);
      }
    }
    for (const mode of ["light", "dark"]) {
      const base = Object.fromEntries(Object.entries(tokens.semantic[mode]).map(([k,v]) => [k,resolve(v.$value)]));
      const c = { ...base, ...palette[mode] };
      for (const key of ["canvas","surface","raised","subtle","text","muted","border","strong-border","danger","success","warning","info"]) {
        assert.equal(c[key],base[key],`${palette.id}/${mode} must preserve ${key}`);
        assert.equal(UI.paletteVariables(palette.id,mode)[`--nds-${key}`],undefined);
      }
      for (const [fg,bg] of [["text","canvas"],["text","surface"],["muted","surface"],["muted","subtle"],["on-primary","primary"],["accent","accent-soft"],["accent","surface"]]) {
        assert.ok(contrastRatio(c[fg],c[bg]) >= 4.5, `${palette.id}/${mode} ${fg}/${bg}`);
      }
      assert.ok(contrastRatio(c.focus,c.surface)>=3, `${palette.id}/${mode} focus`);
    }
  }
});
test("table sorting is numeric, stable, reversible and does not mutate rows", () => {
  const rows = [
    { id: "a", n: 20 },
    { id: "b", n: 3 },
    { id: "c", n: 3 },
  ];
  const col = { key: "n", label: "수량", sortable: true };
  assert.deepEqual(
    UI.sortRows(rows, col, "asc").map((x) => x.id),
    ["b", "c", "a"],
  );
  assert.deepEqual(
    UI.sortRows(rows, col, "desc").map((x) => x.id),
    ["a", "b", "c"],
  );
  assert.equal(rows[0].id, "a");
});
test("calendar handles leap years, month boundaries and six complete weeks", () => {
  const days = UI.calendarCells("2024-02");
  assert.equal(days.length, 42);
  assert.equal(new Set(days).size, 42);
  assert.ok(days.includes("2024-02-29"));
  assert.equal(new Date(days[0] + "T00:00Z").getUTCDay(), 1);
  assert.ok(!UI.calendarCells("2023-02").includes("2023-02-29"));
});

test("calendar month keyboard movement clamps month end", () => {
  assert.equal(UI.shiftCalendarMonth("2024-01-31", 1), "2024-02-29");
  assert.equal(UI.shiftCalendarMonth("2023-03-31", -1), "2023-02-28");
  assert.equal(UI.shiftCalendarMonth("2026-12-31", 1), "2027-01-31");
});
