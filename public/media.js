import {media} from './media-manifest.js?v=4152dfe81a';
export {media};
export const sceneSizes='(max-width: 700px) 156vw, 104vw';
// Deadline for one scene transfer. On an effective 2G link (~6 kB/s) the 900 px plate (≤83 kB)
// arrives in ~14 s; anything slower is reported as recoverable instead of an endless busy state.
export const sceneTimeout=15000;
// Source plates stop at 1672 px: densities above 2× would only ask for upscaled pixels.
export const maxDensity=2;
const pending=new Map();
export const constrained=()=>!!(navigator.connection?.saveData||/^(slow-2g|2g)$/.test(navigator.connection?.effectiveType||''));
const timeoutError=src=>Object.assign(new Error(`Image timed out: ${src}`),{name:'TimeoutError'});

// Smallest plate that still covers the box at the given density and camera zoom; never larger than the source.
/** @param {{src:string,variants?:{width:number,url:string}[]}} spec
 *  @param {{width?:number,height?:number,aspect?:number,dpr?:number,zoom?:number,economy?:boolean}} [box] */
export function selectVariant(spec,{width=0,height=0,aspect=16/9,dpr=1,zoom=1,economy=false}={}){
 const variants=[...(spec.variants||[])].sort((a,b)=>a.width-b.width);
 if(!variants.length)return {url:spec.src,width:Infinity,required:0,detail:1};
 const density=Math.min(maxDensity,Math.max(1,dpr||1)),cover=Math.max(width,height*aspect);
 const required=Math.ceil(cover*density*Math.max(1,zoom));
 const chosen=economy?variants[0]:(variants.find(v=>v.width>=required)||variants[variants.length-1]);
 return {url:chosen.url,width:chosen.width,required,detail:cover>0?chosen.width/(cover*density):1};
}

// Deduplicate in-flight work only. Every handoff decodes again; the browser caches bytes.
// A deadline settles only its own entry: a late callback never clears a newer attempt.
function load(src,{srcset='',sizes='',priority='auto',timeout=sceneTimeout}={}){
 const cacheKey=srcset?`${src}|${srcset}|${sizes}|${innerWidth}|${devicePixelRatio}`:src;
 const existing=pending.get(cacheKey);
 if(existing){if(priority==='high'&&existing.image)existing.image.fetchPriority='high';return existing.promise;}
 const image=new Image();image.decoding='async';image.fetchPriority=priority;if(sizes)image.sizes=sizes;
 const entry={image,promise:null,timer:0};
 const settle=()=>{if(pending.get(cacheKey)===entry)pending.delete(cacheKey);clearTimeout(entry.timer);entry.image=null;image.onload=image.onerror=null;};
 entry.promise=new Promise((resolve,reject)=>{
  image.onload=async()=>{try{if(typeof image.decode==='function')await image.decode();if(!image.naturalWidth)throw new Error('Empty image');settle();resolve(image.currentSrc||image.src);}catch(error){settle();reject(error);}};
  image.onerror=()=>{settle();reject(new Error(`Image unavailable: ${src}`));};
  if(timeout>0)entry.timer=setTimeout(()=>{settle();reject(timeoutError(src));},timeout);
  if(srcset)image.srcset=srcset;image.src=src;
 });
 pending.set(cacheKey,entry);
 return entry.promise;
}
// `variant` (from selectVariant) requests one explicit plate; otherwise the browser picks from srcset/sizes.
/** @param {string} key
 *  @param {{variant?:{url:string,width:number,required?:number,detail?:number},sizes?:string,priority?:string,timeout?:number}} [options]
 *  @returns {Promise<string>} decoded URL */
export function prepareImage(key,{variant,sizes='100vw',priority='auto',timeout=sceneTimeout}={}){
 const spec=media[key];if(!spec)return Promise.reject(new Error(`Unknown media: ${key}`));
 if(variant)return load(variant.url,{priority,timeout});
 return load(spec.src,{srcset:spec.srcset,sizes,priority,timeout});
}
// Resolve only when the element that is actually painted has decoded; reject on error or deadline.
export function decodeElement(image,timeout=sceneTimeout){
 return new Promise((resolve,reject)=>{
  let done=false;
  const finish=(ok,error)=>{if(done)return;done=true;clearTimeout(timer);image.removeEventListener('load',onLoad);image.removeEventListener('error',onError);if(ok)resolve(image);else reject(error);};
  const ready=()=>image.naturalWidth===undefined||image.naturalWidth>0;
  const decode=()=>{
   if(typeof image.decode!=='function'){finish(ready(),new Error('Empty image'));return;}
   image.decode().then(()=>finish(ready(),new Error('Empty image')),error=>finish(image.complete&&ready(),error));
  };
  const onLoad=()=>decode(),onError=()=>finish(false,new Error(`Image element failed: ${image.src}`));
  const timer=timeout>0?setTimeout(()=>finish(false,timeoutError(image.src)),timeout):0;
  image.addEventListener('load',onLoad);image.addEventListener('error',onError);
  if(typeof image.decode==='function'||image.complete)decode();
 });
}
export async function swapImage(image,key,{sizes='100vw',valid=()=>true}={}){
 const url=await prepareImage(key,{sizes,priority:'high'});if(!valid())return false;
 image.removeAttribute('srcset');image.removeAttribute('sizes');image.src=url;image.dataset.media=key;return true;
}
export function warmImage(key,options='100vw'){
 if(constrained()||document.hidden)return Promise.resolve();
 const settings=typeof options==='string'?{sizes:options}:options;
 return prepareImage(key,{...settings,priority:'low',timeout:settings.timeout??sceneTimeout*2}).catch(()=>{});
}
export function warmOnApproach(element,key,options='100vw',rootMargin='300px'){
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){warmImage(key,typeof options==='function'?options():options);observer.disconnect();}},{rootMargin});observer.observe(element);
}
