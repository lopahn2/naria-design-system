import fs from "node:fs/promises";
import ts from "typescript";
const config = ts.readConfigFile("tsconfig.ui.json", ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, ".");
const program = ts.createProgram(parsed.fileNames, {
  ...parsed.options,
  noEmit: true,
});
const checker = program.getTypeChecker();
const source = program.getSourceFile("packages/ui/src/index.ts");
const symbol = checker.getSymbolAtLocation(source);
const exported = checker.getExportsOfModule(symbol);
const exportsMap = new Map(exported.map((x) => [x.name, x]));
const catalog = ts.createSourceFile(
  "catalog.ts",
  await fs.readFile("src/system/catalog.ts", "utf8"),
  ts.ScriptTarget.Latest,
  true,
);
let entries = [];
for (const st of catalog.statements)
  if (ts.isVariableStatement(st))
    for (const d of st.declarationList.declarations)
      if (d.name.getText(catalog) === "entries")
        entries = d.initializer.elements.map((x) =>
          x.elements.map((v) => v.text),
        );
const native = [
  "children",
  "disabled",
  "required",
  "readOnly",
  "autoComplete",
  "name",
  "type",
  "placeholder",
  "min",
  "max",
  "step",
  "maxLength",
  "onClick",
  "onChange",
  "value",
  "checked",
  "id",
  "className",
];
const demo = await fs.readFile("src/system/Demos.tsx", "utf8");
const ds = ts.createSourceFile(
  "Demos.tsx",
  demo,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const fn = ds.statements.find(
  (s) => ts.isFunctionDeclaration(s) && s.name.text === "ComponentDemo",
);
const sw = fn.body.statements.find(ts.isSwitchStatement);
const bindings = (node) => {
  if (ts.isIdentifier(node)) return [node.text];
  if (ts.isArrayBindingPattern(node) || ts.isObjectBindingPattern(node))
    return node.elements.flatMap((e) =>
      ts.isBindingElement(e) ? bindings(e.name) : [],
    );
  return [];
};
const vars = (statements) =>
  statements
    .filter(ts.isVariableStatement)
    .flatMap((s) =>
      s.declarationList.declarations.map((d) => ({
        node: d,
        names: bindings(d.name),
        code: "const " + d.getText(ds) + ";",
      })),
    );
const setupVars = vars(fn.body.statements.filter((s) => s.pos < sw.pos));
const headVars = vars(ds.statements.filter((s) => s.pos < fn.pos));
const namesIn = (node) => {
  const names = new Set();
  const visit = (n) => {
    if (ts.isIdentifier(n)) names.add(n.text);
    ts.forEachChild(n, visit);
  };
  visit(node);
  return names;
};
function exampleCode(id, body) {
  const used = namesIn(
    ts.createSourceFile(
      "case.tsx",
      body,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    ),
  );
  const selected = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const variable of [...setupVars, ...headVars])
      if (!selected.has(variable) && variable.names.some((n) => used.has(n))) {
        selected.add(variable);
        for (const name of namesIn(variable.node)) used.add(name);
        changed = true;
      }
  }
  const imports = ds.statements
    .filter(ts.isImportDeclaration)
    .map((s) => s.getText(ds))
    .join("\n")
    .replace(/(['"])\.\.\/\.\.\/packages\/ui\/src\1/, "'@naria/ui'");
  const types = ds.statements
    .filter(ts.isTypeAliasDeclaration)
    .filter((s) => s.name.text === "DemoState")
    .map((s) => s.getText(ds).replace("export ", ""))
    .join("\n");
  const head = headVars
    .filter((v) => selected.has(v))
    .map((v) => v.code)
    .join("\n");
  const setup = setupVars
    .filter((v) => selected.has(v))
    .map((v) => v.code)
    .join("\n");
  const declarations = [
    used.has("id") ? `const id:string=${JSON.stringify(id)};` : "",
    used.has("state") ? "const [state]=useState<DemoState>('default');" : "",
    used.has("size") ? "const size:UI.Size='md';" : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `${imports}\n${types}\n${head}\nexport function Example(){\n${declarations}\n${setup}\n${body}\n}\n`;
}
const api = {};
for (const [id, name] of entries) {
  const e = exportsMap.get(name);
  if (!e) throw Error("Missing export: " + name);
  const type = checker.getTypeOfSymbolAtLocation(e, source);
  const sig = type.getCallSignatures()[0];
  const param = sig?.parameters[0];
  const props = param
    ? checker.getTypeOfSymbolAtLocation(param, source)
    : undefined;
  const fields = props
    ? checker
        .getPropertiesOfType(props)
        .filter((p) => !p.name.startsWith("aria-"))
        .filter((p) => {
          const f = p.declarations?.[0]?.getSourceFile().fileName || "";
          return !f.includes("node_modules") || native.includes(p.name);
        })
        .slice(0, 24)
        .map((p) => ({
          name: p.name,
          required: !(p.flags & ts.SymbolFlags.Optional),
          type: checker
            .typeToString(
              checker.getTypeOfSymbolAtLocation(
                p,
                p.declarations?.[0] || source,
              ),
              undefined,
              ts.TypeFormatFlags.NoTruncation,
            )
            .slice(0, 300),
        }))
    : [];
  let clause = sw.caseBlock.clauses.findIndex(
    (c) => ts.isCaseClause(c) && c.expression.text === id,
  );
  while (
    clause >= 0 &&
    clause < sw.caseBlock.clauses.length &&
    !sw.caseBlock.clauses[clause].statements.length
  )
    clause++;
  const body =
    clause >= 0
      ? sw.caseBlock.clauses[clause].statements
          .map((s) => s.getText(ds))
          .join("\n")
      : "";
  if (!body) throw Error("Missing demo: " + id);
  api[id] = {
    exportName: name,
    props: fields,
    code: exampleCode(id, body),
  };
}
await fs.writeFile("src/system/api.generated.json", JSON.stringify(api));
console.log(
  `${entries.length} documented component exports and runnable examples`,
);
