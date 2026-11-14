import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {MotionConfig} from 'motion/react';
import DetentDial from './vendor/detent-dial';
import SiriOrb from './vendor/siri-orb';
import AgentSteps from './vendor/ai-loading';
import HoldButton from './vendor/hold-button';
import ExposureSlider from './vendor/exposure-slider';
import BoardingPass from './vendor/boarding-pass';
import MarkerText from './vendor/marker-text';
import SmoothTab from './vendor/smooth-tab';
import Unlock from './vendor/unlock-face-id';
import Slide from './vendor/slide-to-confirm';
import Notifications from './vendor/notification-stack';
import WheelPicker from './vendor/wheel-picker';
import DynamicText from './vendor/dynamic-text';
import Voice from './vendor/ai-voice';
import ToolApproval from './vendor/ai-tool-approval';
import Toolbar from './vendor/toolbar';
import Scrubber from './vendor/scrubber';
import Cart from './vendor/cart-button';
import PageFlip from './vendor/page-flip';
import SignaturePad from './vendor/signature-pad';
import Undo from './vendor/undo-button';
import CardField from './vendor/card-field';
import StackPanel from './vendor/stack-panel';
import Typewriter from './vendor/type-writer';
import Thinking from './vendor/ai-text-loading';
import GlassPlayer from './vendor/liquid-glass-card';
import Bell from './vendor/bell-button';
import MorphPopover from './vendor/morph-popover';
import TaskList from './vendor/ai-task-list';
import MusicToggle from './vendor/music-toggle';
import Command from './vendor/command-button';
import MorphCommand from './vendor/db-command-button';

declare global {interface Window {__NARIA_DEMO__:{id:string;reduced:boolean}}}
const {id,reduced}=window.__NARIA_DEMO__;
function OrbDemo(){const[state,set]=useState<'idle'|'listening'|'thinking'|'streaming'|'done'>('thinking');return <><SiriOrb state={state} colors={{bg:'#f4f8f8',c1:'#0d9488',c2:'#38bdf8',c3:'#84cc16',c4:'#0e7490'}}/><div className="demo-toolbar">{(['idle','listening','thinking','streaming','done'] as const).map(s=><button key={s} aria-pressed={state===s} onClick={()=>set(s)}>{s}</button>)}</div></>}
function TasksDemo(){const[step,set]=useState(0);useEffect(()=>{if(reduced)return;const t=setInterval(()=>set(s=>(s+1)%5),2200);return()=>clearInterval(t)},[]);return <><TaskList label="naria 작업 진행" tasks={['요청 이해하기','자료 확인하기','화면 구성하기','결과 검토하기'].map((label,i)=>({id:String(i),label,status:i<step?'done':i===step?'running':'pending'}))}/><button className="demo-toolbar" onClick={()=>set(s=>(s+1)%5)}>다음 단계 →</button></>}
function CommandDemo(){const[status,set]=useState('');return <><Command onClick={()=>set('단축키로 실행했어요')}>검색</Command><output className="demo-status">{status}</output></>}
function SignatureDemo(){const[status,set]=useState('');return <><SignaturePad onChange={svg=>set(svg?'서명이 입력됐어요':'서명을 지웠어요')}/><output className="demo-status">{status}</output></>}
function MusicDemo(){const[p,set]=useState(.28);return <MusicToggle title="Quiet afternoon" artist="naria · visual demo" progress={p} onSeek={set}/>}
const demos:Record<string,React.ReactNode>={
 'db-command-button':<MorphCommand width={280} placeholder="검색어를 입력하세요">검색</MorphCommand>,
 'detent-dial':<DetentDial/>, 'siri-orb':<OrbDemo/>, 'ai-loading':<AgentSteps/>,
 'hold-button':<HoldButton variant="blue">길게 눌러 확인</HoldButton>, 'exposure-slider':<ExposureSlider accentColor="#0d9488"/>,
 'boarding-pass':<BoardingPass/>, 'marker-text':<MarkerText/>, 'smooth-tab':<SmoothTab/>,
 'unlock-face-id':<Unlock label="잠금 해제 데모"><div className="text-center p-5"><h2 className="text-xl font-semibold">나의 컬렉션</h2><p className="text-sm mt-2 text-muted-foreground">스캔 버튼을 눌러 화면 전환을 확인하세요</p></div></Unlock>,
 'slide-to-confirm':<Slide label="밀어서 확인하기" confirmingLabel="처리 중" doneLabel="완료"/>,
 'notification-stack':<Notifications/>, 'wheel-picker':<WheelPicker/>, 'dynamic-text':<DynamicText words={['Create','Connect','Discover','naria']} className="text-4xl font-semibold"/>,
 'ai-voice':<Voice demo={!reduced}/>, 'ai-tool-approval':<ToolApproval/>, 'toolbar':<Toolbar/>, 'scrubber':<Scrubber label="강도" defaultValue={.4}/>,
 'cart-button':<Cart/>, 'page-flip':<PageFlip/>, 'signature-pad':<SignatureDemo/>, 'undo-button':<Undo label="보관하기" doneLabel="보관했어요"/>,
 'card-field':<CardField testMode/>, 'stack-panel':<StackPanel/>, 'type-writer':<Typewriter sequences={[{text:'Small details. Better experiences.',deleteAfter:true}]} textClassName="text-3xl"/>,
 'ai-text-loading':<Thinking texts={['요청을 이해하고 있어요','정보를 연결하고 있어요','답변을 다듬고 있어요']} showElapsed/>,
 'liquid-glass-card':<GlassPlayer accent="#0d9488"/>, 'bell-button':<Bell label="알림 받기" subscribedLabel="알림 설정됨"/>,
 'morph-popover':<MorphPopover width={280} label="의견 남기기" placeholder="어떤 점이 마음에 드나요?" sentLabel="감사합니다"/>,
 'ai-task-list':<TasksDemo/>, 'music-toggle':<MusicDemo/>, 'command-button':<CommandDemo/>
};
function Ready(){useEffect(()=>{parent.postMessage({type:'naria-motion:ready',id},'*')},[]);return <div className="demo-container">{demos[id]||<p>알 수 없는 샘플</p>}</div>}
createRoot(document.getElementById('root')!).render(<MotionConfig reducedMotion={reduced?'always':'user'}><Ready/></MotionConfig>);
