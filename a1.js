// =====================================================================
//  MILESTONE A1 — "THREE-DAY PROOF"  (Starbound: Little Legends)
//  Tests: do children voluntarily return for Day 2 and Day 3, and do
//  parents feel good about saying yes? Adds Time-to-Delight + Parent
//  Re-Engagement Intent. Data-driven activities = the content-pipeline seed.
// =====================================================================
import * as THREE from './vendor/three.module.min.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';

const $ = (id) => document.getElementById(id);
const QS = new URLSearchParams(location.search);
const todayStr = () => new Date().toISOString().slice(0,10);

// ---------------- Persistent state + analytics ----------------
const KEY='ll_a1', EKEY='ll_a1_events';
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || null; }catch(e){ return null; } }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }
let state = load() || {
  avatar:{created:false, skin:'#ffd9b8', hair:'#5a3a2a', color:'#5ec8c0', style:'short', name:'', stars:0, cosmetics:[]},
  day:1, completedDays:[], lastCompletedDate:null,
  rumiStage:1, twinkleForm:0,
  pre:null, post:null,
  history:[],            // {day,skillId,correct,hints,modeled,firstTry,ms}
  launchCount:0
};
let events = (()=>{ try{ return JSON.parse(localStorage.getItem(EKEY))||[]; }catch(e){ return []; } })();
let launchT = 0, delight={interaction:null,reward:null,smile:null,excited:null};
function log(ev,data={}){ events.push({t:Date.now(), rel: launchT?Math.round((performance.now()-launchT)):null, ev, day:state.day, ...data});
  try{ localStorage.setItem(EKEY, JSON.stringify(events)); }catch(e){} }

// ---------------- Audio ----------------
let audioOn=false, voice=null, actx=null;
function pickVoice(){ const v=speechSynthesis.getVoices();
  voice=v.find(x=>/female|samantha|karen|moira|tessa|google us english/i.test(x.name)&&/en/i.test(x.lang))||v.find(x=>/en/i.test(x.lang))||v[0]||null; }
if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }
function say(t,{rate=0.92,pitch=1.25,then=null}={}){ if(!('speechSynthesis' in window)){ if(then)setTimeout(then,400); return; }
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.rate=rate; u.pitch=pitch; if(voice)u.voice=voice; if(then)u.onend=then; speechSynthesis.speak(u);}catch(e){ if(then)setTimeout(then,400);} }
function chime(type='good'){ try{ actx=actx||new(window.AudioContext||window.webkitAudioContext)();
  const seq=type==='good'?[660,880]:type==='win'?[660,880,1320]:[520];
  seq.forEach((f,i)=>{ const o=actx.createOscillator(),g=actx.createGain(); o.type='sine'; o.frequency.value=f; o.connect(g); g.connect(actx.destination);
    const t=actx.currentTime+i*0.12; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.25,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+0.3); o.start(t); o.stop(t+0.32);});}catch(e){} }
// ---- Phase 1A: tap feedback + collection juice helpers ----
function haptic(ms){ try{ if(navigator.vibrate) navigator.vibrate(ms); }catch(e){} }
function tapRing(x,y){ const r=document.createElement('div'); r.className='tap-ring'; r.style.left=x+'px'; r.style.top=y+'px'; document.body.appendChild(r); setTimeout(()=>r.remove(),450); }
let comboN=0, comboT=0;
function collectChime(){ try{ actx=actx||new(window.AudioContext||window.webkitAudioContext)();
  const now=actx.currentTime; if(now-comboT>1.2) comboN=0; comboT=now; const step=Math.min(comboN,8); comboN++;
  const base=660*Math.pow(2,step/12); // upgraded sound: warm chord + shimmer, rising pitch on a combo
  [[base,'triangle',0,0.22],[base*1.5,'sine',0.05,0.16],[base*2,'sine',0.09,0.12]].forEach(([f,type,off,vol])=>{ const o=actx.createOscillator(),g=actx.createGain(); o.type=type; o.frequency.value=f; o.connect(g); g.connect(actx.destination);
    const tt=now+off; g.gain.setValueAtTime(0.0001,tt); g.gain.exponentialRampToValueAtTime(vol,tt+0.015); g.gain.exponentialRampToValueAtTime(0.0001,tt+0.28); o.start(tt); o.stop(tt+0.3); }); }catch(e){} }
let avatarPop=0; function avatarReact(){ avatarPop=1; }
function collectStar(pos){ burst(pos,'#FFD24D',14); collectChime(); haptic(12); twCheerUntil=performance.now()+450; // Twinkle celebrates collections
  if(delight.reward===null){ delight.reward=Math.round(performance.now()-launchT); log('first_reward',{ms:delight.reward}); } }

// ---------------- Renderer / scene ----------------
const root=$('scene-root');
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; root.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const FOG_GRAY=new THREE.Color('#b9b3c6'), FOG_BRIGHT=new THREE.Color('#cdefff');
scene.background=FOG_GRAY.clone(); scene.fog=new THREE.Fog(FOG_GRAY.clone(),22,60);
const camera=new THREE.PerspectiveCamera(56, innerWidth/innerHeight,0.1,200);
const CAM_OFF=new THREE.Vector3(0,7.5,10);
// ---- Stylized 3-point lighting (warm KEY / cool-blue FILL / purple RIM) — HUNTRIX stage look ----
const hemi=new THREE.HemisphereLight('#eaf2ff','#b6a9d8',0.45); scene.add(hemi); // soft ambient keeps characters readable
const sun=new THREE.DirectionalLight('#fff0d0',1.0); sun.position.set(8,16,6); sun.castShadow=true; // KEY (warm)
sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-22; sun.shadow.camera.right=22; sun.shadow.camera.top=22; sun.shadow.camera.bottom=-22; scene.add(sun);
const fillLight=new THREE.DirectionalLight('#5a8cff',0.38); fillLight.position.set(-9,5,7); scene.add(fillLight); // FILL (cool blue)
const rimLight=new THREE.DirectionalLight('#b06aff',0.7); rimLight.position.set(-4,7,-10); scene.add(rimLight); // RIM (purple) — supernatural edge
// ---- Cheap stylized "bloom": additive glow sprites on emissive focal points (mobile-friendly, no post FX) ----
function glowTex(){ const cv=document.createElement('canvas'); cv.width=cv.height=64; const x=cv.getContext('2d'); const g=x.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(0.4,'rgba(255,255,255,0.5)'); g.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle=g; x.fillRect(0,0,64,64); return new THREE.CanvasTexture(cv); }
const GLOW_TEX=glowTex();
function addGlow(parent,{color='#FFD24D',size=1,opacity=0.7,pos=[0,0,0]}={}){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW_TEX,color:new THREE.Color(color),transparent:true,opacity,blending:THREE.AdditiveBlending,depthWrite:false})); s.scale.set(size,size,1); s.position.set(pos[0],pos[1],pos[2]); parent.add(s); return s; }

// ---- Expressive anime faces (flat "face card" — the mobile Genshin/Honkai technique) ----
function drawFace(g,mode,iris){ g.clearRect(0,0,128,128); g.lineCap='round'; g.lineJoin='round';
  const ex=42,ex2=86,ey=64;
  g.strokeStyle='#5b3a2a'; g.lineWidth=4; g.beginPath(); g.moveTo(ex-12,ey-22); g.quadraticCurveTo(ex,ey-29,ex+12,ey-22); g.moveTo(ex2-12,ey-22); g.quadraticCurveTo(ex2,ey-29,ex2+12,ey-22); g.stroke(); // brows
  if(mode==='blink'){ g.strokeStyle='#3a2a32'; g.lineWidth=4; g.beginPath(); g.moveTo(ex-14,ey); g.quadraticCurveTo(ex,ey+8,ex+14,ey); g.moveTo(ex2-14,ey); g.quadraticCurveTo(ex2,ey+8,ex2+14,ey); g.stroke(); }
  else if(mode==='happy'){ g.strokeStyle='#3a2a32'; g.lineWidth=5; g.beginPath(); g.moveTo(ex-14,ey+5); g.quadraticCurveTo(ex,ey-12,ex+14,ey+5); g.moveTo(ex2-14,ey+5); g.quadraticCurveTo(ex2,ey-12,ex2+14,ey+5); g.stroke();
    g.fillStyle='rgba(255,140,170,0.5)'; g.beginPath(); g.ellipse(ex-6,ey+20,9,5,0,0,7); g.ellipse(ex2+6,ey+20,9,5,0,0,7); g.fill(); }
  else { [ex,ex2].forEach(cx=>{ g.fillStyle='#fff'; g.beginPath(); g.ellipse(cx,ey,14,18,0,0,7); g.fill();
    g.fillStyle=iris; g.beginPath(); g.arc(cx,ey+2,10,0,7); g.fill(); g.fillStyle='#241B3A'; g.beginPath(); g.arc(cx,ey+3,5,0,7); g.fill();
    g.fillStyle='#fff'; g.beginPath(); g.arc(cx-4,ey-4,3.6,0,7); g.fill();
    g.strokeStyle='#2a1f28'; g.lineWidth=3.5; g.beginPath(); g.moveTo(cx-15,ey-10); g.quadraticCurveTo(cx,ey-17,cx+15,ey-10); g.stroke(); }); }
  g.fillStyle='rgba(120,80,90,0.45)'; g.beginPath(); g.arc(64,ey+22,2.2,0,7); g.fill(); // nose
  g.strokeStyle='#c23a5a'; g.lineWidth=4; g.beginPath(); if(mode==='happy'){ g.moveTo(54,ey+34); g.quadraticCurveTo(64,ey+47,74,ey+34); } else { g.moveTo(57,ey+34); g.quadraticCurveTo(64,ey+41,71,ey+34); } g.stroke(); }
function makeFaceTex(mode,iris){ const cv=document.createElement('canvas'); cv.width=cv.height=128; drawFace(cv.getContext('2d'),mode,iris); const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t; }
const faces=[];
function addFace(head,{iris='#c98a3a',size=0.8,z=0.45}={}){ try{
  const tex={open:makeFaceTex('open',iris),blink:makeFaceTex('blink',iris),happy:makeFaceTex('happy',iris)};
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(size,size*0.92),new THREE.MeshBasicMaterial({map:tex.open,transparent:true,depthWrite:false,toneMapped:false}));
  pl.position.set(0,0.02,z); pl.renderOrder=2; head.add(pl);
  faces.push({pl,tex,next:performance.now()+2000+Math.random()*2500,blinkUntil:0}); }catch(e){} }

