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
  launchCount:0, voicePref:null, tutorialDone:false, musicOff:false
};
if(!state.shop) state.shop={owned:[],trail:null}; // Star Shop: purchases persist across days
if(!state.v) state.v=1; // save-schema version — bump with a migrate step when the shape changes
// Debug QS flags: ?day=N jump to day (testing week 2+) · ?fps=1 perf overlay · ?hero3d=0 blob hero
// ?allskills=1 bypass voiced-only filter · ?observe=1 researcher bar · ?bg=<url> custom sky · ?hero=<url> custom rig
let events = (()=>{ try{ return JSON.parse(localStorage.getItem(EKEY))||[]; }catch(e){ return []; } })();
let launchT = 0, delight={interaction:null,reward:null,smile:null,excited:null};
function log(ev,data={}){ events.push({t:Date.now(), rel: launchT?Math.round((performance.now()-launchT)):null, ev, day:state.day, ...data});
  try{ localStorage.setItem(EKEY, JSON.stringify(events)); }catch(e){} }

// ---------------- Audio ----------------
let audioOn=false, voice=null, voiceWarm=null, voiceKid=null, actx=null;
// Per-character voice profiles (pitch/rate) for the device-TTS fallback. Real film/TV-style
// voices come from pre-rendered AI clips in assets/vo/ (see vo() below); these are the safety net.
const VOICE_PROFILE={ narrator:{pitch:1.08,rate:0.96,kid:false}, rumi:{pitch:1.10,rate:0.97,kid:false},
  mira:{pitch:1.00,rate:0.95,kid:false}, zoey:{pitch:1.22,rate:1.02,kid:false},
  child:{pitch:1.35,rate:1.00,kid:true}, revi:{pitch:1.35,rate:1.00,kid:true},
  twinkle:{pitch:1.5,rate:1.06,kid:true}, gloomling:{pitch:0.85,rate:0.92,kid:false} };
function charProfile(name){ const k=(name||'').toLowerCase(); if(VOICE_PROFILE[k]) return k;
  if(/revi|hunter|you/.test(k)) return 'child'; if(/rumi/.test(k)) return 'rumi'; if(/mira/.test(k)) return 'mira'; if(/zoey/.test(k)) return 'zoey'; if(/twinkle/.test(k)) return 'twinkle'; if(/gloom/.test(k)) return 'gloomling'; return 'narrator'; }
function voiceScore(v){ const n=(v.name||'').toLowerCase(); let s=0; // rank built-in voices by how human they sound
  if(/siri/.test(n)) s+=100; if(/online|natural|neural/.test(n)) s+=80; if(/enhanced|premium/.test(n)) s+=60;
  if(/google/.test(n)) s+=42; if(/samantha|ava|allison|jenny|aria|zoe|nicky|sonia|libby|serena/.test(n)) s+=30;
  if(v.localService===false) s+=20; // cloud voices are usually higher quality
  if(/female|woman/.test(n)) s+=6;
  if(/compact|eloquence|fred|albert|zarvox|novelty|whisper|bad|trinoids/.test(n)) s-=80; // robotic/low-quality
  return s; }
function englishVoices(){ const en=x=>/en(-|_|\b)/i.test(x.lang); return speechSynthesis.getVoices().filter(en).sort((a,b)=>voiceScore(b)-voiceScore(a)); }
function pickVoice(){ const v=speechSynthesis.getVoices(); const en=x=>/en(-|_|\b)/i.test(x.lang);
  const pref = state.voicePref && v.find(x=>x.name===state.voicePref && en(x)); // honor the grown-up's choice
  const ranked=englishVoices();
  voiceWarm = pref || ranked[0] || v.find(en) || v[0] || null;
  voiceKid = v.find(x=>en(x)&&/(ana|child|kid|junior|shelley|grandma)/i.test(x.name)) || voiceWarm; // younger voice if present
  voice=voiceWarm; }
if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged=()=>{ pickVoice(); if(!$('parent').classList.contains('hidden')) populateVoicePicker(); }; }
// Character voices to audition (label, sample clip id). Guides share one line so you can compare them.
const CHARACTER_SAMPLES=[['Rumi','praise_reading_star__rumi'],['Mira','praise_reading_star__mira'],['Zoey','praise_reading_star__zoey'],['Twinkle','twinkle_happy'],['Gloomling','gloomling_lost'],['Narrator','reward_great_job']];
function populateVoicePicker(){ const sel=$('pc-voice'); if(!sel) return; sel.innerHTML='';
  CHARACTER_SAMPLES.forEach(([label,clip])=>{ const o=document.createElement('option'); o.value=clip; o.textContent=label; sel.appendChild(o); });
  sel.onchange=()=>{ if(sel.value) say('',{id:sel.value}); }; // play the picked voice on selection too
}
// ---- AI voice clips (assets/vo/<id>.mp3) — film/TV-style; auto-used when present, TTS otherwise ----
const VO_HAVE={}; // id -> preloaded Audio (only ids listed in assets/vo/manifest.json)
function loadVOManifest(){ try{ fetch('assets/vo/manifest.json').then(r=>r.ok?r.json():[]).then(ids=>{ (ids||[]).forEach(id=>{ const a=new Audio('assets/vo/'+id+'.mp3'); a.preload='auto'; VO_HAVE[id]=a; }); }).catch(()=>{}); }catch(e){} }
// Stable text -> clip-id map for authored lines (so rendering assets/vo/<id>.mp3 auto-replaces
// that line with a film/TV-style AI voice). Dynamic lines with the child's name stay on TTS.
const VO_LINES={
  "Hi! I'm Rumi! Welcome to Harmony Harbor! Oh no — the Lighthouse went dark and a shy Gloomling is hiding its words. Will you help me read to light it up?":'rumi_greet_d1',
  "You came back — yay! The dock signs got all mixed up in the wind. Can you read them with me?":'rumi_greet_d2',
  "Three days in a row — you're a real Star Hunter! The lighthouse keeper left you a note. Let's read it together…":'rumi_greet_d3',
  "“Dear friend… the harbor shines because of YOU. Read on!”":'keeper_note',
  "…I lost the words. Will you read them with me?":'gloomling_lost',
  "Here we go — read these with me!":'coach_here_we_go',
  "You filled the harbor with harmony! Watch — Rumi is becoming a Rising Star!":'rumi_rising',
  "Twinkle is evolving into Glimmerfox!":'twinkle_evolve',
  "You did it!":'praise_did_it', "Wonderful reading!":'praise_wonderful', "You're a reading star!":'praise_reading_star',
  "Amazing!":'praise_amazing', "Yay! You read it!":'praise_yay',
  "Almost! Listen again.":'fb_almost', "Trace along the glowing line, like this!":'fb_trace_hint',
  "Tap this one next!":'fb_blend_hint', "Start with the first sound!":'fb_first_sound',
  "See you tomorrow!":'nav_see_tomorrow', "Great job today, Star Hunter!":'reward_great_job',
  "*happy twinkle!* 🦊💛":'twinkle_happy',
  "Hi! I'm Rumi! Welcome to Reventure! Let me show you how to play.":'tut_1',
  "Tap the ground, or hold and drag, to walk around our magical harbor.":'tut_2',
  "Find a friend, then read and play games with me to fill the world with light!":'tut_3',
  "Every sound you learn makes you shine brighter. Ready? Let's go!":'tut_4'
};
function clipIdFor(text,explicit){ return explicit || VO_LINES[text] || null; }
// One voice at a time across BOTH systems: stop any playing AI clip AND cancel device TTS
// before starting either. (Otherwise a clip on headphones + TTS on the phone speaker overlap.)
let curClip=null;
function stopAudio(){ try{ speechSynthesis.cancel(); }catch(e){} if(curClip){ try{ curClip.onended=null; curClip.pause(); curClip.currentTime=0; }catch(e){} curClip=null; if(typeof duckMusic==='function') duckMusic(false); } }
function playClip(a,then){ try{ stopAudio(); a.currentTime=0; curClip=a; if(typeof duckMusic==='function') duckMusic(true);
  a.onended=()=>{ if(curClip===a) curClip=null; if(typeof duckMusic==='function') duckMusic(false); if(then) then(); };
  const p=a.play(); if(p&&p.catch) p.catch(()=>{ if(curClip===a) curClip=null; if(typeof duckMusic==='function') duckMusic(false); if(then) setTimeout(then,300); }); return true; }catch(e){ return false; } }
const ALLOW_TTS=false; // device/robotic voice fully disabled — real character clips only
let lastSay=null; // remembered so the HUD 🔊 can replay the last line
function say(t,{rate=null,pitch=null,then=null,char='narrator',id=null}={}){
  if(t||id) lastSay={t,id,char};
  const cid=clipIdFor(t,id); if(cid && audioOn){ const ck=charProfile(char); const pick=VO_HAVE[cid+'__'+ck]||VO_HAVE[cid]; if(pick && playClip(pick,then)) return; } // per-character AI clip, then generic
  if(!ALLOW_TTS || !audioOn || !('speechSynthesis' in window)){ stopAudio(); if(then) setTimeout(then,500); return; } // no clip → silent (no robotic), keep flow alive
  const pr=VOICE_PROFILE[charProfile(char)]||VOICE_PROFILE.narrator;
  try{ stopAudio(); const u=new SpeechSynthesisUtterance(t); u.rate=(rate!=null?rate:pr.rate); u.pitch=(pitch!=null?pitch:pr.pitch);
    const vv=(pr.kid?voiceKid:voiceWarm)||voice; if(vv)u.voice=vv; if(then)u.onend=then; speechSynthesis.speak(u);}catch(e){ if(then)setTimeout(then,400);} }
// ---- Looping background music (assets/music/theme.mp3) — gapless Web Audio loop, quiet, ducks under voices ----
let bgmGain=null, bgmSrc=null, bgmBuf=null, bgmBase=0.09, bgmReady=false, unduckT=null;
function findLoopRegion(buf){ // trim near-silent edges so the loop is tight (no perceived gap)
  const ch=buf.getChannelData(0), n=ch.length, sr=buf.sampleRate, thr=0.004; let s=0,e=n-1;
  while(s<n && Math.abs(ch[s])<thr) s++; while(e>s && Math.abs(ch[e])<thr) e--;
  const pad=Math.floor(sr*0.015); s=Math.max(0,s-pad); e=Math.min(n-1,e+pad);
  if(e-s < sr*0.5){ s=0; e=n-1; } // safety: if detection went wrong, use the whole file
  return {start:s/sr, end:e/sr}; }
function setBgm(v,t=0.4){ if(bgmGain&&actx){ try{ bgmGain.gain.setTargetAtTime(v,actx.currentTime,t); }catch(e){} } }
async function initMusic(){ if(bgmSrc || bgmReady || state.musicOff || !actx) return; bgmReady=true;
  try{ if(actx.state==='suspended') await actx.resume();
    const res=await fetch('assets/music/theme.mp3'); if(!res.ok){ bgmReady=false; return; }
    bgmBuf=await actx.decodeAudioData(await res.arrayBuffer());
    const {start,end}=findLoopRegion(bgmBuf);
    bgmGain=actx.createGain(); bgmGain.gain.value=0; bgmGain.connect(actx.destination);
    bgmSrc=actx.createBufferSource(); bgmSrc.buffer=bgmBuf; bgmSrc.loop=true; bgmSrc.loopStart=start; bgmSrc.loopEnd=end; bgmSrc.connect(bgmGain);
    bgmSrc.start(0,start); setBgm(bgmBase,1.0); // gentle fade-in
  }catch(e){ bgmReady=false; } }
function duckMusic(on){ if(!bgmGain||state.musicOff) return;
  if(on){ if(unduckT){clearTimeout(unduckT);unduckT=null;} setBgm(bgmBase*0.22,0.12); } // dip well under the voice
  else { if(unduckT)clearTimeout(unduckT); unduckT=setTimeout(()=>{ setBgm(bgmBase,0.6); unduckT=null; },450); } }
function updateMusicBtn(){ const b=$('music-btn'); if(b) b.textContent=state.musicOff?'🔇':'🎵'; }
function toggleMusic(){ state.musicOff=!state.musicOff; save(); updateMusicBtn();
  if(state.musicOff){ setBgm(0,0.3); } else if(bgmSrc){ setBgm(bgmBase,0.5); } else { bgmReady=false; initMusic(); } }
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
// ---- Ambient audio bed: a soft pad under the scene + occasional gentle birdsong ----
let padStarted=false, nextChirp=0;
function startPad(){ if(padStarted||!actx) return; padStarted=true; try{ const out=actx.createGain(); out.gain.value=0.016;
  const lp=actx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=620; lp.connect(actx.destination); out.connect(lp);
  [110,164.81,220].forEach((f,i)=>{ const o=actx.createOscillator(); o.type='sine'; o.frequency.value=f; o.detune.value=(i-1)*5; o.connect(out); o.start(); });
  const lfo=actx.createOscillator(), lg=actx.createGain(); lfo.frequency.value=0.07; lg.gain.value=0.008; lfo.connect(lg); lg.connect(out.gain); lfo.start(); }catch(e){} }
function birdChirp(){ if(!actx) return; try{ const now=actx.currentTime, base=1400+Math.random()*900;
  [0,0.13].forEach((off,i)=>{ const o=actx.createOscillator(),g=actx.createGain(); o.type='sine'; o.frequency.setValueAtTime(base*(i?1.18:1),now+off); o.frequency.exponentialRampToValueAtTime(base*(i?1.45:1.28),now+off+0.07); o.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(0.0001,now+off); g.gain.exponentialRampToValueAtTime(0.045,now+off+0.02); g.gain.exponentialRampToValueAtTime(0.0001,now+off+0.16); o.start(now+off); o.stop(now+off+0.2); }); }catch(e){} }
let avatarPop=0; function avatarReact(){ avatarPop=1; }
function earnStars(n){ state.avatar.stars+=n; if(n>0) SFX.starTick(); const el=$('star-num'); if(el) el.textContent=state.avatar.stars; save(); } // shop currency: earned by reading + exploring
function collectStar(pos){ burst(pos,'#FFD24D',14); collectChime(); haptic(12); earnStars(1); twCheerUntil=performance.now()+450; heroEmote('cheer',700); // Twinkle + hero celebrate collections
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
const CAM_OFF=new THREE.Vector3(0,5.9,11.2); // lower, more cinematic angle: shows the skyline + town, not just ground
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
// ---- Procedural ground textures (canvas, no art files): a magic plaza + rippling water ----
function dockTex(){ const s=512,cv=document.createElement('canvas'); cv.width=cv.height=s; const x=cv.getContext('2d'),c=s/2;
  let g=x.createRadialGradient(c,c,0,c,c,c); g.addColorStop(0,'#fbeacc'); g.addColorStop(0.7,'#f0dcbb'); g.addColorStop(1,'#e6cda4'); x.fillStyle=g; x.fillRect(0,0,s,s);
  x.strokeStyle='rgba(150,110,70,0.30)'; x.lineWidth=2.5; for(let r=46;r<c;r+=46){ x.beginPath(); x.arc(c,c,r,0,7); x.stroke(); } // ring seams
  for(let i=0;i<16;i++){ const a=i/16*Math.PI*2; x.beginPath(); x.moveTo(c,c); x.lineTo(c+Math.cos(a)*c*1.4,c+Math.sin(a)*c*1.4); x.stroke(); } // radial seams
  for(let i=0;i<1600;i++){ x.globalAlpha=Math.random()*0.10; x.fillStyle=Math.random()<0.5?'#ffffff':'#9a6a44'; x.fillRect(Math.random()*s,Math.random()*s,2,2); } x.globalAlpha=1; // stone speckle
  x.save(); x.translate(c,c); x.fillStyle='rgba(255,206,120,0.55)'; x.beginPath(); for(let i=0;i<10;i++){ const a=i/10*Math.PI*2-Math.PI/2, rr=(i%2?32:74); i?x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):x.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);} x.closePath(); x.fill(); x.restore(); // central star inlay
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t; }
function waterTex(){ const s=512,cv=document.createElement('canvas'); cv.width=cv.height=s; const x=cv.getContext('2d'),c=s/2;
  x.fillStyle='#dff0f2'; x.fillRect(0,0,s,s); x.globalCompositeOperation='lighter';
  for(let r=8;r<c*1.5;r+=16){ x.strokeStyle='rgba(255,255,255,'+(0.05+Math.random()*0.06)+')'; x.lineWidth=2+Math.random()*5; x.beginPath(); x.arc(c,c,r,0,7); x.stroke(); } // concentric ripples
  for(let i=0;i<450;i++){ x.fillStyle='rgba(255,255,255,0.05)'; x.beginPath(); x.arc(Math.random()*s,Math.random()*s,Math.random()*26,0,7); x.fill(); } // soft sparkle blobs
  x.globalCompositeOperation='source-over'; const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; t.center.set(0.5,0.5); return t; }
