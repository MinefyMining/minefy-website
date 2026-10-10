import {swapImage,warmImage} from './media.js?v=4152dfe81a';
import {equipmentIcon} from './equipment-icons.js?v=4152dfe81a';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches||document.body.classList.contains('motion-paused'),selected='TR-001',windowMinutes=30,zoom=1.05,animations=[];

// Fixed demonstration samples: no live fleet connection, random telemetry or model inference.
const assets=[
 {id:'TR-001',type:'Caminhão fora de estrada',icon:'haul',x:56,y:34,alert:true,oil:[82,83,84,84,85,87,90,91,94,98,103,108],pressure:[4.2,4.1,4.2,4,3.9,3.8,3.5,3.3,3.1,2.8,2.4,2.1],load:86,speed:[18,22,26,28,24,19,12,18,24,30,29,28],speedScale:60,fuel:[68,68,67,67,66,65,65,64,63,62,62,61]},
 {id:'TR-014',type:'Caminhão fora de estrada',icon:'haul',x:23,y:61,alert:false,oil:[79,79,80,81,80,82,82,83,82,83,82,83],pressure:[4.3,4.2,4.3,4.2,4.2,4.1,4.2,4.1,4.1,4.2,4.1,4.1],load:78,speed:[0,0,8,18,24,28,30,26,24,31,32,32],speedScale:60,fuel:[76,76,75,75,74,74,73,73,72,72,72,71]},
 {id:'EX-007',type:'Escavadeira hidráulica',icon:'excavator',x:39,y:54,alert:false,oil:[76,77,77,78,79,78,80,80,79,80,81,81],pressure:[4,4,4.1,4,4.1,4.2,4.1,4,4.1,4,4,4],load:72,speed:[0,0,.8,1.2,1.8,1.2,0,0,0,0,0,0],speedScale:10,fuel:[58,58,57,57,57,56,56,56,55,55,55,54]},
 {id:'DT-003',type:'Trator de esteiras',icon:'dozer',x:34,y:24,alert:false,oil:[82,83,82,84,85,84,85,86,86,85,86,87],pressure:[4.1,4.1,4.2,4.1,4,4.1,4,4.1,4,4,4.1,4],load:81,speed:[2,2.8,3.6,4.2,3.4,1.8,2.6,3.8,4.6,4.8,4.4,4.2],speedScale:10,fuel:[50,50,49,49,48,48,47,47,46,46,45,45]},
 {id:'LV-004',type:'Caminhonete de apoio',icon:'pickup',x:77,y:43,alert:false,oil:[76,76,77,78,78,77,78,78,79,78,79,79],pressure:[3.8,3.9,3.8,3.8,3.9,3.8,3.9,3.9,3.8,3.8,3.9,3.9],load:42,speed:[0,0,12,24,32,36,30,24,30,38,36,35],speedScale:60,fuel:[83,83,83,82,82,82,81,81,81,80,80,80]},
 {id:'SC-005',type:'Scroller · rejeitos e água',icon:'scroller',x:87,y:73,alert:false,oil:[72,73,73,74,74,75,74,75,75,76,75,76],pressure:[3.8,3.8,3.9,3.8,3.9,3.8,3.8,3.9,3.8,3.9,3.8,3.8],load:62,speed:[.6,.8,1,1.4,1.2,1,.8,1,1.2,1.4,1.2,1.4],speedScale:10,fuel:[66,66,65,65,65,64,64,64,63,63,63,62]}
];
const cycles=[11,15,18,17,20,19,16,12];
const format=(n,d=1)=>n.toFixed(d).replace('.',',');
const last=arr=>arr[arr.length-1];
const speedText=value=>Number.isInteger(value)?String(value):format(value);
const mean=values=>values.reduce((total,v)=>total+v,0)/values.length;
function motion(element,frames,options){if(paused||document.hidden)return;const rect=element.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;animations=animations.filter(a=>a.playState==='running');animations.push(element.animate(frames,options));}