// ---- Anime visual pass: toon ramp + inverted-hull outline ----
function makeRamp(arr,w){ const t=new THREE.DataTexture(new Uint8Array(arr),w,1,THREE.RGBAFormat); t.minFilter=THREE.NearestFilter; t.magFilter=THREE.NearestFilter; t.needsUpdate=true; return t; }
const TOON_RAMP=makeRamp([70,70,92,255, 150,150,172,255, 232,232,244,255, 255,255,255,255],4); // crisp 4-band anime ramp
const OUTLINE_RAMP=makeRamp([84,84,84,255, 84,84,84,255],2); // flat → outline stays dark under any light
function addOutline(mesh,color='#2a2138',thk=0.022){ try{
  const m=new THREE.MeshToonMaterial({color:new THREE.Color(color), gradientMap:OUTLINE_RAMP, side:THREE.BackSide, fog:true});
  m.onBeforeCompile=sh=>{ sh.uniforms.uThk={value:thk};
    sh.vertexShader='uniform float uThk;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n\ttransformed += objectNormal * uThk;'); };
  let o; if(mesh.isSkinnedMesh){ o=new THREE.SkinnedMesh(mesh.geometry,m); o.bind(mesh.skeleton,mesh.bindMatrix); o.bindMode=mesh.bindMode; if(mesh.bindMatrixInverse) o.bindMatrixInverse.copy(mesh.bindMatrixInverse); }
  else o=new THREE.Mesh(mesh.geometry,m);
  o.castShadow=false; o.receiveShadow=false; o.renderOrder=(mesh.renderOrder||0)-1; mesh.add(o);
}catch(e){} }

const WORLD_R=20;
const water=new THREE.Mesh(new THREE.CircleGeometry(WORLD_R,64), new THREE.MeshStandardMaterial({color:'#7fb6bf',roughness:.5}));
water.rotation.x=-Math.PI/2; water.receiveShadow=true; scene.add(water);
const dock=new THREE.Mesh(new THREE.CircleGeometry(9,48), new THREE.MeshStandardMaterial({color:'#e7c9a6',roughness:1}));
dock.rotation.x=-Math.PI/2; dock.position.y=0.02; dock.receiveShadow=true; scene.add(dock);
// lighthouse
const lhMat=new THREE.MeshStandardMaterial({color:'#c9c4d2',roughness:.9});
const lhTower=new THREE.Mesh(new THREE.CylinderGeometry(1,1.5,5,20),lhMat); lhTower.position.y=2.5; lhTower.castShadow=true;
const lhRoof=new THREE.Mesh(new THREE.ConeGeometry(1.5,1.4,20), new THREE.MeshStandardMaterial({color:'#9a93a8',roughness:.9})); lhRoof.position.y=5.7;
const lhLightMat=new THREE.MeshStandardMaterial({color:'#fff6d8',emissive:'#000',emissiveIntensity:0});
const lhLight=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.05,.9,20),lhLightMat); lhLight.position.y=4.85;
const lighthouse=new THREE.Group(); lighthouse.add(lhTower,lhRoof,lhLight); lighthouse.position.set(0,0,-6); scene.add(lighthouse);
function house(x,z,col){ const g=new THREE.Group();
  const b=new THREE.Mesh(new THREE.BoxGeometry(2,1.8,2),new THREE.MeshStandardMaterial({color:col,roughness:.95})); b.position.y=.9; b.castShadow=true;
  const r=new THREE.Mesh(new THREE.ConeGeometry(1.6,1.1,4),new THREE.MeshStandardMaterial({color:'#fff',roughness:.8})); r.position.y=2.35; r.rotation.y=Math.PI/4;
  g.add(b,r); g.position.set(x,0,z); scene.add(g); }
[['#f4b98a',-7,-2],['#9ad2d8',7,-2],['#f3a6c4',-6,3],['#cdb8f0',6,3]].forEach(h=>house(h[1],h[2],h[0]));
// sparkles
const sparkles=[];
function makeSparkle(x,z){ const m=new THREE.Mesh(new THREE.OctahedronGeometry(.32),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.7})); m.position.set(x,1.2,z); addGlow(m,{color:'#FFD24D',size:0.85,opacity:0.6}); scene.add(m); sparkles.push({m,magnet:false,pop:0,seed:Math.random()*6}); }
[[-3,1],[3,.5],[-1.5,-2],[2,-3.5],[-4,-4]].forEach(p=>makeSparkle(p[0],p[1]));

// ---------------- Environment polish: sky, clouds, ambient sparkles, glow, flowers ----------------
// Enhanced 2D backdrop (temporary): a painted neon-dusk K-pop city panorama mapped on the sky dome.
const skyGeo=new THREE.SphereGeometry(90,32,20);
function paintBackdrop(){ const W=2048,H=1024,cv=document.createElement('canvas'); cv.width=W; cv.height=H; const x=cv.getContext('2d'); const horizon=H*0.5;
  let g=x.createLinearGradient(0,0,0,horizon); g.addColorStop(0,'#241a52'); g.addColorStop(0.45,'#5a3aa6'); g.addColorStop(0.8,'#b65a9e'); g.addColorStop(1,'#ffb37a'); x.fillStyle=g; x.fillRect(0,0,W,horizon);
  x.fillStyle='#1a1330'; x.fillRect(0,horizon,W,H-horizon);
  x.globalCompositeOperation='lighter'; x.globalAlpha=0.16; ['#4fd8ff','#ff4fa6','#b06aff'].forEach((c,i)=>{ x.fillStyle=c; const y0=H*(0.12+i*0.09); x.beginPath(); x.moveTo(0,y0); for(let xx=0;xx<=W;xx+=64) x.lineTo(xx,y0+Math.sin(xx*0.004+i)*40); for(let xx=W;xx>=0;xx-=64) x.lineTo(xx,y0+130+Math.sin(xx*0.004+i)*40); x.closePath(); x.fill(); });
  x.globalCompositeOperation='source-over'; x.globalAlpha=1;
  x.fillStyle='#fff'; for(let i=0;i<260;i++){ x.globalAlpha=0.4+Math.random()*0.6; x.beginPath(); x.arc(Math.random()*W,Math.random()*horizon*0.9,Math.random()*1.6+0.3,0,7); x.fill(); } x.globalAlpha=1;
  let hg=x.createRadialGradient(W*0.5,horizon,10,W*0.5,horizon,W*0.5); hg.addColorStop(0,'rgba(255,210,150,0.55)'); hg.addColorStop(1,'rgba(255,210,150,0)'); x.fillStyle=hg; x.fillRect(0,horizon-H*0.22,W,H*0.44);
  const wc=['#4fd8ff','#ff4fa6','#ffd24d']; let bx=0; while(bx<W){ const bw=40+Math.random()*90, bh=H*(0.06+Math.random()*0.16), by=horizon-bh;
    x.fillStyle='#2a1c4a'; x.fillRect(bx,by,bw,bh+H*0.05);
    for(let wy=by+8; wy<horizon-6; wy+=12) for(let wx=bx+6; wx<bx+bw-6; wx+=12) if(Math.random()<0.45){ x.fillStyle=wc[(Math.random()*3)|0]; x.globalAlpha=0.85; x.fillRect(wx,wy,4,5); }
    x.globalAlpha=1; bx+=bw+6; }
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t; }
const skyMat=new THREE.MeshBasicMaterial({map:paintBackdrop(),side:THREE.BackSide,fog:false,depthWrite:false}); skyMat.color.set('#8a86a0'); // dim until harmony returns
const bgURL=QS.get('bg'); if(bgURL){ try{ new THREE.TextureLoader().load(bgURL,tx=>{ tx.colorSpace=THREE.SRGBColorSpace; skyMat.map=tx; skyMat.needsUpdate=true; }); }catch(e){} } // swap in a custom 2D image
scene.add(new THREE.Mesh(skyGeo,skyMat)); scene.background=null;
const clouds=[]; for(let i=0;i<5;i++){ const c=new THREE.Mesh(new THREE.SphereGeometry(2.2+Math.random()*1.5,10,8),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0.5,fog:false})); c.scale.y=0.45; c.position.set(-30+Math.random()*60,16+Math.random()*8,-18-Math.random()*30); clouds.push(c); scene.add(c); }
let ambient=null; { const N=90,p=new Float32Array(N*3); for(let i=0;i<N;i++){ const a=Math.random()*Math.PI*2,r=2+Math.random()*18; p[i*3]=Math.cos(a)*r; p[i*3+1]=0.5+Math.random()*10; p[i*3+2]=Math.sin(a)*r; } const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(p,3)); ambient=new THREE.Points(g,new THREE.PointsMaterial({color:'#FFE9A8',size:0.18,transparent:true,opacity:0,depthWrite:false})); scene.add(ambient); }
function radialTex(){ const cv=document.createElement('canvas'); cv.width=cv.height=64; const x=cv.getContext('2d'); const g=x.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,240,180,1)'); g.addColorStop(1,'rgba(255,240,180,0)'); x.fillStyle=g; x.fillRect(0,0,64,64); return new THREE.CanvasTexture(cv); }
const lhHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:radialTex(),color:'#FFE9A8',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false})); lhHalo.scale.set(5,5,1); lhHalo.position.set(0,4.85,-6); scene.add(lhHalo);
const flowers=[], FCOL=['#ff8fcf','#ffd24d','#8fd0ff','#7ef0c0','#b69cff']; for(let i=0;i<12;i++){ const a=(i/12)*Math.PI*2,r=5+Math.random()*3; const f=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,8),new THREE.MeshToonMaterial({color:FCOL[i%5],gradientMap:TOON_RAMP})); f.position.set(Math.cos(a)*r,0.2,Math.sin(a)*r); f.scale.setScalar(0); flowers.push(f); scene.add(f); }
water.material.emissive=new THREE.Color('#2faab0'); water.material.emissiveIntensity=0;
// ---- Supernatural urban-magic props: glowing crystals + rotating magic-glyph circles ----
const CRYSTAL_COLS=['#ff4fa6','#b06aff','#4fd8ff','#ffd24d','#7ef0c0']; // HUNTRIX color families
const crystals=[];
function makeCrystal(x,z,col,h){ const g=new THREE.Group();
  const c=new THREE.Mesh(new THREE.ConeGeometry(0.35,h,6),new THREE.MeshToonMaterial({color:col,gradientMap:TOON_RAMP,emissive:new THREE.Color(col),emissiveIntensity:0.5})); c.position.y=h/2; c.castShadow=true;
  const tip=new THREE.Mesh(new THREE.OctahedronGeometry(0.24),new THREE.MeshToonMaterial({color:col,gradientMap:TOON_RAMP,emissive:new THREE.Color(col),emissiveIntensity:0.6})); tip.position.y=h+0.1;
  g.add(c,tip); addGlow(g,{color:col,size:1.6,opacity:0.5,pos:[0,h*0.7,0]}); g.position.set(x,0,z); g.rotation.y=Math.random()*6; scene.add(g); crystals.push({g,seed:Math.random()*6}); }
[[-9,-5],[9,-5],[-11,1],[11,2],[-6,6],[6,7]].forEach((p,i)=>makeCrystal(p[0],p[1],CRYSTAL_COLS[i%CRYSTAL_COLS.length],1.1+Math.random()*0.9));
const glyphs=[];
function makeGlyph(x,z,col,r){ const g=new THREE.Group();
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r,0.04,6,48),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.7})); ring.rotation.x=-Math.PI/2;
  const ring2=new THREE.Mesh(new THREE.TorusGeometry(r*0.6,0.03,6,40),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.55})); ring2.rotation.x=-Math.PI/2;
  const band=new THREE.Mesh(new THREE.RingGeometry(r*0.62,r*0.66,16,1),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.35,side:THREE.DoubleSide})); band.rotation.x=-Math.PI/2;
  g.add(ring,ring2,band); g.position.set(x,0.06,z); scene.add(g); glyphs.push({g,seed:Math.random()*6,r1:ring}); }