const water=new THREE.Mesh(new THREE.CircleGeometry(WORLD_R,64), new THREE.MeshStandardMaterial({color:'#7fb6bf',roughness:.5,map:waterTex()}));
water.rotation.x=-Math.PI/2; water.receiveShadow=true; scene.add(water);
// P4: counter-rotating shimmer layer + soft foam ring where water meets the plaza
const water2=new THREE.Mesh(new THREE.CircleGeometry(WORLD_R,64), new THREE.MeshBasicMaterial({map:waterTex(),transparent:true,opacity:0.20,depthWrite:false,blending:THREE.AdditiveBlending}));
water2.rotation.x=-Math.PI/2; water2.position.y=0.015; scene.add(water2);
const foam=new THREE.Mesh(new THREE.RingGeometry(8.92,9.32,64),new THREE.MeshBasicMaterial({color:'#eafcff',transparent:true,opacity:0.32,depthWrite:false,side:THREE.DoubleSide}));
foam.rotation.x=-Math.PI/2; foam.position.y=0.035; scene.add(foam);
const dock=new THREE.Mesh(new THREE.CircleGeometry(9,48), new THREE.MeshStandardMaterial({color:'#e7c9a6',roughness:1,map:dockTex()}));
dock.rotation.x=-Math.PI/2; dock.position.y=0.02; dock.receiveShadow=true; scene.add(dock);
// ---- Lighthouse: a real landmark (striped tower, stone base, gallery, glass lantern, starred roof) ----
// Materials keep the gloom→bloom story: dim/desaturated now, recolored by relightLighthouse().
const lhMat=new THREE.MeshStandardMaterial({color:'#c9c4d2',roughness:.9});      // body bands
const lhStripeMat=new THREE.MeshStandardMaterial({color:'#8f849e',roughness:.9}); // accent bands (dim → coral)
const lhLightMat=new THREE.MeshStandardMaterial({color:'#fff6d8',emissive:'#000',emissiveIntensity:0});
const lighthouse=new THREE.Group();
{ const BANDS=5,H=0.92,Y0=0.42; // tapered, alternating stripe bands
  for(let i=0;i<BANDS;i++){ const w=(BANDS-1-i)*0.09;
    const seg=new THREE.Mesh(new THREE.CylinderGeometry(1.0+w,1.1+w,H,20),(i%2?lhStripeMat:lhMat));
    seg.position.y=Y0+H/2+i*H; if(i===0){seg.castShadow=true;} lighthouse.add(seg); }
  const base=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2.05,0.45,22),new THREE.MeshToonMaterial({color:'#9d94ae',gradientMap:TOON_RAMP})); base.position.y=0.22; lighthouse.add(base); addOutline(base,'#3a2f52',0.02);
  const door=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.95,0.12),new THREE.MeshToonMaterial({color:'#4c3d66',gradientMap:TOON_RAMP})); door.position.set(0,0.9,1.42); lighthouse.add(door);
  const win=y=>{ const w=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.42,0.1),lhLightMat); w.position.set(0,y,1.28-((y-1)*0.075)); lighthouse.add(w); }; win(2.2); win(3.6); // little windows that glow at relight
  const deck=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.45,0.16,20),new THREE.MeshToonMaterial({color:'#7c7290',gradientMap:TOON_RAMP})); deck.position.y=Y0+BANDS*H+0.08; lighthouse.add(deck);
  const rail=new THREE.Mesh(new THREE.TorusGeometry(1.32,0.05,8,24),new THREE.MeshToonMaterial({color:'#5f5578',gradientMap:TOON_RAMP})); rail.rotation.x=Math.PI/2; rail.position.y=deck.position.y+0.42; lighthouse.add(rail);
  var lhLight=new THREE.Mesh(new THREE.CylinderGeometry(0.82,0.82,0.85,16),lhLightMat); lhLight.position.y=deck.position.y+0.55; lighthouse.add(lhLight);
  var lhRoof=new THREE.Mesh(new THREE.ConeGeometry(1.15,1.15,20),new THREE.MeshStandardMaterial({color:'#9a93a8',roughness:.9})); lhRoof.position.y=lhLight.position.y+1.0; lighthouse.add(lhRoof);
  var lhStar=new THREE.Mesh(new THREE.OctahedronGeometry(0.24),new THREE.MeshStandardMaterial({color:'#cfc6dd',emissive:'#000',emissiveIntensity:0})); lhStar.position.y=lhRoof.position.y+0.85; lighthouse.add(lhStar);
  for(let i=0;i<5;i++){ const a=i/5*Math.PI*2+0.4; const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(0.28+Math.random()*0.2),new THREE.MeshToonMaterial({color:'#8d84a2',gradientMap:TOON_RAMP}));
    rock.position.set(Math.cos(a)*2.15,0.16,Math.sin(a)*2.15); rock.rotation.set(Math.random(),Math.random(),0); lighthouse.add(rock); } }
lighthouse.position.set(0,0,-6); scene.add(lighthouse);
// Halo position tracks the (taller) lantern via lhLight world y — set after group placement below.

// ---- Character-themed buildings: each idol has a place, each place has a purpose ----
const winMat=new THREE.MeshStandardMaterial({color:'#ffe1a0',emissive:'#ffb84d',emissiveIntensity:.55,roughness:.6});
function house(x,z,col,roofCol){ const g=new THREE.Group();
  const b=new THREE.Mesh(new THREE.BoxGeometry(2,1.8,2),new THREE.MeshStandardMaterial({color:col,roughness:.95})); b.position.y=.9; b.castShadow=true;
  const r=new THREE.Mesh(new THREE.ConeGeometry(1.7,1.15,4),new THREE.MeshStandardMaterial({color:roofCol||'#fff',roughness:.8})); r.position.y=2.42; r.rotation.y=Math.PI/4;
  const d=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.85,0.08),new THREE.MeshToonMaterial({color:'#6a5480',gradientMap:TOON_RAMP})); d.position.set(0,0.45,1.02);
  const w1=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.42,0.08),winMat); w1.position.set(-0.55,1.15,1.02);
  const w2=w1.clone(); w2.position.x=0.55;
  const ch=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.7,0.3),new THREE.MeshToonMaterial({color:'#b9aecb',gradientMap:TOON_RAMP})); ch.position.set(0.6,2.55,-0.4);
  g.add(b,r,d,w1,w2,ch); g.position.set(x,0,z); g.lookAt(0,0,0); g.position.y=0; scene.add(g); return g; }
function buildingSign(g,emoji,label,accent){ const cv=document.createElement('canvas'); cv.width=256; cv.height=110; const x=cv.getContext('2d');
  x.fillStyle='#2B2233'; x.fillRect(0,8,256,94); x.fillRect(8,0,240,110);
  x.textAlign='center'; x.font='64px system-ui,sans-serif'; x.textBaseline='middle'; x.fillText(emoji,128,42); // icon-first: pre-readers read the picture
  x.fillStyle=accent; x.font='800 26px system-ui,sans-serif'; x.fillText(label,128,90);
  const tex=new THREE.CanvasTexture(cv); tex.colorSpace=THREE.SRGBColorSpace;
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.35,0.58),new THREE.MeshBasicMaterial({map:tex,transparent:true})); sign.position.set(0,1.68,1.06); g.add(sign);
  addGlow(g,{color:accent,size:1.25,opacity:0.5,pos:[0,0.7,1.15]}); } // themed welcoming door glow
const buildings=[]; // {g,id,name,act} — tap → walk to door → the building's purpose happens
function themedBuilding(id,name,emoji,x,z,wall,roof,accent,act){ const g=house(x,z,wall,roof); buildingSign(g,emoji,name,accent); buildings.push({g,id,name,act}); return g; }
// North pair flanks the lighthouse — visible from spawn. East/west pair frames the plaza.
const libHouse =themedBuilding('library','LIBRARY','📖',-5.6,-3.9,'#e9d7f7','#7B4FC4','#FFD24D',()=>{ pausedLesson?resumeLesson():startPractice(); }); // Rumi — practice, or resume a paused lesson
const acadHouse=themedBuilding('academy','SOUNDS','🎓', 5.6,-3.9,'#cfeaf0','#4f8fae','#8FD0FF',()=>openSoundWall()); // Mira — tap-to-hear letter sounds
const hallHouse=themedBuilding('hall','MUSIC','🎵',-7.0, 1.0,'#f8d3e6','#d1567f','#FF8FCF',()=>danceParty());        // Zoey — dance party
const shopHouse=themedBuilding('shop','SHOP','⭐', 7.0, 1.0,'#cdb8f0','#7e5be0','#FFE08A',()=>openShop());           // Twinkle — the Star Shop
{ const roofStar=new THREE.Mesh(new THREE.OctahedronGeometry(0.3),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.9})); roofStar.position.set(0,3.25,0); shopHouse.add(roofStar); addGlow(roofStar,{color:'#FFD24D',size:1.6,opacity:0.7}); }

// ---- Plaza dressing: lamp posts, festival bunting, benches, planters, crates, trees ----
const tapProps=[]; // World Life: props that pop + sparkle when a child taps them {g,col,pop}
const HITMAT=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}); // invisible tap-target expander
function padHit(obj,r=0.95,y=0){ const h=new THREE.Mesh(new THREE.SphereGeometry(r,6,6),HITMAT); h.position.y=y; obj.add(h); }
const lampMat=new THREE.MeshStandardMaterial({color:'#ffe9b0',emissive:'#ffcf70',emissiveIntensity:.9,roughness:.5});
const poleMat=new THREE.MeshToonMaterial({color:'#3f3560',gradientMap:TOON_RAMP});
const LAMP_POS=[[6.4,-5.2],[-6.4,-5.2],[-6.4,5.6],[6.4,5.6]];
LAMP_POS.forEach(([x,z])=>{ const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.1,2.6,8),poleMat); pole.position.set(x,1.3,z);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.2,10,10),lampMat); cap.position.set(x,2.7,z);
  addGlow(cap,{color:'#ffd98a',size:1.5,opacity:0.55}); padHit(cap,0.9); scene.add(pole,cap); tapProps.push({g:cap,col:'#ffd98a',pop:0,snd:'glass'}); });
// Bunting: one merged triangle-pennant geometry (single draw call), sagging between the lamps.
{ const cols=[[1,0.78,0.24],[1,0.56,0.81],[0.56,0.82,1],[0.49,0.94,0.75],[0.71,0.61,0.94]]; const pos=[],col=[];
  for(let s=0;s<LAMP_POS.length;s++){ const [ax,az]=LAMP_POS[s], [bx,bz]=LAMP_POS[(s+1)%LAMP_POS.length];
    for(let i=0;i<9;i++){ const u=(i+0.5)/9, x=ax+(bx-ax)*u, z=az+(bz-az)*u, y=2.62-Math.sin(u*Math.PI)*0.5;
      const dx=(bz-az),dz=-(bx-ax),L=Math.hypot(dx,dz),nx=dx/L*0.13,nz=dz/L*0.13, c=cols[i%5];
      pos.push(x-nx*1.3,y,z-nz*1.3, x+nx*1.3,y,z+nz*1.3, x,y-0.34,z); col.push(...c,...c,...c); } }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  scene.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide}))); }
// Benches (facing the lighthouse) + planters + crates
const woodMat=new THREE.MeshToonMaterial({color:'#a8795a',gradientMap:TOON_RAMP});
[[-3.4,0.9],[3.4,0.9]].forEach(([x,z])=>{ const g=new THREE.Group();
  const seat=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.12,0.5),woodMat); seat.position.y=0.42;
  const back=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.4,0.09),woodMat); back.position.set(0,0.72,-0.22);
  const legs=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.4,0.4),poleMat); legs.position.y=0.2;
  g.add(seat,back,legs); g.position.set(x,0,z); g.lookAt(0,0,-6); scene.add(g); tapProps.push({g,col:'#e8b98a',pop:0,snd:'wood'}); });
[[0,7.6],[-4.8,5.6],[4.8,5.6]].forEach(([x,z],pi)=>{ const g=new THREE.Group();
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.34,0.4,10),new THREE.MeshToonMaterial({color:'#c98d68',gradientMap:TOON_RAMP})); pot.position.y=0.2;
  const PCOL=['#ff8fcf','#ffd24d','#8fd0ff','#7ef0c0','#b69cff'];
  g.add(pot); for(let i=0;i<3;i++){ const f=new THREE.Mesh(new THREE.SphereGeometry(0.14,8,8),new THREE.MeshToonMaterial({color:PCOL[(pi+i)%5],gradientMap:TOON_RAMP})); f.position.set((i-1)*0.2,0.52,(i%2)*0.12-0.06); g.add(f); }
  g.position.set(x,0,z); padHit(g,1.0,0.5); scene.add(g); tapProps.push({g,col:'#ff8fcf',pop:0,snd:'leaf'}); });
[[7.9,-3.6,0.3],[7.4,-4.3,-0.2]].forEach(([x,z,ry])=>{ const c=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,0.7),woodMat); c.position.set(x,0.35,z); c.rotation.y=ry; c.castShadow=true; scene.add(c); tapProps.push({g:c,col:'#e8b98a',pop:0,snd:'wood'}); });
// Stylized toon trees (green, mint, and one pink blossom) with a gentle sway
const trees=[];
[[-8.2,-4.9,'#5fae6e'],[8.3,-4.9,'#5fae6e'],[-8.6,5.0,'#7ec6a0'],[8.6,5.0,'#7ec6a0'],[-4.4,7.4,'#e995c4'],[4.4,7.4,'#5fae6e']].forEach(([x,z,c],i)=>{
  const g=new THREE.Group(); const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.2,1.1,8),new THREE.MeshToonMaterial({color:'#8a5f43',gradientMap:TOON_RAMP})); trunk.position.y=0.55;
  const f1=new THREE.Mesh(new THREE.SphereGeometry(0.85,12,12),new THREE.MeshToonMaterial({color:c,gradientMap:TOON_RAMP})); f1.position.y=1.55; f1.castShadow=true; f1.scale.y=0.9;
  const f2=new THREE.Mesh(new THREE.SphereGeometry(0.55,10,10),new THREE.MeshToonMaterial({color:c,gradientMap:TOON_RAMP})); f2.position.y=2.25; f2.scale.y=0.85;
  addOutline(f1,'#2a4a34',0.02); g.add(trunk,f1,f2); g.position.set(x,0,z); scene.add(g); trees.push({g,ph:i*1.3}); tapProps.push({g,col:c,pop:0,snd:'leaf'}); });
// sparkles
const sparkles=[];
function makeSparkle(x,z){ const m=new THREE.Mesh(new THREE.OctahedronGeometry(.32),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.7})); m.position.set(x,1.2,z); addGlow(m,{color:'#FFD24D',size:0.85,opacity:0.6}); scene.add(m); sparkles.push({m,magnet:false,pop:0,seed:Math.random()*6}); }
[[-3,1],[3,.5],[-1.5,-2],[2,-3.5],[-4,-4]].forEach(p=>makeSparkle(p[0],p[1]));

// ---------------- Environment polish: sky, clouds, ambient sparkles, glow, flowers ----------------
// Enhanced 2D backdrop (temporary): a painted neon-dusk K-pop city panorama mapped on the sky dome.
const skyGeo=new THREE.SphereGeometry(90,32,20);
function paintBackdrop(){ const W=2048,H=1024,cv=document.createElement('canvas'); cv.width=W; cv.height=H; const x=cv.getContext('2d'); const horizon=H*0.52;
  let g=x.createLinearGradient(0,0,0,horizon); g.addColorStop(0,'#1b1147'); g.addColorStop(0.35,'#46247f'); g.addColorStop(0.62,'#8a3a8f'); g.addColorStop(0.85,'#e85a8a'); g.addColorStop(1,'#ffcf8a'); x.fillStyle=g; x.fillRect(0,0,W,horizon);
  x.fillStyle='#140e2a'; x.fillRect(0,horizon,W,H-horizon);
  const mx=W*0.74,my=H*0.2; let mg=x.createRadialGradient(mx,my,0,mx,my,180); mg.addColorStop(0,'rgba(255,245,225,1)'); mg.addColorStop(0.5,'rgba(255,225,200,0.45)'); mg.addColorStop(1,'rgba(255,210,180,0)'); x.fillStyle=mg; x.beginPath(); x.arc(mx,my,180,0,7); x.fill();
  x.fillStyle='#fff6e8'; x.beginPath(); x.arc(mx,my,60,0,7); x.fill();
  x.globalCompositeOperation='lighter';
  ['#4fd8ff','#ff4fa6','#b06aff','#7ef0c0'].forEach((c,i)=>{ x.globalAlpha=0.14; x.fillStyle=c; const y0=H*(0.08+i*0.08); x.beginPath(); x.moveTo(0,y0); for(let xx=0;xx<=W;xx+=48) x.lineTo(xx,y0+Math.sin(xx*0.005+i*1.7)*55); for(let xx=W;xx>=0;xx-=48) x.lineTo(xx,y0+150+Math.sin(xx*0.005+i*1.7)*55); x.closePath(); x.fill(); });
  for(let i=0;i<40;i++){ const ox=Math.random()*W, oy=Math.random()*horizon*0.95, or=2+Math.random()*5, oc=['#4fd8ff','#ff8fcf','#ffe08a'][(Math.random()*3)|0]; let og=x.createRadialGradient(ox,oy,0,ox,oy,or*3); og.addColorStop(0,oc); og.addColorStop(1,'rgba(0,0,0,0)'); x.globalAlpha=0.5; x.fillStyle=og; x.beginPath(); x.arc(ox,oy,or*3,0,7); x.fill(); }
  x.globalCompositeOperation='source-over'; x.globalAlpha=1;
  x.fillStyle='#fff'; for(let i=0;i<320;i++){ x.globalAlpha=0.35+Math.random()*0.6; x.beginPath(); x.arc(Math.random()*W,Math.random()*horizon*0.8,Math.random()*1.6+0.3,0,7); x.fill(); } x.globalAlpha=1;
  let hg=x.createRadialGradient(W*0.5,horizon,10,W*0.5,horizon,W*0.6); hg.addColorStop(0,'rgba(255,200,150,0.5)'); hg.addColorStop(1,'rgba(255,200,150,0)'); x.fillStyle=hg; x.fillRect(0,horizon-H*0.25,W,H*0.5);
  let bx=0; while(bx<W){ const bw=50+Math.random()*120, bh=H*(0.04+Math.random()*0.12), by=horizon-bh; x.fillStyle='#3a2a66'; x.globalAlpha=0.7; x.fillRect(bx,by,bw,bh+H*0.06); bx+=bw+10; } x.globalAlpha=1;
  x.globalCompositeOperation='lighter'; for(let i=0;i<5;i++){ const lx=W*(0.15+i*0.18); x.globalAlpha=0.07; x.fillStyle=['#4fd8ff','#ff4fa6','#ffe08a'][i%3]; x.beginPath(); x.moveTo(lx,horizon); x.lineTo(lx-40,horizon-H*0.42); x.lineTo(lx+40,horizon-H*0.42); x.closePath(); x.fill(); } x.globalCompositeOperation='source-over'; x.globalAlpha=1;
  const wc=['#4fd8ff','#ff4fa6','#ffd24d','#7ef0c0']; bx=0; while(bx<W){ const bw=40+Math.random()*90, bh=H*(0.07+Math.random()*0.18), by=horizon-bh;
    x.fillStyle='#1f1338'; x.fillRect(bx,by,bw,bh+H*0.06);
    if(Math.random()<0.3){ x.fillStyle='#1f1338'; x.fillRect(bx+bw/2-1,by-14,2,14); x.fillStyle='#ff4fa6'; x.fillRect(bx+bw/2-2,by-16,4,4); }
    for(let wy=by+8; wy<horizon-4; wy+=11) for(let wx=bx+5; wx<bx+bw-5; wx+=11) if(Math.random()<0.5){ x.fillStyle=wc[(Math.random()*4)|0]; x.globalAlpha=0.9; x.fillRect(wx,wy,3,5); }
    x.globalAlpha=1; bx+=bw+5; }
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t; }
const skyMat=new THREE.MeshBasicMaterial({map:paintBackdrop(),side:THREE.BackSide,fog:false,depthWrite:false}); skyMat.color.set('#9d97b6'); // dim until harmony returns
const bgURL=QS.get('bg'); if(bgURL){ try{ new THREE.TextureLoader().load(bgURL,tx=>{ tx.colorSpace=THREE.SRGBColorSpace; skyMat.map=tx; skyMat.needsUpdate=true; }); }catch(e){} } // swap in a custom 2D image
const skyMesh=new THREE.Mesh(skyGeo,skyMat); scene.add(skyMesh); scene.background=null;
const clouds=[]; for(let i=0;i<5;i++){ const c=new THREE.Mesh(new THREE.SphereGeometry(2.2+Math.random()*1.5,10,8),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0.5,fog:false})); c.scale.y=0.45; c.position.set(-30+Math.random()*60,16+Math.random()*8,-18-Math.random()*30); clouds.push(c); scene.add(c); }
let ambient=null; { const N=90,p=new Float32Array(N*3); for(let i=0;i<N;i++){ const a=Math.random()*Math.PI*2,r=2+Math.random()*18; p[i*3]=Math.cos(a)*r; p[i*3+1]=0.5+Math.random()*10; p[i*3+2]=Math.sin(a)*r; } const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(p,3)); ambient=new THREE.Points(g,new THREE.PointsMaterial({color:'#FFE9A8',size:0.3,map:GLOW_TEX,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending})); scene.add(ambient); } // soft round motes, not squares
function radialTex(){ const cv=document.createElement('canvas'); cv.width=cv.height=64; const x=cv.getContext('2d'); const g=x.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,240,180,1)'); g.addColorStop(1,'rgba(255,240,180,0)'); x.fillStyle=g; x.fillRect(0,0,64,64); return new THREE.CanvasTexture(cv); }
const lhHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:radialTex(),color:'#FFE9A8',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false})); lhHalo.scale.set(5,5,1); lhHalo.position.set(0,lhLight.position.y,-6); scene.add(lhHalo);
const flowers=[], FCOL=['#ff8fcf','#ffd24d','#8fd0ff','#7ef0c0','#b69cff']; for(let i=0;i<12;i++){ const a=(i/12)*Math.PI*2,r=5+Math.random()*3; const f=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,8),new THREE.MeshToonMaterial({color:FCOL[i%5],gradientMap:TOON_RAMP})); f.position.set(Math.cos(a)*r,0.2,Math.sin(a)*r); f.scale.setScalar(0); flowers.push(f); scene.add(f); }
water.material.emissive=new THREE.Color('#2faab0'); water.material.emissiveIntensity=0;
// ---------------- Ambient life: butterflies, birds, footstep flowers, water ripples ----------------
// All procedural (no new art) — gentle motion + a world that reacts to the child as they move.
const BLIFE=['#ff8fcf','#8fd0ff','#ffd24d','#b69cff','#7ef0c0'];
// Butterflies: soft glowing motes wandering lazy looping paths, wings "flutter" via opacity.
const butterflies=[]; for(let i=0;i<7;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW_TEX,color:new THREE.Color(BLIFE[i%5]),transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false}));
  s.scale.set(0.32,0.32,1); scene.add(s); butterflies.push({s,cx:(Math.random()-0.5)*24,cz:(Math.random()-0.5)*24,rx:2+Math.random()*4,rz:2+Math.random()*4,h:0.7+Math.random()*1.7,sp:0.25+Math.random()*0.5,ph:Math.random()*6.28}); }