assets.forEach(asset=>{
 const button=document.createElement('button');button.className=`equipment-marker${asset.alert?' warning':''}`;button.dataset.asset=asset.id;button.style.left=`${asset.x}%`;button.style.top=`${asset.y}%`;button.setAttribute('aria-label',`Selecionar ${asset.id}, ${asset.type}${asset.alert?', em alerta':''}`);button.setAttribute('aria-pressed',String(asset.id===selected));button.title=`${asset.type} · ${asset.id}`;button.innerHTML=`<span class="marker-symbol">${equipmentIcon(asset.icon)}<i class="marker-condition" aria-hidden="true"></i></span><span class="marker-name">${asset.id}</span><span class="marker-telemetry">${asset.alert?`${last(asset.oil)} °C`:`${speedText(last(asset.speed))} km/h`}</span>`;button.addEventListener('click',()=>selectAsset(asset.id));$('#command-markers').append(button);
});

function smoothPath(points){
 if(points.length<2)return '';
 let path=`M${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
 for(let i=1;i<points.length-1;i++){const p=points[i],next=points[i+1];path+=` Q${p[0].toFixed(2)} ${p[1].toFixed(2)} ${((p[0]+next[0])/2).toFixed(2)} ${((p[1]+next[1])/2).toFixed(2)}`;}
 const end=points[points.length-1];return path+` T${end[0].toFixed(2)} ${end[1].toFixed(2)}`;
}
function samples(asset,key){
 const values=asset[key];if(windowMinutes===30)return values;
 const first=values[0];
 const baseline=Array.from({length:33},(_,i)=>{
  if(key==='oil')return Math.max(70,first-3+Math.floor(i/11));
  if(key==='fuel')return Math.min(100,first+Math.ceil((33-i)/11));
  if(key==='speed')return values[i%values.length];
  return first+(i<17?.1:0);
 });return [...baseline,...values];
}
function drawTrend(selector,values,{width,min,max,ticks,unit,color,threshold,thresholdLabel,gradient}){
 const svg=$(selector),left=30,right=width-12,top=17,bottom=141;
 const x=i=>left+i/(values.length-1)*(right-left),y=value=>bottom-(value-min)/(max-min)*(bottom-top);
 const pts=values.map((v,i)=>[x(i),y(v)]),path=smoothPath(pts),end=pts[pts.length-1];
 const times=windowMinutes===30?['14:00','14:10','14:20','14:30']:['12:30','13:10','13:50','14:30'];
 let markup=`<defs><linearGradient id="${gradient}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${color}" stop-opacity=".20"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>`;
 ticks.forEach(t=>{markup+=`<line class="chart-grid" x1="${left}" x2="${right}" y1="${y(t)}" y2="${y(t)}"/><text class="chart-axis" x="${left-9}" y="${y(t)+3}" text-anchor="end">${String(t).replace('.',',')}</text>`;});
 times.forEach((t,i)=>{markup+=`<text class="chart-axis" x="${left+i/3*(right-left)}" y="165" text-anchor="${i===0?'start':i===3?'end':'middle'}">${t}</text>`;});
 if(threshold!==undefined)markup+=`<line class="chart-threshold" x1="${left}" x2="${right}" y1="${y(threshold)}" y2="${y(threshold)}"/><text class="chart-threshold-label" x="${right-3}" y="${y(threshold)-6}" text-anchor="end">${thresholdLabel}</text>`;
 markup+=`<path class="trend-area" d="${path} L${right} ${bottom} L${left} ${bottom}Z" fill="url(#${gradient})"/><path class="trend-line" d="${path}" pathLength="1" fill="none" stroke="${color}"/><circle class="trend-end-glow" cx="${end[0]}" cy="${end[1]}" r="8" fill="${color}"/><circle cx="${end[0]}" cy="${end[1]}" r="3" fill="${color}"/>`;
 svg.innerHTML=markup;svg.setAttribute('aria-label',`${selected}: histórico demonstrativo de ${unit}, de ${format(values[0])} a ${format(last(values))}, janela de ${windowMinutes} minutos.`);
 const trace=svg.querySelector('.trend-line');motion(trace,[{strokeDasharray:'1',strokeDashoffset:1},{strokeDasharray:'1',strokeDashoffset:0}],{duration:1300,easing:'cubic-bezier(.2,.7,.2,1)'});
 motion(svg.querySelector('.trend-area'),[{opacity:0},{opacity:1}],{duration:1100,easing:'ease-out'});
}
function drawCycles(){
 const svg=$('#cycles-chart'),left=27,right=340,top=17,bottom=141,w=(right-left)/cycles.length;
 let markup='';[0,10,20].forEach(v=>{const y=bottom-v/24*(bottom-top);markup+=`<line class="chart-grid" x1="${left}" x2="${right}" y1="${y}" y2="${y}"/><text class="chart-axis" x="${left-8}" y="${y+3}" text-anchor="end">${v}</text>`;});
 cycles.forEach((v,i)=>{const height=v/24*(bottom-top),x=left+i*w+8,y=bottom-height;markup+=`<rect class="cycle-bar" x="${x}" y="${y}" width="${w-16}" height="${height}" rx="2" fill="${i===4?'#dfbd75':'#81949a'}"/><text class="bar-value" x="${x+(w-16)/2}" y="${y-7}" text-anchor="middle">${v}</text><text class="chart-axis" x="${x+(w-16)/2}" y="165" text-anchor="middle">${String(i+6).padStart(2,'0')}h</text>`;});svg.innerHTML=markup;
 svg.querySelectorAll('.cycle-bar').forEach((bar,i)=>motion(bar,[{opacity:0,transform:'scaleY(.1)'},{opacity:1,transform:'scaleY(1)'}],{duration:800,delay:i*65,easing:'cubic-bezier(.2,.7,.2,1)'}));
}
function renderSpeed(asset){
 const current=last(asset.speed),values=samples(asset,'speed'),max=asset.speedScale;
 const radius=104,cx=175,cy=129,point=ratio=>[cx-Math.cos(ratio*Math.PI)*radius,cy-Math.sin(ratio*Math.PI)*radius];
 const start=point(0),end=point(1),tip=point(current/max);
 let svg=`<path class="speed-track" d="M${start[0]} ${start[1]} A${radius} ${radius} 0 0 1 ${end[0]} ${end[1]}"/>`;
 if(current>0)svg+=`<path class="speed-progress" d="M${start[0]} ${start[1]} A${radius} ${radius} 0 0 1 ${tip[0]} ${tip[1]}"/><circle class="speed-tip" cx="${tip[0]}" cy="${tip[1]}" r="5"/>`;
 for(let i=0;i<=20;i++){const angle=i/20*Math.PI,r1=radius+13,r2=r1+(i%5===0?7:3);svg+=`<line class="dial-tick ${i%5===0?'major':''}" x1="${cx-Math.cos(angle)*r1}" y1="${cy-Math.sin(angle)*r1}" x2="${cx-Math.cos(angle)*r2}" y2="${cy-Math.sin(angle)*r2}"/>`;}
 svg+=`<text class="speed-number" x="${cx}" y="109" text-anchor="middle">${speedText(current)}</text><text class="speed-unit" x="${cx}" y="129" text-anchor="middle">km/h</text><text class="chart-axis" x="${start[0]-5}" y="153" text-anchor="middle">0</text><text class="chart-axis" x="${end[0]+5}" y="153" text-anchor="middle">${max}</text><text class="speed-caption" x="${cx}" y="158" text-anchor="middle">${current===0?'SEM DESLOCAMENTO':'EM DESLOCAMENTO'}</text>`;
 $('#speed-gauge').innerHTML=svg;$('#speed-gauge').setAttribute('aria-label',`${asset.id}: velocidade ${speedText(current)} km/h. Escala de 0 a ${max} km/h.`);
 $('#speed-average').textContent=`${format(mean(values))} km/h`;$('#speed-peak').textContent=`${speedText(Math.max(...values))} km/h`;
 const path=smoothPath(values.map((v,i)=>[3+i/(values.length-1)*334,30-v/max*26]));$('#speed-spark').innerHTML=`<path d="${path}" fill="none"/>`;$('#speed-spark').setAttribute('aria-label',`Velocidade de ${asset.id} no período selecionado, média ${format(mean(values))} km/h.`);
 motion($('#speed-gauge .speed-progress')||$('#speed-gauge'),[{opacity:.2},{opacity:1}],{duration:800,easing:'ease-out'});
}
function renderFuel(asset){
 const values=samples(asset,'fuel'),current=last(values),drop=values[0]-current;
 $('#fuel-level').innerHTML=`${current}<small>%</small>`;$('#fuel-period-change').textContent=`−${format(drop,0)} p.p. no período`;
 $('#fuel-meter').style.setProperty('--fuel-level',`${current}%`);$('#fuel-meter').classList.toggle('low',current<=20);$('#fuel-meter').setAttribute('aria-label',`Nível de combustível: ${current}%`);
 const low=Math.max(0,Math.floor(Math.min(...values)/10)*10-10),high=Math.min(100,Math.ceil(Math.max(...values)/10)*10+10),ticks=[];for(let i=low;i<=high;i+=10)ticks.push(i);
 drawTrend('#fuel-chart',values,{width:520,min:low,max:high,ticks,unit:'nível de combustível em %',color:'#d2b678',gradient:'fuel-area-gradient'});
}
function renderCharts(){
 const asset=assets.find(a=>a.id===selected),warm=asset.alert?'#e69a87':'#d4b776';
 drawTrend('#temperature-chart',samples(asset,'oil'),{width:350,min:70,max:115,ticks:[70,85,100,115],unit:'temperatura em °C',color:warm,threshold:100,thresholdLabel:'REFERÊNCIA DA SIMULAÇÃO',gradient:'oil-area-gradient'});
 drawTrend('#pressure-chart',samples(asset,'pressure'),{width:350,min:1,max:5,ticks:[1,2,3,4,5],unit:'pressão em bar',color:asset.alert?'#e0b787':'#8daeb7',threshold:2.4,thresholdLabel:'FAIXA ILUSTRATIVA',gradient:'pressure-area-gradient'});
 $('#pressure-trend-end').textContent=format(last(asset.pressure));
 $('#temperature-trend-end').textContent=last(asset.oil);
 $('.trend-card .chart-reading').classList.toggle('warning-reading',asset.alert);
 renderSpeed(asset);renderFuel(asset);
}
function frameMap(){
 const asset=assets.find(a=>a.id===selected),amount=Math.min(5,(zoom-1)*15),x=(50-asset.x)/50*amount,y=(50-asset.y)/50*amount;
 $('#command-map-world').style.transform=`translate(${x}%,${y}%) scale(${zoom})`;
 $('#map-zoom-in').disabled=zoom>=1.8;$('#map-zoom-out').disabled=zoom<=1.001;
}
function selectAsset(id){
 const asset=assets.find(a=>a.id===id);if(!asset)return;selected=id;
 $('#command-asset-select').value=id;
 $$('.equipment-marker').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.asset===id)));
 $('.command-asset').classList.toggle('has-alert',asset.alert);$('#map-selection').classList.toggle('has-alert',asset.alert);
 $('#asset-detail-heading').textContent=id;$('#command-asset-type').textContent=asset.type;$('#asset-state-icon').innerHTML=equipmentIcon(asset.icon);
 $('#telemetry-asset').textContent=id;$('#telemetry-type').textContent=asset.type;
 $('#asset-condition').textContent=asset.alert?'ALERTA DE TEMPERATURA':'CONDIÇÃO NORMAL · SIMULAÇÃO';
 $('#command-oil').innerHTML=`${last(asset.oil)}<small>°C</small>`;$('#command-pressure').innerHTML=`${format(last(asset.pressure))} <small>bar</small>`;$('#command-load').innerHTML=`${asset.load} <small>%</small>`;
 $('#command-speed').innerHTML=`${speedText(last(asset.speed))} <small>km/h</small>`;$('#command-fuel').innerHTML=`${last(asset.fuel)} <small>%</small>`;
 $('#asset-fuel-fill').style.width=`${last(asset.fuel)}%`;
 $('#command-oil-context').textContent=asset.alert?'Subida de 26 °C na janela de 30 min':'Leitura dentro da faixa demonstrativa';
 $('#command-asset-summary').textContent=asset.alert?'Temperatura elevada e pressão em queda. A combinação dos sinais orienta a análise da equipe.':'Posição, parâmetros e histórico reunidos para acompanhar a condição e o trabalho do equipamento.';
 $('#map-selection-label').textContent=asset.alert?'EVENTO PRIORITÁRIO':'EQUIPAMENTO SELECIONADO';$('#map-selection-title').innerHTML=`${id} <span>${asset.alert?'Alta temperatura do óleo':asset.type}</span>`;$('#map-selection-detail').textContent=asset.alert?'108 °C · posição e sinais associados à ocorrência.':`${last(asset.oil)} °C · condição normal na simulação.`;
 renderCharts();frameMap();
 motion($('.asset-identity'),[{opacity:.25,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out'});
}
$('#command-asset-select').addEventListener('change',e=>selectAsset(e.target.value));
$$('[data-window]').forEach(button=>button.addEventListener('click',()=>{windowMinutes=Number(button.dataset.window);$$('[data-window]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderCharts();}));
$('#map-zoom-in').addEventListener('click',()=>{zoom=Math.min(1.8,zoom+.2);frameMap();});
$('#map-zoom-out').addEventListener('click',()=>{zoom=Math.max(1,zoom-.2);frameMap();});
$('#map-reset').addEventListener('click',()=>{zoom=1.05;selectAsset('TR-001');});

function presentation(){
 renderCharts();drawCycles();if(paused)return;
 motion($('.command-frame'),[{opacity:.7,transform:'translateY(38px) rotateX(4deg) scale(.975)'},{opacity:1,transform:'translateY(0) rotateX(0) scale(1)'}],{duration:1400,easing:'cubic-bezier(.16,1,.3,1)'});
 motion($('.command-terrain'),[{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:2600,easing:'cubic-bezier(.16,1,.3,1)'});
 $$('.command-kpis>div').forEach((el,i)=>motion(el,[{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,delay:150+i*100,easing:'ease-out'}));
 motion($('#map-selection'),[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,delay:500,easing:'ease-out'});
}
$('#command-replay').addEventListener('click',presentation);
const entrance=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){presentation();entrance.disconnect();}},{threshold:.15});entrance.observe($('.command-frame'));
selectAsset(selected);drawCycles();

// Commercial close: current offers confirmed by Minefy's CEO in this revision.
const products=[
 {image:'tablet',category:'HARDWARE INDUSTRIAL',title:'Conexão que começa<br>na cabine.',alt:'Tablet industrial embarcado — representação conceitual',position:'74% center'},
 {image:'can',category:'TELEMETRIA ACTISKY',title:'Cada ativo.<br>Um contexto completo.',alt:'Módulo ActiSky e integração embarcada — representação conceitual',position:'71% center'},
 {image:'safety',category:'SEGURANÇA · ADAS E DMS',title:'Atenção ao condutor.<br>Visão da operação.',alt:'Operador atento e câmeras de monitoramento na cabine — representação conceitual',position:'43% center'},
 {image:'pickup',category:'LOCAÇÃO DE CAMINHONETES',title:'Sua equipe.<br>Preparada para o campo.',alt:'Caminhonete adaptada para mineração — representação conceitual',position:'70% center'},
 {image:'tailings',category:'SCROLLER · SERVIÇOS EM BARRAGENS',title:'Gestão dos rejeitos.<br>Recuperação da água.',alt:'Scroller trabalhando na área de rejeitos — representação conceitual',position:'69% center'}
];
let productIndex=0,productRequest=0;
const productSizes='(max-width: 700px) 100vw, 60vw';
async function chooseProduct(index){
 const item=products[index],img=$('#product-photo'),key=`cinema/${item.image}`;
 if(index===productIndex&&img.dataset.media===key)return;
 productIndex=index;const request=++productRequest;
 $$('.offering').forEach((offering,i)=>{const open=i===index;offering.classList.toggle('active',open);offering.querySelector('button').setAttribute('aria-expanded',String(open));offering.querySelector('button b').textContent=open?'−':'+';offering.querySelector('.offering-detail').hidden=!open;});
 $('.portfolio-visual').setAttribute('aria-busy','true');
 try{
  if(!await swapImage(img,key,{sizes:productSizes,valid:()=>request===productRequest}))return;
  img.alt=item.alt;img.style.objectPosition=item.position;
  $('#product-category').textContent=item.category;$('#product-photo-title').innerHTML=item.title;$('#product-number').textContent=String(index+1).padStart(2,'0');
  motion(img,[{opacity:.35,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'});
 }catch{/* Keep the previous image; clicking this offer again retries the request. */}
 finally{if(request===productRequest)$('.portfolio-visual').setAttribute('aria-busy','false');}
}
$$('.offering h3 button').forEach((button,i)=>{
 button.addEventListener('click',()=>chooseProduct(i));
 for(const event of ['pointerenter','focus'])button.addEventListener(event,()=>warmImage(`cinema/${products[i].image}`,productSizes));
});
window.addEventListener('minefy-motion',e=>{paused=e.detail.paused;if(paused){animations.forEach(a=>{try{a.finish();}catch{a.cancel();}});animations=[];}});
document.documentElement.dataset.commandReady='true';
