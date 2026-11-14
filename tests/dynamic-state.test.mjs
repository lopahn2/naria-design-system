import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import React,{act} from 'react';
import * as UI from '../packages/ui/dist/index.js';
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost/'});
globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.HTMLElement=dom.window.HTMLElement;globalThis.Node=dom.window.Node;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
globalThis.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
dom.window.HTMLElement.prototype.scrollIntoView=function(){};
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
