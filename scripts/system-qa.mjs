import fs from "node:fs/promises";
import { build } from "esbuild";
const api = JSON.parse(
  await fs.readFile("src/system/api.generated.json", "utf8"),
);
const source = `import React from 'react';import {createRoot} from 'react-dom/client';import {flushSync} from 'react-dom';import * as UI from '../../packages/ui/src';import {ComponentDemo} from '../../src/system/Demos';import {PatternDemo} from '../../src/system/Patterns';import '../../packages/ui/src/styles.css';import '../../src/system/system.css';
const root=createRoot(document.getElementById('app'));const ids=${JSON.stringify(Object.keys(api))};const results=[];let errors=[];window.addEventListener('error',e=>errors.push(e.message));window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason)));const oldError=console.error;console.error=(...a)=>{errors.push(a.join(' '));oldError(...a)};
class Boundary extends React.Component{state={error:false};static getDerivedStateFromError(){return {error:true}}componentDidCatch(e){errors.push(e.message)}render(){return this.state.error?<div>Render error</div>:this.props.children}}
const pause=()=>new Promise(r=>setTimeout(r,25));
async function run(){for(const theme of ['light','dark']){for(const id of ids){errors=[];flushSync(()=>root.render(<UI.NariaProvider theme={theme}><UI.ToastProvider><Boundary key={theme+id}><ComponentDemo id={id}/></Boundary></UI.ToastProvider></UI.NariaProvider>));await pause();results.push({id,theme,errors:[...errors]});document.getElementById('status').textContent=results.length+'/152 checked';}}document.getElementById('result').textContent=JSON.stringify(results.filter(x=>x.errors.length));document.getElementById('status').textContent=results.length+'/152 checked · '+results.filter(x=>x.errors.length).length+' failed';document.getElementById('status').dataset.complete='true'}run();`;
await fs.mkdir("node_modules/.cache", { recursive: true });
await fs.writeFile(
  "node_modules/.cache/system-qa.tsx",
  source
    .replaceAll("../../packages", "../../packages")
    .replaceAll("../../src", "../../src"),
);
// Resolve imports from the project root using stdin rather than the scratch file location.
await build({
  stdin: {
    contents: source
      .replaceAll("../../packages", "./packages")
      .replaceAll("../../src", "./src"),
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  bundle: true,
  jsx: "automatic",
  format: "iife",
  outfile: "dist/system-qa.js",
});
await fs.writeFile(
  "dist/system-check.html",
  '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>System render QA</title><link rel="stylesheet" href="system-qa.css"><h1 id="status">Starting</h1><pre id="result"></pre><div id="app" style="max-width:700px;padding:24px"></div><script src="system-qa.js"></script></html>',
);
await fs.writeFile(
  "dist/responsive-check.html",
  `<!doctype html><html lang="ko"><meta charset="utf-8"><title>Responsive QA</title><style>body{font:14px system-ui;background:#eef1f2;margin:0;padding:16px}header{display:flex;gap:16px;padding:12px}iframe{height:780px;border:1px solid #9ba5aa;background:white;max-width:none}select{font:inherit;padding:8px}</style><header><label>Viewport <select id="width"><option>320</option><option selected>390</option><option>768</option><option>1440</option></select></label><label>Route <select id="route"><option value="system">Overview</option>${Object.keys(
    api,
  )
    .map((id) => `<option value="components/${id}">${id}</option>`)
    .join(
      "",
    )}${["onboarding", "settings", "search", "workspace", "checkout", "dashboard"].map((id) => `<option value="patterns/${id}">${id} pattern</option>`).join("")}</select></label></header><iframe title="Responsive preview" style="width:390px" src="index.html#system"></iframe><script>const frame=document.querySelector('iframe');document.querySelector('#width').onchange=e=>frame.style.width=e.target.value+'px';document.querySelector('#route').onchange=e=>frame.src='index.html#'+e.target.value;</script></html>`,
);
console.log("QA: /system-check.html and /responsive-check.html");