// Birds: small dark V-silhouettes gliding across the sky, wings flapping, looping back around.
const birds=[]; for(let i=0;i<4;i++){ const g=new THREE.Group(); const bm=new THREE.MeshBasicMaterial({color:'#2e2a44',fog:true,side:THREE.DoubleSide});
  const wl=new THREE.Mesh(new THREE.PlaneGeometry(0.95,0.16),bm), wr=new THREE.Mesh(new THREE.PlaneGeometry(0.95,0.16),bm); wl.position.x=-0.5; wr.position.x=0.5;
  g.add(wl,wr); g.rotation.x=-0.5; g.position.set(-34+Math.random()*68,12+Math.random()*8,-12-Math.random()*24); scene.add(g); birds.push({g,wl,wr,sp:2+Math.random()*1.6,ph:Math.random()*6.28}); }
// Footstep flowers + water ripples: bloom/ripple in the hero's wake as they walk.
function flowerTex(){ const cv=document.createElement('canvas'); cv.width=cv.height=64; const x=cv.getContext('2d'); x.translate(32,32);
  for(let i=0;i<5;i++){ x.rotate(Math.PI*2/5); x.fillStyle='rgba(255,255,255,0.95)'; x.beginPath(); x.ellipse(0,-15,7,12,0,0,7); x.fill(); }
  x.fillStyle='#ffe08a'; x.beginPath(); x.arc(0,0,7,0,7); x.fill(); return new THREE.CanvasTexture(cv); }
const FLOWER_TEX=flowerTex(), STEP_GEO=new THREE.PlaneGeometry(0.5,0.5), RIPPLE_GEO=new THREE.RingGeometry(0.28,0.4,24);
const stepFx=[]; let stepDist=0, lastStepX=0, lastStepZ=0;
function spawnStepFlower(x,z){ const m=new THREE.Mesh(STEP_GEO,new THREE.MeshBasicMaterial({map:FLOWER_TEX,color:new THREE.Color(BLIFE[(Math.random()*5)|0]),transparent:true,opacity:0,depthWrite:false}));
  m.rotation.x=-Math.PI/2; m.rotation.z=Math.random()*6; m.position.set(x,0.05,z); scene.add(m); stepFx.push({m,life:0,max:3.4,flower:true}); }
function spawnRipple(x,z){ const m=new THREE.Mesh(RIPPLE_GEO,new THREE.MeshBasicMaterial({color:'#dff4ff',transparent:true,opacity:0.5,depthWrite:false,side:THREE.DoubleSide}));
  m.rotation.x=-Math.PI/2; m.position.set(x,0.06,z); scene.add(m); stepFx.push({m,life:0,max:1.2,flower:false}); }
// ---- Supernatural urban-magic props: glowing crystals + rotating magic-glyph circles ----
const CRYSTAL_COLS=['#ff4fa6','#b06aff','#4fd8ff','#ffd24d','#7ef0c0']; // HUNTRIX color families
const crystals=[];
function makeCrystal(x,z,col,h){ const g=new THREE.Group();
  const c=new THREE.Mesh(new THREE.ConeGeometry(0.35,h,6),new THREE.MeshToonMaterial({color:col,gradientMap:TOON_RAMP,emissive:new THREE.Color(col),emissiveIntensity:0.5})); c.position.y=h/2; c.castShadow=true;
  const tip=new THREE.Mesh(new THREE.OctahedronGeometry(0.24),new THREE.MeshToonMaterial({color:col,gradientMap:TOON_RAMP,emissive:new THREE.Color(col),emissiveIntensity:0.6})); tip.position.y=h+0.1;
  g.add(c,tip); addGlow(g,{color:col,size:1.6,opacity:0.5,pos:[0,h*0.7,0]}); g.position.set(x,0,z); g.rotation.y=Math.random()*6; padHit(g,1.0,0.8); scene.add(g); crystals.push({g,seed:Math.random()*6}); tapProps.push({g,col,pop:0,snd:'crystal'}); }
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
let heroMixer=null, heroActions={}, heroLoaded=false, heroPerforming=false, heroMats=[], heroOutfitMats=[], heroHairMats=[], heroSkinMats=[], heroCurrent=null, rumiMixer=null, rumiActions={}, rumiCurrent='idle', rumiWaveUntil=0, rumiNextWave=4000;
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
    clips.forEach(c=>{ const n=(c.name||'').toLowerCase(); const k=/idle/.test(n)?'idle':(/walk|run/.test(n)?'walk':(/dance/.test(n)?'dance':(/cheer|celebrat|jump/.test(n)?'cheer':(/wave|greet|hello/.test(n)?'wave':null)))); if(k&&!actions[k]) actions[k]=mixer.clipAction(c); });
    if(!actions.idle && clips[0]) actions.idle=mixer.clipAction(clips[0]);
    if(actions.idle) actions.idle.reset().play(); }
  return {mixer,actions}; }
function playHero(key){ if(!heroMixer||!heroActions[key]||heroCurrent===key) return; const next=heroActions[key];
  Object.values(heroActions).forEach(a=>{ if(a!==next) a.fadeOut(0.25); }); next.reset().fadeIn(0.25).play(); heroCurrent=key; }
let emoteUntil=0;
function heroEmote(key,ms){ if(heroLoaded && heroActions[key]){ emoteUntil=performance.now()+ms; playHero(key); } } // one-shot (cheer) then back to idle/walk
function playRumi(key){ if(!rumiMixer||!rumiActions[key]||rumiCurrent===key) return; const next=rumiActions[key];
  Object.values(rumiActions).forEach(a=>{ if(a!==next) a.fadeOut(0.3); }); next.reset().fadeIn(0.3).play(); rumiCurrent=key; }
function setupRumiWave(){ if(rumiActions.wave){ rumiActions.wave.setLoop(THREE.LoopOnce,1); rumiActions.wave.clampWhenFinished=false; } rumiNextWave=performance.now()+3000; }
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
      if(rRoot){ rumi.children.slice().forEach(c=>{ c.visible=false; }); const r=mountCharacter(rumi,rRoot,gltf.animations,{tag:'rumi',buckets:null}); rumiMixer=r.mixer; rumiActions=r.actions; setupRumiWave(); } }catch(e){} }
    log('hero_model_loaded',{characters:names, avatar:avRoot.name||null});
  }catch(e){ heroLoaded=false; } },
  undefined, ()=>{ heroLoaded=false; }); }
async function maybeLoadHero(){ if(QS.get('hero3d')==='0') return; // 3D character ON by default now (use ?hero3d=0 for the customizable blob)
  try{ const r=await fetch(HERO_URL,{method:'HEAD'}); if(r&&r.ok) loadHero(); }catch(e){} }
// Rumi NPC from her own folder (separate rigged model).
async function maybeLoadRumi(){ if(QS.get('hero3d')==='0') return; // loads the week's guide (Rumi/Mira/Zoey) as the in-world NPC
  const d=decideDay(); const name=coachNameFor(d>0?d:1);
  async function tryLoad(n){ const url=`assets/${n}/${n}.glb`;
    try{ const r=await fetch(url,{method:'HEAD'}); if(!r||!r.ok) return false; }catch(e){ return false; }
    return new Promise(res=>{ new GLTFLoader().load(url, gltf=>{ try{ rumi.children.slice().forEach(c=>{ c.visible=false; }); const m=mountCharacter(rumi,gltf.scene,gltf.animations,{tag:n,buckets:null}); rumiMixer=m.mixer; rumiActions=m.actions; setupRumiWave(); }catch(e){} res(true); }, undefined, ()=>res(false)); }); }
  if(!(await tryLoad(name)) && name!=='rumi') await tryLoad('rumi');
}

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

// ---- World Life: the other two legends hang out near their houses (idle, dance, wave, greet) ----
const npcs=[]; // {g,mixer,actions,name,current,waveUntil,nextAct,homeYaw}
const NPC_SPOTS={rumi:[-4.3,-2.4,0.55], mira:[4.3,-2.4,-0.55], zoey:[-5.5,-0.1,0.8]}; // each idol stands by her own building
function playNpc(n,key){ if(!n.mixer||!n.actions[key]||n.current===key) return; const next=n.actions[key];
  Object.values(n.actions).forEach(a=>{ if(a!==next) a.fadeOut(0.3); }); next.reset().fadeIn(0.3).play(); n.current=key; }
async function loadAmbientIdols(){ if(QS.get('hero3d')==='0') return;
  const d=decideDay(); const guide=coachNameFor(d>0?d:1); // the week's guide already stands in the guide slot
  for(const name of ['rumi','mira','zoey']){ if(name===guide) continue; const [x,z,ry]=NPC_SPOTS[name];
    const url=`assets/${name}/${name}.glb`;
    try{ const r=await fetch(url,{method:'HEAD'}); if(!r||!r.ok) continue; }catch(e){ continue; }
    await new Promise(res=>{ new GLTFLoader().load(url,gltf=>{ try{
      const g=new THREE.Group(); g.position.set(x,0,z); g.rotation.y=ry; scene.add(g);
      const m=mountCharacter(g,gltf.scene,gltf.animations,{tag:name,buckets:null});
      if(m.actions.wave){ m.actions.wave.setLoop(THREE.LoopOnce,1); }
      npcs.push({g,mixer:m.mixer,actions:m.actions,name,current:'idle',waveUntil:0,nextAct:performance.now()+5000+Math.random()*6000,homeYaw:ry});
    }catch(e){} res(); },undefined,()=>res()); }); } }
let npcGreetT=0;
function npcGreet(n){ const np=performance.now(); if(np<npcGreetT) return; npcGreetT=np+1400;
  if(n.actions.wave){ playNpc(n,'wave'); n.waveUntil=np+1600; }
  const p=n.g.position; burst(new THREE.Vector3(p.x,1.9,p.z),'#FFE08A',10); haptic(10);
  if(audioOn) say(praises[(Math.random()*praises.length)|0],{char:n.name}); } // voiced via each idol's own clips

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
const TW_SCALE=0.6; // keep the Star Pal small so it never blocks the characters
twinkle.scale.setScalar(TW_SCALE);
twinkle.position.copy(gloomling.position); twinkle.visible=false; scene.add(twinkle);
let twinkleFollows=false;

const marker=new THREE.Mesh(new THREE.TorusGeometry(.7,.12,8,24),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.7}));
marker.rotation.x=-Math.PI/2; marker.visible=false; addGlow(marker,{color:'#FFD24D',size:1.3,opacity:0.5}); scene.add(marker);
function setMarker(p){ if(!p){marker.visible=false;return;} marker.position.set(p.x,.1,p.z); marker.visible=true; }

// movement
const ray=new THREE.Raycaster(), ndc=new THREE.Vector2(), target=avatar.position.clone();
let avVel=0, avHeading=0, avBank=0; // velocity + smoothed heading + bank (animation personality)
let controlEnabled=false;
function tapGround(cx,cy,juice=true){ if(!controlEnabled)return false; ndc.x=(cx/innerWidth)*2-1; ndc.y=-(cy/innerHeight)*2+1; ray.setFromCamera(ndc,camera);
  const hit=ray.intersectObject(water,false)[0];
  if(hit&&Math.hypot(hit.point.x,hit.point.z)<=WORLD_R-1){ target.copy(hit.point); target.y=0; $('hint').style.opacity=0;
    if(juice){ burst(new THREE.Vector3(hit.point.x,0.06,hit.point.z),'#FFE9A8',6); avatarReact(); } // tap = small ground sparkle + avatar reaction
    if(delight.interaction===null){ delight.interaction=Math.round(performance.now()-launchT); log('first_interaction',{ms:delight.interaction}); }
    return true; } return false; }
// Tap OR hold-and-drag: a quick tap walks the hero to a spot; holding and dragging
// makes the hero continuously follow your finger across the ground (kid-friendly steering).
let dragging=false, dragTrailT=0;
// ---------------- STAR SHOP: tap the shop → walk to the door → it opens. Stars buy fun. ----------------
const SHOP_ITEMS=[
  {id:'fireworks',emoji:'🎆',name:'Firework Show',price:3,instant:true},
  {id:'trail_gold',emoji:'⭐',name:'Gold Sparkle Trail',price:8,trail:'#FFC83D'},
  {id:'trail_pink',emoji:'💗',name:'Pink Sparkle Trail',price:8,trail:'#FF8FCF'},
  {id:'trail_sky',emoji:'💙',name:'Sky Sparkle Trail',price:8,trail:'#8FD0FF'},
  {id:'balloons',emoji:'🎈',name:'Party Balloons',price:10},
  {id:'bow',emoji:'🎀',name:"Twinkle's Bow",price:12},
];
let buildingPending=null; // {g,act} — the building we're walking to
function doorPoint(g){ const p=g.position.clone(); const dir=p.clone().negate().setY(0).normalize(); return p.add(dir.multiplyScalar(2.0)); }
function enterBuildingWalk(b){ if(!controlEnabled) return; const d=doorPoint(b.g); target.copy(d); target.y=0; setMarker(d); buildingPending=b;
  burst(new THREE.Vector3(b.g.position.x,1.4,b.g.position.z),'#FFD24D',8); haptic(8); }
function openShop(){ buildingPending=null; controlEnabled=false; setMarker(null); SFX.bell(); wipe(()=>{ renderShop(); show('shop'); showBack(closeShop); }); log('shop_open',{stars:state.avatar.stars}); }
function closeShop(){ wipe(()=>{ hide('shop'); hideBack(); controlEnabled=true; }); }
function spendStars(n,btn){ if(state.avatar.stars<n){ if(btn){ btn.classList.remove('deny'); void btn.offsetWidth; btn.classList.add('deny'); }
    const tip=$('shop-tip'); if(tip) tip.textContent='Read and collect to earn more ⭐!'; SFX.deny(); return false; }
  state.avatar.stars-=n; earnStars(0); const ss=$('shop-stars'); if(ss) ss.textContent=state.avatar.stars; return true; }
function applyTrail(color){ state.avatar.color=color; applyAvatar(); }
let balloonsBuilt=false, twBow=null;
function buildBalloons(){ if(balloonsBuilt) return; balloonsBuilt=true;
  [[6.4,-5.2],[-6.4,5.6]].forEach(([x,z])=>{ ['#ff4fa6','#ffd24d','#4fd8ff'].forEach((c,i)=>{
    const b=new THREE.Mesh(new THREE.SphereGeometry(0.22,10,10),new THREE.MeshToonMaterial({color:c,gradientMap:TOON_RAMP})); b.scale.y=1.15; b.position.set(x+(i-1)*0.26,3.05+(i%2)*0.2,z); scene.add(b);
    const s=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.5,4),new THREE.MeshBasicMaterial({color:'#fff'})); s.position.set(b.position.x,2.78,z); scene.add(s); }); }); }
function buildTwinkleBow(){ if(twBow) return; twBow=new THREE.Group(); const m=new THREE.MeshToonMaterial({color:'#ff5fa8',gradientMap:TOON_RAMP});
  const l=new THREE.Mesh(new THREE.SphereGeometry(0.12,8,8),m); l.scale.set(1,0.7,0.6); l.position.x=-0.11;
  const r=l.clone(); r.position.x=0.11; const k=new THREE.Mesh(new THREE.SphereGeometry(0.07,8,8),m);
  twBow.add(l,r,k); twBow.position.set(0,1.58,0.1); twinkle.add(twBow); }
