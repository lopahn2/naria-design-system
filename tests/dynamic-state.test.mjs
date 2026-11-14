import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import React,{act} from 'react';
import * as UI from '../packages/ui/dist/index.js';
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost/'});
globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.HTMLElement=dom.window.HTMLElement;globalThis.Node=dom.window.Node;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
globalThis.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
dom.window.HTMLElement.prototype.scrollIntoView=function(){};
dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true};
dom.window.HTMLDialogElement.prototype.close=function(){this.open=false};
globalThis.requestAnimationFrame=fn=>setTimeout(fn,0);
globalThis.cancelAnimationFrame=id=>clearTimeout(id);
const {createRoot}=await import('react-dom/client');
async function mount(Component,props){const host=document.createElement('div');document.body.append(host);const root=createRoot(host);async function render(p){await act(async()=>root.render(React.createElement(Component,p)))}await render(props);return {host,render,async close(){await act(async()=>root.unmount());host.remove()}}}
test('Tabs retain a keyboard entry after the controlled selection disappears',async()=>{
 const items=[{value:'a',label:'A',content:'A panel'},{value:'b',label:'B',content:'B panel'}];
 const app=await mount(UI.Tabs,{label:'Tabs',items,value:'a',onValueChange(){}});
 try{await app.render({label:'Tabs',items:items.slice(1),value:'a',onValueChange(){}});assert.equal(app.host.querySelector('[role=tab]').tabIndex,0)}finally{await app.close()}
});
test('Tree exposes a new keyboard entry when focused nodes are removed',async()=>{
 const props={label:'Tree',nodes:[{id:'a',label:'A'},{id:'b',label:'B'}],value:'a',onValueChange(){}};
 const app=await mount(UI.Tree,props);try{await app.render({...props,nodes:[props.nodes[1]]});assert.equal(app.host.querySelector('[role=treeitem]').tabIndex,0)}finally{await app.close()}
});
test('Tree reports sibling position and size for collapsed data',async()=>{
 const app=await mount(UI.Tree,{label:'Tree',nodes:[{id:'a',label:'A'},{id:'b',label:'B'}],value:'a',onValueChange(){}});
 try{const item=app.host.querySelectorAll('[role=treeitem]')[1];assert.equal(item.getAttribute('aria-posinset'),'2');assert.equal(item.getAttribute('aria-setsize'),'2')}finally{await app.close()}
});
test('Avatar retries a new image source after a failed source',async()=>{
 const app=await mount(UI.Avatar,{name:'나리',src:'/failed.png'});
 try{await act(async()=>app.host.querySelector('img').dispatchEvent(new window.Event('error')));assert.equal(app.host.querySelector('img'),null);await app.render({name:'나리',src:'/valid.png'});assert.equal(app.host.querySelector('img')?.getAttribute('src'),'/valid.png')}finally{await app.close()}
});
test('Combobox starts on the first available option when first item is disabled',async()=>{
 let selected='';const app=await mount(UI.Combobox,{label:'분야',options:[{value:'a',label:'마감',disabled:true},{value:'b',label:'개발'}],value:'',onValueChange:v=>{selected=v}});
 try{const input=app.host.querySelector('input');await act(async()=>input.click());const active=input.getAttribute('aria-activedescendant');assert.equal(document.getElementById(active)?.getAttribute('aria-disabled'),null);await act(async()=>input.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true})));assert.equal(selected,'b')}finally{await app.close()}
});
test('Calendar starts within allowed dates and disables navigation beyond min/max months',async()=>{
 const app=await mount(UI.Calendar,{label:'예약',value:'',min:'2030-02-10',max:'2030-02-20',onValueChange(){}});
 try{
  const grid=app.host.querySelector('[role=grid]');
  assert.ok(grid.getAttribute('aria-label').includes('2030-02'));
  assert.equal(grid.querySelector('button[tabindex="0"]').textContent,'10');
  assert.equal(app.host.querySelector('[aria-label="이전 달"]').disabled,true);
  assert.equal(app.host.querySelector('[aria-label="다음 달"]').disabled,true);
  assert.equal(grid.querySelector('button[aria-label*="2월 9일"]').disabled,true);
 }finally{await app.close()}
});
test('Calendar exposes all selected range days and both endpoints',async()=>{
 const app=await mount(UI.Calendar,{label:'기간',value:'2026-11-21',range:{start:'2026-11-18',end:'2026-11-21'},onValueChange(){}});
 try{
  assert.equal(app.host.querySelectorAll('td[aria-selected="true"]').length,4);
  assert.equal(app.host.querySelectorAll('button.is-selected').length,2);
  assert.equal(app.host.querySelector('.is-range-start button').textContent,'18');
 }finally{await app.close()}
});
test('Nested providers inherit the active theme and palette when changing density',async()=>{
 function Sample(){return React.createElement(UI.NariaProvider,{theme:'dark',palette:'playful'},React.createElement(UI.NariaProvider,{density:'compact'},React.createElement('span',null,'Nested')))}
 const app=await mount(Sample,{});
 try{
  const nested=app.host.querySelector('[data-density="compact"]');
  assert.equal(nested.dataset.ndsTheme,'dark');
  assert.equal(nested.style.getPropertyValue('--nds-primary'),UI.palettePresets.find(p=>p.id==='playful').dark.primary);
 }finally{await app.close()}
});
test('DatePicker opens its calendar, selects a day, closes and restores the trigger',async()=>{
 let chosen='';
 function Example(){const [value,setValue]=React.useState('2026-11-18');return React.createElement(UI.DatePicker,{label:'예약 날짜',value,onValueChange:v=>{chosen=v;setValue(v)},min:'2026-11-01',max:'2026-11-30'})}
 const app=await mount(Example,{});
 try{
  const trigger=app.host.querySelector('[aria-haspopup="dialog"]');trigger.focus();
  await act(async()=>trigger.click());
  assert.equal(app.host.querySelector('dialog').open,true);
  await act(async()=>app.host.querySelector('button[aria-label*="11월 20일"]').click());
  assert.equal(chosen,'2026-11-20');
  assert.equal(app.host.querySelector('input').value,'2026-11-20');
  assert.equal(app.host.querySelector('dialog').open,false);
  assert.equal(document.activeElement,trigger);
 }finally{await app.close()}
});
test('DateRangePicker clears an earlier end when the start advances',async()=>{
 let range;
 function Example(){const [value,setValue]=React.useState({start:'2026-11-18',end:'2026-11-21'});return React.createElement(UI.DateRangePicker,{label:'기간',...value,onChange:v=>{range=v;setValue(v)}})}
 const app=await mount(Example,{});
 try{
  await act(async()=>app.host.querySelector('[aria-label="시작일 달력 열기"]').click());
  await act(async()=>app.host.querySelector('button[aria-label*="11월 25일"]').click());
  assert.deepEqual(range,{start:'2026-11-25',end:''});
  assert.equal(app.host.querySelectorAll('input')[1].min,'2026-11-25');
 }finally{await app.close()}
});
