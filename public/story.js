import {media, prepareImage, decodeElement, selectVariant, warmImage, sceneTimeout, constrained} from './media.js?v=20261011-scene';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=t=>t*t*(3-2*t);
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused');
let stageIndex=-1, phase=0,copyAnimation;
const chapters=[
 {type:'mining',kicker:'01 / ESCAVAÇÃO E CARREGAMENTO',title:'TUDO COMEÇA <br><em>EM CAMPO.</em>',description:'Perfurar, escavar, carregar. Equipamentos diferentes, um mesmo ciclo. A operação precisa de ritmo — e de visibilidade.',tags:['FRENTE DE LAVRA','CICLO OPERACIONAL'],fact:'A MINEFY CONECTA OS SINAIS DE QUEM PRODUZ.',label:'ESCAVAÇÃO → CARREGAMENTO',name:'O CICLO COMEÇA'},
 {type:'plant',kicker:'02 / TRATAMENTO DO MATERIAL',title:'O MATERIAL <br>SEGUE. <br><em>OS DADOS TAMBÉM.</em>',description:'O material chega à usina e percorre etapas de tratamento. Conectar a informação entre as frentes ajuda a enxergar o fluxo, os ritmos e as interfaces da operação.',tags:['USINA','FLUXO DO MATERIAL'],fact:'REPRESENTAÇÃO CONCEITUAL DO CICLO MINERAL.',label:'TRANSPORTE → TRATAMENTO',name:'A OPERAÇÃO AVANÇA'},
 {type:'tailings',kicker:'03 / MANEJO DE REJEITOS',title:'A JORNADA <br>CONTINUA <br><em>ALÉM DA USINA.</em>',description:'Na área de rejeitos, o Scroller anfíbio trabalha com propulsão helicoidal. Operações especializadas também abrem espaço para visibilidade e acompanhamento.',tags:['SCROLLER ANFÍBIO','REJEITOS'],fact:'GESTÃO DE REJEITOS E RECUPERAÇÃO DE ÁGUA.',label:'REJEITOS → SCROLLER',name:'NOVOS TERRENOS'},
 {type:'truck',kicker:'04 / DE VOLTA AO TRANSPORTE',title:'POR FORA, <br>A FORÇA. <br><em>POR DENTRO, SINAIS.</em>',description:'Acompanhamos o TR-001 em movimento. Cada ciclo deixa informações que podem ajudar a operação a entender o comportamento da máquina.',tags:['TR-001','CAMINHÃO FORA DE ESTRADA'],fact:'CONTINUE ROLANDO PARA ENTRAR NA MÁQUINA.',label:'TR-001 → APROXIMAÇÃO DO MOTOR',name:'UM EQUIPAMENTO. UMA HISTÓRIA.'},
 {type:'engine',kicker:'05 / O QUE A MÁQUINA ESTÁ DIZENDO',title:'O ÓLEO <br>AQUECE. <br><em>O SINAL MUDA.</em>',description:'O motor segue trabalhando, mas um parâmetro começa a mudar. Nesta simulação, a temperatura do óleo evolui de 82 °C para 108 °C.',tags:['MOTOR EM CORTE','ÓLEO EM CIRCULAÇÃO'],fact:'VALORES ILUSTRATIVOS · NÃO SÃO LIMITES DE FABRICANTE.',label:'MOTOR → SINAL DE TEMPERATURA',name:'O DESVIO APARECE'},
 {type:'can',kicker:'06 / DO SINAL AO CONTEXTO',title:'A MÁQUINA <br>FALA. <br><em>ACTISKY CONECTA.</em>',description:'Pelos sinais disponíveis na rede CAN e nos sensores, o ActiSky conecta a condição do equipamento à plataforma. A leitura ganha identificação, histórico e contexto.',tags:['CAN J1939','ACTISKY','SENSORES'],fact:'DISPONIBILIDADE DE SINAIS VALIDADA POR EQUIPAMENTO.',label:'REDE CAN → ACTISKY → PLATAFORMA',name:'O SINAL GANHA CAMINHO'},
 {type:'tablet',kicker:'07 / CONTEXTO PARA QUEM OPERA',title:'O ALERTA <br>CHEGA <br><em>À CABINE.</em>',description:'No tablet industrial, o operador vê qual equipamento requer atenção e qual condição mudou. Uma informação clara para apoiar o procedimento da operação.',tags:['TABLET INDUSTRIAL','ALERTA CONTEXTUAL'],fact:'CENA DEMONSTRATIVA · CANAIS CONFIGURADOS POR PROJETO.',label:'ACTISKY → TABLET DO OPERADOR',name:'A INFORMAÇÃO CHEGA'},
 {type:'mobile',kicker:'08 / EQUIPES DE CAMPO CONECTADAS',title:'A EQUIPE <br>RECEBE <br><em>O MESMO CONTEXTO.</em>',description:'Na caminhonete de apoio, o celular apresenta a mesma ocorrência. Operação e manutenção podem compartilhar o contexto do equipamento e coordenar a resposta.',tags:['FROTA DE APOIO','COMUNICAÇÃO EM CAMPO'],fact:'VISÃO CONCEITUAL DE ENTREGA MULTICANAL.',label:'TR-001 → EQUIPE DE CAMPO',name:'O CONTEXTO SE ESPALHA'},
 {type:'control',kicker:'09 / A VISÃO DE TODA A OPERAÇÃO',title:'UMA FROTA. <br>UM ALERTA. <br><em>UMA DECISÃO.</em>',description:'Na sala de controle, o TR-001 se destaca no mapa. Posição, sinais e histórico ajudam a equipe a priorizar a análise e conduzir a decisão operacional.',tags:['CONTROLE DE FROTA','ALERTAS','HISTÓRICO'],fact:'SIGA PARA EXPLORAR A COMBINAÇÃO DOS SINAIS.',label:'CAMPO → SALA DE CONTROLE',name:'DA MÁQUINA À DECISÃO'}
];

