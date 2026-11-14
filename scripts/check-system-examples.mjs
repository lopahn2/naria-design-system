import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
const api = JSON.parse(
  await fs.readFile("src/system/api.generated.json", "utf8"),
);
const folder = path.resolve(".example-check");
await fs.mkdir(folder, { recursive: true });
try {
  const names = [];
  for (const [id, data] of Object.entries(api)) {
    const name = path.join(folder, id + ".tsx");
    await fs.writeFile(name, data.code);
    names.push(name);
  }
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    baseUrl: process.cwd(),
    paths: { "@naria/ui": ["packages/ui/src/index.ts"] },
  };
  const program = ts.createProgram(names, options);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.length) {
    console.error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCurrentDirectory: () => process.cwd(),
        getCanonicalFileName: (f) => f,
        getNewLine: () => "\n",
      }),
    );
    process.exitCode = 1;
  } else
    console.log(`All ${names.length} downloadable TSX examples typecheck.`);
} finally {
  await fs.rm(folder, { recursive: true, force: true });
}