function fireworksShow(){ confetti(); for(let i=0;i<5;i++){ setTimeout(()=>{ SFX.boom();
  magicBurst(new THREE.Vector3((Math.random()-0.5)*14,6+Math.random()*4,-2-Math.random()*6),40,['#ff4fa6','#ffd24d','#4fd8ff','#7ef0c0'][(Math.random()*4)|0]); },i*450); } }
function applyShopOwned(){ if(state.shop.owned.includes('balloons')) buildBalloons(); if(state.shop.owned.includes('bow')) buildTwinkleBow(); } // rebuild purchases on load
function renderShop(){ const ss=$('shop-stars'); if(ss) ss.textContent=state.avatar.stars; const tip=$('shop-tip'); if(tip) tip.textContent='';
  const host=$('shop-items'); if(!host) return; host.innerHTML='';
  SHOP_ITEMS.forEach(it=>{ const owned=state.shop.owned.includes(it.id), eq=it.trail&&state.shop.trail===it.id;
    const row=document.createElement('div'); row.className='shop-item';
    const label=it.instant?`${it.price} ⭐`:owned?(it.trail?(eq?'On! ✓':'Wear'):'Yours ✓'):`${it.price} ⭐`;
    row.innerHTML=`<div class="si-ico">${it.emoji}</div><b>${it.name}</b>`;
    const b=document.createElement('button'); b.className='si-buy'+(owned&&!it.instant?' owned':'')+(eq?' eq':''); b.textContent=label;
    b.onclick=()=>{ const has=state.shop.owned.includes(it.id);
      if(it.instant){ if(spendStars(it.price,b)){ fireworksShow(); log('shop_buy',{id:it.id}); } return; }
      if(has){ if(it.trail){ state.shop.trail=it.id; applyTrail(it.trail); save(); renderShop(); } return; }
      if(spendStars(it.price,b)){ state.shop.owned.push(it.id);
        if(it.trail){ state.shop.trail=it.id; applyTrail(it.trail); }
        if(it.id==='balloons') buildBalloons(); if(it.id==='bow') buildTwinkleBow();
        save(); SFX.fanfare(); confetti(); renderShop(); log('shop_buy',{id:it.id}); } };
    row.appendChild(b); host.appendChild(row); }); }
// ---------------- Building purposes: Library practice, Academy sound wall, Music Hall dance party ----------------
function startPractice(){ buildingPending=null; controlEnabled=false; setMarker(null); // Rumi's Library: a 5-question practice visit — extra stars, no pressure
  const day=state.day>0?state.day:1; const list=genActivities(day,5);
  if(!list.length){ controlEnabled=true; return; }
  runActivities(list,()=>{ confetti(); SFX.fanfare();
    const p=praises[(Math.random()*praises.length)|0]; if(audioOn) say(p,{char:'rumi'});
    controlEnabled=true; log('practice_done',{}); },true); log('practice_start',{}); }
let swLetters=[];
function openSoundWall(){ buildingPending=null; controlEnabled=false; setMarker(null); // Mira's Academy: tap a letter, hear its sound (all clips already voiced)
  const day=state.day>0?state.day:1; const host=$('sw-options'); if(!host){ controlEnabled=true; return; }
  swLetters=[]; for(let i=0;i<8;i++) swLetters.push(LETTERBANK[(day*3+i)%LETTERBANK.length]);
  host.innerHTML='';
  swLetters.forEach(L=>{ const b=document.createElement('button'); b.className='opt'; b.textContent=L[0];
    b.onclick=()=>{ if(audioOn) say(L[1]); b.classList.remove('correct'); void b.offsetWidth; b.classList.add('correct'); sparkleAt(b,5); haptic(6);
      setTimeout(()=>b.classList.remove('correct'),700); };
    host.appendChild(b); });
  const closeSW=()=>{ wipe(()=>{ hide('soundwall'); hideBack(); controlEnabled=true; }); };
  wipe(()=>{ show('soundwall'); showBack(closeSW); }); log('soundwall_open',{});
  const c=$('sw-close'); if(c) c.onclick=closeSW; }
function danceParty(){ buildingPending=null; if(!controlEnabled) return; controlEnabled=false; setMarker(null); // Zoey's Music Hall: everyone dances!
  spotOn=1; confetti(); SFX.combo(); haptic(20); log('dance_party',{});
  if(rumiActions.dance){ playRumi('dance'); rumiWaveUntil=performance.now()+5200; }
  for(const n of npcs){ if(n.actions.dance){ playNpc(n,'dance'); n.waveUntil=performance.now()+5200; } }
  heroEmote('dance',5200); twinkleSpin(5000);
  setTimeout(()=>{ magicBurst(hallHouse.position.clone().add(new THREE.Vector3(0,2.5,0)),30,'#FF8FCF'); },600);
  setTimeout(()=>{ spotOn=0; controlEnabled=true; },5400); }
// Tapping Rumi in the world → she waves and offers a friendly tip (interactive guide).
const RUMI_TIPS=["Tap the ground to explore — or hold and drag to walk with me!","Look for the glowing star and listen for its sound!","You're doing amazing. Sound it out nice and slow.","Tap Twinkle to say hello!","Every sound you learn makes you shine brighter!"];
let rumiTipT=0;
function rumiTip(){ const np=performance.now(); if(np<rumiTipT) return; rumiTipT=np+1400;
  if(rumiActions.wave){ playRumi('wave'); rumiWaveUntil=np+1500; rumiNextWave=np+8000; }
  burst(new THREE.Vector3(rumi.position.x,1.9,rumi.position.z),'#FFE08A',8);
  if(audioOn){ const ti=(Math.random()*RUMI_TIPS.length)|0; say(RUMI_TIPS[ti],{id:'tip_'+ti}); } }
renderer.domElement.addEventListener('pointerdown',e=>{ if(e.isPrimary===false) return; lastInputT=performance.now(); tapRing(e.clientX,e.clientY); haptic(8); if(!controlEnabled) return;
  ndc.x=(e.clientX/innerWidth)*2-1; ndc.y=-(e.clientY/innerHeight)*2+1; ray.setFromCamera(ndc,camera);
  if(rumi.visible && ray.intersectObject(rumi,true).length){ rumiTip(); return; } // tap Rumi → tip
  for(const n of npcs){ if(ray.intersectObject(n.g,true).length){ npcGreet(n); return; } } // tap an idol → wave + hello
  if(wish && ray.intersectObject(wish,true).length){ burst(wish.position.clone(),'#FFD24D',16); collectChime(); earnStars(1); twinkleCheer(1200); scene.remove(wish); wish=null; return; } // caught a wish!
  for(const bl of buildings){ if(ray.intersectObject(bl.g,true).length){ enterBuildingWalk(bl); return; } } // tap a building → walk to its door
  for(const p of tapProps){ if(ray.intersectObject(p.g,true).length){ propDelight(p); break; } } // tap a prop → pop + sparkle (still walks)
  buildingPending=null; // walking somewhere else cancels a pending visit
  dragging=true; tapGround(e.clientX,e.clientY); });
function propDelight(p){ p.pop=1; const w=new THREE.Vector3(); p.g.getWorldPosition(w); w.y+=0.9;
  burst(w,p.col,8); (SFX[p.snd]||chirp)(); haptic(8);
  if(p.snd==='leaf'){ for(let i=0;i<3;i++) setTimeout(()=>spawnStepFlower(w.x+(Math.random()-0.5)*1.2, w.z+(Math.random()-0.5)*1.2), i*140); } // trees & planters shed petals
  if(p.snd==='glass') burst(new THREE.Vector3(w.x,w.y+1.4,w.z),'#ffffff',6); } // lamps flash bright
renderer.domElement.addEventListener('pointermove',e=>{ if(e.isPrimary===false||!dragging||!controlEnabled) return;
  if(tapGround(e.clientX,e.clientY,false)){ dragTrailT-=1; if(dragTrailT<=0){ dragTrailT=4; tapRing(e.clientX,e.clientY); } } }); // light dotted feedback as the finger drags
const endDrag=()=>{ dragging=false; };
renderer.domElement.addEventListener('pointerup',endDrag);
renderer.domElement.addEventListener('pointercancel',endDrag);
renderer.domElement.addEventListener('pointerleave',endDrag);
// suppress the long-press "copy / select all" callout while steering the character
renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
renderer.domElement.style.webkitUserSelect='none'; renderer.domElement.style.userSelect='none'; renderer.domElement.style.webkitTouchCallout='none';

// bursts / confetti / bloom
const bursts=[];
function burst(pos,color='#FFE9A8',n=24){ for(let i=0;i<n;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(.08,6,6),new THREE.MeshBasicMaterial({color})); s.position.copy(pos); s.position.y+=1;
  const d=new THREE.Vector3(Math.random()-.5,Math.random()*1.1,Math.random()-.5).normalize(); bursts.push({m:s,v:d.multiplyScalar(3+Math.random()*3),life:1}); scene.add(s);} }
function confetti(){ const cols=['#FFC83D','#FF8FCF','#8FD0FF','#7EF0C0','#B69CFF'];
  for(let i=0;i<60;i++){ const d=document.createElement('div'); d.className='confetti'; d.style.left=Math.random()*100+'vw'; d.style.background=cols[i%5];
    d.style.animation=`fall ${1.6+Math.random()*1.4}s ${Math.random()*.6}s ease-in forwards`; document.body.appendChild(d); setTimeout(()=>d.remove(),3600);} }
// PASS 7: DOM sparkle burst from a screen element (the 3D burst is hidden behind the overlay during learning)
const SPARKS=['✨','⭐','🌟','💫'];
function sparkleAt(el,n=10){ if(!el)return; const r=el.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2;
  for(let i=0;i<n;i++){ const s=document.createElement('div'); s.className='fx-spark'; s.textContent=SPARKS[i%SPARKS.length];
    const a=(Math.PI*2*i)/n+Math.random()*0.5, dist=46+Math.random()*54;
    s.style.left=cx+'px'; s.style.top=cy+'px';
    s.style.setProperty('--dx',Math.cos(a)*dist+'px'); s.style.setProperty('--dy',(Math.sin(a)*dist-30)+'px');
    s.style.setProperty('--rot',((Math.random()*120-60)|0)+'deg');
    s.style.fontSize=(16+Math.random()*14)+'px';
    document.body.appendChild(s); setTimeout(()=>s.remove(),760); } }
function coachHop(){ const el=$('coach-img')&&!$('coach-img').classList.contains('hidden')?$('coach-img'):$('coach-face'); if(!el)return; el.classList.remove('cheer'); void el.offsetWidth; el.classList.add('cheer'); setTimeout(()=>el.classList.remove('cheer'),640); }
function reEnter(el){ if(!el)return; el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); setTimeout(()=>el.classList.remove('enter'),560); }
// Back button (top-left): one consistent way OUT of lessons, practice, sound wall, shop.
let backAct=null;
function showBack(fn){ backAct=fn; const b=$('back-btn'); if(b) b.classList.remove('hidden'); }
function hideBack(){ backAct=null; const b=$('back-btn'); if(b) b.classList.add('hidden'); }
// P1b: star-iris "door" transition — covers the screen, swaps scenes under cover, reveals.
let wiping=false;
function wipe(mid){ if(wiping){ try{mid&&mid();}catch(e){} return; } wiping=true; SFX.whoosh();
  const d=document.createElement('div'); d.className='wipe'; document.body.appendChild(d);
  requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('in')));
  setTimeout(()=>{ try{mid&&mid();}catch(e){} d.classList.remove('in');
    setTimeout(()=>{ d.remove(); wiping=false; },420); },430); }
let bloom=0, blooming=false; function startBloom(){ blooming=true; }
function relightLighthouse(){ lhMat.color.set('#f7f0e2'); lhStripeMat.color.set('#e2566b'); lhRoof.material.color.set('#e23e6b');
  lhLightMat.emissive.set('#FFD24D'); lhLightMat.emissiveIntensity=1.2;
  lhStar.material.color.set('#ffd24d'); lhStar.material.emissive.set('#FFC83D'); lhStar.material.emissiveIntensity=1.0;
  burst(lighthouse.position,'#FFD24D',40); }

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
// ---------------- P2: synthesized SFX palette (AudioBible specs — zero download, zero quota) ----------------
function sfx(fn){ try{ if(!audioOn) return; actx=actx||new(window.AudioContext||window.webkitAudioContext)(); fn(actx); }catch(e){} }
function tone(a,{f=440,f2=null,type='sine',t=0.15,g=0.12,at=0.005,delay=0}={}){ const o=a.createOscillator(),v=a.createGain(); o.type=type; const t0=a.currentTime+delay;
  o.frequency.setValueAtTime(f,t0); if(f2) o.frequency.exponentialRampToValueAtTime(Math.max(40,f2),t0+t);
  v.gain.setValueAtTime(0,t0); v.gain.linearRampToValueAtTime(g,t0+at); v.gain.exponentialRampToValueAtTime(0.0001,t0+t);
  o.connect(v); v.connect(a.destination); o.start(t0); o.stop(t0+t+0.02); }
function nz(a,{t=0.2,g=0.08,fLow=400,fHigh=2000,delay=0}={}){ const n=a.createBufferSource(),buf=a.createBuffer(1,Math.max(1,a.sampleRate*t)|0,a.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length); n.buffer=buf;
  const bp=a.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=(fLow+fHigh)/2; bp.Q.value=0.8;
  const v=a.createGain(); const t0=a.currentTime+delay; v.gain.setValueAtTime(g,t0); v.gain.exponentialRampToValueAtTime(0.0001,t0+t);
  n.connect(bp); bp.connect(v); v.connect(a.destination); n.start(t0); }
let starStreak=0; // rises with consecutive correct answers — the star tick climbs with it
const SFX={
  starTick(){ sfx(a=>tone(a,{f:1046*Math.pow(1.122,Math.min(starStreak,6)),t:0.09,g:0.1})); },
  combo(){ sfx(a=>{ tone(a,{f:784,t:0.12,g:0.12}); tone(a,{f:1046,t:0.22,g:0.12,delay:0.11}); nz(a,{t:0.35,g:0.03,fLow:3000,fHigh:8000,delay:0.1}); }); },
  wood(){ sfx(a=>{ tone(a,{f:180,f2:90,type:'triangle',t:0.09,g:0.14}); nz(a,{t:0.05,g:0.05,fLow:200,fHigh:600}); }); },
  glass(){ sfx(a=>tone(a,{f:1318,t:0.25,g:0.09})); },
  leaf(){ sfx(a=>nz(a,{t:0.18,g:0.06,fLow:1500,fHigh:5000})); },
  crystal(){ sfx(a=>{ tone(a,{f:880,t:0.3,g:0.07}); tone(a,{f:884,t:0.3,g:0.07}); }); },
  whoosh(){ sfx(a=>nz(a,{t:0.32,g:0.09,fLow:300,fHigh:1400})); },
  bell(){ sfx(a=>{ tone(a,{f:659,type:'triangle',t:0.25,g:0.1}); tone(a,{f:523,type:'triangle',t:0.3,g:0.1,delay:0.15}); }); },
  fanfare(){ sfx(a=>{ [523,659,784].forEach((f,i)=>tone(a,{f,type:'triangle',t:0.18,g:0.11,delay:i*0.09})); nz(a,{t:0.4,g:0.03,fLow:4000,fHigh:9000,delay:0.25}); }); },
  deny(){ sfx(a=>tone(a,{f:220,f2:180,t:0.25,g:0.1})); }, // kind, not sad
  boom(){ sfx(a=>{ tone(a,{f:300,f2:900,t:0.5,g:0.06}); nz(a,{t:0.5,g:0.12,fLow:100,fHigh:900,delay:0.45}); nz(a,{t:0.3,g:0.05,fLow:3000,fHigh:9000,delay:0.55}); }); },
  horn(){ sfx(a=>tone(a,{f:130,type:'triangle',t:0.8,g:0.09,at:0.25})); },
};
// Gentle harbor ambience: soft wave swells + rare gull cries. Mutes during lessons; respects 🔊.
let ambTimer=null;
function ambLoop(){ const lessonUp=(!$('challenge').classList.contains('hidden'))||(!$('starcheck').classList.contains('hidden'))||(!$('shop').classList.contains('hidden'));
  if(!lessonUp && audioOn){ sfx(a=>nz(a,{t:2.6,g:0.016,fLow:150,fHigh:600}));
    if(Math.random()<0.22) sfx(a=>{ tone(a,{f:1200,f2:900,t:0.12,g:0.012}); tone(a,{f:1100,f2:850,t:0.1,g:0.01,delay:0.15}); }); }
  ambTimer=setTimeout(ambLoop, 6000+Math.random()*3500); }
function chirp(){ try{ actx=actx||new(window.AudioContext||window.webkitAudioContext)(); const now=actx.currentTime;
  [880,1320].forEach((f,i)=>{ const o=actx.createOscillator(),g=actx.createGain(); o.type='triangle'; o.frequency.value=f; o.connect(g); g.connect(actx.destination); const tt=now+i*0.08; g.gain.setValueAtTime(0.0001,tt); g.gain.exponentialRampToValueAtTime(0.16,tt+0.01); g.gain.exponentialRampToValueAtTime(0.0001,tt+0.16); o.start(tt); o.stop(tt+0.18); }); }catch(e){} }
function twinkleCheer(ms=900){ twCheerUntil=performance.now()+ms; chirp(); }
function twinkleSpin(ms=1600){ twSpinUntil=performance.now()+ms; }

// ---------------- UI helpers ----------------
function show(id){ $(id).classList.remove('hidden'); }
function hide(id){ $(id).classList.add('hidden'); }
function speak(name,text,btn,next,id){ $('bubble-name').textContent=name; $('bubble-text').textContent=text; $('bubble-next').textContent=btn||'Tap ▶'; show('bubble');
  if(audioOn) say(text,{char:name,id}); $('bubble-next').onclick=()=>{ hide('bubble'); if(next) next(); }; }
