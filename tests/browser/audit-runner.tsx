import React from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import axe from 'axe-core';
import * as UI from '../../packages/ui/src';
import {ComponentDemo} from '../../src/system/Demos';
import {PatternDemo} from '../../src/system/Patterns';
import {components,patterns} from '../../src/system/catalog';
import '../../packages/ui/src/styles.css';
import '../../src/system/system.css';
const stage=document.querySelector('#stage')!;const root=createRoot(stage);const results:any[]=[];
const cases=[...components.map(x=>({id:x.id,pattern:false})),...patterns.map(x=>({id:x.id,pattern:true}))];
const status=document.querySelector('#status')!, summary=document.querySelector('#summary')!, output=document.querySelector('#results')!;
document.querySelector('#download')!.addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(results,null,2)],{type:'application/json'}));a.download='naria-accessibility-audit.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
async function run(){for(const theme of ['light','dark'] as const)for(const c of cases){
 flushSync(()=>root.render(<UI.NariaProvider theme={theme}><UI.ToastProvider><div key={theme+c.id}>{c.pattern?<PatternDemo id={c.id}/>:<ComponentDemo id={c.id}/>}</div></UI.ToastProvider></UI.NariaProvider>));
 await document.fonts.ready; await new Promise(r=>setTimeout(r,50));
 const r=await axe.run(stage,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});
 results.push({id:c.id,pattern:c.pattern,theme,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,target:n.target,summary:n.failureSummary}))}))});
 status.textContent=`${results.length}/${cases.length*2} 검사`;
 }
 const failures=results.filter(r=>r.violations.length);status.textContent=`${results.length}건 검사 · ${failures.length}건 발견`;status.setAttribute('data-complete','true');summary.textContent=JSON.stringify(failures,null,2);output.textContent=JSON.stringify(results);}
run().catch(e=>{status.textContent='검사 실패: '+e.message;console.error(e)});
