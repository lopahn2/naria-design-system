import fs from 'node:fs/promises';
import path from 'node:path';
import {thirdPartyNotices} from './notices.mjs';
const html=await fs.readFile('dist/index.html','utf8');
let output=html;
for(const match of html.matchAll(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g)){
  const js=await fs.readFile(path.join('dist',match[1]),'utf8');
  output=output.replace(match[0],()=>`<script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`);
}
for(const match of html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)){
  const css=await fs.readFile(path.join('dist',match[1]),'utf8');
  output=output.replace(match[0],()=>`<style>${css}</style>`);
}
const notice=await thirdPartyNotices();
await fs.mkdir('deliverables',{recursive:true});
await fs.writeFile('THIRD_PARTY_NOTICES.md',notice);
output+=`\n<!-- Third-party notices\n${notice.replace(/-->/g,'-- >')}\n-->`;
for(const [name,hash] of [['naria-design-system','system'],['naria-design-atlas','all'],['naria-motion-gallery','motion-lab']]){
 const page=output.replace('<head>',`<head><script>if(!location.hash)location.hash="${hash}";</script>`);
 await fs.writeFile(`deliverables/${name}.html`,page);
 await fs.writeFile(`dist/${name}.html`,page);
}
console.log('Standalone HTML: system + atlas + motion gallery');