makeGlyph(0,0,'#b06aff',3.2); makeGlyph(-7,-1,'#4fd8ff',1.6); makeGlyph(7,-1,'#ff4fa6',1.6);

const skin=c=>new THREE.MeshToonMaterial({color:c, gradientMap:TOON_RAMP});
// avatar (child) — materials kept for customization + cosmetics
const avatar=new THREE.Group();
const avBodyMat=skin(state.avatar.color), avHairMat=skin(state.avatar.hair), avSkinMat=skin(state.avatar.skin);
let avHat=null, avCape=null, avHair=null;
const avBody=new THREE.Mesh(new THREE.CapsuleGeometry(.4,.6,6,12),avBodyMat); avBody.position.y=.85; avBody.castShadow=true;
const avHead=new THREE.Mesh(new THREE.SphereGeometry(.45,18,18),avSkinMat); avHead.position.y=1.7; avHead.castShadow=true;
const avEye=x=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),new THREE.MeshStandardMaterial({color:'#241B3A'}));m.position.set(x,1.74,.4);return m;};
const avStar=new THREE.Mesh(new THREE.OctahedronGeometry(.18),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#a98a00',emissiveIntensity:.4})); avStar.position.set(0,1.05,.4);
avatar.add(avBody,avHead,avStar); addFace(avHead,{iris:'#c98a3a',size:0.8,z:0.45}); // expressive anime face
function rebuildHair(style){ if(avHair) avatar.remove(avHair); avHair=new THREE.Group();
  const cap=new THREE.Mesh(new THREE.SphereGeometry(.5,18,18,0,6.3,0,1.9),avHairMat); cap.position.y=1.75; avHair.add(cap);
  if(style==='ponytail'){ const p=new THREE.Mesh(new THREE.CapsuleGeometry(.14,.7,4,8),avHairMat); p.position.set(0,1.5,-.42); avHair.add(p); }
  else if(style==='puffs'){ [-.5,.5].forEach(x=>{ const s=new THREE.Mesh(new THREE.SphereGeometry(.24,12,12),avHairMat); s.position.set(x,1.85,0); avHair.add(s); }); }
  else if(style==='bun'){ const b=new THREE.Mesh(new THREE.SphereGeometry(.26,12,12),avHairMat); b.position.set(0,2.18,0); avHair.add(b); }
  else if(style==='long'){ const l=new THREE.Mesh(new THREE.CapsuleGeometry(.22,.8,6,10),avHairMat); l.position.set(0,1.4,-.3); avHair.add(l); }
  avatar.add(avHair); }
rebuildHair(state.avatar.style||'short');
avatar.position.set(0,0,5); scene.add(avatar);
[avBody,avHead].forEach(m=>addOutline(m,'#2a2138',0.02)); // anime outline on the hero
let avStarGlow=addGlow(avStar,{color:state.avatar.color,size:0.95,opacity:0.85}); // color-identity glow on the hero's star-tool
function applyAvatar(){ avBodyMat.color.set(state.avatar.color); avHairMat.color.set(state.avatar.hair); avSkinMat.color.set(state.avatar.skin);
  if(avStarGlow) avStarGlow.material.color.set(state.avatar.color);
  if(heroLoaded){ // tint the real model's named material zones (the evolved creation customizes the model itself)
    heroOutfitMats.forEach(m=>m.color.set(state.avatar.color));
    heroHairMats.forEach(m=>m.color.set(state.avatar.hair));
    heroSkinMats.forEach(m=>m.color.set(state.avatar.skin)); } }
function addHat(){ if(!state.avatar.cosmetics.includes('hat')) state.avatar.cosmetics.push('hat'); if(heroLoaded) return; if(avHat)return; avHat=new THREE.Mesh(new THREE.ConeGeometry(.45,.5,16),new THREE.MeshStandardMaterial({color:'#FF8FCF',roughness:.6})); avHat.position.y=2.15; avatar.add(avHat); }
function addCape(){ if(!state.avatar.cosmetics.includes('cape')) state.avatar.cosmetics.push('cape'); if(heroLoaded) return; if(avCape)return; avCape=new THREE.Mesh(new THREE.ConeGeometry(.55,1,12,1,true),new THREE.MeshStandardMaterial({color:'#7B4FC4',side:THREE.DoubleSide,roughness:.7})); avCape.position.set(0,.95,-.28); avatar.add(avCape); }
function addStar(){ if(!state.avatar.cosmetics.includes('star')) state.avatar.cosmetics.push('star'); if(heroLoaded) return; avStar.scale.setScalar(1.7); avStar.material.emissiveIntensity=.95; }

// ---------- Optional rigged anime character (drop-in; silently falls back to the blob) ----------
let heroMixer=null, heroActions={}, heroLoaded=false, heroPerforming=false, heroMats=[], heroOutfitMats=[], heroHairMats=[], heroSkinMats=[], heroCurrent=null, rumiMixer=null;
const HERO_URL = QS.get('hero') || 'assets/hero/hero.glb';
const HERO_ROT = parseFloat(QS.get('heroRotY')||'0')||0;
const INSPECT = QS.get('inspect')==='1'; // turntable debug view of the character
function gradientRamp(){ const d=new Uint8Array([88,88,88,255, 178,178,178,255, 255,255,255,255]);
  const tex=new THREE.DataTexture(d,3,1,THREE.RGBAFormat); tex.minFilter=THREE.NearestFilter; tex.magFilter=THREE.NearestFilter; tex.needsUpdate=true; return tex; }
function toonify(model,buckets){ const B=buckets||{}, outlineTargets=[];
  model.traverse(o=>{ if(o.isMesh && o.material){ const arr=Array.isArray(o.material)?o.material:[o.material];
    const out=arr.map(m=>{ const baked = !m.map && !!m.emissiveMap; // models that bake color into the emissive (unlit) channel
      const tm=new THREE.MeshToonMaterial({ color:(baked?new THREE.Color('#000'):(m.color?m.color.clone():new THREE.Color('#ffffff'))), map:m.map||null, emissive:(baked?new THREE.Color('#fff'):new THREE.Color('#000')), emissiveMap:m.emissiveMap||null, emissiveIntensity:(baked?1:0), gradientMap:TOON_RAMP, transparent:!!m.transparent, alphaTest:m.alphaTest||0, side:(m.side!==undefined?m.side:THREE.FrontSide) });
      if(B.all) B.all.push(tm);
      const nm=((m.name||'')+' '+(o.name||'')).toLowerCase(); // sort into tintable zones by material/mesh name
      if(B.hair && /hair|braid|bang|fringe|ponytail|bun/.test(nm)) B.hair.push(tm);
      else if(B.outfit && /cloth|outfit|dress|jacket|shirt|top|bottom|skirt|coat|costume|pant|short|vest/.test(nm)) B.outfit.push(tm);
      else if(B.skin && /skin|face|head|body|arm|leg|hand/.test(nm)) B.skin.push(tm);
      return tm; });
    o.material=Array.isArray(o.material)?out:out[0]; o.castShadow=true; o.frustumCulled=false; outlineTargets.push(o); } });
  /* outlines disabled for imported GLB — AI-generated meshes have messy normals that make the inverted-hull outline produce dark artifacts */ }
// Mount any character subtree into a slot group: scale to ~1.8, ground, center, toon, animate.
function mountCharacter(group,root,animations,{tag='',buckets=null,rot=HERO_ROT}={}){
  const box=new THREE.Box3().setFromObject(root),size=new THREE.Vector3(); box.getSize(size);
  const s=1.8/(size.y||1); root.scale.setScalar(s); root.rotation.y=rot;
  const box2=new THREE.Box3().setFromObject(root); root.position.set(0,-box2.min.y,0); // center + feet to ground
  toonify(root,buckets); group.add(root);
  let mixer=null, actions={};
  if(animations && animations.length){ mixer=new THREE.AnimationMixer(root);
    const clips = tag ? animations.filter(c=>(c.name||'').toLowerCase().includes(tag)).concat(animations.filter(c=>!(c.name||'').toLowerCase().includes(tag))) : animations;
    clips.forEach(c=>{ const n=(c.name||'').toLowerCase(); const k=/idle/.test(n)?'idle':(/walk|run/.test(n)?'walk':(/dance/.test(n)?'dance':null)); if(k&&!actions[k]) actions[k]=mixer.clipAction(c); });
    if(!actions.idle && clips[0]) actions.idle=mixer.clipAction(clips[0]);
    if(actions.idle) actions.idle.reset().play(); }
  return {mixer,actions}; }
function playHero(key){ if(!heroMixer||!heroActions[key]||heroCurrent===key) return; const next=heroActions[key];
  Object.values(heroActions).forEach(a=>{ if(a!==next) a.fadeOut(0.25); }); next.reset().fadeIn(0.25).play(); heroCurrent=key; }
function loadHero(){ const loader=new GLTFLoader();
  loader.load(HERO_URL, gltf=>{ try{
    const cands=gltf.scene.children.filter(c=>{ let has=false; c.traverse(o=>{ if(o.isMesh) has=true; }); return has; });
    const names=cands.map(c=>c.name||'(unnamed)');
    const nodeSel=QS.get('heroNode'), idxSel=QS.get('heroIndex');
    // ---- AVATAR slot (player) ----
    let avRoot=gltf.scene;
    if(cands.length>1){ avRoot=(nodeSel&&cands.find(c=>(c.name||'').toLowerCase().includes(nodeSel.toLowerCase()))) || (idxSel!=null&&cands[parseInt(idxSel)]) || cands[0];
      try{ console.log('[characters] in file:',names.join(', '),'→ avatar:',avRoot.name); }catch(e){}
      setHint('Models: '+names.join(' · ')); setTimeout(()=>{ if($('hint')) $('hint').style.opacity=0; },7000); }
    [avBody,avHead,avStar].forEach(m=>m.visible=false); if(avHair) avHair.visible=false;
    const a=mountCharacter(avatar,avRoot,gltf.animations,{tag:(avRoot.name||'').toLowerCase(),buckets:{all:heroMats,outfit:heroOutfitMats,hair:heroHairMats,skin:heroSkinMats}});
    avatar.children.forEach(c=>{ if(c!==avRoot) c.visible=false; }); // hide every leftover blob part, keep only the model
    heroMixer=a.mixer; heroActions=a.actions; heroLoaded=true; applyAvatar();
    // ---- RUMI slot (optional): a different character named "rumi" in the same file replaces her placeholder ----
    if(cands.length>1){ try{ const rRoot=cands.find(c=>(c.name||'').toLowerCase().includes('rumi') && c!==avRoot);
      if(rRoot){ rumi.children.slice().forEach(c=>{ c.visible=false; }); const r=mountCharacter(rumi,rRoot,gltf.animations,{tag:'rumi',buckets:null}); rumiMixer=r.mixer; } }catch(e){} }
    log('hero_model_loaded',{characters:names, avatar:avRoot.name||null});
  }catch(e){ heroLoaded=false; } },
  undefined, ()=>{ heroLoaded=false; }); }
async function maybeLoadHero(){ if(QS.get('hero3d')==='0') return; // 3D character ON by default now (use ?hero3d=0 for the customizable blob)
  try{ const r=await fetch(HERO_URL,{method:'HEAD'}); if(r&&r.ok) loadHero(); }catch(e){} }
// Rumi NPC from her own folder (separate rigged model).
async function maybeLoadRumi(){ if(QS.get('hero3d')==='0') return;
  try{ const url='assets/rumi/rumi.glb'; const r=await fetch(url,{method:'HEAD'}); if(!r||!r.ok) return;
    new GLTFLoader().load(url, gltf=>{ try{ rumi.children.slice().forEach(c=>{ c.visible=false; }); const m=mountCharacter(rumi,gltf.scene,gltf.animations,{tag:'rumi',buckets:null}); rumiMixer=m.mixer; }catch(e){} }, undefined, ()=>{});
  }catch(e){} }

// Rumi
let rumiBraid=null;
const rumi=new THREE.Group(); const rumiJacket=new THREE.MeshToonMaterial({color:'#FFC83D',gradientMap:TOON_RAMP,emissive:'#000',emissiveIntensity:0});
let rumiCape=null,rumiCrown=null;
{ const j=new THREE.Mesh(new THREE.CapsuleGeometry(.46,.7,6,12),rumiJacket); j.position.y=.95; j.castShadow=true;
  const core=new THREE.Mesh(new THREE.BoxGeometry(.4,.7,.3),skin('#fff')); core.position.y=1;
  const head=new THREE.Mesh(new THREE.SphereGeometry(.46,18,18),skin('#ffe0c2')); head.position.y=1.85; head.castShadow=true;
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.52,18,18,0,6.3,0,2),skin('#7B4FC4')); hair.position.y=1.9;
  const braid=new THREE.Mesh(new THREE.CapsuleGeometry(.13,1,4,8),skin('#7B4FC4')); braid.position.set(-.4,1.2,.2); braid.rotation.z=.35;
  const bstar=new THREE.Mesh(new THREE.OctahedronGeometry(.14),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#a98a00',emissiveIntensity:.5})); bstar.position.set(-.62,.7,.2);
  const staff=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.1,8),new THREE.MeshStandardMaterial({color:'#e8e2f0'})); staff.position.set(.55,1.1,0);
  const mic=new THREE.Mesh(new THREE.SphereGeometry(.16,12,12),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.6})); mic.position.set(.55,1.7,0);
  rumi.add(j,core,head,hair,braid,bstar,staff,mic); rumiBraid=braid; addOutline(j,'#3a2a1a',0.02); addOutline(head,'#3a2a1a',0.02); addGlow(mic,{color:'#FFE08A',size:1.15,opacity:0.85}); addGlow(bstar,{color:'#FFD24D',size:0.5,opacity:0.7}); addFace(head,{iris:'#e0a83a',size:0.82,z:0.46}); }
