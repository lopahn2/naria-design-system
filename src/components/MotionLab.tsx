import {useEffect,useMemo,useRef,useState} from 'react';
import {Play,Pause,RotateCcw,Maximize2,Bookmark,ArrowUpRight,Download,ChevronLeft,ChevronRight,Activity,Upload,Check} from 'lucide-react';
import {Dialog} from './ui';
import {downloadMotionFile,motionDocument,motionSamples,MOTION_STORAGE,parseMotionPicks,type MotionSample} from '../lib/motion';
import '../styles/motion.css';

const groups=['전체','Buttons','Inputs','Navigation','Cards','AI','Text'] as const;
const groupNames:Record<string,string>={전체:'전체',Buttons:'버튼',Inputs:'입력',Navigation:'탐색',Cards:'카드',AI:'AI',Text:'텍스트'};
const PAGE_SIZE=12;
function initialPicks(){try{return parseMotionPicks(JSON.parse(localStorage.getItem(MOTION_STORAGE)||'[]'));}catch{return [];}}

function MotionFrame({sample,theme,reduced,run,revision,large=false}:{sample:MotionSample;theme:'light'|'dark';reduced:boolean;run:boolean;revision:number;large?:boolean}){
 const host=useRef<HTMLDivElement>(null),frame=useRef<HTMLIFrameElement>(null);
 const[inView,setInView]=useState(false),[state,setState]=useState('loading');
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting),{threshold:.05});if(host.current)observer.observe(host.current);return()=>observer.disconnect()},[]);
 const html=useMemo(()=>motionDocument(sample,theme,reduced),[sample,theme,reduced]);
 const mounted=run&&inView;
 useEffect(()=>{setState('loading')},[mounted,revision,html]);
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.source!==frame.current?.contentWindow||event.data?.id!==sample.id)return;if(event.data.type==='naria-motion:ready')setState(s=>s.startsWith('error:')?s:'ready');if(event.data.type==='naria-motion:error')setState('error:'+event.data.message);};window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive)},[sample.id]);
 return <div ref={host} className={`motion-stage ${large?'is-large':''}`} data-demo-state={mounted?state:'stopped'} data-demo-id={sample.id}>
  {mounted?<><iframe ref={frame} key={`${sample.id}-${revision}`} title={`${sample.name} · ${sample.source} 모션 샘플`} srcDoc={html} sandbox="allow-scripts" allow="camera 'none'; microphone 'none'; geolocation 'none'"/><span className={`motion-ready ${state==='ready'?'ready':''}`} aria-label={state==='ready'?'샘플 실행 중':'샘플 불러오는 중'}/>{state.startsWith('error:')&&<p className="motion-error" role="alert">샘플 실행 오류 · 다시 시작을 눌러 주세요.<small>{state.slice(6)}</small></p>}</>:<div className="motion-idle"><span className="motion-number">{sample.number}</span><Activity size={24} strokeWidth={1.2}/><strong>{sample.name}</strong><span>{run?'화면에 보이면 실행해요':'재생 버튼을 눌러 체험하세요'}</span></div>}
 </div>;
}
function MotionCard({sample,theme,reduced,autoplay,picked,onPick,onExpand}:{sample:MotionSample;theme:'light'|'dark';reduced:boolean;autoplay:boolean;picked:boolean;onPick:()=>void;onExpand:()=>void}){
 const[manual,setManual]=useState<boolean|null>(null),[revision,setRevision]=useState(0);
 useEffect(()=>setManual(null),[autoplay,reduced]);
 const run=manual??autoplay;
 return <article className={`motion-card ${picked?'motion-picked':''}`}>
  <div className="motion-card-heading"><span>{sample.number} <i/> {sample.categoryLabel}</span><button type="button" aria-label={`${sample.name} ${sample.source} ${picked?'선택 취소':'즐겨찾기'}`} aria-pressed={picked} onClick={onPick}>{picked?<Check size={17}/>:<Bookmark size={17}/>}</button></div>
  <MotionFrame sample={sample} theme={theme} reduced={reduced} run={run} revision={revision}/>
  <div className="motion-card-info"><div className="motion-title"><h2>{sample.name}</h2><small>{sample.source}</small></div><p>{sample.hint}</p>
   <div className="motion-card-controls"><button type="button" onClick={()=>setManual(!run)} aria-label={`${sample.number} ${run?'정지':'재생'}`}>{run?<Pause size={14}/>:<Play size={14}/>}<span>{run?'정지':'재생'}</span></button><button type="button" aria-label={`${sample.number} 다시 시작`} onClick={()=>{setRevision(v=>v+1);setManual(true)}}><RotateCcw size={14}/></button><button type="button" onClick={onExpand} aria-label={`${sample.number} 크게 보기`}><Maximize2 size={14}/></button><a href={sample.url} target="_blank" rel="noreferrer" aria-label={`${sample.name} ${sample.source} 원본 열기`}>원본<ArrowUpRight size={13}/></a></div>
  </div>
 </article>;
}
export function MotionLab({query,theme,forceReduced=false}:{query:string;theme:'light'|'dark';forceReduced?:boolean}){
 const[group,setGroup]=useState('전체'),[source,setSource]=useState('전체'),[savedOnly,setSavedOnly]=useState(false),[page,setPage]=useState(0),[picks,setPicks]=useState(initialPicks),[notice,setNotice]=useState('');
 const[reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),[autoplay,setAutoplay]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches);
 const[expanded,setExpanded]=useState<MotionSample|null>(null),[largeRevision,setLargeRevision]=useState(0),[largeRun,setLargeRun]=useState(true);
 const motionReduced=reduced||forceReduced;
 useEffect(()=>{if(forceReduced)setAutoplay(false)},[forceReduced]);
 const file=useRef<HTMLInputElement>(null),anchor=useRef<HTMLDivElement>(null),firstSave=useRef(true);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{setReduced(media.matches);if(media.matches)setAutoplay(false)};media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 useEffect(()=>{if(firstSave.current){firstSave.current=false;return}try{localStorage.setItem(MOTION_STORAGE,JSON.stringify(picks))}catch{setNotice('자동 저장을 사용할 수 없어요. 선택을 JSON으로 내보내 주세요.')}},[picks]);
 useEffect(()=>setPage(0),[group,source,query,savedOnly]);
 const list=motionSamples.filter(s=>(group==='전체'||s.category===group)&&(source==='전체'||s.source===source)&&(!savedOnly||picks.includes(s.id))&&(!query||[s.name,s.id,s.number,s.source,s.categoryLabel,s.hint].join(' ').toLowerCase().includes(query.toLowerCase())));
 const pages=Math.max(1,Math.ceil(list.length/PAGE_SIZE)),current=Math.min(page,pages-1),visible=list.slice(current*PAGE_SIZE,(current+1)*PAGE_SIZE);
 const toggle=(id:string)=>setPicks(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
 const navigate=(p:number)=>{setPage(p);anchor.current?.scrollIntoView({block:'start'})};
 const exportPicks=()=>downloadMotionFile('naria-motion-selections.json',JSON.stringify({schemaVersion:1,project:'naria-cloud',kind:'motion',source:'https://designbookmark.com/motion',selections:picks.map(id=>{const s=motionSamples.find(s=>s.id===id)!;return {id,name:s.name,source:s.source,url:s.url}})},null,2),'application/json');
 const importPicks=async(f?:File)=>{if(!f)return;try{if(f.size>100000)throw Error('100KB 이하의 선택 파일을 사용해 주세요.');const d=JSON.parse(await f.text());if(d.schemaVersion!==1||d.kind!=='motion'||!Array.isArray(d.selections))throw Error('모션 선택 JSON 파일을 사용해 주세요.');const incoming=parseMotionPicks(d.selections.map((s:{id?:string})=>s?.id));setPicks(p=>[...new Set([...p,...incoming])]);setNotice(`${incoming.length}개 선택을 기존 목록과 합쳤어요.`)}catch(e){setNotice(e instanceof Error?e.message:'선택 파일을 확인해 주세요.')}finally{if(file.current)file.current.value=''}};
 return <section className="motion-lab">
  <div className="motion-intro"><div><span className="motion-eyebrow">MOTION COLLECTION / 001—082</span><h2>직접 움직여 보고,<br/>마음에 드는 반응을 골라요.</h2><p>버튼의 짧은 반응부터 카드와 텍스트의 전환까지.<br/>DesignBookmark에 소개된 82개 예제를 한곳에 담았습니다.</p></div><div className="motion-total"><b>82<span>motions</span></b><p>6가지 분류 · 3개 출처<br/>확인일 2026.11.14</p></div></div>
  <div className="motion-toolbar" ref={anchor}><div className="motion-switches"><label><input type="checkbox" checked={autoplay} onChange={e=>setAutoplay(e.target.checked)}/>보이는 샘플 자동 재생</label><label><input type="checkbox" checked={motionReduced} disabled={forceReduced} onChange={e=>{setReduced(e.target.checked);if(e.target.checked)setAutoplay(false)}}/>모션 줄이기</label></div><div className="motion-tools"><button type="button" onClick={exportPicks} disabled={!picks.length}><Download size={14}/>선택 내보내기</button><button type="button" onClick={()=>file.current?.click()}><Upload size={14}/>불러오기</button><input ref={file} type="file" accept=".json" className="sr-only" aria-label="모션 선택 파일" onChange={e=>void importPicks(e.target.files?.[0])}/></div></div>
  <div className="motion-filters"><div className="filter-chips" aria-label="모션 분류">{groups.map(g=><button type="button" key={g} className={`filter-chip ${group===g?'active':''}`} aria-pressed={group===g} onClick={()=>setGroup(g)}>{groupNames[g]}<small>{motionSamples.filter(s=>g==='전체'||s.category===g).length}</small></button>)}<button type="button" className={`filter-chip ${savedOnly?'active':''}`} aria-pressed={savedOnly} onClick={()=>setSavedOnly(!savedOnly)}><Bookmark size={12}/>선택 {picks.length}</button></div><label className="motion-source">출처<select value={source} onChange={e=>setSource(e.target.value)}>{['전체','DesignBookmark','Kokonut UI','SmoothUI'].map(s=><option key={s}>{s}</option>)}</select></label></div>
  {notice&&<div className="notice" role="status">{notice}<button type="button" onClick={()=>setNotice('')}>닫기</button></div>}
  {motionReduced&&<p className="motion-hint">자동 재생을 끄고, 가능한 전환을 단순화합니다. 원본의 일부 반복·직접 조작 모션은 남을 수 있어요. 각 샘플의 정지 버튼으로 언제든 멈출 수 있습니다.</p>}
  <div className="motion-result"><span>{list.length}개 중 {list.length?current*PAGE_SIZE+1:0}–{Math.min((current+1)*PAGE_SIZE,list.length)}</span><span>선택은 이 브라우저에 저장 · 기기 이동은 JSON으로</span></div>
  {list.length?<div className="motion-grid">{visible.map(s=><MotionCard key={s.id} sample={s} theme={theme} reduced={motionReduced} autoplay={autoplay&&!expanded} picked={picks.includes(s.id)} onPick={()=>toggle(s.id)} onExpand={()=>{setExpanded(s);setLargeRevision(0);setLargeRun(true)}}/>)}</div>:<div className="empty-results"><h2>일치하는 모션이 없어요</h2><p>검색어나 분류, 선택 필터를 바꿔 보세요.</p></div>}
  <nav className="motion-pagination" aria-label="모션 페이지"><button type="button" disabled={current===0} onClick={()=>navigate(current-1)}><ChevronLeft size={16}/>이전</button>{Array.from({length:pages},(_,i)=><button type="button" key={i} aria-label={`모션 ${i+1}페이지`} aria-current={current===i?'page':undefined} onClick={()=>navigate(i)}>{i+1}</button>)}<button type="button" disabled={current===pages-1} onClick={()=>navigate(current+1)}>다음<ChevronRight size={16}/></button></nav>
  <p className="footer-note">원본 코드를 기반으로 실행 환경·팔레트를 조정한 비교용 샘플입니다. 원본의 아이콘을 사용하며, 보라 계열은 청록 계열로 바꿨습니다. 입력은 샘플 안에서만 처리되며 실제 결제·전송·음성 녹음은 없습니다. <a href="https://designbookmark.com/motion" target="_blank" rel="noreferrer">전체 원본 목록</a></p>
  <Dialog open={!!expanded} onClose={()=>setExpanded(null)} title={expanded?`${expanded.number} · ${expanded.name}`:'모션 상세'}>{expanded&&<><p>{expanded.hint}</p><MotionFrame sample={expanded} theme={theme} reduced={motionReduced} run={largeRun} revision={largeRevision} large/><div className="motion-detail-tools"><button type="button" onClick={()=>setLargeRun(!largeRun)}>{largeRun?<Pause size={14}/>:<Play size={14}/>} {largeRun?'정지':'재생'}</button><button type="button" onClick={()=>{setLargeRevision(v=>v+1);setLargeRun(true)}}><RotateCcw size={14}/>다시 시작</button><button type="button" onClick={()=>toggle(expanded.id)}><Bookmark size={14}/>{picks.includes(expanded.id)?'선택 취소':'선택하기'}</button><button type="button" onClick={()=>downloadMotionFile(`naria-motion-${expanded.id}.html`,motionDocument(expanded,theme,reduced),'text/html')}><Download size={14}/>개별 HTML</button></div><p className="motion-hint">{expanded.source} · <a href={expanded.url} target="_blank" rel="noreferrer">원본 코드</a></p></>}</Dialog>
 </section>
}
