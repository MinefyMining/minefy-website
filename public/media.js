import {media} from './media-manifest.js?v=80df660aeb';
export {media};
export const sceneSizes='(max-width: 700px) 156vw, 104vw';
const pending=new Map();
const constrained=()=>navigator.connection?.saveData||/^(slow-2g|2g)$/.test(navigator.connection?.effectiveType||'');

// Deduplicate in-flight work only. Every handoff decodes again; the browser caches bytes.
export function prepareImage(key,{sizes='100vw',priority='auto'}={}){
 const spec=media[key];if(!spec)return Promise.reject(new Error(`Unknown media: ${key}`));
 const cacheKey=`${key}|${sizes}|${innerWidth}|${devicePixelRatio}`;
 if(pending.has(cacheKey)){const entry=pending.get(cacheKey);if(priority==='high'&&entry.image)entry.image.fetchPriority='high';return entry.promise;}
 const image=new Image();image.decoding='async';image.fetchPriority=priority;image.sizes=sizes;
 const entry={image,promise:null};
 entry.promise=new Promise((resolve,reject)=>{
  image.onload=async()=>{try{await image.decode();if(!image.naturalWidth)throw new Error('Empty image');pending.delete(cacheKey);entry.image=null;image.onload=image.onerror=null;resolve(image.currentSrc||image.src);}catch(error){pending.delete(cacheKey);entry.image=null;image.onload=image.onerror=null;reject(error);}};
  image.onerror=()=>{pending.delete(cacheKey);entry.image=null;image.onload=image.onerror=null;reject(new Error(`Image unavailable: ${key}`));};
  image.srcset=spec.srcset;image.src=spec.src;
 });
 pending.set(cacheKey,entry);
 return entry.promise;
}
export async function swapImage(image,key,{sizes='100vw',valid=()=>true}={}){
 const url=await prepareImage(key,{sizes,priority:'high'});if(!valid())return false;
 image.removeAttribute('srcset');image.removeAttribute('sizes');image.src=url;image.dataset.media=key;return true;
}
export function warmImage(key,sizes='100vw'){
 if(constrained()||document.hidden)return Promise.resolve();
 return prepareImage(key,{sizes,priority:'low'}).catch(()=>{});
}
export function warmOnApproach(element,key,sizes='100vw'){
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){warmImage(key,sizes);observer.disconnect();}},{rootMargin:'300px'});observer.observe(element);
}
