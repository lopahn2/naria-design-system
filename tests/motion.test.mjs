import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {build} from 'esbuild';
const result=await build({entryPoints:['src/lib/motion.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {motionSamples,motionDocument,parseMotionPicks}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
test('all 82 source entries have unique matching runnable samples',async()=>{
 const manifest=JSON.parse(await fs.readFile('references/motion-source-manifest.json','utf8'));
 assert.equal(motionSamples.length,82);assert.equal(new Set(motionSamples.map(s=>s.id)).size,82);
 assert.deepEqual(motionSamples.map(s=>s.id),manifest.map(s=>s.id));
 assert.equal(motionSamples.filter(s=>s.engine==='html').length,50);
 assert.equal(motionSamples.filter(s=>s.engine==='react').length,32);
});
test('standalone sample documents have parseable scripts and no external script or stylesheet dependency',()=>{
 for(const sample of motionSamples){const html=motionDocument(sample,'light',false);
  assert.ok(html.includes("connect-src 'none'"));
  assert.ok(html.slice(0,1024).includes('charset="utf-8"'),sample.id);
  assert.ok(html.includes('data:font/woff2;base64,'),sample.id);
  assert.ok(html.includes(`Source: ${sample.url}`),sample.id);
  assert.ok(html.includes('Third-party notices'),sample.id);
  assert.ok(!/<script[^>]+src=|<link[^>]+rel="stylesheet"/.test(html),sample.id);
  for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))assert.doesNotThrow(()=>new vm.Script(m[1]),sample.id);
 }
});
test('motion selections round trip, deduplicate, and reject invalid input',()=>{
 const selected=motionSamples.slice(0,4).map(s=>s.id);
 assert.deepEqual(parseMotionPicks(JSON.parse(JSON.stringify(selected))),selected);
 assert.deepEqual(parseMotionPicks([...selected,...selected]),selected);
 for(const x of [{},null,['unknown'],[null],[10]])assert.throws(()=>parseMotionPicks(x));
});