rumi.position.set(-2.2,0,3); rumi.rotation.y=.4; scene.add(rumi);

// Gloomling + Twinkle
const gloomling=new THREE.Group();
{ const b=new THREE.Mesh(new THREE.SphereGeometry(.7,18,18),new THREE.MeshToonMaterial({color:'#8b8598',gradientMap:TOON_RAMP})); b.position.y=.8; b.castShadow=true;
  const e=x=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.1,10,10),new THREE.MeshBasicMaterial({color:'#2a2536'}));m.position.set(x,.95,.62);return m;};
  gloomling.add(b,e(-.22),e(.22)); addOutline(b,'#2a2536',0.02); }
gloomling.position.set(.6,0,-3.4); scene.add(gloomling);
const twinkle=new THREE.Group(); let twTailStar=null, twCape=null;
{ const body=new THREE.Mesh(new THREE.SphereGeometry(.55,18,18),new THREE.MeshToonMaterial({color:'#fff0cf',gradientMap:TOON_RAMP,emissive:'#FFE0A8',emissiveIntensity:.15})); body.position.y=.55; body.castShadow=true;
  const head=new THREE.Mesh(new THREE.SphereGeometry(.42,18,18),new THREE.MeshToonMaterial({color:'#fff0cf',gradientMap:TOON_RAMP})); head.position.y=1.1;
  const ear=x=>{const m=new THREE.Mesh(new THREE.ConeGeometry(.16,.4,10),new THREE.MeshToonMaterial({color:'#9a6ae0',gradientMap:TOON_RAMP}));m.position.set(x,1.5,0);return m;};
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.38,16,16),new THREE.MeshToonMaterial({color:'#fff0cf',gradientMap:TOON_RAMP})); tail.position.set(-.5,.6,-.3);
  twTailStar=new THREE.Mesh(new THREE.OctahedronGeometry(.18),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.8})); twTailStar.position.set(-.78,.75,-.45);
  const eye=x=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.07,10,10),new THREE.MeshBasicMaterial({color:'#241B3A'}));m.position.set(x,1.15,.36);return m;};
  twinkle.add(body,head,ear(-.18),ear(.18),tail,twTailStar,eye(-.14),eye(.14)); addOutline(body,'#5a3aa0',0.018); addOutline(head,'#5a3aa0',0.018); addGlow(twTailStar,{color:'#FFD24D',size:0.72,opacity:0.8}); }
twinkle.position.copy(gloomling.position); twinkle.visible=false; scene.add(twinkle);
let twinkleFollows=false;

const marker=new THREE.Mesh(new THREE.TorusGeometry(.7,.12,8,24),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.7}));
marker.rotation.x=-Math.PI/2; marker.visible=false; addGlow(marker,{color:'#FFD24D',size:1.3,opacity:0.5}); scene.add(marker);
function setMarker(p){ if(!p){marker.visible=false;return;} marker.position.set(p.x,.1,p.z); marker.visible=true; }

// movement
const ray=new THREE.Raycaster(), ndc=new THREE.Vector2(), target=avatar.position.clone();
let avVel=0, avHeading=0, avBank=0; // velocity + smoothed heading + bank (animation personality)
let controlEnabled=false;
function tapGround(cx,cy){ if(!controlEnabled)return; ndc.x=(cx/innerWidth)*2-1; ndc.y=-(cy/innerHeight)*2+1; ray.setFromCamera(ndc,camera);
  const hit=ray.intersectObject(water,false)[0];
  if(hit&&Math.hypot(hit.point.x,hit.point.z)<=WORLD_R-1){ target.copy(hit.point); target.y=0; $('hint').style.opacity=0;
    burst(new THREE.Vector3(hit.point.x,0.06,hit.point.z),'#FFE9A8',6); avatarReact(); // tap = small ground sparkle + avatar reaction
    if(delight.interaction===null){ delight.interaction=Math.round(performance.now()-launchT); log('first_interaction',{ms:delight.interaction}); } } }
renderer.domElement.addEventListener('pointerdown',e=>{ tapRing(e.clientX,e.clientY); haptic(8); if(controlEnabled) tapGround(e.clientX,e.clientY); });

// bursts / confetti / bloom
const bursts=[];
function burst(pos,color='#FFE9A8',n=24){ for(let i=0;i<n;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(.08,6,6),new THREE.MeshBasicMaterial({color})); s.position.copy(pos); s.position.y+=1;
  const d=new THREE.Vector3(Math.random()-.5,Math.random()*1.1,Math.random()-.5).normalize(); bursts.push({m:s,v:d.multiplyScalar(3+Math.random()*3),life:1}); scene.add(s);} }
function confetti(){ const cols=['#FFC83D','#FF8FCF','#8FD0FF','#7EF0C0','#B69CFF'];
  for(let i=0;i<60;i++){ const d=document.createElement('div'); d.className='confetti'; d.style.left=Math.random()*100+'vw'; d.style.background=cols[i%5];
    d.style.animation=`fall ${1.6+Math.random()*1.4}s ${Math.random()*.6}s ease-in forwards`; document.body.appendChild(d); setTimeout(()=>d.remove(),3600);} }
let bloom=0, blooming=false; function startBloom(){ blooming=true; }
function relightLighthouse(){ lhMat.color.set('#f3ead8'); lhRoof.material.color.set('#e23e6b'); lhLightMat.emissive.set('#FFD24D'); lhLightMat.emissiveIntensity=1.2; burst(lighthouse.position,'#FFD24D',40); }

// ---------------- VFX 2.0: magic particles, rings, spotlight, flash, cinematic cam, Twinkle reactions ----------------
const magic=[];
// energy-ribbon trail behind the hero's star-tool (color-identity)
let trailT=0; const trail=[];
function spawnTrail(){ const p=new THREE.Vector3(); avStar.getWorldPosition(p); const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW_TEX,color:new THREE.Color(state.avatar.color),transparent:true,opacity:0.6,blending:THREE.AdditiveBlending,depthWrite:false})); s.scale.set(0.5,0.5,1); s.position.copy(p); scene.add(s); trail.push({m:s,life:1}); }
function magicBurst(pos,n=46,color='#FFE9A8'){ for(let i=0;i<n;i++){ const star=new THREE.Mesh(new THREE.OctahedronGeometry(0.07+Math.random()*0.06),new THREE.MeshBasicMaterial({color,transparent:true}));
  const a=Math.random()*Math.PI*2, r=Math.random()*0.6; star.position.set(pos.x+Math.cos(a)*r,pos.y+0.3+Math.random()*0.5,pos.z+Math.sin(a)*r);
  magic.push({m:star,vx:Math.cos(a)*(0.4+Math.random()*0.9),vy:1.6+Math.random()*2.6,vz:Math.sin(a)*(0.4+Math.random()*0.9),life:1,max:1+Math.random()*0.9,spin:(Math.random()-0.5)*7}); scene.add(star); } }
const rings=[];
function magicRing(pos,color='#FFD24D'){ const g=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.06,8,40),new THREE.MeshBasicMaterial({color,transparent:true})); g.rotation.x=-Math.PI/2; g.position.set(pos.x,0.12,pos.z); scene.add(g); rings.push({m:g,life:1}); }
const spot=new THREE.Mesh(new THREE.CircleGeometry(1.7,40),new THREE.MeshBasicMaterial({color:'#fff3c0',transparent:true,opacity:0,depthWrite:false})); spot.rotation.x=-Math.PI/2; spot.position.y=0.04; scene.add(spot);
let spotOn=0, cineUntil=0, twSpinUntil=0, twCheerUntil=0;
function screenFlash(){ const f=document.createElement('div'); f.className='flash'; document.body.appendChild(f); setTimeout(()=>f.remove(),420); }
function chirp(){ try{ actx=actx||new(window.AudioContext||window.webkitAudioContext)(); const now=actx.currentTime;
  [880,1320].forEach((f,i)=>{ const o=actx.createOscillator(),g=actx.createGain(); o.type='triangle'; o.frequency.value=f; o.connect(g); g.connect(actx.destination); const tt=now+i*0.08; g.gain.setValueAtTime(0.0001,tt); g.gain.exponentialRampToValueAtTime(0.16,tt+0.01); g.gain.exponentialRampToValueAtTime(0.0001,tt+0.16); o.start(tt); o.stop(tt+0.18); }); }catch(e){} }
