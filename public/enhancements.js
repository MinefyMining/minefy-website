// Keep navigation usable before optional scenes and charts have downloaded.
// A first interaction is replayed after initialization, including on a slow link.
import {loadI18n} from './home-i18n.js';
export function deferEnhancement(selectors, load) {
 const sections=[...document.querySelectorAll(selectors)];
 let pending,ready=false,latestAction=0;
 const notices=[];
 const observer=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting))start();
 });
 function state(value){sections.forEach(section=>{section.dataset.enhancement=value;});}
 function clearNotices(){notices.splice(0).forEach(note=>note.remove());}
 async function showRetry(){
  const {t}=await loadI18n();
  clearNotices();
  sections.forEach(section=>{
   const note=document.createElement('p');note.className='enhancement-retry';note.setAttribute('role','status');
   note.textContent=t('js.enh.retry');
   const button=document.createElement('button');button.type='button';button.textContent=t('js.enh.retryButton');button.dataset.enhancementRetry='true';
   button.addEventListener('click',start);note.append(button);section.prepend(note);notices.push(note);
  });
 }
 function start(){
  if(ready)return Promise.resolve(true);
  if(pending)return pending;
  state('loading');clearNotices();
  pending=Promise.resolve().then(load).then(()=>{
   ready=true;state('ready');observer.disconnect();
   window.removeEventListener('hashchange',onHash);
   document.removeEventListener('pointerover',onLink);
   document.removeEventListener('focusin',onLink);
   sections.forEach(section=>{
    for(const type of ['click','input','change'])section.removeEventListener(type,onInteraction,true);
   });
   return true;
  },async()=>{pending=null;state('error');await showRetry();return false;});
  return pending;
 }
 async function onInteraction(event){
  if(ready||event.target.closest('[data-enhancement-retry]'))return;
  const control=event.target.closest('button,input,select');
  if(!control)return;
  if(event.type==='click'&&control.tagName!=='BUTTON'){start();return;}
  event.preventDefault();event.stopImmediatePropagation();
  const action=++latestAction,value=control.value,type=event.type;
  if(!await start()||action!==latestAction||!control.isConnected)return;
  if(type==='click')control.click();
  else{control.value=value;control.dispatchEvent(new Event(type,{bubbles:true}));}
 }
 function matchesHash(hash){
  if(!hash||hash==='#')return false;
  const target=document.getElementById(hash.slice(1));
  return target&&sections.some(section=>section===target||section.contains(target));
 }
 function onHash(){if(matchesHash(window.location.hash))start();}
 function onLink(event){
  const link=event.target.closest('a[href^="#"]');
  if(link&&matchesHash(link.getAttribute('href')))start();
 }
 state('pending');
 sections.forEach(section=>{
  observer.observe(section);
  for(const type of ['click','input','change'])section.addEventListener(type,onInteraction,true);
 });
 document.addEventListener('pointerover',onLink,{passive:true});
 document.addEventListener('focusin',onLink);
 window.addEventListener('hashchange',onHash);onHash();
 return start;
}