// Decode the incoming plate, then the element that is painted, before crossing over; retain only the visible pair and target.
const section=$('#jornada'),container=$('#story-canvas'),frames=new Map();
const sceneAspect=1672/941; // every cinema plate shares this frame; the manifest only carries widths.
const sceneKey=index=>`cinema/${chapters[index].type==='control'?'control-v2':chapters[index].type}`;
const pushFor=index=>index===3?.27:index===4?.14:.075;
let activeFrame,pointerX=0,pointerY=0,desiredIndex=-1,failedIndex=-1,visible=false,request=0,cameraKey='',hud={temp:-1,critical:false};
let selectionTimer,warmTimer,pruneTimer,statusTimer,resizeTimer;
const errorNote=document.createElement('div');errorNote.className='story-media-error';errorNote.hidden=true;
errorNote.innerHTML='<span>A conexão interrompeu esta cena.</span><button type="button">Tentar novamente</button>';
errorNote.setAttribute('role','status');$('.story-sticky').append(errorNote);
errorNote.querySelector('button').addEventListener('click',()=>{failedIndex=-1;showChapter(desiredIndex);});
// Discreet loading state: appears only when a plate takes longer than a glance, never pretends the preview is final.
const status=document.createElement('div');status.className='story-media-status';status.hidden=true;
status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.innerHTML='<span></span><b></b>';
$('.story-sticky').append(status);
function showStatus(index){clearTimeout(statusTimer);statusTimer=setTimeout(()=>{status.querySelector('b').textContent=`CENA ${String(index+1).padStart(2,'0')} · CARREGANDO`;status.hidden=false;},300);}
function hideStatus(){clearTimeout(statusTimer);status.hidden=true;}
// The painted frame can differ from stageIndex after a failed chapter (copy advances, plate stays): never prune it.
function paintedIndex(){return activeFrame&&frames.get(Number(activeFrame.dataset.scene))===activeFrame?Number(activeFrame.dataset.scene):-1;}
function pruneFrames(keep){
 for(const [index,frame] of frames){if(!keep.has(index)&&frame!==activeFrame){frame.remove();frames.delete(index);}}
}
function getFrame(index){
 if(frames.has(index))return frames.get(index);
 // The embedded preview only preserves the composition's colour field while the plate arrives; it is never marked ready.
 const frame=document.createElement('div');frame.className='film-frame';frame.dataset.scene=String(index);
 frame.style.backgroundImage=`url("${media[sceneKey(index)].preview}")`;
 container.append(frame);frames.set(index,frame);
 pruneFrames(new Set([paintedIndex(),index,...[...frames.keys()].slice(-2)]));
 return frame;
}
// Plate choice follows the real cover box, display density and the deepest camera push of the chapter.
function sceneBox(index){
 const frame=frames.get(index)||activeFrame;
 const width=frame?.offsetWidth||container.offsetWidth||innerWidth*1.04,height=frame?.offsetHeight||container.offsetHeight||innerHeight*1.04;
 return {width,height};
}
function sceneVariant(index){
 return selectVariant(media[sceneKey(index)],{...sceneBox(index),aspect:sceneAspect,dpr:devicePixelRatio||1,zoom:(1.025+pushFor(index))*1.035,economy:constrained()});
}
function warmScene(index){if(index<0||index>8)return;warmImage(sceneKey(index),{variant:sceneVariant(index)});}
function updateChapter(index){
 const changed=stageIndex!==index;stageIndex=index;const c=chapters[index];
 section.dataset.chapter=c.type;
 $('#story-step').textContent=String(index+1).padStart(2,'0');$('#story-chapter-label').textContent=c.name;$('#story-kicker').textContent=c.kicker;$('#story-title').innerHTML=c.title;$('#story-description').textContent=c.description;$('#story-fact span').textContent=c.fact;$('#story-scene-label').textContent=c.label;
 $('#story-tags').replaceChildren(...c.tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
 $$('.story-dots button').forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 $('#story-prev').disabled=index===0;$('#story-next').setAttribute('aria-label',index===8?'Explorar a combinação dos sinais':'Próximo capítulo');
 container.setAttribute('aria-label',`Cena cinematográfica conceitual: ${c.kicker.substring(5).toLowerCase()}`);
 $('#story-hud').hidden=!(index===4||index===5);$('#story-alert').hidden=!(index===6||index===7||index===8);
 if(changed&&!paused&&$('.story-copy').animate){copyAnimation?.cancel();copyAnimation=$('.story-copy').animate([{opacity:.3,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out'});}
}
// Mount a staging element and resolve only after it has decoded; the previous plate stays painted meanwhile.
async function mountImage(frame,url){
 const img=document.createElement('img');img.className='is-staging';img.alt='';img.decoding='async';img.draggable=false;img.src=url;
 frame.append(img);
 try{await decodeElement(img,sceneTimeout);}catch(error){img.remove();throw error;}
 return img;
}
function settlePlate(frame,img,variant){
 frame.querySelectorAll('img').forEach(old=>{if(old!==img)old.remove();});
 img.classList.remove('is-staging');frame.dataset.width=String(variant.width);frame.dataset.detail=variant.detail.toFixed(3);
}
async function showChapter(index){
 if(!visible||index!==desiredIndex||index===failedIndex)return;
 const id=++request,incoming=getFrame(index),key=sceneKey(index);
 errorNote.hidden=true;container.setAttribute('aria-busy','true');showStatus(index);
 // First arrival: copy is readable at once, the backdrop is marked as a preview and the busy state is explicit.
 if(!activeFrame){activeFrame=incoming;incoming.classList.add('is-active','is-preview');updateChapter(index);}
 const live=()=>id===request&&visible&&index===desiredIndex&&frames.get(index)===incoming;
 try{
  const variant=sceneVariant(index);
  const url=await prepareImage(key,{variant,priority:'high',timeout:sceneTimeout});
  if(!live())return;
  const img=await mountImage(incoming,url);
  if(!live()){img.remove();return;}
  // Atomic commit: plate, copy, HUD and busy state change together, after the painted element decoded.
  settlePlate(incoming,img,variant);incoming.classList.add('is-ready');incoming.classList.remove('is-preview');
  activeFrame=incoming;frames.forEach(frame=>frame.classList.toggle('is-active',frame===incoming));
  hideStatus();updateChapter(index);frameCamera();updateHud();container.setAttribute('aria-busy','false');
  clearTimeout(pruneTimer);pruneTimer=setTimeout(()=>pruneFrames(new Set([paintedIndex(),desiredIndex])),850);
  clearTimeout(warmTimer);
  if(index<8)warmTimer=setTimeout(()=>{if(visible&&desiredIndex===index)warmScene(index+1);},650);
 }catch(error){
  if(!live())return;
  failedIndex=index;hideStatus();container.setAttribute('aria-busy','false');
  errorNote.querySelector('span').textContent=error?.name==='TimeoutError'?'A conexão está lenta e esta cena não chegou a tempo.':'A conexão interrompeu esta cena.';
  errorNote.hidden=false;
  // The narrative stays readable on the chapter the visitor is in, even while its plate is unavailable.
  updateChapter(index);frameCamera();updateHud();
 }
}
// A larger viewport or density promotes the plate of the current chapter; a smaller one never downgrades it.
function promoteScene(){
 if(!visible||stageIndex<0||stageIndex!==desiredIndex||paintedIndex()!==stageIndex||!activeFrame?.classList.contains('is-ready'))return;
 const index=stageIndex,frame=activeFrame,key=sceneKey(index),variant=sceneVariant(index);
 if(variant.width<=Number(frame.dataset.width||0)||frame.dataset.pending===variant.url)return;
 const id=request;frame.dataset.pending=variant.url;
 (async()=>{
  try{
   const url=await prepareImage(key,{variant,priority:'auto',timeout:sceneTimeout});
   if(id!==request||frames.get(index)!==frame)return;
   const img=await mountImage(frame,url);
   if(id!==request||frames.get(index)!==frame){img.remove();return;}
   settlePlate(frame,img,variant);frameCamera();
  }catch{/* The current plate stays; the next resize evaluates again. */}
  finally{if(frame.dataset.pending===variant.url)delete frame.dataset.pending;}
 })();
}
function frameCamera(){
 // After a failed chapter the previous plate keeps its own camera until a new commit.
 if(!activeFrame||!visible||stageIndex!==desiredIndex||paintedIndex()!==stageIndex)return;
 // Camera travel is capped where the plate has fewer pixels than the display asks for.
 const detail=Number(activeFrame.dataset.detail||1),allowance=detail>=1?1:Math.max(.6,detail);
 const travel=paused?0:ease(phase),push=pushFor(stageIndex)*allowance;
 const values=[1.025+travel*push,paused?0:(.5-travel)*1.8+pointerX*.55,paused?0:(travel-.5)*1.1+pointerY*.35,stageIndex===4?clamp((phase-.35)*1.35):0];
 const key=`${activeFrame.dataset.scene}|${values.map(v=>v.toFixed(4)).join('|')}`;if(key===cameraKey)return;cameraKey=key;
 activeFrame.style.setProperty('--push',values[0]);
 activeFrame.style.setProperty('--pan-x',`${values[1]}%`);
 activeFrame.style.setProperty('--pan-y',`${values[2]}%`);
 container.style.setProperty('--heat',values[3]);
}
// HUD writes happen only when the displayed value or state changes; a 2 °C band keeps the threshold from chattering.
function updateHud(){
 if(stageIndex!==desiredIndex||!(stageIndex===4||stageIndex===5))return;
 const temp=stageIndex===4?Math.round(82+26*ease(clamp(phase*1.45))):108;
 const critical=temp>=100||(hud.critical&&temp>=98);
 if(temp===hud.temp&&critical===hud.critical)return;
 if(temp!==hud.temp){$('#story-temperature').textContent=String(temp);$('.hud-bar>span').style.width=`${(temp-70)/45*100}%`;}
 if(critical!==hud.critical){$('#story-hud').classList.toggle('critical',critical);$('#story-signal-state').textContent=critical?'DESVIO IDENTIFICADO · SIMULAÇÃO':'LEITURA ILUSTRATIVA';}
 hud={temp,critical};
}
function syncStory(){
 const r=section.getBoundingClientRect(),wasVisible=visible;
 visible=r.top<innerHeight&&r.bottom>0&&!document.hidden;
 section.classList.toggle('story-visible',visible);
 if(!visible){clearTimeout(selectionTimer);clearTimeout(warmTimer);hideStatus();return;}
 const p=clamp(-r.top/(r.height-innerHeight)),position=p*9;
 let n=Math.min(8,Math.floor(position));
 // 3 % of a chapter of hysteresis on the adjacent boundary only: resting on it does not alternate chapters; distant jumps land at once.
 if(desiredIndex>=0&&Math.abs(n-desiredIndex)===1){if(n>desiredIndex&&position<n+.03)n=desiredIndex;else if(n<desiredIndex&&position>n+.97)n=desiredIndex;}
 phase=clamp(position-n);
 if(n!==desiredIndex||!wasVisible){
  desiredIndex=n;failedIndex=-1;clearTimeout(selectionTimer);clearTimeout(warmTimer);
  // Ignore transient chapters crossed by a fast fling or keyboard navigation.
  selectionTimer=setTimeout(()=>showChapter(n),activeFrame?80:0);
 }
 frameCamera();updateHud();$('.story-timeline>span').style.transform=`scaleX(${p})`;
}
function gotoChapter(index){
 if(index>8){$('#preditiva').scrollIntoView({behavior:'instant'});return;}
 const top=section.getBoundingClientRect().top+scrollY,range=section.offsetHeight-innerHeight;
 window.scrollTo({top:top+range*(Math.max(0,index)+.08)/9,behavior:'instant'});
}
$$('[data-story]').forEach(b=>{
 const index=Number(b.dataset.story);b.addEventListener('click',()=>gotoChapter(index));
 for(const event of ['pointerenter','focus'])b.addEventListener(event,()=>warmScene(index));
});
$('#story-prev').addEventListener('click',()=>gotoChapter(Math.max(0,desiredIndex)-1));$('#story-next').addEventListener('click',()=>gotoChapter(Math.max(0,desiredIndex)+1));
let queued=false;
function queueSync(){if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;syncStory();});}}
window.addEventListener('scroll',queueSync,{passive:true});
window.addEventListener('resize',()=>{queueSync();clearTimeout(resizeTimer);resizeTimer=setTimeout(promoteScene,250);});
document.addEventListener('visibilitychange',queueSync);
$('.story-sticky').addEventListener('pointermove',e=>{if(e.pointerType==='touch'||paused||!visible)return;pointerX=e.clientX/innerWidth-.5;pointerY=e.clientY/innerHeight-.5;queueSync();});
$('.story-sticky').addEventListener('pointerleave',()=>{pointerX=pointerY=0;queueSync();});
window.addEventListener('minefy-motion',e=>{paused=e.detail.paused;if(paused&&copyAnimation)copyAnimation.finish();queueSync();});
// Prepare the opening plate one viewport ahead of the journey, without fetching the other chapters.
const approach=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){warmScene(0);approach.disconnect();}},{rootMargin:'100% 0px'});approach.observe(section);
syncStory();