function twinkleCheer(ms=900){ twCheerUntil=performance.now()+ms; chirp(); }
function twinkleSpin(ms=1600){ twSpinUntil=performance.now()+ms; }

// ---------------- UI helpers ----------------
function show(id){ $(id).classList.remove('hidden'); }
function hide(id){ $(id).classList.add('hidden'); }
function speak(name,text,btn,next){ $('bubble-name').textContent=name; $('bubble-text').textContent=text; $('bubble-next').textContent=btn||'Tap ▶'; show('bubble');
  if(audioOn) say(text); $('bubble-next').onclick=()=>{ hide('bubble'); if(next) next(); }; }
function setEnergy(p){ $('energy-fill').style.width=p+'%'; }
function setHint(t){ $('hint').textContent=t; $('hint').style.opacity=1; }
function heroName(){ return (state.avatar.name&&state.avatar.name.trim())?state.avatar.name.trim():'Star Hunter'; }
let creationMode=false, focusAvatarUntil=0;
// The headline daily moment: the CHILD's avatar grows (Rumi/Twinkle are supporting cast).
function avatarTransform(accessoryFn,label,then){
  $('tf-emoji').textContent='🌟'; $('tf-title').textContent=`${heroName()} grew today!`; $('tf-sub').textContent='✨ '+label+' ✨';
  heroPerforming=true; if(heroLoaded) playHero(heroActions.dance?'dance':'idle');
  // 1) anticipation: spotlight rises, world dims, camera pushes in, Twinkle gets excited
  const dimFrom=hemi.intensity; hemi.intensity=dimFrom*0.5; spotOn=1; cineUntil=performance.now()+3650; twinkleSpin(3300);
  setTimeout(()=>{ // 2) the reveal: flash + expanding rings + star fountain + accessory + hero glow + sound sting
    screenFlash(); chime('win'); haptic(30);
    if(accessoryFn) accessoryFn();
    magicRing(avatar.position,'#FFD24D'); setTimeout(()=>magicRing(avatar.position,'#FF8FCF'),150);
    magicBurst(avatar.position,46); show('transform');
    if(audioOn) say(`Wow ${heroName()}! YOUR Star Hunter grew today! You unlocked a ${label}!`);
    let g=0; const pulse=()=>{ g+=.04; const e=Math.max(0,Math.sin(g*Math.PI))*0.6;
      avBodyMat.emissive.set('#FFD24D'); avBodyMat.emissiveIntensity=e;
      heroMats.forEach(m=>{ if(m.emissive){ m.emissive.set('#FFD24D'); m.emissiveIntensity=e*0.8; } });
      if(g<1) requestAnimationFrame(pulse); else { avBodyMat.emissiveIntensity=.12; heroMats.forEach(m=>{ if(m.emissive) m.emissiveIntensity=.06; }); } };
    pulse();
  },650);
  // 3) restore + spotlight show-off + Twinkle cheers
  setTimeout(()=>{ hide('transform'); hemi.intensity=dimFrom; spotOn=0; focusAvatarUntil=performance.now()+2300; twinkleCheer(2000); if(audioOn) say(`Look at you, ${heroName()}!`); save(); },3650);
  setTimeout(()=>{ heroPerforming=false; if(then) then(); },5600);
}
function recordExcitement(kind){ if(delight[kind]===null){ delight[kind]=Math.round(performance.now()-launchT); log('delight_'+kind,{ms:delight[kind]}); $('obs-readout').textContent=`smile ${delight.smile??'–'}ms · wow ${delight.excited??'–'}ms`; } }

// =====================================================================
//  CONTENT (data-driven) — the pipeline seed
// =====================================================================
// choose-item: {template,skillId,pic,prompt,say,options:[{t,say}],answer}
// blend-item:  {template:'blend',skillId,pic,word,say,prompt,sounds:[{t,say}]}
const DAYS = {
  1:{ skillLabel:'Letter sounds',
    greet:["Rumi","Hi! I'm Rumi! Welcome to Harmony Harbor! Oh no — the Lighthouse went dark and a shy Gloomling is hiding its words. Will you help me read to light it up?","Let's go! ▶"],
    activities:[
      {template:'soundMatch',skillId:'phon.letter.sound',pic:'☀️',prompt:'Which letter says  sss…  like  sun?',say:'Which letter says sss, like sun?',options:[{t:'S',say:'sss'},{t:'M',say:'mmm'},{t:'T',say:'tuh'}],answer:'S'},
      {template:'firstSound',skillId:'phon.onset',pic:'🐝',prompt:'What sound does  “bee”  start with?',say:'What sound does bee start with? Buh, buh, bee.',options:[{t:'B',say:'buh'},{t:'F',say:'fff'},{t:'N',say:'nnn'}],answer:'B'},
    ],
    tease:["Tomorrow: help read the harbor signs — and find Twinkle a brand-new look!"] },
  2:{ skillLabel:'Sight words',
    greet:["Rumi","You came back — yay! The dock signs got all mixed up in the wind. Can you read them with me?","Let's read! ▶"],
    activities:[
      {template:'wordPicture',skillId:'read.sightword',pic:'🐱',prompt:'Which word says  “cat”?',say:'Which word says cat?',options:[{t:'cat',say:'cat'},{t:'dog',say:'dog'},{t:'sun',say:'sun'}],answer:'cat'},
      {template:'soundMatch',skillId:'phon.letter.sound',pic:'🐟',prompt:'Which letter says  fff…  like  fish?',say:'Which letter says fff, like fish?',options:[{t:'F',say:'fff'},{t:'L',say:'lll'},{t:'R',say:'rrr'}],answer:'F'},
    ],
    tease:["Tomorrow: blend sounds to read a WHOLE word — and Twinkle will EVOLVE!"] },
  3:{ skillLabel:'Blending words',
    greet:["Rumi","Three days in a row — you're a real Star Hunter! The lighthouse keeper left you a note. Let's read it together…","Open the note ▶"],
    story:["Keeper's note","“Dear friend… the harbor shines because of YOU. Read on!”"],
    activities:[
      {template:'blend',skillId:'phon.cvc.blend',pic:'🐱',word:'cat',say:'Tap the sounds in order. c… a… t… cat!',prompt:'Tap the sounds in order to read it!',sounds:[{t:'c',say:'cuh'},{t:'a',say:'aah'},{t:'t',say:'tuh'}]},
      {template:'blend',skillId:'phon.cvc.blend',pic:'☀️',word:'sun',say:'Now this one. s… u… n… sun!',prompt:'Tap the sounds in order!',sounds:[{t:'s',say:'sss'},{t:'u',say:'uh'},{t:'n',say:'nnn'}]},
    ],
    tease:["You played 3 days in a row! More adventures are coming soon…"] }
};

// Star Check (pre/post) — choose-only, no hints, transfer words (not practiced)
const STARCHECK=[
  {skillId:'phon.letter.sound',pic:'🌙',prompt:'Which letter says  mmm?',say:'Which letter says mmm?',options:['M','T','S'],answer:'M'},
  {skillId:'phon.onset',pic:'🍃',prompt:'What does  “leaf”  start with?',say:'What sound does leaf start with?',options:['L','B','F'],answer:'L'},
  {skillId:'read.sightword',pic:'🐷',prompt:'Which word says  “pig”?',say:'Which word says pig?',options:['pig','bus','net'],answer:'pig'},
  {skillId:'read.sightword',pic:'🔴',prompt:'Which word says  “red”?',say:'Which word says red?',options:['red','sun','dog'],answer:'red'},
  {skillId:'phon.rhyme',pic:'🐱',prompt:'What rhymes with  “cat”?',say:'What rhymes with cat?',options:['hat','dog','sun'],answer:'hat'},
  {skillId:'phon.letter.sound',pic:'⛺',prompt:'Which letter says  tuh?',say:'Which letter says tuh?',options:['T','M','F'],answer:'T'},
];

// =====================================================================
//  ACTIVITY RUNNER (no-fail, adaptive, instrumented)
// =====================================================================
const praises=["You did it!","Wonderful reading!","You're a reading star!","Amazing!","Yay! You read it!"];
let curList=[], curIdx=0, onListDone=null, dayMistakes=0;
function runActivities(list,done){ curList=list; curIdx=0; onListDone=done; dayMistakes=0; show('challenge'); renderActivity(); }
function renderLights(){ const el=$('ch-lights'); el.innerHTML=''; for(let i=0;i<curList.length;i++){ const s=document.createElement('span'); s.className='lite'+(i<curIdx?' on':''); s.textContent=i<curIdx?'●':'○'; el.appendChild(s);} }
let mistakes=0, blendProgress=0, itemStart=0, itemHints=0, itemModeled=false;
function renderActivity(){ const a=curList[curIdx]; mistakes=0; itemHints=0; itemModeled=false; itemStart=performance.now();
  $('ch-pic').textContent=a.pic; $('ch-prompt').textContent=a.prompt; $('ch-options').innerHTML=''; renderLights();
  if(audioOn) say(a.say);
  $('ch-hear').onclick=()=>{ if(audioOn) say(a.say); };
  $('ch-hint').onclick=()=>hintActivity(a);
  log('activity_start',{skillId:a.skillId,template:a.template});
  if(a.template==='blend') renderBlend(a); else renderChoose(a);
}
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }
function renderChoose(a){ let opts=a.options.slice();
  if(dayMistakes>=2) opts=opts.filter(o=>o.t===a.answer).concat(opts.filter(o=>o.t!==a.answer).slice(0,1)); // adaptive: fewer options
  shuffle(opts).forEach(o=>{ const b=document.createElement('button'); b.className='opt'; b.textContent=o.t;
    b.onclick=()=>{ if(audioOn) say(o.say,{rate:.8}); if(o.t===a.answer) correct(a,b); else wrong(a,b); };
    $('ch-options').appendChild(b); }); }
function renderBlend(a){ blendProgress=0;
  a.sounds.forEach((s,idx)=>{ const b=document.createElement('button'); b.className='opt'; b.textContent=s.t; b.dataset.idx=idx;
    b.onclick=()=>{ if(audioOn) say(s.say,{rate:.8});
      if(idx===blendProgress){ b.classList.add('correct'); blendProgress++; if(blendProgress===a.sounds.length){ if(audioOn) setTimeout(()=>say(a.word,{rate:.8}),300); correct(a,b);} }
      else { mistakes++; dayMistakes++; itemHints++; if(audioOn) say("Start with the first sound!"); flashBlend(); } };
    $('ch-options').appendChild(b); }); }