function setEnergy(p){ $('energy-fill').style.width=p+'%'; }
function setHint(t){ $('hint').textContent=t; $('hint').style.opacity=1; }
function heroName(){ return (state.avatar.name&&state.avatar.name.trim())?state.avatar.name.trim():'Revi Star'; }
let creationMode=false, focusAvatarUntil=0;
// The headline daily moment: the CHILD's avatar grows (Rumi/Twinkle are supporting cast).
function avatarTransform(accessoryFn,label,then){
  tfPortrait(null); $('tf-emoji').textContent='🌟'; $('tf-title').textContent=`${heroName()} grew today!`; $('tf-sub').textContent='✨ '+label+' ✨';
  heroPerforming=true; if(heroLoaded) playHero(heroActions.dance?'dance':'idle');
  // 1) anticipation: spotlight rises, world dims, camera pushes in, Twinkle gets excited
  const dimFrom=hemi.intensity; hemi.intensity=dimFrom*0.5; spotOn=1; cineUntil=performance.now()+3650; twinkleSpin(3300);
  setTimeout(()=>{ // 2) the reveal: flash + expanding rings + star fountain + accessory + hero glow + sound sting
    screenFlash(); chime('win'); haptic(30);
    if(accessoryFn) accessoryFn();
    magicRing(avatar.position,'#FFD24D'); setTimeout(()=>magicRing(avatar.position,'#FF8FCF'),150);
    magicBurst(avatar.position,46); show('transform');
    if(audioOn) say(`Wow ${heroName()}! YOUR Star Hunter grew today! You unlocked a ${label}!`,{id:'xtra_grew'});
    let g=0; const pulse=()=>{ g+=.04; const e=Math.max(0,Math.sin(g*Math.PI))*0.6;
      avBodyMat.emissive.set('#FFD24D'); avBodyMat.emissiveIntensity=e;
      heroMats.forEach(m=>{ if(m.emissive){ m.emissive.set('#FFD24D'); m.emissiveIntensity=e*0.8; } });
      if(g<1) requestAnimationFrame(pulse); else { avBodyMat.emissiveIntensity=.12; heroMats.forEach(m=>{ if(m.emissive) m.emissiveIntensity=.06; }); } };
    pulse();
  },650);
  // 3) restore + spotlight show-off + Twinkle cheers
  setTimeout(()=>{ hide('transform'); hemi.intensity=dimFrom; spotOn=0; focusAvatarUntil=performance.now()+2300; twinkleCheer(2000); if(audioOn) say(`Look at you, ${heroName()}!`,{id:'xtra_lookatyou'}); save(); },3650);
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
      {template:'trace',skillId:'phon.letter.form',letter:'S',pic:'☀️',prompt:'Trace the letter  S  — sss, like sun!',say:'sss. Trace the S with your finger!',coachLine:'Trace it with your finger! ✏️'},
      {template:'soundMatch',skillId:'phon.letter.sound',pic:'☀️',prompt:'Which letter says  sss…  like  sun?',say:'Which letter says sss, like sun?',options:[{t:'S',say:'sss'},{t:'M',say:'mmm'},{t:'T',say:'tuh'}],answer:'S'},
      {template:'firstSound',skillId:'phon.onset',pic:'🐝',prompt:'What sound does  “bee”  start with?',say:'What sound does bee start with? buh, buh, bee.',options:[{t:'B',say:'buh'},{t:'F',say:'fff'},{t:'N',say:'nnn'}],answer:'B'},
      {template:'soundMatch',skillId:'phon.letter.sound',pic:'🌙',prompt:'Which letter says  mmm…  like  moon?',say:'Which letter says mmm, like moon?',options:[{t:'M',say:'mmm'},{t:'S',say:'sss'},{t:'T',say:'tuh'}],answer:'M'},
      {template:'firstSound',skillId:'phon.onset',pic:'🔝',prompt:'What sound does  “top”  start with?',say:'What sound does top start with? tuh, tuh, top.',options:[{t:'T',say:'tuh'},{t:'M',say:'mmm'},{t:'B',say:'buh'}],answer:'T'},
    ],
    tease:["Tomorrow: help read the harbor signs — and find Twinkle a brand-new look!"], teaseId:"tease_d1" },
  2:{ skillLabel:'Sight words',
    greet:["Rumi","You came back — yay! The dock signs got all mixed up in the wind. Can you read them with me?","Let's read! ▶"],
    activities:[
      {template:'wordPicture',skillId:'read.sightword',pic:'🐱',prompt:'Which word says  “cat”?',say:'Which word says cat?',options:[{t:'cat',say:'cat'},{t:'dog',say:'dog'},{t:'sun',say:'sun'}],answer:'cat'},
      {template:'soundMatch',skillId:'phon.letter.sound',pic:'🐟',prompt:'Which letter says  fff…  like  fish?',say:'Which letter says fff, like fish?',options:[{t:'F',say:'fff'},{t:'L',say:'lll'},{t:'R',say:'rrr'}],answer:'F'},
      {template:'wordPicture',skillId:'read.sightword',pic:'🐶',prompt:'Which word says  “dog”?',say:'Which word says dog?',options:[{t:'dog',say:'dog'},{t:'cat',say:'cat'},{t:'bus',say:'bus'}],answer:'dog'},
    ],
    tease:["Tomorrow: blend sounds to read a WHOLE word — and Twinkle will EVOLVE!"], teaseId:"tease_d2" },
  3:{ skillLabel:'Blending words',
    greet:["Rumi","Three days in a row — you're a real Star Hunter! The lighthouse keeper left you a note. Let's read it together…","Open the note ▶"],
    story:["Keeper's note","“Dear friend… the harbor shines because of YOU. Read on!”"],
    activities:[
      {template:'blend',skillId:'phon.cvc.blend',pic:'🐱',word:'cat',say:'Tap the sounds in order. c… a… t… cat!',prompt:'Tap the sounds in order to read it!',sounds:[{t:'c',say:'cuh'},{t:'a',say:'aah'},{t:'t',say:'tuh'}]},
      {template:'blend',skillId:'phon.cvc.blend',pic:'☀️',word:'sun',say:'Tap the sounds in order. s… u… n… sun!',prompt:'Tap the sounds in order to read it!',sounds:[{t:'s',say:'sss'},{t:'u',say:'uh'},{t:'n',say:'nnn'}]},
      {template:'blend',skillId:'phon.cvc.blend',pic:'🐶',word:'dog',say:'Tap the sounds in order. d… o… g… dog!',prompt:'Tap the sounds in order to read it!',sounds:[{t:'d',say:'duh'},{t:'o',say:'awe'},{t:'g',say:'guh'}]},
    ],
    tease:["You played 3 days in a row! More adventures are coming soon…"], teaseId:"tease_d3" }
};
const MAX_DAY = 21; // the daily loop now runs three weeks
// ---- Procedural content for days 4..21: rotating skills, offset indexing so items vary day to day ----
const LETTERBANK=[['S','sss','sun','☀️'],['M','mmm','moon','🌙'],['T','tuh','top','🔝'],['F','fff','fish','🐟'],['B','buh','bee','🐝'],['N','nnn','net','🥅'],['P','puh','pig','🐷'],['D','duh','dog','🐶'],['L','lll','leaf','🍃'],['R','rrr','red','🔴'],['C','kuh','cat','🐱'],['H','huh','hat','🎩'],['G','guh','goat','🐐'],['K','kuh','kite','🪁'],['V','vvv','van','🚐'],['W','wuh','web','🕸️'],['Z','zzz','zip','🤐'],['J','juh','jam','🍓']];
const SIGHTBANK=[['cat','🐱','dog','sun'],['dog','🐶','cat','bus'],['sun','☀️','net','pig'],['red','🔴','mom','big'],['pig','🐷','bus','hat'],['bus','🚌','red','net'],['hat','🎩','dog','sun'],['mom','👩','big','net'],['big','🔵','pig','bus'],['net','🥅','cat','mom'],['box','📦','fox','dog'],['fox','🦊','box','sun'],['hen','🐔','dog','cat'],['top','🔝','net','sun'],['bug','🐛','box','pig'],['cup','☕','bus','mom'],['bed','🛏️','red','dog'],['van','🚐','fox','sun'],['jam','🍓','big','net'],['map','🗺️','mom','cat'],['fan','🪭','pig','box'],['rug','🧶','red','bus']];
const PH={a:'aah',e:'eh',i:'ih',o:'awe',u:'uh',b:'buh',c:'cuh',d:'duh',f:'fff',g:'guh',h:'huh',j:'juh',k:'kuh',l:'lll',m:'mmm',n:'nnn',p:'puh',r:'rrr',s:'sss',t:'tuh',v:'vvv',w:'wuh',x:'ks',y:'yuh',z:'zzz'};
const CVCWORDS=[['cat','🐱'],['sun','☀️'],['dog','🐶'],['pig','🐷'],['hen','🐔'],['bed','🛏️'],['top','🔝'],['bug','🐛'],['map','🗺️'],['fan','🪭'],['net','🥅'],['cup','☕'],['box','📦'],['log','🪵'],['mop','🧹'],['jam','🍓'],['ten','🔟'],['rug','🧶'],['van','🚐'],['web','🕸️'],['zip','🤐'],['rat','🐀'],['mat','🟫'],['sit','🪑'],['hop','🐰'],['fox','🦊'],['bat','🦇'],['pen','🖊️'],['cub','🐻'],['gum','🍬'],['hut','🛖'],['lip','👄'],['nut','🥜'],['wet','💧'],['kid','🧒'],['mud','🟤'],['jet','✈️'],['gem','💎'],['fin','🐠'],['pup','🐶'],['tag','🏷️'],['win','🏆'],['dig','⛏️'],['lid','🥫'],['pot','🍲'],['dot','🔴'],['fit','🏋️'],['rib','🍖'],['bin','🗑️']];
// Rhyming (word families): [target,emoji,rhyme-answer,distractor,distractor] — all option words exist in the banks above
const RHYMEBANK=[['cat','🐱','hat','dog','sun'],['bat','🦇','mat','dog','pig'],['dog','🐶','log','cat','bus'],['pig','🐷','big','cat','net'],['hen','🐔','pen','cat','sun'],['top','🔝','hop','dog','sun'],['bug','🐛','rug','cat','dog'],['box','📦','fox','cat','sun'],['fan','🪭','van','dog','pig'],['rat','🐀','bat','dog','sun'],['bed','🛏️','red','cat','sun'],['mat','🟫','cat','dog','pig'],['hop','🐰','top','dog','sun'],['hut','🛖','nut','cat','dog'],['pen','🖊️','ten','cat','sun'],['cup','☕','pup','dog','cat'],['sit','🪑','fit','dog','cat'],['net','🥅','jet','dog','sun'],['win','🏆','fin','dog','cat'],['pot','🍲','dot','cat','sun']];
// Ending sounds — words whose final letter is a sound we have (excludes x-endings like box/fox)
const LASTWORDS=CVCWORDS.filter(W=>'SMTFBNPDLRCHGKVWZJ'.includes(W[0].slice(-1).toUpperCase()));
// High-frequency sight words (recognition): [word, distractor, distractor] — all in-set
const SIGHTWORDS=[['the','and','to'],['and','the','it'],['is','in','it'],['to','go','so'],['in','it','is'],['it','in','at'],['you','we','my'],['my','me','we'],['see','we','me'],['we','me','he'],['go','so','up'],['up','at','on'],['at','on','in'],['on','at','up'],['can','me','he'],['he','we','me']];
const GENGREET=["You're back — let's keep our reading streak glowing!","Another day, another adventure in Harmony Harbor!","Twinkle missed you! Ready to read together?","The harbor shines brighter every day you read!","Let's find new sounds and words today!"];
const TRSET=['S','C','O','U','A','M','N','I','L','T'], TRBANK=LETTERBANK.filter(e=>TRSET.includes(e[0]));
// Spoken-text templates — used by genDay AND the gameplay clip-id map below, so they stay in sync.
const vSound=L=>`Which letter says ${L[1]}, like ${L[2]}?`;
const vTrace=L=>`${L[1]}. Trace the ${L[0]} with your finger!`;
const vWord=w=>`Which word says ${w}?`;
const vFirst=L=>`What sound does ${L[2]} start with? ${L[1]}, ${L[1]}, ${L[2]}.`;
const vBlend=w=>`Tap the sounds in order. ${w.split('').join('… ')}… ${w}!`;
const vRhyme=w=>`What rhymes with ${w}?`;
const vCase=L=>`Find the little letter that says ${L[1]}!`;
const vLast=W=>`What sound does ${W[0]} end with?`;
const vSight=w=>`Tap the word — ${w}.`;
// Batches "letters" + "words" + "blend" + "rhyme": map prompts/sounds/words to AI clip ids.
(function(){ const phId=p=>'ph_'+p.replace(/[^a-z]/gi,'');
  LETTERBANK.forEach(L=>{ VO_LINES[L[1]]=phId(L[1]); VO_LINES[vSound(L)]='q_snd_'+L[0].toLowerCase(); VO_LINES[vFirst(L)]='q_first_'+L[2]; });
  TRBANK.forEach(L=>{ VO_LINES[vTrace(L)]='q_trace_'+L[0].toLowerCase(); });
  SIGHTBANK.forEach(S=>{ VO_LINES[vWord(S[0])]='q_word_'+S[0]; });
  [...new Set(SIGHTBANK.flatMap(S=>[S[0],S[2],S[3]]))].forEach(w=>{ VO_LINES[w]='word_'+w; });
  CVCWORDS.forEach(W=>{ const w=W[0]; VO_LINES[vBlend(w)]='q_blend_'+w; VO_LINES[w]='word_'+w; w.split('').forEach(ch=>{ const p=PH[ch]||ch; VO_LINES[p]=phId(p); }); });
  RHYMEBANK.forEach(R=>{ VO_LINES[vRhyme(R[0])]='q_rhyme_'+R[0]; [R[2],R[3],R[4]].forEach(w=>{ if(!VO_LINES[w]) VO_LINES[w]='word_'+w; }); });
  LETTERBANK.forEach(L=>{ VO_LINES[vCase(L)]='q_case_'+L[0].toLowerCase(); });
  LASTWORDS.forEach(W=>{ VO_LINES[vLast(W)]='q_last_'+W[0]; });
  SIGHTWORDS.forEach(W=>{ VO_LINES[vSight(W[0])]='q_sight_'+W[0]; W.forEach(w=>{ if(!VO_LINES[w]) VO_LINES[w]='word_'+w; }); });
})();
// ---- Activity item builders + scalable day generator ----
const QUESTIONS_PER_DAY=21; // tune this to change session length
function pickN(bank,count,day,salt){ const out=[],seen=new Set(),L=bank.length; let k=0; while(out.length<count && seen.size<L && k<L*4){ const idx=((day*7+salt+k*5)%L+L)%L; if(!seen.has(idx)){ seen.add(idx); out.push(bank[idx]); } k++; } return out; }
function distractors2(ans,salt){ const d=[],L=LETTERBANK.length; let k=0; while(d.length<2 && k<60){ const c=LETTERBANK[((salt+k*7)%L+L)%L]; if(c[0]!==ans[0] && !d.some(o=>o[0]===c[0])) d.push(c); k++; } return d; }
function itTrace(TL){ return {template:'trace',skillId:'phon.letter.form',letter:TL[0],pic:TL[3],prompt:`Trace the letter  ${TL[0]}  — ${TL[1]}, like ${TL[2]}!`,say:vTrace(TL),coachLine:'Trace it with your finger! ✏️'}; }
function itSound(L,salt){ const d=distractors2(L,salt); return {template:'soundMatch',skillId:'phon.letter.sound',pic:L[3],prompt:`Which letter says  ${L[1]}…  like  ${L[2]}?`,say:vSound(L),options:[{t:L[0],say:L[1]},{t:d[0][0],say:d[0][1]},{t:d[1][0],say:d[1][1]}],answer:L[0]}; }
function itFirst(F,salt){ const d=distractors2(F,salt); return {template:'firstSound',skillId:'phon.onset',pic:F[3],prompt:`What sound does  “${F[2]}”  start with?`,say:vFirst(F),options:[{t:F[0],say:F[1]},{t:d[0][0],say:d[0][1]},{t:d[1][0],say:d[1][1]}],answer:F[0]}; }
function itWord(S){ return {template:'wordPicture',skillId:'read.sightword',pic:S[1],prompt:`Which word says  “${S[0]}”?`,say:vWord(S[0]),options:[{t:S[0],say:S[0]},{t:S[2],say:S[2]},{t:S[3],say:S[3]}],answer:S[0]}; }
function itBlend(W){ return {template:'blend',skillId:'phon.cvc.blend',pic:W[1],word:W[0],say:vBlend(W[0]),prompt:'Tap the sounds in order to read it!',sounds:W[0].split('').map(ch=>({t:ch,say:PH[ch]||ch}))}; }
function itRhyme(R){ return {template:'rhyme',skillId:'phon.rhyme',pic:R[1],prompt:`What rhymes with  “${R[0]}”?`,say:vRhyme(R[0]),options:[{t:R[2],say:R[2]},{t:R[3],say:R[3]},{t:R[4],say:R[4]}],answer:R[2]}; }
function itCase(L,salt){ const low=L[0].toLowerCase(), d=distractors2(L,salt); return {template:'caseMatch',skillId:'read.letter.case',pic:L[0],prompt:`Find the little  ${low}  for  ${L[0]}!`,say:vCase(L),options:[{t:low,say:L[1]},{t:d[0][0].toLowerCase(),say:d[0][1]},{t:d[1][0].toLowerCase(),say:d[1][1]}],answer:low}; }
function itLast(W,salt){ const last=W[0].slice(-1).toUpperCase(), ans=LETTERBANK.find(e=>e[0]===last)||[last,PH[W[0].slice(-1)]||last], d=distractors2(ans,salt);
  return {template:'lastSound',skillId:'phon.coda',pic:W[1],prompt:`What sound does  “${W[0]}”  end with?`,say:vLast(W),options:[{t:ans[0],say:ans[1]},{t:d[0][0],say:d[0][1]},{t:d[1][0],say:d[1][1]}],answer:ans[0]}; }
function itSight(W){ return {template:'sightRec',skillId:'read.sightword.hf',pic:'📖',prompt:`Tap the word —  ${W[0]}`,say:vSight(W[0]),options:[{t:W[0],say:W[0]},{t:W[1],say:W[1]},{t:W[2],say:W[2]}],answer:W[0]}; }
function allocCounts(weights,N){ const ks=Object.keys(weights), raw=ks.map(k=>weights[k]*N), counts=raw.map(x=>Math.floor(x));
  let rem=N-counts.reduce((a,b)=>a+b,0); const fr=raw.map((x,idx)=>[idx,x-Math.floor(x)]).sort((a,b)=>b[1]-a[1]);
  for(let j=0;j<rem;j++) counts[fr[j%fr.length][0]]++; const o={}; ks.forEach((k,idx)=>o[k]=counts[idx]); return o; }