// This lab demonstrates configurable compound rules; it is not a trained ML model.
const temp=$('#oil-temp'),pressure=$('#oil-pressure'),vibration=$('#engine-vibration');
let simulationId=0;
function updateLab(){
 const t=Number(temp.value),p=Number(pressure.value),v=Number(vibration.value),hot=t>=100,low=p<=2.4,shaking=v>=8,count=Number(hot)+Number(low)+Number(shaking),compound=hot&&low;
 $('#oil-temp-value').textContent=`${t.toFixed(0)} °C`;$('#oil-pressure-value').textContent=`${p.toFixed(1).replace('.',',')} bar`;$('#engine-vibration-value').textContent=`${v.toFixed(1).replace('.',',')} mm/s`;
 [hot,low,shaking].forEach((critical,i)=>{$$('.parameter')[i].classList.toggle('critical',critical);});
 const result=$('.prediction-result');result.classList.toggle('warning',count>0&&!compound);result.classList.toggle('critical',compound);
 $('#risk-arc').style.strokeDashoffset=String(522-(count?count/3*485:57));$('#risk-icon').textContent=compound?'!':count?'!':'✓';$('#risk-level').textContent=compound?'ALERTA COMPOSTO':count?'ATENÇÃO':'NORMAL';$('#risk-count').textContent=`${count} ${count===1?'SINAL FORA':'SINAIS FORA'} DA FAIXA`;
 $('#risk-title').innerHTML=compound?(shaking?'Três sinais. <br>Uma prioridade de análise.':'Temperatura e pressão <br>pedem atenção conjunta.'):count?'Um sinal mudou. <br>O contexto importa.':'Um equipamento. <br>Vários sinais para acompanhar.';
 $('#risk-description').textContent=compound?(shaking?'Óleo aquecido, pressão reduzida e vibração elevada reforçam a ocorrência. A equipe recebe evidências para avaliar a condição da máquina.':'A combinação de óleo aquecido e pressão reduzida atende à regra demonstrativa. O evento ganha contexto para a operação.'):count?'Um parâmetro isolado sai da faixa da simulação. A combinação configurada ainda não foi atendida.':'Mova os parâmetros ou execute o cenário para ver quando os sinais se combinam e geram um alerta.';
 $('#rule-status').textContent=compound?'TR-001 · OCORRÊNCIA DEMONSTRATIVA GERADA':'MONITORAMENTO · AGUARDANDO COMBINAÇÃO';
}
[temp,pressure,vibration].forEach(input=>input.addEventListener('input',()=>{simulationId++;$('#simulate-scenario').disabled=false;updateLab();}));
$('#reset-scenario').addEventListener('click',()=>{simulationId++;temp.value=82;pressure.value=4.2;vibration.value=2;$('#simulate-scenario').disabled=false;updateLab();});
$('#simulate-scenario').addEventListener('click',()=>{
 const id=++simulationId,start=performance.now();$('#simulate-scenario').disabled=true;
 function step(now){if(id!==simulationId)return;const q=paused?1:clamp((now-start)/6500);temp.value=String(Math.round(82+26*q));pressure.value=String((4.2-2.1*clamp((q-.25)/.75)).toFixed(1));vibration.value=String((2+6.5*clamp((q-.45)/.55)).toFixed(1));updateLab();if(q<1)requestAnimationFrame(step);else $('#simulate-scenario').disabled=false;}
 requestAnimationFrame(step);
});
updateLab();document.documentElement.dataset.storyReady='true';
