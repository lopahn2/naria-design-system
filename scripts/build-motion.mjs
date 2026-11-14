import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {build} from 'esbuild';
import {compile} from 'tailwindcss';
import {thirdPartyNotices} from './notices.mjs';

const root=process.cwd();
const manifest=JSON.parse(await fs.readFile('references/motion-source-manifest.json','utf8'));
if(manifest.length!==82||new Set(manifest.map(x=>x.id)).size!==82)throw Error('Expected 82 distinct source items');
export function withoutPurple(text){
  return text.replace(/\b(purple|violet|fuchsia|indigo)(?=-\d)/g,'teal').replace(/#[\da-fA-F]{6}(?![\da-fA-F])/g,hex=>{
    const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255),max=Math.max(...rgb),min=Math.min(...rgb),d=max-min;
    if(d<.06)return hex;
    let h=(max===rgb[0]?(rgb[1]-rgb[2])/d+(rgb[1]<rgb[2]?6:0):max===rgb[1]?(rgb[2]-rgb[0])/d+2:(rgb[0]-rgb[1])/d+4)*60;
    if(h<235||h>325)return hex;
    const x=d*(1-Math.abs((185/60)%2-1));
    return '#'+[0,x,d].map(v=>Math.round((v+min)*255).toString(16).padStart(2,'0')).join('');
  }).replace(/oklch\(([^()]*?)\s(2[5-9]\d(?:\.\d+)?|3[0-2]\d(?:\.\d+)?)(\s*[/)][^;]*)/g,(_m,a,_h,b)=>`oklch(${a} 185${b}`);
}
const escapeScript=t=>t.replace(/<\/script/gi,'<\\/script');
// The original source is kept unchanged under references/. Adapted copies are built here.
for(const item of manifest.filter(x=>x.source!=='DesignBookmark')){
 const json=JSON.parse(await fs.readFile(`references/motion-originals/${item.id}.json`,'utf8'));
 await fs.writeFile(`motion/vendor/${item.id}.tsx`,withoutPurple(json.files[0].content.replace('"../ai-core"','"./smooth-ai-core"')));
}
const sources=await Promise.all((await fs.readdir('motion/vendor')).filter(f=>f.endsWith('.tsx')).map(f=>fs.readFile(`motion/vendor/${f}`,'utf8')));
sources.push(await fs.readFile('motion/entry.tsx','utf8'),await fs.readFile('motion/primitives.tsx','utf8'));
const candidates=[...new Set(sources.flatMap(t=>[...t.matchAll(/["'`]([^"'`]+)["'`]/g)].flatMap(m=>m[1].split(/\s+/))))];
const tw=await compile(await fs.readFile('motion/demo.css','utf8'),{base:root,loadStylesheet:async(id,base)=>{
 const file=id==='tailwindcss'?path.resolve('node_modules/tailwindcss/index.css'):path.resolve(base,id);
 return {path:file,base:path.dirname(file),content:await fs.readFile(file,'utf8')};
}});
const css=tw.build(candidates);
const bundle=await build({entryPoints:['motion/entry.tsx'],bundle:true,write:false,minify:true,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},alias:{'@/lib/utils':path.join(root,'motion/utils.ts'),'@/components/ui/button':path.join(root,'motion/primitives.tsx'),'@/components/ui/card':path.join(root,'motion/primitives.tsx')},legalComments:'inline'});
const runtime=bundle.outputFiles[0].text;
const names={Buttons:'버튼',Inputs:'입력',Navigation:'탐색',Cards:'카드',AI:'AI',Text:'텍스트'};
const help={
 'plan-switch':'Monthly / Yearly를 전환하고 가격·혜택·버튼 변화를 확인하세요.', 'letter-limit':'텍스트를 입력해 남은 글자 수와 한도 근처의 반응을 확인하세요.',
 'pull-cord':'전등 줄을 아래로 당겼다 놓아 보세요.', 'morph-tooltip':'도구 위에 포인터를 옮기거나 버튼에 포커스를 주세요.', 'spring-dropdown':'선택 메뉴를 열고 항목을 바꿔 보세요.', 'file-drop':'파일을 끌어 놓거나 샘플의 파일 버튼을 눌러 보세요.',
 'morph-island':'알림 영역을 눌러 크기와 내용이 이어지는 전환을 확인하세요.', 'goo-menu':'＋를 눌러 액션을 펼치고 항목을 선택하세요.', 'jelly-slider':'슬라이더를 좌우로 드래그하세요.',
 'hold-button':'버튼을 길게 누르세요. 중간에 놓았을 때의 복귀도 비교하세요.', 'swipe-deck':'맨 위 카드를 좌우로 밀어 보세요.', 'springy-input':'이메일을 입력하고 확인 버튼을 누르세요.',
 'rubber-dock':'탭을 전환하고 선택 표시가 늘어나는 모습을 확인하세요.', 'parallax-ticket':'티켓을 기울이거나 눌러 앞뒷면을 전환하세요.', 'glass-lens':'포인터를 움직이거나 드래그해 확대 렌즈를 옮기세요.',
 'pull-refresh':'목록을 아래로 당겼다가 놓아 새로고침을 확인하세요.', 'word-roll':'단어가 세로로 교체되는 타이밍과 높이를 비교하세요.', 'weight-wave':'글자의 굵기가 순서대로 변하는 모습을 확인하세요.',
 'goo-morph':'텍스트가 연결되며 바뀌는 형태를 확인하세요.', 'scramble-text':'문자가 섞였다가 정렬되는 전환을 확인하세요.', 'read-along':'단어별 강조가 읽는 순서대로 이동합니다.', 'roll-links':'링크 위에 포인터를 올리거나 포커스를 주세요.',
 'prompt-box':'프롬프트를 입력하고 전송 상태를 확인하세요.', 'streaming-reply':'답변이 순서대로 나타나는 속도와 흐름을 확인하세요.', 'ghost-suggestion':'제안된 텍스트를 확인하고 입력을 이어가세요.', 'goo-thinking':'로딩 요소가 합쳐지고 분리되는 움직임을 확인하세요.',
 'expand-card':'카드를 눌러 상세 정보를 펼쳐 보세요.', 'fan-cards':'카드 위에 포인터를 옮기거나 눌러 펼쳐 보세요.', 'stat-card':'숫자와 차트의 변화가 어떻게 이어지는지 확인하세요.', 'profile-card':'프로필 위에 포인터를 올리거나 버튼을 눌러 보세요.',
 'magnetic-button':'버튼 가까이 포인터를 움직여 끌림을 확인하세요.', 'loading-success':'버튼을 눌러 처리 중에서 성공까지 전환을 확인하세요.', 'copy-button':'복사 버튼의 상태 전환을 확인하세요.', 'like-burst':'좋아요를 누르고 다시 취소해 보세요.',
 'tab-pill':'다른 탭을 눌러 선택 표시의 이동을 확인하세요.', 'bottom-bar':'하단 메뉴를 눌러 아이콘과 라벨의 반응을 확인하세요.', 'dynamic-menu':'메뉴를 펼치고 항목 사이를 이동하세요.', 'segmented-control':'보기 옵션을 바꿔 선택 배경과 콘텐츠를 비교하세요.',
 'sidebar-collapse':'사이드바를 접고 펼쳐 보세요.', 'pagination-dots':'점을 눌러 페이지와 선택 표시를 전환하세요.', 'command-palette':'명령 검색을 열고 검색어나 항목을 선택하세요.', 'step-progress':'단계를 진행하고 이전 단계로 돌아가 보세요.',
 'otp-code':'숫자를 입력해 칸 이동과 완료 반응을 확인하세요.', 'toggle-switch':'스위치를 켜고 꺼 보세요.', 'star-rating':'별점을 선택하고 다른 점수로 바꿔 보세요.', 'tag-input':'태그를 입력하고 Enter로 추가하거나 삭제하세요.',
 'number-stepper':'＋ / −를 눌러 숫자 변화와 눌림을 확인하세요.', 'range-slider':'핸들을 끌어 값과 말풍선의 반응을 확인하세요.', 'password-strength':'데모 문자열을 입력해 강도 표시를 비교하세요.', 'checkbox-list':'항목을 체크하고 취소해 보세요.',
 'detent-dial':'다이얼을 돌리거나 방향키로 값을 바꾸세요.', 'siri-orb':'아래 상태 버튼으로 대기·듣기·처리 중·완료를 비교하세요.', 'ai-loading':'진행 중인 단계를 펼쳐 세부 내용을 확인하세요.', 'exposure-slider':'눈금을 좌우로 드래그해 노출 값을 바꾸세요.',
 'boarding-pass':'탑승권을 펼치고 게이트·시간이 바뀌는 데모를 확인하세요.', 'marker-text':'강조선이 그려진 뒤 Replay로 다시 재생하세요.', 'smooth-tab':'탭을 누르거나 콘텐츠를 좌우로 밀어 보세요.',
 'unlock-face-id':'스캔 버튼을 눌러 잠금 해제 모션을 확인하세요. 카메라는 사용하지 않습니다.', 'slide-to-confirm':'핸들을 끝까지 밀어 확인하세요. 키보드로도 실행할 수 있어요.', 'notification-stack':'알림 묶음을 펼치고 항목을 닫아 보세요.',
 'wheel-picker':'시간 휠을 위아래로 밀거나 방향키를 사용하세요.', 'dynamic-text':'공통 글자가 이동하며 다음 단어로 바뀝니다.', 'ai-voice':'녹음·미리 듣기·전송 화면을 체험하세요. 실제 마이크나 오디오는 사용하지 않습니다.',
 'ai-tool-approval':'Allow 또는 Deny를 눌러 승인 흐름을 비교하세요. 실제 도구는 실행되지 않습니다.', 'toolbar':'도구를 바꾸고 손잡이로 툴바 위치를 옮겨 보세요.', 'scrubber':'값을 좌우로 드래그하거나 방향키로 조절하세요.',
 'cart-button':'상품을 담고 수량을 늘리거나 줄여 보세요.', 'page-flip':'페이지 모서리를 잡아 넘기거나 화살표 버튼을 사용하세요.', 'signature-pad':'펜이나 손가락으로 그린 뒤 되돌리기·지우기를 확인하세요.',
 'undo-button':'보관하기를 누른 뒤 제한 시간 안에 Undo를 눌러 보세요.', 'card-field':'Use test card로 가짜 카드 정보를 채워 전환을 확인하세요. 실제 결제는 없습니다.',
 'stack-panel':'설정 항목을 열고 뒤로 돌아가 보세요.', 'type-writer':'입력·삭제·다시 입력하는 리듬을 확인하세요.', 'ai-text-loading':'처리 문구와 경과 시간이 함께 변화합니다.', 'liquid-glass-card':'재생·다음 곡·진행 막대를 조작하세요. 소리가 없는 시각 데모입니다.',
 'bell-button':'알림 버튼을 눌러 종과 숫자 변화를 확인하세요.', 'morph-popover':'의견 버튼을 열고 데모 메시지를 입력해 전송 전환을 확인하세요.', 'ai-task-list':'자동 진행을 보거나 다음 단계 버튼을 누르세요.',
 'music-toggle':'재생 버튼과 진행 링을 조작하세요. 소리가 없는 시각 데모입니다.', 'command-button':'버튼을 누르거나 샘플 안에서 ⌘/Ctrl + K를 누르세요.'
};
const samples=[];
for(const [index,item] of manifest.entries()){
 let html='';
 if(item.source==='DesignBookmark'&&item.id!=='db-command-button'){
  html=await fs.readFile(`references/motion-originals/${item.id}.html`,'utf8');
  html=html.replace(/<link[^>]*href="https?:[^>]*>/g,'');
  for(const match of [...html.matchAll(/<link[^>]*href="([^"]+\.css)"[^>]*>/g)]){
   const asset=new URL(match[1],item.url).pathname.replace('/motion-src/','');
   const styles=await fs.readFile(`references/motion-assets/${asset}`,'utf8');
   html=html.replace(match[0],()=>`<style>${withoutPurple(styles)}</style>`);
  }
  // Replace scripts with reviewed, local source. No external calls are needed at runtime.
  for(const match of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]){
   const asset=new URL(match[1],item.url).pathname.replace('/motion-src/','');
   let code=await fs.readFile(`references/motion-assets/${asset}`,'utf8');
   if(asset==='shared/motion.js')code=code.replace("matchMedia('(prefers-reduced-motion: reduce)').matches","(window.__NARIA_DEMO__.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches)").replace("const step = (s, dt) => {", "const step = (s, dt) => { if(reduce){s.x=s.t;s.v=0;return;}").replace("try { setTheme(localStorage.getItem('ms-theme')); } catch { setTheme('dark'); }","setTheme(window.__NARIA_DEMO__.theme);");
   html=html.replace(match[0],()=>`<script>${escapeScript(withoutPurple(code))}</script>`);
  }
  html=html.replace('</head>','<style>.badge{display:none}html,body{min-height:100%;height:100%}button:focus-visible,input:focus-visible,[tabindex]:focus-visible{outline:2px solid #189ca8!important;outline-offset:3px}html[data-reduced=true] *,html[data-reduced=true] *::before,html[data-reduced=true] *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}</style></head>');
 }
 samples.push({...item,number:`M${String(index+1).padStart(2,'0')}`,categoryLabel:names[item.category],hint:help[item.id.replace(/^db-/,'')]||'샘플을 직접 조작해 보세요.',engine:html?'html':'react',html});
}
const font=await fs.readFile('references/Inter-variable.woff2');
if(font.subarray(0,4).toString()!=='wOF2')throw Error('Expected WOFF2 variable font');
const fontCss=`@font-face{font-family:Inter;src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');font-weight:100 900;font-style:normal;font-display:swap}`;
const output={version:1,checkedAt:'2026-11-14',source:'https://designbookmark.com/motion',runtime,css,fontCss,notices:await thirdPartyNotices(),samples};
await fs.mkdir('src/data',{recursive:true});
await fs.writeFile('src/data/motion.generated.json',JSON.stringify(output));
await fs.writeFile('references/motion-integrity.json',JSON.stringify(await Promise.all(manifest.map(async x=>({id:x.id,sha256:crypto.createHash('sha256').update(await fs.readFile(`references/motion-originals/${x.id}${x.id==='db-command-button'?'.tsx':x.source==='DesignBookmark'?'.html':'.json'}`)).digest('hex')}))),null,2));
console.log(`Motion: ${samples.length} samples, ${(JSON.stringify(output).length/1024/1024).toFixed(2)} MiB; React runtime ${(runtime.length/1024).toFixed(0)} KiB`);