function genActivities(day,N){ const i=day, t=Math.min(1,Math.max(0,(i-1)/16)), L=(a,b)=>a+(b-a)*t; // t: 0 (day1) → 1 (day17+) ramps difficulty
  const c=allocCounts({trace:L(.22,.06),sound:L(.20,.10),case:L(.14,.06),first:L(.12,.10),word:L(.12,.12),last:L(.06,.12),rhyme:L(.06,.14),sight:L(.04,.14),blend:L(.04,.16)},N);
  // Only serve questions whose prompt is already voiced (so the game is fully voiced with whatever clips exist).
  // As more clips get generated, more skill types appear automatically. ?allskills=1 disables the filter.
  const filterOn = Object.keys(VO_HAVE).length>=10 && QS.get('allskills')!=='1';
  const V = arr => filterOn ? arr.filter(a=>{ const id=clipIdFor(a.say); return id && VO_HAVE[id]; }) : arr;
  const traces=V(pickN(TRBANK,c.trace,i,11).map(itTrace));
  const sounds=V(pickN(LETTERBANK,c.sound,i,23).map((Lx,k)=>itSound(Lx,i*3+k*5+1)));
  const firsts=V(pickN(LETTERBANK,c.first,i,37).map((F,k)=>itFirst(F,i*5+k*7+3)));
  const lasts=V(pickN(LASTWORDS,c.last,i,53).map((W,k)=>itLast(W,i*6+k*5+4)));
  const words=V(pickN(SIGHTBANK,c.word,i,5).map(itWord));
  const rhymes=V(pickN(RHYMEBANK,c.rhyme,i,29).map(itRhyme));
  const cases=V(pickN(LETTERBANK,c.case,i,43).map((Lx,k)=>itCase(Lx,i*4+k*5+2)));
  const sights=V(pickN(SIGHTWORDS,c.sight,i,61).map(itSight));
  const blends=V(pickN(CVCWORDS,c.blend,i,17).map(itBlend));
  const groups=[traces,sounds,firsts,lasts,words,rhymes,cases,sights,blends], acts=[]; let safety=0; // round-robin interleave for variety
  while(acts.length<N && safety++<400){ let added=false; for(const g of groups){ if(g.length){ acts.push(g.shift()); added=true; if(acts.length>=N) break; } } if(!added) break; }
  while(acts.length<N){ acts.push(itSound(LETTERBANK[(i*7+acts.length*3)%LETTERBANK.length], i+acts.length)); } // backfill safety
  return acts; }
function genDay(day){ const i=day, gn=coachNameFor(day), GN=gn.charAt(0).toUpperCase()+gn.slice(1), labels=['Letter sounds','Reading words','Blending words'];
  return { skillLabel:labels[i%3], greet:[GN,GENGREET[i%GENGREET.length],"Let's read! ▶"], greetId:'greet_g'+(i%GENGREET.length), activities:genActivities(day,QUESTIONS_PER_DAY),
    tease:[ day>=MAX_DAY ? "Three whole weeks of reading — you're a true Star Hunter! 🌟" : "Come back tomorrow for more sounds, words, and sparkles!" ], teaseId: day>=MAX_DAY?'tease_wk3':'tease_more' }; }
function getDay(day){ if(DAYS[day]){ const d=DAYS[day]; if(d.activities.length>=QUESTIONS_PER_DAY) return d; // pad authored days with fresh practice
    const pad=genActivities(day,QUESTIONS_PER_DAY).filter(a=>!d.activities.some(x=>x.say===a.say));
    return {...d, activities:[...d.activities,...pad].slice(0,QUESTIONS_PER_DAY)}; }
  return genDay(day); }


// Star Check (pre/post) — choose-only, no hints, transfer words (not practiced)
const STARCHECK=[
  {skillId:'phon.letter.sound',pic:'🌙',prompt:'Which letter says  mmm?',say:'Which letter says mmm?',options:['M','T','S'],answer:'M'},
  {skillId:'phon.onset',pic:'🍃',prompt:'What does  “leaf”  start with?',say:'What sound does leaf start with?',options:['L','B','F'],answer:'L'},
  {skillId:'read.sightword',pic:'🐷',prompt:'Which word says  “pig”?',say:'Which word says pig?',options:['pig','bus','net'],answer:'pig'},
  {skillId:'read.sightword',pic:'🔴',prompt:'Which word says  “red”?',say:'Which word says red?',options:['red','sun','dog'],answer:'red'},
  {skillId:'phon.rhyme',pic:'🐱',prompt:'What rhymes with  “cat”?',say:'What rhymes with cat?',options:['hat','dog','sun'],answer:'hat'},
  {skillId:'phon.letter.sound',pic:'⛺',prompt:'Which letter says  tuh?',say:'Which letter says tuh?',options:['T','M','F'],answer:'T'},
];
// Batch "check": Star Check intro + questions (pig/red reuse existing word clips).
VO_LINES["Let's play Twinkle's Star Check! Just try your best — it's only for fun."]='chk_intro';
['chk_q1','chk_q2','chk_q3','chk_q4','chk_q5','chk_q6'].forEach((id,i)=>{ const q=STARCHECK[i]; if(q && !VO_LINES[q.say]) VO_LINES[q.say]=id; });

// =====================================================================
//  ACTIVITY RUNNER (no-fail, adaptive, instrumented)
// =====================================================================
const praises=["You did it!","Wonderful reading!","You're a reading star!","Amazing!","Yay! You read it!"];
let curList=[], curIdx=0, onListDone=null, dayMistakes=0;
let curPractice=false, lessonExited=false, pausedLesson=false;
function runActivities(list,done,practice){ curList=list; curIdx=0; onListDone=done; dayMistakes=0; curPractice=!!practice; lessonExited=false; pausedLesson=false;
  setMarker(null); wipe(()=>{ show('challenge'); showBack(exitLesson); renderActivity(); }); }
function exitLesson(){ stopAudio(); lessonExited=true; hideBack(); // pause, never punish — the day lesson resumes at the same question
  wipe(()=>{ hide('challenge'); controlEnabled=true; if(!curPractice){ pausedLesson=true; setHint('Tap the 📖 Library to keep reading!'); } }); }
function resumeLesson(){ lessonExited=false; pausedLesson=false; controlEnabled=false; setMarker(null); $('hint').style.opacity=0;
  wipe(()=>{ show('challenge'); showBack(exitLesson); renderActivity(); }); }
function renderLights(){ const el=$('ch-lights'); const n=curList.length; const done=Math.min(curIdx,n);
  // P1c: pre-numeric progress — a filling bar of star nubs (rows of 7, matching the celebration cadence)
  el.classList.remove('count'); el.classList.add('starbar'); el.innerHTML='';
  for(let i=0;i<n;i++){ const s=document.createElement('span'); s.className='nub'+(i<done?' lit':'')+(i===done-1?' just':''); el.appendChild(s); } }