function flashBlend(){ const n=$('ch-options').querySelector(`[data-idx="${blendProgress}"]`); if(n){ n.classList.add('glowhint'); setTimeout(()=>n.classList.remove('glowhint'),1500);} }
function hintActivity(a){ itemHints++; log('hint_used',{skillId:a.skillId});
  if(a.template==='blend'){ flashBlend(); if(audioOn) say("Tap this one next!"); return; }
  const btns=[...$('ch-options').querySelectorAll('.opt')];
  const w=btns.find(b=>b.textContent!==a.answer&&!b.classList.contains('dim')); if(w) w.classList.add('dim');
  const r=btns.find(b=>b.textContent===a.answer); if(r){ r.classList.add('glowhint'); setTimeout(()=>r.classList.remove('glowhint'),1600);} if(audioOn) say(a.say); }
function wrong(a,btn){ mistakes++; dayMistakes++; itemHints++; btn.classList.add('dim'); if(audioOn) say("Almost! Listen again.");
  if(mistakes>=2){ itemModeled=true; const r=[...$('ch-options').querySelectorAll('.opt')].find(b=>b.textContent===a.answer);
    if(r){ r.classList.add('glowhint'); if(audioOn) say(`This one says ${a.answer}. Tap it with me!`); r.onclick=()=>{ if(audioOn) say(a.answer,{rate:.8}); correct(a,r);}; } } }
function correct(a,btn){ btn.classList.remove('glowhint'); btn.classList.add('correct'); chime('good'); burst(lighthouse.position,'#FFE9A8',10); twCheerUntil=performance.now()+900; // Twinkle cheers learning success
  if(delight.reward===null){ delight.reward=Math.round(performance.now()-launchT); log('first_reward',{ms:delight.reward}); }
  const firstTry=(mistakes===0&&itemHints===0);
  state.history.push({day:state.day,skillId:a.skillId,correct:true,hints:itemHints,modeled:itemModeled,firstTry,ms:Math.round(performance.now()-itemStart)});
  log('activity_item',{skillId:a.skillId,correct:true,hints:itemHints,modeled:itemModeled,firstTry});
  save();
  [...$('ch-options').querySelectorAll('.opt')].forEach(b=>b.onclick=null);
  const p=praises[(Math.random()*praises.length)|0];
  setTimeout(()=>{ curIdx++; renderLights();
    if(curIdx<curList.length){ if(audioOn) say(p,{then:renderActivity}); else renderActivity(); }
    else { hide('challenge'); if(audioOn) say(p,{then:onListDone}); else onListDone(); } }, 700);
}

// =====================================================================
//  STAR CHECK (pre/post)
// =====================================================================
let scIdx=0, scScore=0, scDone=null, scTag='pre';
function runStarCheck(tag,done){ scTag=tag; scIdx=0; scScore=0; scDone=done; show('starcheck');
  $('sc-title').textContent= tag==='pre'?"Twinkle's Star Check ⭐":"Star Check — look how far! ⭐";
  if(audioOn) say("Let's play Twinkle's Star Check! Just try your best — it's only for fun."); setTimeout(renderSC,900); }
function renderSC(){ const q=STARCHECK[scIdx]; $('sc-pic').textContent=q.pic; $('sc-prompt').textContent=q.prompt; $('sc-options').innerHTML='';
  if(audioOn) say(q.say);
  shuffle(q.options.slice()).forEach(t=>{ const b=document.createElement('button'); b.className='opt'; b.textContent=t;
    b.onclick=()=>{ const ok=(t===q.answer); if(ok){ scScore++; b.classList.add('correct'); chime('good'); } else { b.classList.add('dim'); }
      log('starcheck_item',{phase:scTag,skillId:q.skillId,correct:ok});
      [...$('sc-options').querySelectorAll('.opt')].forEach(x=>x.onclick=null);
      setTimeout(()=>{ scIdx++; if(scIdx<STARCHECK.length) renderSC(); else finishSC(); },650); };
    $('sc-options').appendChild(b); }); }
function finishSC(){ hide('starcheck'); state[scTag]=scScore; log('starcheck_done',{phase:scTag,score:scScore,outOf:STARCHECK.length}); save();
  if(audioOn) say(`You got ${scScore} stars! Great trying!`); if(scDone) setTimeout(scDone,800); }

// =====================================================================
//  DAY FLOW
// =====================================================================
function startDay(day){ state.day=day; save(); $('day-num').textContent=day; $('star-num').textContent=state.avatar.stars; setEnergy(0);
  log('day_start',{day});
  show('hud');
  const D=DAYS[day];
  // reset scene positions for re-walk
  if(day>1){ gloomling.visible=true; gloomling.scale.setScalar(1); twinkle.visible=(state.twinkleForm>0); twinkleFollows=(state.twinkleForm>0);
    if(state.twinkleForm>0){ gloomling.visible=false; } }
  speak(D.greet[0],D.greet[1],D.greet[2],()=>{
    if(day===3 && D.story){ speak(D.story[0],D.story[1],"Wow! ▶",()=>beginExplore(day)); }
    else beginExplore(day);
  });
}
let reached=false;
function beginExplore(day){ controlEnabled=true; reached=false; setMarker(gloomling.position);
  setHint(state.twinkleForm>0?'Tap the ground to explore! 👣':'Tap the ground to walk to the Gloomling! 👣');
  if(audioOn) say(state.twinkleForm>0?"Let's find today's adventure!":"Follow the sparkles!"); }
function reachSpot(){ if(reached)return; reached=true; controlEnabled=false; setMarker(null); $('hint').style.opacity=0;
  const D=DAYS[state.day];
  if(state.day===1){ speak('Gloomling',"…I lost the words. Will you read them with me?","Yes! Let's read ✨",()=>runActivities(D.activities,dayProgress)); }
  else { speak('Rumi',"Here we go — read these with me!","Let's read ✨",()=>runActivities(D.activities,dayProgress)); }
}

// progression beat per day (avatar always grows; plus day-specific marquee)
function dayProgress(){
  state.avatar.stars = Math.max(state.avatar.stars, state.day); $('star-num').textContent=state.avatar.stars;
  setEnergy(100); startBloom(); chime('win');
  if(state.day===1){
    relightLighthouse();
    setTimeout(()=>{ gloomling.visible=false; twinkle.visible=true; twinkle.position.copy(gloomling.position); state.twinkleForm=1; burst(twinkle.position,'#7EF0C0',30);
      speak('Rumi',`Amazing reading, ${heroName()}! The Lighthouse is shining and the Gloomling became a happy Star Pal. Tap your new friend!`,"Tap Twinkle! 🦊",enableTwinkleTap); },1500);
  } else if(state.day===2){
    twTailStar.material.emissiveIntensity=1.4;
    avatarTransform(addHat,'Stylish New Hat',()=>{ speak('Rumi',`Wonderful, ${heroName()}! Look — Twinkle is glowing… almost ready to evolve tomorrow!`,'▶',rewardDay); });
  } else if(state.day===3){
    twinkleEvolve(()=> avatarTransform(addCape,'Hero Cape',()=> runStarCheck('post',()=>rewardDay()) ));
  }
}
function enableTwinkleTap(){ controlEnabled=false; setHint('Tap Twinkle to befriend! 🦊✨');
  const tap=e=>{ ndc.x=(e.clientX/innerWidth)*2-1; ndc.y=-(e.clientY/innerHeight)*2+1; ray.setFromCamera(ndc,camera);
    if(ray.intersectObject(twinkle,true).length){ renderer.domElement.removeEventListener('pointerdown',tap); burst(twinkle.position,'#FF8FCF',30); chime('good'); $('hint').style.opacity=0; twinkleFollows=true;
      // Rumi gets a quick Rising-Star moment, then the HEADLINE: the child's own avatar grows.
      speak('Twinkle',"*happy twinkle!* 🦊💛","Aww! ▶",()=>rumiTransform(2,'RISING STAR','🌟',()=>avatarTransform(addStar,'Star Hunter Trainee',rewardDay))); } };
  renderer.domElement.addEventListener('pointerdown',tap);
}
function rumiTransform(stage,label,emoji,then){ state.rumiStage=Math.max(state.rumiStage,stage); log('rumi_evolve',{stage});
  $('tf-emoji').textContent=emoji; $('tf-title').textContent='RUMI is transforming!'; $('tf-sub').textContent='✨ '+label+' ✨';
  setTimeout(()=>{ show('transform'); if(audioOn) say("You filled the harbor with harmony! Watch — Rumi is becoming a Rising Star!");
    rumiJacket.emissive.set('#FFC83D'); rumiJacket.emissiveIntensity=.6;
    if(!rumiCape){ rumiCape=new THREE.Mesh(new THREE.ConeGeometry(.7,1.2,12,1,true),new THREE.MeshStandardMaterial({color:'#7B4FC4',emissive:'#5a3aa0',emissiveIntensity:.4,side:THREE.DoubleSide})); rumiCape.position.set(0,1,-.3); rumi.add(rumiCape);
      rumiCrown=new THREE.Mesh(new THREE.OctahedronGeometry(.2),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:1})); rumiCrown.position.set(0,2.5,0); rumi.add(rumiCrown);} burst(rumi.position,'#FFE9A8',40); },400);
  setTimeout(()=>{ hide('transform'); save(); then(); },3400);
}
function twinkleEvolve(then){ log('twinkle_evolve',{form:2}); state.twinkleForm=2;
  $('tf-emoji').textContent='🦊'; $('tf-title').textContent='TWINKLE is evolving!'; $('tf-sub').textContent='✨ GLIMMERFOX ✨';
  show('transform'); if(audioOn) say("Twinkle is evolving into Glimmerfox!");
  let s=0; const grow=()=>{ s+=.05; twinkle.scale.setScalar(1+Math.sin(s*Math.PI)*0.25); if(s<1) requestAnimationFrame(grow); else twinkle.scale.setScalar(1.12); };
  grow();
  if(!twCape){ twCape=new THREE.Mesh(new THREE.ConeGeometry(.4,.7,10,1,true),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.5,side:THREE.DoubleSide})); twCape.position.set(0,.6,-.35); twinkle.add(twCape);}
  twTailStar.material.emissiveIntensity=1.6; burst(twinkle.position,'#FFD24D',40);
  setTimeout(()=>{ hide('transform'); save(); then(); },3000);
}

function rewardDay(){ // reward cards per day
  const nm=heroName();
  const cards = state.day===1 ? [['🌟','My Star Hunter','You leveled up!'],['🦊','Twinkle','A new friend!'],['⭐','Reading Star','You read 2 words!']]
    : state.day===2 ? [['🎩','New Hat',nm+"'s style!"],['🌟','Day 2 Star','Your hero grew!'],['✨','Twinkle','Almost evolving!']]
    : [['🦸','Hero Cape',nm+' shines!'],['🌟','Star Hunter!','3 days strong!'],['🦊','Glimmerfox','Twinkle evolved!']];
  $('reward-h').textContent= state.day===3 ? `${nm}, you did it — 3 days! 🎉` : `Great job, ${nm}! 🎉`;
  $('reward-cards').innerHTML=''; cards.forEach(c=>{ const d=document.createElement('div'); d.className='rcard'; d.innerHTML=`<div class="rc-ico">${c[0]}</div><b>${c[1]}</b><small>${c[2]}</small>`; $('reward-cards').appendChild(d); });
  show('reward'); confetti(); chime('win'); if(audioOn) say("Great job today, Star Hunter!");
  $('reward-next').onclick=()=>{ hide('reward'); completeDay(); };
}

