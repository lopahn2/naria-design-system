import data from '../data/motion.generated.json';
export const motionSamples=data.samples;
export type MotionSample=typeof motionSamples[number];
export const MOTION_STORAGE='naria:motion-picks:v1';
export function parseMotionPicks(value:unknown):string[]{
 if(!Array.isArray(value))throw new Error('선택 목록 형식이 올바르지 않아요.');
 const ids=new Set(motionSamples.map(s=>s.id));
 if(value.some(v=>typeof v!=='string'||!ids.has(v)))throw new Error('이 갤러리에 없는 모션이 포함되어 있어요.');
 return [...new Set(value as string[])];
}
export function motionDocument(sample:MotionSample,theme:'light'|'dark',reduced:boolean){
 const config={id:sample.id,theme,reduced};
 const credit=`\n<!-- ${sample.number}: ${sample.name}\nSource: ${sample.url}\n${data.notices.replace(/-->/g,'-- >')}\n-->`;
 const fontStyle=`<style>${data.fontCss}</style>`;
 const bootstrap=`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none';"><script>window.__NARIA_DEMO__=${JSON.stringify(config)};document.documentElement.dataset.theme=${JSON.stringify(theme)};document.documentElement.dataset.reduced=${JSON.stringify(String(reduced))};document.documentElement.classList.toggle('dark',${theme==='dark'});addEventListener('error',e=>parent.postMessage({type:'naria-motion:error',id:window.__NARIA_DEMO__.id,message:e.message},'*'));addEventListener('unhandledrejection',e=>parent.postMessage({type:'naria-motion:error',id:window.__NARIA_DEMO__.id,message:String(e.reason)},'*'));</script>`;
 const ready=`<script>requestAnimationFrame(()=>parent.postMessage({type:'naria-motion:ready',id:window.__NARIA_DEMO__.id},'*'));</script>`;
 if(sample.engine==='html')return sample.html.replace('<head>','<head><meta charset="utf-8">'+bootstrap+fontStyle).replace('</body>',ready+'</body>')+credit;
 return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${bootstrap}${fontStyle}<title>${sample.name}</title><style>${data.css}</style></head><body><div id="root"></div><script>${data.runtime.replace(/<\/script/gi,'<\\/script')}</script></body></html>`+credit;
}
export function downloadMotionFile(name:string,content:string,type:string){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