// P1c: earned stars fly from the tapped answer up to the progress bar
function flyStars(fromEl,count=3){ const bar=$('ch-lights'); if(!bar) return;
  let f=fromEl&&fromEl.getBoundingClientRect(); if(!f||!f.width) f={left:innerWidth/2,top:innerHeight*0.55,width:0,height:0}; // trace completions have no button
  const t=bar.getBoundingClientRect();
  const tx=t.left+t.width/2, ty=t.top+t.height/2, fx=f.left+f.width/2, fy=f.top+f.height/2;
  for(let i=0;i<count;i++){ const s=document.createElement('div'); s.className='fly-star'; s.textContent='⭐';
    s.style.left=fx+'px'; s.style.top=fy+'px';
    document.body.appendChild(s);
    const dx=tx-fx+(i-1)*12, dy=ty-fy;
    s.animate([{transform:'translate(-50%,-50%) scale(.5)',opacity:0},{transform:'translate(-50%,-50%) scale(1.15)',opacity:1,offset:.25},
      {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.55)`,opacity:1}],
      {duration:620+i*90,easing:'cubic-bezier(.3,.7,.4,1)',fill:'forwards'});
    setTimeout(()=>{ s.remove(); if(i===count-1){ const b=$('ch-lights'); if(b){ b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); } } },640+i*90); } }
// P1c: mid-set celebrations every 7th correct — the run gets beats instead of a flatline
function midSetBeat(){ const done=curIdx; if(done>0 && done%7===0 && done<curList.length){ confetti(); SFX.combo();
  const msgs={7:"Seven stars! You're on fire!",14:"Halfway superstar!"}; const m=msgs[done]||"Wow, look at all those stars!";
  coach('cheer',m); if(audioOn) say(m,{char:coachChar}); return true; } return false; }
let mistakes=0, blendProgress=0, itemStart=0, itemHints=0, itemModeled=false;
// ---- On-screen learning coach: a friendly face + line that reacts while the child works ----
// Real art lives in assets/coach/ (<name>.png + optional <name>-cheer.png / <name>-think.png).
// Guides rotate each day. Days 1-3 stay Rumi (her onboarding story), then it cycles
// Mira → Zoey → Rumi → … daily. Override any day with ?coach=rumi|mira|zoey.
let coachCurMode='smile', coachChar='rumi'; const coachArt={}; const COACH_NAMES=['rumi','mira','zoey'];
function coachNameFor(day){ const o=QS.get('coach'); if(o&&COACH_NAMES.includes(o)) return o;
  if(day<=3) return 'rumi'; return COACH_NAMES[((day-3)%3+3)%3]; }
function coachDisplayName(){ return coachChar.charAt(0).toUpperCase()+coachChar.slice(1); }
function coachLoaded(){ const a=coachArt[coachChar]; return !!(a && (a.smile||a.cheer||a.think)); }
function loadCoachArt(name){ if(coachArt[name]) return; const set=coachArt[name]={}; ['smile','cheer','think'].forEach(m=>{ const im=new Image();
  im.onload=()=>{ set[m]=im; if(name===coachChar) showCoachImg(); }; im.onerror=()=>{}; im.src='assets/coach/'+(m==='smile'?name+'.png':name+'-'+m+'.png'); }); }
function showCoachImg(){ const el=$('coach-img'),cv=$('coach-face'); if(!el||!cv) return; const has=coachLoaded(); cv.classList.toggle('hidden',has); el.classList.toggle('hidden',!has); drawCoach(coachCurMode); }
function setCoachChar(name){ if(!COACH_NAMES.includes(name)) name='rumi'; coachChar=name; loadCoachArt(name); showCoachImg(); }
function drawCoach(mode){ coachCurMode=mode||'smile';
  if(coachLoaded()){ const a=coachArt[coachChar], pick=a[coachCurMode]||a.smile||a.cheer||a.think, el=$('coach-img'); if(el&&pick) el.src=pick.src; return; }
  const cv=$('coach-face'); if(!cv) return; const g=cv.getContext('2d'); g.clearRect(0,0,120,120);
  g.fillStyle='#7B4FC4'; g.beginPath(); g.arc(60,64,46,0,7); g.fill(); // hair back
  g.fillStyle='#ffe0c2'; g.beginPath(); g.ellipse(60,66,33,37,0,0,7); g.fill(); // face
  g.fillStyle='#7B4FC4'; g.beginPath(); g.moveTo(24,60); g.quadraticCurveTo(38,30,60,40); g.quadraticCurveTo(82,30,96,60); g.quadraticCurveTo(78,48,60,50); g.quadraticCurveTo(42,48,24,60); g.closePath(); g.fill(); // bangs
  g.fillStyle='#5ec8c0'; g.fillRect(40,46,6,14); // signature streak
  const ey=72;
  if(mode==='cheer'){ g.strokeStyle='#2a1f28'; g.lineWidth=4; g.lineCap='round'; g.beginPath(); g.moveTo(41,ey); g.quadraticCurveTo(49,ey-8,57,ey); g.moveTo(63,ey); g.quadraticCurveTo(71,ey-8,79,ey); g.stroke(); }
  else { g.fillStyle='#2a1f28'; g.beginPath(); g.ellipse(49,ey,5,7,0,0,7); g.ellipse(71,ey,5,7,0,0,7); g.fill(); g.fillStyle='#fff'; g.beginPath(); g.arc(47,ey-2,1.7,0,7); g.arc(69,ey-2,1.7,0,7); g.fill(); }
  if(mode==='think'){ g.strokeStyle='#5a3a8a'; g.lineWidth=3; g.lineCap='round'; g.beginPath(); g.moveTo(42,ey-12); g.lineTo(55,ey-9); g.moveTo(65,ey-9); g.lineTo(78,ey-12); g.stroke(); }
  g.fillStyle='rgba(255,140,170,0.5)'; g.beginPath(); g.arc(43,ey+12,6,0,7); g.arc(77,ey+12,6,0,7); g.fill(); // cheeks
  g.strokeStyle='#c23a5a'; g.lineWidth=3.5; g.lineCap='round'; g.beginPath();
  if(mode==='think'){ g.moveTo(54,ey+22); g.lineTo(66,ey+21); } else { g.moveTo(51,ey+18); g.quadraticCurveTo(60,ey+28,69,ey+18); } g.stroke(); }
function coach(mode,line){ const l=$('coach-line'); if(l&&line!=null) l.textContent=line; drawCoach(mode||'smile'); }
setCoachChar('rumi'); // week-1 default; startDay() switches the guide per week
function renderActivity(){ if(lessonExited) return; const a=curList[curIdx]; mistakes=0; itemHints=0; itemModeled=false; itemStart=performance.now();
  coach('smile', a.coachLine || a.prompt);
  $('ch-pic').textContent=a.pic; $('ch-prompt').textContent=a.prompt; $('ch-options').innerHTML=''; renderLights();
  reEnter($('ch-pic')); reEnter($('ch-prompt')); // PASS 6: animate the subject + question in on each item
  if(audioOn) say(a.say,{char:coachChar});
  $('ch-hear').onclick=()=>{ if(audioOn) say(a.say,{char:coachChar}); };
  $('ch-hint').onclick=()=>hintActivity(a);
  log('activity_start',{skillId:a.skillId,template:a.template});
  $('challenge').classList.toggle('tracing',a.template==='trace'); // give tracing the whole stage
  if(a.template==='blend') renderBlend(a); else if(a.template==='trace') renderTrace(a); else renderChoose(a);
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
// ---- Finger-tracing activity (multimodal: see + hear + trace + say) ----
function letterStrokes(ch){ const arc=(cx,cy,r,a0,a1,n=26)=>{ const p=[]; for(let i=0;i<=n;i++){ const a=a0+(a1-a0)*i/n; p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]); } return p; };
  switch(ch){
    case 'O': return [arc(0.5,0.5,0.36,-Math.PI/2,1.5*Math.PI)];
    case 'C': return [arc(0.52,0.5,0.37,0.32*Math.PI,1.68*Math.PI)];
    case 'U': return [[[0.24,0.12],[0.24,0.46]].concat(arc(0.5,0.46,0.26,Math.PI,2*Math.PI)).concat([[0.76,0.46],[0.76,0.12]])];
    case 'S': return [arc(0.52,0.31,0.19,1.9*Math.PI,0.55*Math.PI).concat(arc(0.48,0.66,0.19,1.5*Math.PI,3.05*Math.PI))];
    case 'I': return [[[0.5,0.12],[0.5,0.88]]];
    case 'L': return [[[0.33,0.12],[0.33,0.88],[0.72,0.88]]];
    case 'T': return [[[0.18,0.14],[0.82,0.14]],[[0.5,0.14],[0.5,0.88]]];
    case 'A': return [[[0.2,0.9],[0.5,0.12],[0.8,0.9]],[[0.33,0.56],[0.67,0.56]]];
    case 'M': return [[[0.15,0.9],[0.15,0.12],[0.5,0.6],[0.85,0.12],[0.85,0.9]]];
    case 'N': return [[[0.2,0.9],[0.2,0.12],[0.8,0.9],[0.8,0.12]]];
    default:  return [[[0.5,0.12],[0.5,0.88]]];
  } }
function densifyStrokes(strokes){ const out=[]; strokes.forEach(s=>{ for(let i=0;i<s.length-1;i++){ const [x0,y0]=s[i],[x1,y1]=s[i+1]; const d=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.round(d/0.02));
    for(let k=0;k<n;k++){ const t=k/n; out.push({x:x0+(x1-x0)*t,y:y0+(y1-y0)*t,hit:false}); } } const l=s[s.length-1]; out.push({x:l[0],y:l[1],hit:false}); }); return out; }
let traceState=null;
function renderTrace(a){ const host=$('ch-options'); host.innerHTML='';
  const cv=document.createElement('canvas'); cv.width=300; cv.height=340; cv.className='trace-cv'; host.appendChild(cv);
  const W=300,H=340, strokes=letterStrokes(a.letter), pts=densifyStrokes(strokes), g=cv.getContext('2d'); let done=false;
  const draw=()=>{ g.clearRect(0,0,W,H);
    g.lineWidth=28; g.lineCap='round'; g.lineJoin='round'; g.strokeStyle='rgba(123,79,196,0.16)'; // faint guide letter
    strokes.forEach(s=>{ g.beginPath(); s.forEach((p,i)=>{ const x=p[0]*W,y=p[1]*H; i?g.lineTo(x,y):g.moveTo(x,y); }); g.stroke(); });
    g.fillStyle='#FFC83D'; pts.forEach(p=>{ if(p.hit){ g.beginPath(); g.arc(p.x*W,p.y*H,11,0,7); g.fill(); } }); // golden trail where traced
    if(!done){ const s=pts[0]; g.fillStyle='#22c55e'; g.beginPath(); g.arc(s.x*W,s.y*H,10,0,7); g.fill(); g.fillStyle='#fff'; g.font='bold 14px sans-serif'; g.textAlign='center'; g.fillText('▶',s.x*W,s.y*H+5); } };
  const at=e=>{ const r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}; };
  const move=e=>{ if(done) return; const q=at(e); let any=false; pts.forEach(p=>{ if(!p.hit && Math.hypot(p.x-q.x,p.y-q.y)<0.075){ p.hit=true; any=true; } });
    if(any){ draw(); if(pts.filter(p=>p.hit).length/pts.length>=0.82){ done=true; complete(); } } };
  const complete=()=>{ chime('good'); coach('cheer',(a.letter+'! You traced it!')); if(audioOn) say(a.letter+'! '+(a.say||''),{rate:.8,char:coachChar}); setTimeout(()=>correct(a,document.createElement('button')),350); };
  cv.addEventListener('pointerdown',e=>{ cv.setPointerCapture&&cv.setPointerCapture(e.pointerId); move(e); });
  cv.addEventListener('pointermove',e=>{ if(e.buttons||e.pressure>0) move(e); });
  traceState={pts,draw,move,complete,get done(){return done;}}; draw();
}
function hintActivity(a){ itemHints++; log('hint_used',{skillId:a.skillId}); coach('think',"Here's a little help — watch!");
  if(a.template==='trace'){ if(traceState){ let n=0; const cap=Math.ceil(traceState.pts.length*0.5); const reveal=()=>{ if(n<cap){ traceState.pts[n].hit=true; n++; traceState.draw(); setTimeout(reveal,40);} }; reveal(); } if(audioOn) say("Trace along the glowing line, like this!",{char:coachChar}); return; }
  if(a.template==='blend'){ flashBlend(); if(audioOn) say("Tap this one next!",{char:coachChar}); return; }
  const btns=[...$('ch-options').querySelectorAll('.opt')];
  const w=btns.find(b=>b.textContent!==a.answer&&!b.classList.contains('dim')); if(w) w.classList.add('dim');
  const r=btns.find(b=>b.textContent===a.answer); if(r){ r.classList.add('glowhint'); setTimeout(()=>r.classList.remove('glowhint'),1600);} if(audioOn) say(a.say,{char:coachChar}); }
function wrong(a,btn){ mistakes++; starStreak=0; dayMistakes++; itemHints++; btn.classList.add('dim'); btn.classList.remove('wrongshake'); void btn.offsetWidth; btn.classList.add('wrongshake'); coach('think',"Almost! Let's try again."); if(audioOn) say("Almost! Listen again.",{char:coachChar});
  if(mistakes>=2){ itemModeled=true; const r=[...$('ch-options').querySelectorAll('.opt')].find(b=>b.textContent===a.answer);
    if(r){ r.classList.add('glowhint'); if(audioOn) say(`This one says ${a.answer}. Tap it with me!`,{id:'xtra_thisone'}); r.onclick=()=>{ if(audioOn) say(a.answer,{rate:.8,char:coachChar}); correct(a,r);}; } } }
function correct(a,btn){ btn.classList.remove('glowhint'); btn.classList.add('correct'); chime('good'); burst(lighthouse.position,'#FFE9A8',10); twCheerUntil=performance.now()+900; heroEmote('cheer',900); // Twinkle + hero cheer learning success
  sparkleAt(btn,12); coachHop(); starStreak++; earnStars(1); flyStars(btn,3); // stars visibly fly to the progress bar — wealth you can see
  if(delight.reward===null){ delight.reward=Math.round(performance.now()-launchT); log('first_reward',{ms:delight.reward}); }
  const firstTry=(mistakes===0&&itemHints===0);
  state.history.push({day:state.day,skillId:a.skillId,correct:true,hints:itemHints,modeled:itemModeled,firstTry,ms:Math.round(performance.now()-itemStart)});
  log('activity_item',{skillId:a.skillId,correct:true,hints:itemHints,modeled:itemModeled,firstTry});
  save();
  [...$('ch-options').querySelectorAll('.opt')].forEach(b=>b.onclick=null);
  const p=praises[(Math.random()*praises.length)|0]; coach('cheer',p);
  let advanced=false;
  const adv=()=>{ if(advanced||lessonExited) return; advanced=true; curIdx++; renderLights(); // advance once praise ends OR the cap fires
    if(curIdx<curList.length){ setTimeout(renderActivity, midSetBeat()?1700:280); } // a breath between items
    else { hideBack(); wipe(()=>{ hide('challenge'); onListDone(); }); } };
  if(audioOn) say(p,{char:coachChar,then:adv}); else setTimeout(adv,450);
  setTimeout(adv,1700); // safety cap — never let a stuck audio clip freeze the game
}

// =====================================================================
//  STAR CHECK (pre/post)
// =====================================================================
let scIdx=0, scScore=0, scDone=null, scTag='pre';
function runStarCheck(tag,done){ scTag=tag; scIdx=0; scScore=0; scDone=done; wipe(()=>show('starcheck'));
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
function finishSC(){ wipe(()=>hide('starcheck')); state[scTag]=scScore; log('starcheck_done',{phase:scTag,score:scScore,outOf:STARCHECK.length}); save();
  if(audioOn) say(`You got ${scScore} stars! Great trying!`,{id:'xtra_startry'}); if(scDone) setTimeout(scDone,800); }

// =====================================================================
//  DAY FLOW
// =====================================================================
function startDay(day){ state.day=day; save(); $('day-num').textContent=day; $('star-num').textContent=state.avatar.stars; setEnergy(0);
  log('day_start',{day});
  setCoachChar(coachNameFor(day)); // weekly guide rotation (Rumi → Mira → Zoey)
  show('hud');
  const D=getDay(day);
  // reset scene positions for re-walk
  if(day>1){ gloomling.visible=true; gloomling.scale.setScalar(1); twinkle.visible=(state.twinkleForm>0); twinkleFollows=(state.twinkleForm>0);
    if(state.twinkleForm>0){ gloomling.visible=false; } }
  speak(D.greet[0],D.greet[1],D.greet[2],()=>{
    if(day===3 && D.story){ speak(D.story[0],D.story[1],"Wow! ▶",()=>beginExplore(day),'keeper_note'); }
    else beginExplore(day);
  },D.greetId);
}
let reached=false;
function beginExplore(day){ controlEnabled=true; reached=false; setMarker(gloomling.position);
  setHint(state.twinkleForm>0?'Tap or hold & drag to explore! 👣':'Tap the ground to walk to the Gloomling! 👣');
  if(audioOn) say(state.twinkleForm>0?"Let's find today's adventure!":"Follow the sparkles!",{id:state.twinkleForm>0?'explore_new':'explore_first'}); }
function reachSpot(){ if(reached)return; reached=true; controlEnabled=false; setMarker(null); $('hint').style.opacity=0;
  const D=getDay(state.day);
  if(state.day===1){ speak('Gloomling',"…I lost the words. Will you read them with me?","Yes! Let's read ✨",()=>runActivities(D.activities,dayProgress)); }
  else { speak(coachDisplayName(),"Here we go — read these with me!","Let's read ✨",()=>runActivities(D.activities,dayProgress)); }
}

// progression beat per day (avatar always grows; plus day-specific marquee)
function dayProgress(){
  state.avatar.stars = Math.max(state.avatar.stars, state.day); $('star-num').textContent=state.avatar.stars;
  setEnergy(100); startBloom(); chime('win');
  if(state.day===1){
    relightLighthouse();
    setTimeout(()=>{ gloomling.visible=false; twinkle.visible=true; twinkle.position.copy(gloomling.position); state.twinkleForm=1; burst(twinkle.position,'#7EF0C0',30);
      speak('Rumi',`Amazing reading, ${heroName()}! The Lighthouse is shining and the Gloomling became a happy Star Pal. Tap your new friend!`,"Tap Twinkle! 🦊",enableTwinkleTap,'xtra_day1'); },1500);
  } else if(state.day===2){
    twTailStar.material.emissiveIntensity=1.4;
    avatarTransform(addHat,'Stylish New Hat',()=>{ speak('Rumi',`Wonderful, ${heroName()}! Look — Twinkle is glowing… almost ready to evolve tomorrow!`,'▶',rewardDay,'xtra_day2'); });
  } else if(state.day===3){
    twinkleEvolve(()=> avatarTransform(addCape,'Hero Cape',()=> runStarCheck('post',()=>rewardDay()) ));
  } else { // days 4..21: keep the streak rewarding; a weekly milestone gives an extra sparkle
    twTailStar.material.emissiveIntensity=1.6; relightLighthouse();
    if(state.day%7===0){ avatarTransform(addStar,'Weekly Star',()=>rewardDay()); } else { setTimeout(()=>rewardDay(),900); }
  }
}
function enableTwinkleTap(){ controlEnabled=false; setHint('Tap Twinkle to befriend! 🦊✨');
  const tap=e=>{ ndc.x=(e.clientX/innerWidth)*2-1; ndc.y=-(e.clientY/innerHeight)*2+1; ray.setFromCamera(ndc,camera);
    if(ray.intersectObject(twinkle,true).length){ renderer.domElement.removeEventListener('pointerdown',tap); burst(twinkle.position,'#FF8FCF',30); chime('good'); $('hint').style.opacity=0; twinkleFollows=true;
      // Rumi gets a quick Rising-Star moment, then the HEADLINE: the child's own avatar grows.
      speak('Twinkle',"*happy twinkle!* 🦊💛","Aww! ▶",()=>rumiTransform(2,'RISING STAR','🌟',()=>avatarTransform(addStar,'Star Hunter Trainee',rewardDay))); } };
  renderer.domElement.addEventListener('pointerdown',tap);
}
function tfPortrait(src){ const im=$('tf-img'),em=$('tf-emoji'); if(!im||!em) return; // storybook circular portrait when we have art, emoji otherwise
  if(src){ im.src=src; im.classList.remove('hidden'); em.classList.add('hidden'); } else { im.classList.add('hidden'); em.classList.remove('hidden'); } }
function rumiTransform(stage,label,emoji,then){ state.rumiStage=Math.max(state.rumiStage,stage); log('rumi_evolve',{stage});
  tfPortrait(`assets/coach/${coachChar}-cheer.png`); // whichever guide is transforming this week (was hardcoded to Rumi)
  $('tf-emoji').textContent=emoji; $('tf-title').textContent=coachDisplayName().toUpperCase()+' is transforming!'; $('tf-sub').textContent='✨ '+label+' ✨';
  setTimeout(()=>{ show('transform'); if(audioOn) say("You filled the harbor with harmony! Watch — Rumi is becoming a Rising Star!");
    rumiJacket.emissive.set('#FFC83D'); rumiJacket.emissiveIntensity=.6;
    if(!rumiCape){ rumiCape=new THREE.Mesh(new THREE.ConeGeometry(.7,1.2,12,1,true),new THREE.MeshStandardMaterial({color:'#7B4FC4',emissive:'#5a3aa0',emissiveIntensity:.4,side:THREE.DoubleSide})); rumiCape.position.set(0,1,-.3); rumi.add(rumiCape);
      rumiCrown=new THREE.Mesh(new THREE.OctahedronGeometry(.2),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:1})); rumiCrown.position.set(0,2.5,0); rumi.add(rumiCrown);} burst(rumi.position,'#FFE9A8',40); },400);
  setTimeout(()=>{ hide('transform'); save(); then(); },3400);
}
function twinkleEvolve(then){ log('twinkle_evolve',{form:2}); state.twinkleForm=2;
  tfPortrait(null); $('tf-emoji').textContent='🦊'; $('tf-title').textContent='TWINKLE is evolving!'; $('tf-sub').textContent='✨ GLIMMERFOX ✨';
  show('transform'); if(audioOn) say("Twinkle is evolving into Glimmerfox!");
  let s=0; const grow=()=>{ s+=.05; twinkle.scale.setScalar(TW_SCALE*(1+Math.sin(s*Math.PI)*0.25)); if(s<1) requestAnimationFrame(grow); else twinkle.scale.setScalar(TW_SCALE*1.12); };
  grow();
  if(!twCape){ twCape=new THREE.Mesh(new THREE.ConeGeometry(.4,.7,10,1,true),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.5,side:THREE.DoubleSide})); twCape.position.set(0,.6,-.35); twinkle.add(twCape);}
  twTailStar.material.emissiveIntensity=1.6; burst(twinkle.position,'#FFD24D',40);
  setTimeout(()=>{ hide('transform'); save(); then(); },3000);
}

function rewardDay(){ igniteFireflies(); // reward cards per day
  const nm=heroName();
  const week=Math.ceil(state.day/7);
  const cards = state.day===1 ? [['🌟','My Star Hunter','You leveled up!'],['🦊','Twinkle','A new friend!'],['⭐','Reading Star','You read 2 words!']]
    : state.day===2 ? [['🎩','New Hat',nm+"'s style!"],['🌟','Day 2 Star','Your hero grew!'],['✨','Twinkle','Almost evolving!']]
    : state.day===3 ? [['🦸','Hero Cape',nm+' shines!'],['🌟','Star Hunter!','3 days strong!'],['🦊','Glimmerfox','Twinkle evolved!']]
    : state.day%7===0 ? [['🏅',`Week ${week} done!`,`${state.day} days strong!`],['⭐','Weekly Star',nm+' is glowing!'],['📚','Super Reader','Keep it up!']]
    : [['🌟',`Day ${state.day} Star`,nm+' grew!'],['📖','Reading streak',`${state.completedDays.length+1} days!`],['✨','Twinkle','Cheering you on!']];
  $('reward-h').textContent= state.day>=MAX_DAY ? `${nm}, three whole weeks! 🏆` : state.day%7===0 ? `Week ${week} complete, ${nm}! 🎉` : state.day===3 ? `${nm}, you did it — 3 days! 🎉` : `Great job, ${nm}! 🎉`;
  $('reward-cards').innerHTML=''; cards.forEach(c=>{ const d=document.createElement('div'); d.className='rcard'; d.innerHTML=`<div class="rc-ico">${c[0]}</div><b>${c[1]}</b><small>${c[2]}</small>`; $('reward-cards').appendChild(d); });
  show('reward'); confetti(); chime('win'); if(audioOn) say("Great job today, Star Hunter!");
  $('reward-next').onclick=()=>{ hide('reward'); completeDay(); };
}

function completeDay(){ if(!state.completedDays.includes(state.day)) state.completedDays.push(state.day);
  state.lastCompletedDate=todayStr(); save(); log('day_complete',{day:state.day, stars:state.avatar.stars, rumiStage:state.rumiStage, twinkleForm:state.twinkleForm});
  buildDashboard();
  const D=getDay(state.day);
  $('dg-emoji').textContent = state.day>=MAX_DAY?'🏆':(state.day%7===0?'🏅':'🌙');
  $('dg-title').textContent = state.day>=MAX_DAY?'You played 21 days!':(state.day%7===0?`Week ${Math.ceil(state.day/7)} done!`:'See you tomorrow!');
  $('dg-text').textContent = D.tease[0];
  SFX.horn(); show('daygate'); if(audioOn) say(D.tease[0],{id:D.teaseId});
  if(state.day===3){ /* offer parent re-engagement next time they open parent panel */ state.askReengage=true; save(); }
  $('dg-close').onclick=()=>{ hide('daygate'); };
}

// =====================================================================
//  PARENT GATE + DASHBOARD + REENGAGE + TOOLS
// =====================================================================
const GATE=['4','2','7']; let gateInput=[];
function padBlip(){ try{ actx=actx||new(window.AudioContext||window.webkitAudioContext)(); const o=actx.createOscillator(),g=actx.createGain(); o.type='sine'; o.frequency.value=660; o.connect(g); g.connect(actx.destination); const t=actx.currentTime; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.12,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+0.12); o.start(t); o.stop(t+0.13); }catch(e){} }
function openGate(){ gateInput=[]; $('pg-seq').textContent=GATE.join(' · '); const pad=$('pg-pad'); pad.innerHTML='';
  ['1','2','3','4','5','6','7','8','9'].forEach(n=>{ const b=document.createElement('button'); b.textContent=n; b.onclick=()=>{
      b.animate?.([{transform:'scale(0.84)'},{transform:'scale(1)'}],{duration:170,easing:'ease-out'}); haptic(10); padBlip(); // press feedback: pop + buzz + blip
      gateInput.push(n);
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
  const dots=$('pc-dots'); dots.innerHTML=''; const wk=Math.ceil(state.day/7), base=(wk-1)*7; // dots show THIS week (of 3)
  if(wk>1){ const lbl=document.createElement('small'); lbl.textContent='Wk'+wk+' '; lbl.style.opacity=.7; dots.appendChild(lbl); }
  for(let i=1;i<=7;i++){ const dnum=base+i; const s=document.createElement('span'); if(state.completedDays.includes(dnum)) s.className='on'; dots.appendChild(s);}
  // today takeaway
  const todayItems=state.history.filter(x=>x.day===state.day);
  const got=todayItems.filter(x=>x.correct).length, tried=todayItems.length, usedHints=todayItems.reduce((s,x)=>s+x.hints,0);
  const skillName = (getDay(state.day).skillLabel||'reading').toLowerCase();
  $('pc-today').innerHTML = `<li>Practiced <b>${skillName}</b></li><li>Tried ${tried}, got ${got}, used ${usedHints} hint${usedHints===1?'':'s'}</li>`+(state.day===3?'<li>Read a whole word independently 🎉</li>':'');
  $('pc-pre').textContent = state.pre==null?'–':state.pre; $('pc-post').textContent = state.post==null?'–':state.post;
}
function openParent(){ buildDashboard(); populateVoicePicker(); show('parent');
  $('reengage').classList.toggle('hidden', !state.askReengage);
  log('dashboard_view');
  [...document.querySelectorAll('#reengage .re-btns button')].forEach(b=>b.onclick=()=>{ log('parent_reengage',{value:b.dataset.v}); state.askReengage=false; save(); $('reengage').classList.add('hidden'); });
}
$('pc-close').onclick=()=>hide('parent');
$('pc-voice-test').onclick=()=>{ const sel=$('pc-voice'); say('',{id:(sel&&sel.value)||'praise_reading_star__rumi'}); }; // play the selected character voice
$('pc-export').onclick=()=>{ const blob=new Blob([JSON.stringify({state,events},null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='little-legends-a1-data.json'; a.click(); };
$('pc-sim').onclick=()=>{ state.lastCompletedDate=null; save(); hide('parent'); location.reload(); };
$('pc-reset').onclick=()=>{ if(confirm('Reset all test data?')){ localStorage.removeItem(KEY); localStorage.removeItem(EKEY); location.reload(); } };

// =====================================================================
//  BOOT
// =====================================================================
function decideDay(){ const forced=QS.get('day'); if(forced){ return Math.max(1,Math.min(MAX_DAY,parseInt(forced))); }
  const maxC = state.completedDays.length? Math.max(...state.completedDays):0;
  const next = Math.min(MAX_DAY, maxC+1);
  if(state.lastCompletedDate===todayStr() && maxC>=1 && maxC<MAX_DAY){ return -1; } // already played today -> gate
  if(maxC>=MAX_DAY && state.lastCompletedDate===todayStr()) return -2; // finished all, today
  return next;
}
function boot(){
  loadVOManifest(); maybeLoadHero(); maybeLoadRumi();
  setTimeout(loadAmbientIdols,2500); // ambient idols load after the essentials so startup stays fast
  applyShopOwned(); const scb=$('shop-close'); if(scb) scb.onclick=closeShop; const bb=$('back-btn'); if(bb) bb.onclick=()=>{ if(backAct){ SFX.whoosh; const f=backAct; f(); } }; // back button routes to the current screen's exit
  updateMusicBtn(); const mb=$('music-btn'); if(mb) mb.onclick=toggleMusic;
  const hb=$('hear-btn'); if(hb) hb.onclick=()=>{ if(lastSay) say(lastSay.t,{id:lastSay.id,char:lastSay.char}); }; // 🔊 = hear it again
  if(QS.get('observe')==='1'){ show('observer'); $('mark-smile').onclick=()=>recordExcitement('smile'); $('mark-excited').onclick=()=>recordExcitement('excited'); }
  if(QS.get('reset')==='1'){ localStorage.removeItem(KEY); localStorage.removeItem(EKEY); location.search=''; }
  $('start-btn').onclick=()=>{ audioOn=true; try{ actx=new(window.AudioContext||window.webkitAudioContext)(); }catch(e){} if(!ambTimer) ambLoop();
    initMusic();
    launchT=performance.now(); state.launchCount=(state.launchCount||0)+1; save(); log('app_open',{launchCount:state.launchCount});
    hide('intro');
    if(!state.tutorialDone) showTutorial();
    else routeDay();
  };
}
// Brief gameplay tutorial, voiced by Rumi (replaces the old avatar-creation page).
function showTutorial(){ controlEnabled=false; creationMode=false; rebuildHair(state.avatar.style||'short'); applyAvatar();
  const steps=[
    "Hi! I'm Rumi! Welcome to Reventure! Let me show you how to play.",
    "Tap the ground, or hold and drag, to walk around our magical harbor.",
    "Find a friend, then read and play games with me to fill the world with light!",
    "Every sound you learn makes you shine brighter. Ready? Let's go!"
  ];
  let i=0;
  const step=()=>{ if(i>=steps.length){ state.tutorialDone=true; save(); log('tutorial_done'); runStarCheck('pre',()=>routeDay()); return; }
    const last=(i===steps.length-1); speak('Rumi',steps[i++],last?"Let's go! ✨":"Next ▶",step); };
  step();
}
function routeDay(){ // restore prior cosmetics/rumi/twinkle visual state
  rebuildHair(state.avatar.style||'short'); applyAvatar();
  if(state.avatar.cosmetics.includes('star')) addStar();
  if(state.avatar.cosmetics.includes('hat')) addHat();
  if(state.avatar.cosmetics.includes('cape')) addCape();
  if(state.rumiStage>=2){ rumiJacket.emissive.set('#FFC83D'); rumiJacket.emissiveIntensity=.6; }
  const d=decideDay();
  if(d===-1){ $('dg-emoji').textContent='🌙'; $('dg-title').textContent='See you tomorrow!'; $('dg-text').textContent='You already played today — come back tomorrow for the next adventure! (Grown-ups can tap 👪 to continue testing.)'; show('hud'); show('daygate'); $('dg-close').onclick=()=>hide('daygate'); igniteFireflies(); if(audioOn) say("See you tomorrow!"); return; }
  if(d===-2){ $('dg-emoji').textContent='🏆'; $('dg-title').textContent='You finished all 21 days!'; $('dg-text').textContent='Three weeks of reading — amazing! More is coming soon. 💛'; show('hud'); show('daygate'); $('dg-close').onclick=()=>hide('daygate'); return; }
  startDay(d);
}

// ---------------- Main loop ----------------
let lastT=performance.now();
// P4: Harmony Hours — the harbor greets you differently by time of day (applied after the bloom story beat)
const HOUR=(new Date()).getHours();
const HOUR_TINT=(HOUR>=5&&HOUR<11)?{sun:'#ffe9c9',sunI:1.05,rim:'#8fb7ff',rimI:0.55,fog:'#dff2ff',lamp:0.55,win:0.35}
  :(HOUR>=17||HOUR<5)?{sun:'#ffc98f',sunI:0.9,rim:'#c77dff',rimI:0.9,fog:'#c3aede',lamp:1.15,win:0.9}
  :{sun:'#fff0d0',sunI:1.0,rim:'#b06aff',rimI:0.7,fog:'#cdefff',lamp:0.85,win:0.55};
let LAMP_BASE=0.85;
// P4: shooting-star wishes — a streak crosses the sky; catch the landing sparkle for +1 star
let wishNext=performance.now()+50000, wish=null, wishStreak=null;
// P6: fireflies orbit the lighthouse once today's lesson is done — the world remembers
const fireflies=[]; let firefliesOn=false;
function igniteFireflies(){ if(firefliesOn) return; firefliesOn=true;
  for(let i=0;i<12;i++){ const s2=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW_TEX,color:'#d8ffb0',transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,depthWrite:false}));
    s2.scale.set(0.28,0.28,1); scene.add(s2); fireflies.push({s:s2,ph:i*0.52,r:2.6+Math.random()*1.4,h:1+Math.random()*2.4,sp:0.3+Math.random()*0.4}); } }
// P6: Twinkle notices when a child stalls and flies toward what's next
let lastInputT=performance.now(), twGuideUntil=0, twGuideCool=0; const twGuideTarget=new THREE.Vector3();
function launchWish(){ const a=Math.random()*Math.PI*2, r=2.5+Math.random()*4.5;
  const s2=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW_TEX,color:'#fff6d0',transparent:true,opacity:0.95,blending:THREE.AdditiveBlending,depthWrite:false}));
  s2.scale.set(1.6,1.6,1); scene.add(s2); SFX.glass();
  wishStreak={s:s2,f:new THREE.Vector3(-24+Math.random()*10,16,-14),t:new THREE.Vector3(Math.cos(a)*r,0.5,Math.sin(a)*r),p:0}; }
function landWish(pos){ wish=new THREE.Mesh(new THREE.OctahedronGeometry(0.3),new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:1}));
  wish.position.copy(pos); wish.position.y=0.9; addGlow(wish,{color:'#FFE9A8',size:2.2,opacity:0.85}); scene.add(wish);
  wish.userData.until=performance.now()+7000; burst(pos.clone(),'#FFE9A8',10); }
const FPS_ON=QS.get('fps')==='1'; let fpsEl=null,fpsN=0,fpsT=performance.now(); // ?fps=1 → live fps/draw-call overlay for device profiling
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
  if(moving){ stepDist+=Math.hypot(avatar.position.x-lastStepX,avatar.position.z-lastStepZ); // bloom flowers on land / ripple on water in the hero's wake
    if(stepDist>0.85){ stepDist=0; const fx=avatar.position.x+(Math.random()-0.5)*0.4, fz=avatar.position.z+(Math.random()-0.5)*0.4; if(Math.hypot(fx,fz)<8.6) spawnStepFlower(fx,fz); else spawnRipple(fx,fz); } }
  lastStepX=avatar.position.x; lastStepZ=avatar.position.z;
  if(heroMixer) heroMixer.update(dt);
  if(heroLoaded){ // keep the primitive blob fully hidden (hair can get rebuilt after the model loads)
    if(avBody.visible) avBody.visible=false; if(avHead.visible) avHead.visible=false; if(avStar.visible) avStar.visible=false; if(avHair&&avHair.visible) avHair.visible=false; }
  if(INSPECT) setHint(`load:${heroLoaded?1:0} mix:${heroMixer?1:0} act:[${Object.keys(heroActions).join(',')}] cur:${heroCurrent} t:${heroMixer?heroMixer.time.toFixed(1):'-'}`);
  if(rumiMixer) rumiMixer.update(dt); // Rumi NPC model animation
  if(heroLoaded && !heroPerforming && performance.now()>=emoteUntil) playHero(moving && heroActions.walk ? 'walk' : 'idle');
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
    if(np<twGuideUntil){ twinkle.position.lerp(twGuideTarget,1-Math.exp(-dt*2.2)); } // idle helper: fly toward what's next
    else if(twinkleFollows){ const yaw=avatar.rotation.y; // float to the avatar's side + slightly behind, OFF the camera axis so it never blocks the characters
      const off=new THREE.Vector3(Math.cos(yaw)*1.7-Math.sin(yaw)*0.5,0,-Math.sin(yaw)*1.7-Math.cos(yaw)*0.5); const goal=avatar.position.clone().add(off);
      twinkle.position.lerp(new THREE.Vector3(goal.x,twinkle.position.y,goal.z),1-Math.exp(-dt*4)); twinkle.position.y=1.6+baseY; }
    else twinkle.position.y=baseY;
    if(spinning) twinkle.rotation.y+=dt*10; // happy spin
    else { const yaw=Math.atan2(avatar.position.x-twinkle.position.x,avatar.position.z-twinkle.position.z); twinkle.rotation.y+=(yaw-twinkle.rotation.y)*Math.min(1,dt*3); } // curious look toward you
    const blink=(t%3.4<0.1)?0.15:1, e1=twinkle.children[6], e2=twinkle.children[7]; if(e1) e1.scale.y=blink; if(e2) e2.scale.y=blink;
    if(twTailStar) twTailStar.material.emissiveIntensity=(cheering?1.6:.8)+Math.sin(t*6)*.3; }
  rumi.position.y=Math.sin(t*1.6)*.04; if(rumiBraid){ rumiBraid.rotation.x=Math.sin(t*1.4)*0.06; rumiBraid.rotation.z=0.35+Math.sin(t*1.1)*0.04; } // braid secondary motion
  if(rumiMixer){ const np=performance.now(); // the guide stays lively: waves when you're near, breaks into a little dance now and then
    if(np>rumiNextWave && np>=rumiWaveUntil && rumiCurrent==='idle'){
      const near=Math.hypot(rumi.position.x-avatar.position.x,rumi.position.z-avatar.position.z)<5;
      if(rumiActions.dance && Math.random()<(near?0.35:0.55)){ playRumi('dance'); rumiWaveUntil=np+4200; } // a dance break
      else if(rumiActions.wave){ playRumi('wave'); rumiWaveUntil=np+1500; }                               // a friendly wave
      rumiNextWave=np+(near?5000:9000)+Math.random()*5000; }
    if(np>=rumiWaveUntil && rumiCurrent!=='idle') playRumi('idle'); }
  if(reached===false && controlEnabled && Math.hypot(gloomling.position.x-avatar.position.x,gloomling.position.z-avatar.position.z)<2.0){ reachSpot(); }
  if(buildingPending && controlEnabled){ const d=doorPoint(buildingPending.g); if(Math.hypot(avatar.position.x-d.x,avatar.position.z-d.z)<1.2){ const b=buildingPending; buildingPending=null; b.act(); } }
  if(blooming&&bloom<1){ bloom=Math.min(1,bloom+dt*.6); skyMat.color.copy(new THREE.Color('#9d97b6')).lerp(new THREE.Color('#ffffff'),bloom); scene.fog.color.copy(FOG_GRAY).lerp(FOG_BRIGHT,bloom);
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
  for(const tr of trees) tr.g.rotation.z=Math.sin(t*0.8+tr.ph)*0.018; // gentle wind sway
  lampMat.emissiveIntensity=LAMP_BASE+0.15*Math.sin(t*2.1); // soft lamp breathing
  water2.material.map.rotation-=dt*0.014; foam.material.opacity=0.26+0.12*Math.sin(t*1.6); skyMesh.rotation.y+=dt*0.0045; // living water + drifting sky
  if(controlEnabled && !wish && !wishStreak && performance.now()>wishNext){ launchWish(); wishNext=performance.now()+60000+Math.random()*60000; }
  if(wishStreak){ wishStreak.p+=dt/1.1; const q=Math.min(1,wishStreak.p); wishStreak.s.position.lerpVectors(wishStreak.f,wishStreak.t,q); wishStreak.s.material.opacity=0.95*(1-q*0.35);
    if(q>=1){ scene.remove(wishStreak.s); landWish(wishStreak.t); wishStreak=null; } }
  for(const f of fireflies){ const a2=t*f.sp+f.ph; f.s.position.set(Math.cos(a2)*f.r, f.h+Math.sin(t*2+f.ph)*0.3, -6+Math.sin(a2)*f.r); f.s.material.opacity=0.5+0.4*Math.sin(t*3+f.ph); }
  { const np3=performance.now(); if(controlEnabled && twinkle.visible && twinkleFollows && np3-lastInputT>20000 && np3>twGuideCool){
      const g2=pausedLesson?libHouse.position:(gloomling.visible?gloomling.position:shopHouse.position);
      twGuideTarget.set(g2.x,1.8,g2.z); twGuideUntil=np3+3600; twGuideCool=np3+40000; chirp(); } }
  if(wish){ wish.rotation.y+=dt*3; wish.position.y=0.9+Math.sin(t*4)*0.15; if(performance.now()>wish.userData.until){ scene.remove(wish); wish=null; } }
  if(bloom>=1){ const k=Math.min(1,dt/3); sun.color.lerp(new THREE.Color(HOUR_TINT.sun),k); sun.intensity+=(HOUR_TINT.sunI-sun.intensity)*k;
    rimLight.color.lerp(new THREE.Color(HOUR_TINT.rim),k); rimLight.intensity+=(HOUR_TINT.rimI-rimLight.intensity)*k;
    scene.fog.color.lerp(new THREE.Color(HOUR_TINT.fog),k); LAMP_BASE+=(HOUR_TINT.lamp-LAMP_BASE)*k; winMat.emissiveIntensity+=(HOUR_TINT.win-winMat.emissiveIntensity)*k; }
  for(const p of tapProps){ if(p.pop>0){ p.pop=Math.max(0,p.pop-dt*2.6); const s=1+0.16*Math.sin((1-p.pop)*Math.PI); p.g.scale.setScalar(s); } } // tapped-prop squash pop
  for(const n of npcs){ if(n.mixer) n.mixer.update(dt); const np2=performance.now(); // ambient idols: never perfectly still
    if(np2>n.nextAct){ const pick=(n.actions.dance&&Math.random()<0.4)?'dance':(n.actions.wave?'wave':null);
      if(pick){ playNpc(n,pick); n.waveUntil=np2+(pick==='dance'?4200:1600); } n.nextAct=np2+8000+Math.random()*7000; }
    if(np2>=n.waveUntil && n.current!=='idle') playNpc(n,'idle');
    const dx=avatar.position.x-n.g.position.x, dz=avatar.position.z-n.g.position.z; // turn to watch the hero when close
    const want=Math.hypot(dx,dz)<5 ? Math.atan2(dx,dz) : n.homeYaw; let dy=want-n.g.rotation.y; while(dy>Math.PI)dy-=Math.PI*2; while(dy<-Math.PI)dy+=Math.PI*2; n.g.rotation.y+=dy*Math.min(1,dt*2); }
  if(water.material.map){ water.material.map.rotation+=dt*0.02; water.material.map.offset.y=Math.sin(t*0.3)*0.01; } // gently shimmering water
  for(const b of butterflies){ b.s.position.set(b.cx+Math.cos(t*b.sp+b.ph)*b.rx, b.h+Math.sin(t*b.sp*2.3+b.ph)*0.25, b.cz+Math.sin(t*b.sp*0.8+b.ph)*b.rz); b.s.material.opacity=0.45+0.35*Math.sin(t*7+b.ph); } // drift + wing flutter
  for(const b of birds){ b.g.position.x+=dt*b.sp; if(b.g.position.x>36){ b.g.position.x=-36; b.g.position.z=-12-Math.random()*24; b.g.position.y=12+Math.random()*8; } const fl=Math.sin(t*8+b.ph)*0.5; b.wl.rotation.z=0.35+fl; b.wr.rotation.z=-0.35-fl; }
  for(let i=stepFx.length-1;i>=0;i--){ const f=stepFx[i]; f.life+=dt; const p=f.life/f.max;
    if(f.flower){ const pop=p<0.18?(p/0.18):1; f.m.scale.setScalar(0.4+pop*0.7); f.m.material.opacity=(p<0.18?p/0.18:1)*Math.max(0,1-Math.max(0,(p-0.6)/0.4))*0.95; }
    else { f.m.scale.setScalar(1+p*4); f.m.material.opacity=Math.max(0,0.5*(1-p)); }
    if(p>=1){ scene.remove(f.m); f.m.material.dispose(); stepFx.splice(i,1); } }
  // (ambient audio pad + birdsong removed — they added a constant background drone)
  if(ambient){ ambient.rotation.y+=dt*0.03; ambient.material.opacity=0.35+0.2*Math.sin(t*1.5); }
  { const lit=lhLightMat.emissiveIntensity>0.1; lhHalo.material.opacity+=((lit?0.7+0.18*Math.sin(t*3):0)-lhHalo.material.opacity)*Math.min(1,dt*4); }
  for(const c of crystals){ const e=0.5+Math.sin(t*1.5+c.seed)*0.25; c.g.children[0].material.emissiveIntensity=e; c.g.children[1].material.emissiveIntensity=e+0.12; } // energy-infused pulse
  for(const gl of glyphs){ gl.g.rotation.y+=dt*0.25; gl.r1.material.opacity=0.55+0.25*Math.sin(t*1.2+gl.seed); } // slowly turning magic glyphs
  for(const f of faces){ const np=performance.now(); let m=f.tex.open; // blink + reactive happy expression (uses existing cheer signal)
    if(np<twCheerUntil) m=f.tex.happy; else { if(np>=f.next){ f.blinkUntil=np+120; f.next=np+2200+Math.random()*2800; } if(np<f.blinkUntil) m=f.tex.blink; }
    if(f.pl.material.map!==m){ f.pl.material.map=m; f.pl.material.needsUpdate=true; } }
  renderer.render(scene,camera);
  if(FPS_ON){ fpsN++; const fn=performance.now(); if(fn-fpsT>=1000){ if(!fpsEl){ fpsEl=document.createElement('div'); fpsEl.style.cssText='position:fixed;left:8px;bottom:8px;z-index:99;background:rgba(0,0,0,.65);color:#7ef0c0;font:700 12px monospace;padding:4px 9px;border-radius:8px;pointer-events:none'; document.body.appendChild(fpsEl); }
    fpsEl.textContent=Math.round(fpsN*1000/(fn-fpsT))+' fps · '+renderer.info.render.calls+' calls · '+((renderer.info.memory&&renderer.info.memory.geometries)||0)+' geo'; fpsN=0; fpsT=fn; } }
  requestAnimationFrame(tick);
}
addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });
applyAvatar(); boot(); requestAnimationFrame(tick);
// Title-screen "Meet the Legends" — rotating tagline under the character portraits.
(function legendTips(){ const el=$('legend-tip'), intro=$('intro'); if(!el||!intro) return;
  const tips=["Rumi loves to read! 📖","Mira loves puzzles! 🧩","Zoey makes music! 🎵","Tap to start your adventure! ✨"]; let i=0;
  const live=()=>intro && !intro.classList.contains('hidden');
  el.textContent=tips[0]; el.style.transition='opacity .3s';
  setInterval(()=>{ if(!live()) return; el.style.opacity='0'; setTimeout(()=>{ if(!live())return; i=(i+1)%tips.length; el.textContent=tips[i]; el.style.opacity='1'; },300); }, 2600);
})();