function completeDay(){ if(!state.completedDays.includes(state.day)) state.completedDays.push(state.day);
  state.lastCompletedDate=todayStr(); save(); log('day_complete',{day:state.day, stars:state.avatar.stars, rumiStage:state.rumiStage, twinkleForm:state.twinkleForm});
  buildDashboard();
  const D=DAYS[state.day];
  $('dg-emoji').textContent = state.day===3?'🏆':'🌙';
  $('dg-title').textContent = state.day===3?'You played 3 days!':'See you tomorrow!';
  $('dg-text').textContent = D.tease[0];
  show('daygate'); if(audioOn) say(D.tease[0]);
  if(state.day===3){ /* offer parent re-engagement next time they open parent panel */ state.askReengage=true; save(); }
  $('dg-close').onclick=()=>{ hide('daygate'); };
}

// =====================================================================
//  PARENT GATE + DASHBOARD + REENGAGE + TOOLS
// =====================================================================
const GATE=['3','7','1']; let gateInput=[];
function openGate(){ gateInput=[]; $('pg-seq').textContent=GATE.join(' · '); const pad=$('pg-pad'); pad.innerHTML='';
  ['1','2','3','4','5','6','7','8','9'].forEach(n=>{ const b=document.createElement('button'); b.textContent=n; b.onclick=()=>{ gateInput.push(n);
    if(gateInput.length===GATE.length){ if(gateInput.join('')===GATE.join('')){ hide('parent-gate'); openParent(); } else { gateInput=[]; b.parentElement.animate?.([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:200}); } } }; pad.appendChild(b); });
  show('parent-gate'); }
$('pg-cancel').onclick=()=>hide('parent-gate');
$('parent-open').onclick=openGate;

function metrics(){ const h=state.history; const att=h.length, corr=h.filter(x=>x.correct).length;
  const indep=h.filter(x=>x.firstTry).length; const hints=h.reduce((s,x)=>s+x.hints,0);
  return { attempts:att, reading: att?Math.round(100*corr/att):0, confidence: att?Math.round(100*indep/att):0,
    independentRate: att?(indep/att):0, hintPerItem: att?(hints/att):0 }; }
