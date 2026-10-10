import {media, prepareImage, warmImage, warmOnApproach, sceneSizes} from './media.js?v=4152dfe81a';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=t=>t*t*(3-2*t);
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused');
let stageIndex=-1, phase=0;
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

// Decode incoming scenes before crossing over; retain only the visible pair and target.
const section=$('#jornada'),container=$('#story-canvas'),frames=new Map();
const sceneKey=index=>`cinema/${chapters[index].type==='control'?'control-v2':chapters[index].type}`;
let activeFrame,pointerX=0,pointerY=0,desiredIndex=-1,failedIndex=-1,visible=false;
let selectionTimer,warmTimer,pruneTimer;
const errorNote=document.createElement('div');errorNote.className='story-media-error';errorNote.hidden=true;
errorNote.innerHTML='A conexão interrompeu esta cena.<button type="button">Tentar novamente</button>';
errorNote.setAttribute('role','status');$('.story-sticky').append(errorNote);
errorNote.querySelector('button').addEventListener('click',()=>{failedIndex=-1;showChapter(desiredIndex);});
function pruneFrames(keep){
 for(const [index,frame] of frames){if(!keep.has(index)){frame.remove();frames.delete(index);}}
}
function getFrame(index){
 if(frames.has(index))return frames.get(index);
 // An embedded preview preserves the composition while the first full scene arrives.
 const frame=document.createElement('div');frame.className='film-frame';frame.dataset.scene=String(index);
 frame.style.backgroundImage=`url("${media[sceneKey(index)].preview}")`;
 const img=document.createElement('img');img.alt='';img.decoding='async';img.draggable=false;
 frame.append(img);container.append(frame);frames.set(index,frame);
 pruneFrames(new Set([stageIndex,index,...[...frames.keys()].slice(-2)]));
 return frame;
}
function updateChapter(index){
 const changed=stageIndex!==index;stageIndex=index;const c=chapters[index];
 section.dataset.chapter=c.type;
 $('#story-step').textContent=String(index+1).padStart(2,'0');$('#story-chapter-label').textContent=c.name;$('#story-kicker').textContent=c.kicker;$('#story-title').innerHTML=c.title;$('#story-description').textContent=c.description;$('#story-fact span').textContent=c.fact;$('#story-scene-label').textContent=c.label;
 $('#story-tags').replaceChildren(...c.tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
 $$('.story-dots button').forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 $('#story-prev').disabled=index===0;$('#story-next').setAttribute('aria-label',index===8?'Explorar a combinação dos sinais':'Próximo capítulo');
 container.setAttribute('aria-label',`Cena cinematográfica conceitual: ${c.kicker.substring(5).toLowerCase()}`);
 $('#story-hud').hidden=!(index===4||index===5);$('#story-alert').hidden=!(index===6||index===7||index===8);
 if(changed&&window.gsap&&!paused)gsap.fromTo('.story-copy',{opacity:.3,y:10},{opacity:1,y:0,duration:.5,overwrite:true});
}
async function showChapter(index){
 if(!visible||index!==desiredIndex||index===failedIndex)return;
 const incoming=getFrame(index),img=incoming.querySelector('img');
 errorNote.hidden=true;container.setAttribute('aria-busy','true');
 if(!activeFrame){activeFrame=incoming;incoming.classList.add('is-active');updateChapter(index);}
 try{
  const url=await prepareImage(sceneKey(index),{sizes:sceneSizes,priority:'high'});
  if(index!==desiredIndex||!visible||frames.get(index)!==incoming)return;
  img.src=url;incoming.classList.add('is-ready');activeFrame=incoming;
  frames.forEach(frame=>frame.classList.toggle('is-active',frame===incoming));
  updateChapter(index);frameCamera();updateHud();container.setAttribute('aria-busy','false');
  clearTimeout(pruneTimer);pruneTimer=setTimeout(()=>pruneFrames(new Set([stageIndex,desiredIndex])),850);
  clearTimeout(warmTimer);
  if(index<8)warmTimer=setTimeout(()=>{if(visible&&desiredIndex===index)warmImage(sceneKey(index+1),sceneSizes);},650);
 }catch{
  if(index!==desiredIndex||!visible)return;
  failedIndex=index;errorNote.hidden=false;container.setAttribute('aria-busy','false');
 }
}
function frameCamera(){
 if(!activeFrame||!visible||stageIndex!==desiredIndex)return;
 const travel=paused?0:ease(phase),push=stageIndex===3?.27:stageIndex===4?.14:.075;
 activeFrame.style.setProperty('--push',1.025+travel*push);
 activeFrame.style.setProperty('--pan-x',`${paused?0:(.5-travel)*1.8+pointerX*.55}%`);
 activeFrame.style.setProperty('--pan-y',`${paused?0:(travel-.5)*1.1+pointerY*.35}%`);
 container.style.setProperty('--heat',stageIndex===4?clamp((phase-.35)*1.35):0);
}
function updateHud(){
 if(stageIndex!==desiredIndex)return;
 const temp=stageIndex===4?Math.round(82+26*ease(clamp(phase*1.45))):108;
 $('#story-temperature').textContent=String(temp);$('#story-hud').classList.toggle('critical',temp>=100);$('.hud-bar>span').style.width=`${(temp-70)/45*100}%`;$('#story-signal-state').textContent=temp>=100?'DESVIO IDENTIFICADO · SIMULAÇÃO':'LEITURA ILUSTRATIVA';
}
function syncStory(){
 const r=section.getBoundingClientRect(),wasVisible=visible;
 visible=r.top<innerHeight&&r.bottom>0&&!document.hidden;
 section.classList.toggle('story-visible',visible);
 if(!visible){clearTimeout(selectionTimer);clearTimeout(warmTimer);return;}
 const p=clamp(-r.top/(r.height-innerHeight)),n=Math.min(8,Math.floor(p*9));phase=clamp(p*9-n);
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
 for(const event of ['pointerenter','focus'])b.addEventListener(event,()=>warmImage(sceneKey(index),sceneSizes));
});
$('#story-prev').addEventListener('click',()=>gotoChapter(Math.max(0,desiredIndex)-1));$('#story-next').addEventListener('click',()=>gotoChapter(Math.max(0,desiredIndex)+1));
let queued=false;
function queueSync(){if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;syncStory();});}}
window.addEventListener('scroll',queueSync,{passive:true});window.addEventListener('resize',queueSync);
document.addEventListener('visibilitychange',queueSync);
$('.story-sticky').addEventListener('pointermove',e=>{if(e.pointerType==='touch'||paused||!visible)return;pointerX=e.clientX/innerWidth-.5;pointerY=e.clientY/innerHeight-.5;queueSync();});
$('.story-sticky').addEventListener('pointerleave',()=>{pointerX=pointerY=0;queueSync();});
window.addEventListener('minefy-motion',e=>{paused=e.detail.paused;queueSync();});
warmOnApproach(section,sceneKey(0),sceneSizes);syncStory();

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
