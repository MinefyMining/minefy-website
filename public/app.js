import {deferEnhancement} from './enhancements.js?v=20261010-fast';
const swapImage=(...args)=>import('./media.js?v=20261011-scene').then(module=>module.swapImage(...args));
const warmImage=(...args)=>import('./media.js?v=20261011-scene').then(module=>module.warmImage(...args)).catch(()=>{});
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const reducedMedia = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMedia.matches;
const transitions=new Set();
function animate(element,keyframes,options){
 if(motionPaused||!element?.animate)return;
 const animation=element.animate(keyframes,options);transitions.add(animation);
 animation.finished.catch(()=>{}).finally(()=>transitions.delete(animation));
}
let activeStage = -1, fleetProgress = 0;
const stages = [
  { type:'haul', category:'TRANSPORTE DE GRANDE PORTE', title:'POTÊNCIA <br>COM <br><em>INTELIGÊNCIA.</em>', description:'Cada ciclo conta. Conecte o transporte de material à leitura de posição, condição do equipamento e alertas da operação.', features:['LOCALIZAÇÃO','TELEMETRIA','ALERTAS'], name:'CAMINHÃO FORA DE ESTRADA', context:'DA MÁQUINA À DECISÃO' },
  { type:'excavator', category:'ESCAVAÇÃO E CARREGAMENTO', title:'CADA <br>MOVIMENTO <br><em>IMPORTA.</em>', description:'Mais contexto para acompanhar a escavação. Visualize atividade, horas de operação e informações disponíveis nos sensores do equipamento.', features:['ATIVIDADE','HORÍMETRO','SENSORES'], name:'ESCAVADEIRA', context:'VISIBILIDADE NA FRENTE DE LAVRA' },
  { type:'drill', category:'PERFURAÇÃO EM CAMPO', title:'PRECISÃO <br>DESDE <br><em>A BASE.</em>', description:'A operação começa antes do carregamento. Reúna posição, eventos e condições da perfuratriz para apoiar o acompanhamento em campo.', features:['POSIÇÃO','EVENTOS','CONDIÇÃO'], name:'PERFURATRIZ', context:'CONTEXTO EM CADA ETAPA' },
  { type:'pickup', category:'APOIO À OPERAÇÃO', title:'CONEXÃO <br>POR TODA <br><em>A MINA.</em>', description:'A frota de apoio também faz parte do todo. Acompanhe deslocamentos e eventos das caminhonetes que conectam as equipes de campo.', features:['DESLOCAMENTOS','FROTA LEVE','EVENTOS'], name:'CAMINHONETE DE MINA', context:'PESSOAS E EQUIPAMENTOS CONECTADOS' },
  { type:'scroller', category:'OPERAÇÃO ANFÍBIA EM REJEITOS', title:'NOVOS <br>TERRENOS. <br><em>MAIS VISÃO.</em>', description:'Gestão de rejeitos e recuperação de água em barragens com Scroller. Uma frente de serviços Minefy que conecta o manejo do material às necessidades da operação.', features:['SCROLLER','GESTÃO DE REJEITOS','RECUPERAÇÃO DE ÁGUA'], name:'SCROLLER · GESTÃO DE REJEITOS', context:'REJEITOS E ÁGUA · SERVIÇOS MINEFY' }
];