function buildDashboard(){ const m=metrics();
  $('pc-name').textContent='Your Star Hunter'; $('pc-day').textContent=state.day; $('pc-streak').textContent='🔥 '+state.completedDays.length;
  $('pc-reading').style.width=m.reading+'%'; $('pc-conf').style.width=m.confidence+'%';
  $('pc-reading-l').textContent = m.reading>=80?'Shining!':m.reading>=40?'Growing!':'Starting';
  $('pc-conf-l').textContent = m.confidence>=70?'Strong!':m.confidence>=40?'Growing!':'Starting';
  const dots=$('pc-dots'); dots.innerHTML=''; for(let i=1;i<=3;i++){ const s=document.createElement('span'); if(state.completedDays.includes(i)) s.className='on'; dots.appendChild(s);}
  // today takeaway
  const todayItems=state.history.filter(x=>x.day===state.day);
  const got=todayItems.filter(x=>x.correct).length, tried=todayItems.length, usedHints=todayItems.reduce((s,x)=>s+x.hints,0);
  const skillName = state.day===1?'letter sounds':state.day===2?'sight words':'blending sounds into words';
  $('pc-today').innerHTML = `<li>Practiced <b>${skillName}</b></li><li>Tried ${tried}, got ${got}, used ${usedHints} hint${usedHints===1?'':'s'}</li>`+(state.day===3?'<li>Read a whole word independently 🎉</li>':'');
  $('pc-pre').textContent = state.pre==null?'–':state.pre; $('pc-post').textContent = state.post==null?'–':state.post;
}
function openParent(){ buildDashboard(); show('parent');
  $('reengage').classList.toggle('hidden', !state.askReengage);
  log('dashboard_view');
  [...document.querySelectorAll('#reengage .re-btns button')].forEach(b=>b.onclick=()=>{ log('parent_reengage',{value:b.dataset.v}); state.askReengage=false; save(); $('reengage').classList.add('hidden'); });
}
$('pc-close').onclick=()=>hide('parent');
$('pc-export').onclick=()=>{ const blob=new Blob([JSON.stringify({state,events},null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='little-legends-a1-data.json'; a.click(); };
$('pc-sim').onclick=()=>{ state.lastCompletedDate=null; save(); hide('parent'); location.reload(); };
$('pc-reset').onclick=()=>{ if(confirm('Reset all test data?')){ localStorage.removeItem(KEY); localStorage.removeItem(EKEY); location.reload(); } };

// =====================================================================
//  BOOT
// =====================================================================
function decideDay(){ const forced=QS.get('day'); if(forced){ return Math.max(1,Math.min(3,parseInt(forced))); }
  const maxC = state.completedDays.length? Math.max(...state.completedDays):0;
  const next = Math.min(3, maxC+1);
  if(state.lastCompletedDate===todayStr() && maxC>=1 && maxC<3){ return -1; } // already played today -> gate
  if(maxC>=3 && state.lastCompletedDate===todayStr()) return -2; // finished all, today
  return next;
}
function boot(){
  maybeLoadHero(); maybeLoadRumi();
  if(QS.get('observe')==='1'){ show('observer'); $('mark-smile').onclick=()=>recordExcitement('smile'); $('mark-excited').onclick=()=>recordExcitement('excited'); }
  if(QS.get('reset')==='1'){ localStorage.removeItem(KEY); localStorage.removeItem(EKEY); location.search=''; }
  $('start-btn').onclick=()=>{ audioOn=true; try{ actx=new(window.AudioContext||window.webkitAudioContext)(); }catch(e){}
    launchT=performance.now(); state.launchCount=(state.launchCount||0)+1; save(); log('app_open',{launchCount:state.launchCount});
    hide('intro');
    if(!state.avatar.created) showAvatarCreate();
    else routeDay();
  };
}
function showAvatarCreate(){ show('avatar-create'); creationMode=true; controlEnabled=false;
  const skins=['#ffd9b8','#e8b48a','#a9744f','#6e4a32'], hairs=['#5a3a2a','#7B4FC4','#2a2340','#c23e6b'], colors=['#5ec8c0','#FF8FCF','#FFC83D','#8FD0FF'];
  const styles=[['short','Short'],['ponytail','Ponytail'],['puffs','Puffs'],['bun','Bun'],['long','Long']];
  const names=['Star','Sunny','Sky','Rae','Kai','Mimi'];
  const mk=(host,arr,key)=>{ const el=$(host); el.innerHTML=''; arr.forEach(c=>{ const s=document.createElement('div'); s.className='sw'+(state.avatar[key]===c?' sel':''); s.style.background=c;
    s.onclick=()=>{ state.avatar[key]=c; [...el.children].forEach(x=>x.classList.remove('sel')); s.classList.add('sel'); applyAvatar(); }; el.appendChild(s); }); };
  const styleEl=$('ac-style'); styleEl.innerHTML=''; styles.forEach(([v,lbl])=>{ const b=document.createElement('button'); b.className='chip'+(((state.avatar.style||'short')===v)?' sel':''); b.textContent=lbl;
    b.onclick=()=>{ state.avatar.style=v; [...styleEl.children].forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); rebuildHair(v); }; styleEl.appendChild(b); });
  const nameEl=$('ac-names'); nameEl.innerHTML=''; names.forEach(n=>{ const b=document.createElement('button'); b.className='chip'; b.textContent=n;
    b.onclick=()=>{ state.avatar.name=n; $('ac-name').value=n; if(audioOn) say(n,{rate:.85}); }; nameEl.appendChild(b); });
  $('ac-name').value=state.avatar.name||''; $('ac-name').oninput=e=>{ state.avatar.name=e.target.value; };
  mk('ac-skin',skins,'skin'); mk('ac-hair',hairs,'hair'); mk('ac-color',colors,'color'); applyAvatar();
  // With a real rigged model, Outfit/Hair/Skin COLORS tint the model's material zones; only the hairstyle MESH-swap row needs the model to ship hair variants (hidden for now).
  if(heroLoaded){ const el=$('ac-style'), row=el&&el.closest('.ac-row'); if(row) row.style.display='none'; }
  if(audioOn) say("Make your very own Star Hunter! Pick your hair, your colors, and your name.");
  $('ac-done').onclick=()=>{ state.avatar.created=true; creationMode=false; save();
    log('avatar_created',{skin:state.avatar.skin,hair:state.avatar.hair,color:state.avatar.color,style:state.avatar.style,named:!!(state.avatar.name&&state.avatar.name.trim())}); hide('avatar-create');
    if(audioOn) say(`Welcome, ${heroName()}! Let's go to Harmony Harbor!`,{then:()=>runStarCheck('pre',()=>routeDay())}); else runStarCheck('pre',()=>routeDay()); };
}
function routeDay(){ // restore prior cosmetics/rumi/twinkle visual state
  rebuildHair(state.avatar.style||'short'); applyAvatar();
  if(state.avatar.cosmetics.includes('star')) addStar();
  if(state.avatar.cosmetics.includes('hat')) addHat();
  if(state.avatar.cosmetics.includes('cape')) addCape();
  if(state.rumiStage>=2){ rumiJacket.emissive.set('#FFC83D'); rumiJacket.emissiveIntensity=.6; }
  const d=decideDay();
  if(d===-1){ $('dg-emoji').textContent='🌙'; $('dg-title').textContent='See you tomorrow!'; $('dg-text').textContent='You already played today — come back tomorrow for the next adventure! (Grown-ups can tap 👪 to continue testing.)'; show('hud'); show('daygate'); $('dg-close').onclick=()=>hide('daygate'); if(audioOn) say("See you tomorrow!"); return; }
  if(d===-2){ $('dg-emoji').textContent='🏆'; $('dg-title').textContent='You finished the 3-day adventure!'; $('dg-text').textContent='More is coming soon. 💛'; show('hud'); show('daygate'); $('dg-close').onclick=()=>hide('daygate'); return; }
  startDay(d);
}

// ---------------- Main loop ----------------
let lastT=performance.now();
function tick(now){ const dt=Math.min((now-lastT)/1000,.05); lastT=now; const t=now/1000;
  // ---- movement with personality: accel/decel, smooth turn, banking, idle life ----
  const dx=target.x-avatar.position.x, dz=target.z-avatar.position.z, d=Math.hypot(dx,dz);
  const want = d>0.12 ? 6 : 0;
  avVel += (want-avVel)*Math.min(1,dt*(want>avVel?6:9)); // ease-in / faster ease-out
  let moving = avVel>0.15;
  if(d>0.001 && avVel>0.01){ const step=Math.min(avVel*dt,d); avatar.position.x+=dx/d*step; avatar.position.z+=dz/d*step;
    let da=Math.atan2(dx,dz)-avHeading; da=Math.atan2(Math.sin(da),Math.cos(da)); avHeading+=da*Math.min(1,dt*7); // smooth turn (shortest angle)
    const bankTgt=Math.max(-0.28,Math.min(0.28,-da*0.5)); avBank+=(bankTgt-avBank)*Math.min(1,dt*8); } // lean into turns
  else avBank+=(0-avBank)*Math.min(1,dt*6);
  const cineActive = creationMode || now<focusAvatarUntil || now<cineUntil;
  if(!cineActive) avatar.rotation.y=avHeading; // let creation/show-off camera drive rotation otherwise
  const sp=avVel/6, breath=moving?0:Math.sin(t*2.2)*0.02;
  avatar.position.y = (!heroLoaded)?Math.abs(Math.sin(t*9))*0.12*sp:0; // foot bob scales with speed
  if(avatarPop>0.001){ avatarPop*=Math.exp(-dt*9); const p=avatarPop; avatar.scale.set(1+p*0.08,1-p*0.10,1+p*0.08); avatar.rotation.z=avBank; }
  else { avatar.scale.set(1,1+breath,1); avatar.rotation.z=avBank+(moving?0:Math.sin(t*1.1)*0.02); } // idle breathing + weight-shift
  if(avHair){ avHair.rotation.x=-sp*0.18+Math.sin(t*2.0)*0.03; avHair.rotation.z=avBank*0.6+Math.sin(t*1.3)*0.02; } // hair never static
  if(moving && sp>0.4){ trailT-=dt; if(trailT<=0){ trailT=0.045; spawnTrail(); } } // energy ribbon while moving
  if(heroMixer) heroMixer.update(dt);
  if(rumiMixer) rumiMixer.update(dt); // Rumi NPC model animation
  if(heroLoaded && !heroPerforming) playHero(moving && heroActions.walk ? 'walk' : 'idle');
  if(INSPECT){ // turntable: slowly orbit the character so it's clearly visible from all sides
    const a=t*0.5; camera.position.set(avatar.position.x+Math.sin(a)*4.5, 2.6, avatar.position.z+Math.cos(a)*4.5); camera.lookAt(avatar.position.x,1.3,avatar.position.z);
  } else if(now<cineUntil){ // cinematic push-in during the transformation reveal
    camera.position.lerp(new THREE.Vector3(avatar.position.x+0.2,2.2,avatar.position.z+4.1),1-Math.exp(-dt*4)); camera.lookAt(avatar.position.x,1.5,avatar.position.z);
  } else if(creationMode){ // live close-up while customizing YOUR hero
    camera.position.lerp(new THREE.Vector3(avatar.position.x,2.05,avatar.position.z+4.6),1-Math.exp(-dt*6)); camera.lookAt(avatar.position.x,1.5,avatar.position.z);
    avatar.rotation.y=Math.sin(t*0.6)*0.5;
  } else if(now<focusAvatarUntil){ // "show off your hero" beat after a transformation
    camera.position.lerp(new THREE.Vector3(avatar.position.x,2.1,avatar.position.z+4.8),1-Math.exp(-dt*5)); camera.lookAt(avatar.position.x,1.45,avatar.position.z);
    avatar.rotation.y+=dt*1.4;
  } else { // smooth follow + gentle idle sway when standing still (cinematic breath)
    const sway = moving?0:Math.sin(t*0.6)*0.18, lift = moving?0:Math.sin(t*0.8)*0.03;
    camera.position.lerp(avatar.position.clone().add(CAM_OFF).add(new THREE.Vector3(sway,0,0)),1-Math.exp(-dt*5)); camera.lookAt(avatar.position.x,1.2+lift,avatar.position.z);
  }
  if(marker.visible){ marker.rotation.z+=dt*2; marker.position.y=.1+Math.sin(t*3)*.08; }
  for(let i=sparkles.length-1;i>=0;i--){ const s=sparkles[i], m=s.m; m.rotation.y+=dt*2.4;
    if(!s.magnet){ m.position.y=1.2+Math.sin(t*3+s.seed)*.12;
      if(controlEnabled && Math.hypot(m.position.x-avatar.position.x,m.position.z-avatar.position.z)<3.0) s.magnet=true; }
    if(s.magnet){ s.pop=Math.min(1,s.pop+dt*5); m.scale.setScalar(1+0.6*Math.sin(s.pop*Math.PI)); // scale up before collection
      const goal=new THREE.Vector3(avatar.position.x,1.0,avatar.position.z); m.position.lerp(goal,1-Math.exp(-dt*11)); // fly into the avatar
      if(m.position.distanceTo(goal)<0.45){ collectStar(m.position.clone()); scene.remove(m); sparkles.splice(i,1); } } }
  if(gloomling.visible) gloomling.position.y=Math.sin(t*2)*.1;
  if(twinkle.visible){ const np=performance.now(), cheering=np<twCheerUntil, spinning=np<twSpinUntil;
    let baseY=Math.sin(t*3)*.12; if(cheering) baseY=Math.abs(Math.sin(t*12))*0.5; // excited hops
    if(twinkleFollows){ const behind=new THREE.Vector3(Math.sin(avatar.rotation.y)*-1.6,0,Math.cos(avatar.rotation.y)*-1.6); const goal=avatar.position.clone().add(behind); twinkle.position.lerp(new THREE.Vector3(goal.x,twinkle.position.y,goal.z),1-Math.exp(-dt*4)); twinkle.position.y=1.4+baseY; }
    else twinkle.position.y=baseY;
    if(spinning) twinkle.rotation.y+=dt*10; // happy spin
    else { const yaw=Math.atan2(avatar.position.x-twinkle.position.x,avatar.position.z-twinkle.position.z); twinkle.rotation.y+=(yaw-twinkle.rotation.y)*Math.min(1,dt*3); } // curious look toward you
    const blink=(t%3.4<0.1)?0.15:1, e1=twinkle.children[6], e2=twinkle.children[7]; if(e1) e1.scale.y=blink; if(e2) e2.scale.y=blink;
    if(twTailStar) twTailStar.material.emissiveIntensity=(cheering?1.6:.8)+Math.sin(t*6)*.3; }
  rumi.position.y=Math.sin(t*1.6)*.04; if(rumiBraid){ rumiBraid.rotation.x=Math.sin(t*1.4)*0.06; rumiBraid.rotation.z=0.35+Math.sin(t*1.1)*0.04; } // braid secondary motion
  if(reached===false && controlEnabled && Math.hypot(gloomling.position.x-avatar.position.x,gloomling.position.z-avatar.position.z)<2.0){ reachSpot(); }
  if(blooming&&bloom<1){ bloom=Math.min(1,bloom+dt*.6); skyMat.color.copy(new THREE.Color('#8a86a0')).lerp(new THREE.Color('#ffffff'),bloom); scene.fog.color.copy(FOG_GRAY).lerp(FOG_BRIGHT,bloom);
    hemi.intensity=.45+.35*bloom; water.material.color.copy(new THREE.Color('#7fb6bf')).lerp(new THREE.Color('#3fc8d2'),bloom); water.material.emissiveIntensity=0.1*bloom; dock.material.color.copy(new THREE.Color('#e7c9a6')).lerp(new THREE.Color('#ffe3b0'),bloom);
    flowers.forEach((f,i)=>f.scale.setScalar(Math.max(0,Math.min(1,bloom*1.3-i*0.02))*(0.85+0.3*Math.sin(i)))); }
  for(let i=bursts.length-1;i>=0;i--){ const b=bursts[i]; b.life-=dt*1.4; b.m.position.addScaledVector(b.v,dt); b.v.y-=dt*4; if(b.life<=0){ scene.remove(b.m); bursts.splice(i,1);} }
  // VFX 2.0 updates: magic star fountain, expanding rings, spotlight disc
  for(let i=magic.length-1;i>=0;i--){ const p=magic[i]; p.life-=dt/p.max; p.m.position.x+=p.vx*dt; p.m.position.y+=p.vy*dt; p.m.position.z+=p.vz*dt; p.vy-=dt*1.2; p.m.rotation.y+=p.spin*dt; p.m.rotation.x+=p.spin*dt; p.m.material.opacity=Math.max(0,p.life); p.m.scale.setScalar(0.6+p.life*0.8); if(p.life<=0){ scene.remove(p.m); magic.splice(i,1);} }
  for(let i=rings.length-1;i>=0;i--){ const r=rings[i]; r.life-=dt*1.3; const s=1+(1-r.life)*5; r.m.scale.set(s,s,1); r.m.material.opacity=Math.max(0,r.life); if(r.life<=0){ scene.remove(r.m); rings.splice(i,1);} }
  for(let i=trail.length-1;i>=0;i--){ const r=trail[i]; r.life-=dt*3.5; r.m.material.opacity=Math.max(0,r.life*0.6); r.m.scale.setScalar(0.5*r.life); if(r.life<=0){ scene.remove(r.m); trail.splice(i,1);} }
  spot.material.opacity+=((spotOn?0.5:0)-spot.material.opacity)*Math.min(1,dt*6); if(spot.material.opacity>0.01){ spot.position.x=avatar.position.x; spot.position.z=avatar.position.z; spot.rotation.z+=dt*0.6; }
  // environment ambience: drifting clouds, twinkling motes, lighthouse halo
  for(const c of clouds){ c.position.x+=dt*0.6; if(c.position.x>34) c.position.x=-34; }
  if(ambient){ ambient.rotation.y+=dt*0.03; ambient.material.opacity=0.35+0.2*Math.sin(t*1.5); }
  { const lit=lhLightMat.emissiveIntensity>0.1; lhHalo.material.opacity+=((lit?0.7+0.18*Math.sin(t*3):0)-lhHalo.material.opacity)*Math.min(1,dt*4); }
  for(const c of crystals){ const e=0.5+Math.sin(t*1.5+c.seed)*0.25; c.g.children[0].material.emissiveIntensity=e; c.g.children[1].material.emissiveIntensity=e+0.12; } // energy-infused pulse
  for(const gl of glyphs){ gl.g.rotation.y+=dt*0.25; gl.r1.material.opacity=0.55+0.25*Math.sin(t*1.2+gl.seed); } // slowly turning magic glyphs
  for(const f of faces){ const np=performance.now(); let m=f.tex.open; // blink + reactive happy expression (uses existing cheer signal)
    if(np<twCheerUntil) m=f.tex.happy; else { if(np>=f.next){ f.blinkUntil=np+120; f.next=np+2200+Math.random()*2800; } if(np<f.blinkUntil) m=f.tex.blink; }
    if(f.pl.material.map!==m){ f.pl.material.map=m; f.pl.material.needsUpdate=true; } }
  renderer.render(scene,camera); requestAnimationFrame(tick);
}
addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });
applyAvatar(); boot(); requestAnimationFrame(tick);
