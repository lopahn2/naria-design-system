import { useEffect, useId, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { LoaderCircle, X } from 'lucide-react';

export function Button({children,variant='primary',loading=false,className='',disabled,...props}: ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'ghost'|'danger';loading?:boolean}) {
  return <button type="button" className={`n-button n-button--${variant} ${className}`} disabled={disabled||loading} aria-busy={loading||undefined} {...props}>{loading&&<LoaderCircle className="spin" size={16} aria-hidden/>}{children}</button>;
}
export function Dialog({open,onClose,title,children,sheet=false}:{open:boolean;onClose:()=>void;title:string;children:ReactNode;sheet?:boolean}) {
  const ref=useRef<HTMLDialogElement>(null); const id=useId();
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    if(open){ const previous=document.activeElement as HTMLElement|null; if(!el.open)el.showModal(); const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';return ()=>{el.close();document.body.style.overflow=previousOverflow;previous?.focus();}; }
    if(el.open)el.close();
  },[open]);
  return <dialog ref={ref} className={`n-dialog ${sheet?'n-dialog--sheet':''}`} aria-labelledby={id} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget){const rect=e.currentTarget.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)onClose();}}}>
    {sheet&&<div className="sheet-handle"/>}<div className="dialog-heading"><h2 id={id}>{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="닫기"><X size={20}/></button></div>{children}
  </dialog>;
}
export function Tabs({labels,value,onChange,style='line',children}:{labels:string[];value:number;onChange:(v:number)=>void;style?:string;children:ReactNode}) {
  const id=useId();const refs=useRef<(HTMLButtonElement|null)[]>([]);
  return <><div role="tablist" aria-label="샘플 보기" className={`demo-tabs demo-tabs--${style}`}>
    {labels.map((label,i)=><button type="button" key={label} ref={el=>{refs.current[i]=el;}} role="tab" id={`${id}-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={value===i} tabIndex={value===i?0:-1} onClick={()=>onChange(i)} onKeyDown={e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%labels.length;else if(e.key==='ArrowLeft')next=(i+labels.length-1)%labels.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=labels.length-1;else return;e.preventDefault();onChange(next);refs.current[next]?.focus();}}>{label}</button>)}
  </div>{labels.map((_,i)=><div key={i} role="tabpanel" hidden={value!==i} tabIndex={0} id={`${id}-panel-${i}`} aria-labelledby={`${id}-${i}`} className="demo-tab-panel">{value===i?children:null}</div>)}</>;
}