// Navigation and controls remain independent of cinematic asset loading.
const menuButton = $('.menu-button');
function closeMenu() { $('#mobile-menu').hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Abrir menu'); document.body.classList.remove('menu-open'); }
menuButton.addEventListener('click', () => { const expanded = menuButton.getAttribute('aria-expanded') === 'true'; $('#mobile-menu').hidden = expanded; menuButton.setAttribute('aria-expanded', String(!expanded)); menuButton.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu'); document.body.classList.toggle('menu-open', !expanded); });
$$('#mobile-menu a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e => { if(e.key==='Escape'){closeMenu();menuButton.blur();} });

const motionButton = document.createElement('button');
motionButton.className = 'motion-toggle';
function syncMotion(){ if(motionPaused)transitions.forEach(animation=>{try{animation.finish();}catch{animation.cancel();}});document.body.classList.toggle('motion-paused',motionPaused);window.dispatchEvent(new CustomEvent('minefy-motion',{detail:{paused:motionPaused}})); motionButton.textContent=motionPaused?'▶':'Ⅱ'; motionButton.setAttribute('aria-label',motionPaused?'Ativar animações':'Pausar animações');motionButton.setAttribute('aria-pressed',String(motionPaused)); }
motionButton.addEventListener('click',()=>{motionPaused=!motionPaused;syncMotion();});
document.body.append(motionButton);syncMotion();
reducedMedia.addEventListener('change', e=>{motionPaused=e.matches;syncMotion();});

const gallerySizes='(max-width: 700px) 100vw, 60vw';
const stageSources={haul:'truck',excavator:'mining',drill:'drill',pickup:'pickup',scroller:'tailings'};
let stageRequest=0;
async function chooseStage(index) {
  const data=stages[index],image=$('#fleet-photo'),key=`cinema/${stageSources[data.type]}`;
  if(activeStage===index&&image.dataset.media===key)return;
  activeStage=index;const request=++stageRequest;
  $('#fleet-panel').setAttribute('aria-busy','true');
  try{
    // The initial image stays native-lazy; only interactions prepare a new asset.
    if(image.dataset.media!==key&&!await swapImage(image,key,{sizes:gallerySizes,valid:()=>request===stageRequest}))return;
  }catch{if(request===stageRequest){$('#fleet-panel').setAttribute('aria-busy','false');}return;}
  if(request!==stageRequest)return;
  $('#fleet-panel').setAttribute('aria-busy','false');
  $('#fleet-category').textContent=data.category;
  $('#fleet-title').innerHTML=data.title;
  $('#fleet-description').textContent=data.description;
  $('#fleet-features').replaceChildren(...data.features.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
  $('#fleet-number').textContent=String(index+1).padStart(2,'0');
  $('#model-label').textContent=data.name;
  $('#fleet-context').textContent=data.context;
  $('#fleet-canvas').setAttribute('aria-label',`Cena cinematográfica: ${data.name.toLowerCase()}`);
  $('#fleet-panel').setAttribute('aria-labelledby',`tab-${data.type}`);
  $$('.fleet-tabs button').forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
  image.alt=`${data.name.toLowerCase()} — cena conceitual`;
  animate(image,[{opacity:.35,transform:'scale(1.05)'},{opacity:1,transform:'scale(1)'}],{duration:700,easing:'ease-out'});
  animate($('.fleet-copy'),[{opacity:.2,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out'});
}
function scrollToStage(index){
  const section=$('#frota'), height=section.offsetHeight-innerHeight;
  const top=section.getBoundingClientRect().top+window.scrollY;
  const target=top+height*(index/4);
  chooseStage(index);
  if(!section.classList.contains('compact-gallery'))window.scrollTo({top:target,behavior:motionPaused?'instant':'smooth'});
}
$$('.fleet-tabs button').forEach((button,index)=>{
  button.addEventListener('click',()=>scrollToStage(index));
  for(const event of ['pointerenter','focus'])button.addEventListener(event,()=>warmImage(`cinema/${stageSources[stages[index].type]}`,gallerySizes));
  button.addEventListener('keydown',event=>{
    let target=index;
    if(event.key==='ArrowRight')target=(index+1)%5;
    else if(event.key==='ArrowLeft')target=(index+4)%5;
    else if(event.key==='Home')target=0;
    else if(event.key==='End')target=4;
    else return;
    event.preventDefault();$$('.fleet-tabs button')[target].focus();scrollToStage(target);
  });
});
// Large anchor jumps bypass intermediate scenes, so only the destination uses bandwidth.
$$('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
 const hash=link.getAttribute('href'),target=document.getElementById(hash.slice(1));
 if(!target||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 event.preventDefault();const top=target.getBoundingClientRect().top+scrollY-76;
 history.pushState(null,'',hash);
 if(link.classList.contains('skip-link'))target.focus({preventScroll:true});
 window.scrollTo({top:Math.max(0,top),behavior:motionPaused||Math.abs(top-scrollY)>innerHeight*2?'instant':'smooth'});
}));
let scrollQueued=false;
function updateScroll(){
  scrollQueued=false;
  const scroll=window.scrollY,range=document.documentElement.scrollHeight-innerHeight;
  const section=$('#frota'),compact=section.classList.contains('compact-gallery');
  if(!compact)fleetProgress=clamp(-section.getBoundingClientRect().top/(section.offsetHeight-innerHeight));
  $('#header').classList.toggle('scrolled',scroll>80);
  $('.page-progress>span').style.transform=`scaleX(${range>0?clamp(scroll/range):0})`;
  if(!compact)chooseStage(Math.min(4,Math.floor(fleetProgress*4.999)));
  else if(activeStage<0)chooseStage(0);
  $('#chapter-progress').style.width=`${fleetProgress*100}%`;
  const hero=$('.hero-image'),heroVisible=!motionPaused&&scroll<innerHeight*1.3;
  hero.style.willChange=heroVisible?'transform':'auto';
  if(heroVisible)hero.style.transform=`translateY(${scroll*.17}px)`; // sem zoom ao rolar (CEO 12/10/2026)
}
function queueScroll(){if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}}
window.addEventListener('scroll',queueScroll,{passive:true});window.addEventListener('resize',queueScroll);updateScroll();
// Decorative loops use no animation time while their section is away from the viewport.
const visibility=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-viewport',e.isIntersecting)),{rootMargin:'80px'});
[$('.hero'),$('.ticker'),$('.command-frame')].filter(Boolean).forEach(el=>visibility.observe(el));

// Native, one-shot reveals replace two animation libraries on the critical path.
const reveals=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{if(!entry.isIntersecting)return;reveals.unobserve(entry.target);animate(entry.target,[{opacity:0,transform:'translateY(26px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,easing:'cubic-bezier(.16,1,.3,1)'});});
},{rootMargin:'0px 0px -6% 0px'});
$$('.reveal').forEach(element=>reveals.observe(element));

// Load only the destination's interaction code. Direct links and fast taps also work.
deferEnhancement('#jornada,#preditiva',()=>import('./story.js?v=20261011-scene'));
deferEnhancement('#inteligencia,#solucoes',()=>import('./command.js?v=20261011-scene'));
document.documentElement.dataset.ready='true';
