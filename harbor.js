// =====================================================================
//  HARMONY HARBOR — Vertical Slice (Starbound: Little Legends)
//  Validates ONE question: "Will a 5-7 year old want to keep playing?"
//  Systems built (only these): Exploration · Learning activity ·
//  Companion acquisition · Transformation reward loop.
// =====================================================================
import * as THREE from './vendor/three.module.min.js';

// ---------------- DOM ----------------
const $ = (id) => document.getElementById(id);
const root = $('scene-root');
const hud = $('hud'), energyFill = $('energy-fill'), hintEl = $('hint');
const bubble = $('bubble'), bubbleName = $('bubble-name'), bubbleText = $('bubble-text'), bubbleNext = $('bubble-next');
const challenge = $('challenge'), chPic = $('ch-pic'), chPrompt = $('ch-prompt'), chOptions = $('ch-options');

// ---------------- Audio (Web Speech API + tiny WebAudio chimes) ----------------
let audioOn = false, voice = null;
function pickVoice(){
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v => /female|samantha|karen|moira|tessa|google us english/i.test(v.name) && /en/i.test(v.lang))
       || vs.find(v => /en/i.test(v.lang)) || vs[0] || null;
}
if ('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function say(text, {rate=0.92, pitch=1.25, then=null}={}){
  if(!('speechSynthesis' in window)){ if(then) setTimeout(then,400); return; }
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate=rate; u.pitch=pitch; if(voice) u.voice=voice;
    if(then) u.onend = then;
    speechSynthesis.speak(u);
  }catch(e){ if(then) setTimeout(then,400); }
}
let actx=null;
function chime(type='good'){
  try{
    actx = actx || new (window.AudioContext||window.webkitAudioContext)();
    const seq = type==='good' ? [660,880] : type==='win' ? [660,880,1320] : [520];
    seq.forEach((f,i)=>{ const o=actx.createOscillator(), g=actx.createGain();
      o.type='sine'; o.frequency.value=f; o.connect(g); g.connect(actx.destination);
      const t=actx.currentTime+i*0.12; g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(0.25,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+0.3);
      o.start(t); o.stop(t+0.32); });
  }catch(e){}
}

// ---------------- Renderer / scene / camera ----------------
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
root.appendChild(renderer.domElement);

const scene = new THREE.Scene();
// the harbor starts a little gray/sad; it "blooms" with color on success
const FOG_GRAY = new THREE.Color('#b9b3c6'), FOG_BRIGHT = new THREE.Color('#cdefff');
scene.background = FOG_GRAY.clone();
scene.fog = new THREE.Fog(FOG_GRAY.clone(), 22, 60);

const camera = new THREE.PerspectiveCamera(56, innerWidth/innerHeight, 0.1, 200);
const CAM_OFF = new THREE.Vector3(0, 7.5, 10);

const hemi = new THREE.HemisphereLight('#ffffff', '#cabfe0', 0.62);
scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff3da', 0.85);
sun.position.set(8,16,6); sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-22; sun.shadow.camera.right=22; sun.shadow.camera.top=22; sun.shadow.camera.bottom=-22;
scene.add(sun);

// ---------------- Environment ----------------
const WORLD_R = 20;
const water = new THREE.Mesh(new THREE.CircleGeometry(WORLD_R,64),
  new THREE.MeshStandardMaterial({ color:'#7fb6bf', roughness:0.5, metalness:0.0 }));
water.rotation.x=-Math.PI/2; water.receiveShadow=true; scene.add(water);
// dock / plaza
const dock = new THREE.Mesh(new THREE.CircleGeometry(9,48),
  new THREE.MeshStandardMaterial({ color:'#e7c9a6', roughness:1 }));
dock.rotation.x=-Math.PI/2; dock.position.y=0.02; dock.receiveShadow=true; scene.add(dock);

// lighthouse (starts gray, relights gold)
const lighthouse = new THREE.Group();
const lhMat = new THREE.MeshStandardMaterial({ color:'#c9c4d2', roughness:0.9 });
const lhTower = new THREE.Mesh(new THREE.CylinderGeometry(1.0,1.5,5,20), lhMat);
lhTower.position.y=2.5; lhTower.castShadow=true;
const lhRoof = new THREE.Mesh(new THREE.ConeGeometry(1.5,1.4,20), new THREE.MeshStandardMaterial({color:'#9a93a8',roughness:.9}));
lhRoof.position.y=5.7;
const lhLightMat = new THREE.MeshStandardMaterial({ color:'#fff6d8', emissive:'#000000', emissiveIntensity:0 });
const lhLight = new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.05,0.9,20), lhLightMat);
lhLight.position.y=4.85;
lighthouse.add(lhTower, lhRoof, lhLight);
lighthouse.position.set(0,0,-6); scene.add(lighthouse);

// a few cozy harbor houses
function house(x,z,col){ const g=new THREE.Group();
  const b=new THREE.Mesh(new THREE.BoxGeometry(2,1.8,2), new THREE.MeshStandardMaterial({color:col,roughness:.95}));
  b.position.y=0.9; b.castShadow=true;
  const r=new THREE.Mesh(new THREE.ConeGeometry(1.6,1.1,4), new THREE.MeshStandardMaterial({color:'#fff',roughness:.8}));
  r.position.y=2.35; r.rotation.y=Math.PI/4;
  g.add(b,r); g.position.set(x,0,z); scene.add(g); return g; }
const houseCols=['#f4b98a','#9ad2d8','#f3a6c4','#cdb8f0'];
[[-7,-2],[7,-2],[-6,3],[6,3]].forEach((p,i)=>house(p[0],p[1],houseCols[i]));

// floating collectible sparkles (delight during exploration)
const sparkles=[];
function makeSparkle(x,z){ const m=new THREE.Mesh(new THREE.OctahedronGeometry(0.32),
  new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:0.7}));
  m.position.set(x,1.2,z); scene.add(m); sparkles.push(m); }
[[-3,1],[3,0.5],[-1.5,-2],[2,-3.5],[-4,-4]].forEach(p=>makeSparkle(p[0],p[1]));

// ---------------- Characters ----------------
function skin(c){ return new THREE.MeshStandardMaterial({color:c,roughness:.7}); }

// Player avatar (the child) — a little trainee
const avatar = new THREE.Group();
{ const body=new THREE.Mesh(new THREE.CapsuleGeometry(0.4,0.6,6,12), skin('#5ec8c0')); body.position.y=0.85; body.castShadow=true;
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.45,18,18), skin('#ffd9b8')); head.position.y=1.7; head.castShadow=true;
  const hair=new THREE.Mesh(new THREE.SphereGeometry(0.5,18,18,0,6.3,0,1.9), skin('#5a3a2a')); hair.position.y=1.75;
  const star=new THREE.Mesh(new THREE.OctahedronGeometry(0.18), new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#a98a00',emissiveIntensity:.4})); star.position.set(0,1.05,0.4);
  avatar.add(body,head,hair,star); }
avatar.position.set(0,0,5); scene.add(avatar);

// RUMI — gold jacket, purple braid
const rumi = new THREE.Group();
const rumiJacketMat = new THREE.MeshStandardMaterial({color:'#FFC83D',roughness:.55,emissive:'#000',emissiveIntensity:0});
let rumiCape=null, rumiCrown=null;
{ const jacket=new THREE.Mesh(new THREE.CapsuleGeometry(0.46,0.7,6,12), rumiJacketMat); jacket.position.y=0.95; jacket.castShadow=true;
  const core=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.7,0.3), skin('#ffffff')); core.position.y=1.0;
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.46,18,18), skin('#ffe0c2')); head.position.y=1.85; head.castShadow=true;
  const hair=new THREE.Mesh(new THREE.SphereGeometry(0.52,18,18,0,6.3,0,2.0), skin('#7B4FC4')); hair.position.y=1.9;
  // braid over shoulder
  const braid=new THREE.Mesh(new THREE.CapsuleGeometry(0.13,1.0,4,8), skin('#7B4FC4')); braid.position.set(-0.4,1.2,0.2); braid.rotation.z=0.35;
  const braidStar=new THREE.Mesh(new THREE.OctahedronGeometry(0.14), new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#a98a00',emissiveIntensity:.5})); braidStar.position.set(-0.62,0.7,0.2);
  // songstaff (friendly mic)
  const staff=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,1.1,8), new THREE.MeshStandardMaterial({color:'#e8e2f0'})); staff.position.set(0.55,1.1,0);
  const mic=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,12), new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.6})); mic.position.set(0.55,1.7,0);
  rumi.add(jacket,core,head,hair,braid,braidStar,staff,mic); }
rumi.position.set(-2.2,0,3); rumi.rotation.y=0.4; scene.add(rumi);

// GLOOMLING (gray, sad) -> becomes TWINKLE
const gloomling = new THREE.Group();
{ const b=new THREE.Mesh(new THREE.SphereGeometry(0.7,18,18), new THREE.MeshStandardMaterial({color:'#8b8598',roughness:.95})); b.position.y=0.8; b.castShadow=true;
  const e=(x)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(0.1,10,10), new THREE.MeshStandardMaterial({color:'#2a2536'})); m.position.set(x,0.95,0.62); return m;};
  gloomling.add(b,e(-0.22),e(0.22)); }
gloomling.position.set(0.6,0,-3.4); scene.add(gloomling);

// TWINKLE the glow-fox (hidden until rescue)
const twinkle = new THREE.Group();
{ const body=new THREE.Mesh(new THREE.SphereGeometry(0.55,18,18), new THREE.MeshStandardMaterial({color:'#fff0cf',emissive:'#FFE0A8',emissiveIntensity:.15,roughness:.5})); body.position.y=0.55; body.castShadow=true;
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.42,18,18), new THREE.MeshStandardMaterial({color:'#fff0cf',roughness:.5})); head.position.y=1.1;
  const ear=(x)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(0.16,0.4,10), new THREE.MeshStandardMaterial({color:'#9a6ae0'})); m.position.set(x,1.5,0); return m;};
  const tail=new THREE.Mesh(new THREE.SphereGeometry(0.38,16,16), new THREE.MeshStandardMaterial({color:'#fff0cf',roughness:.5})); tail.position.set(-0.5,0.6,-0.3);
  const tailStar=new THREE.Mesh(new THREE.OctahedronGeometry(0.18), new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.8})); tailStar.position.set(-0.78,0.75,-0.45);
  const eye=(x)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(0.07,10,10), new THREE.MeshStandardMaterial({color:'#241B3A'})); m.position.set(x,1.15,0.36); return m;};
  twinkle.add(body,head,ear(-0.18),ear(0.18),tail,tailStar,eye(-0.14),eye(0.14)); }
twinkle.position.copy(gloomling.position); twinkle.visible=false; scene.add(twinkle);
let twinkleFollows=false;

// objective marker (breadcrumb)
const marker = new THREE.Mesh(new THREE.TorusGeometry(0.7,0.12,8,24),
  new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:.7}));
marker.rotation.x=-Math.PI/2; marker.visible=false; scene.add(marker);
function setMarker(pos){ if(!pos){marker.visible=false;return;} marker.position.set(pos.x,0.1,pos.z); marker.visible=true; }

// ---------------- Movement (tap to move) + follow cam ----------------
const ray=new THREE.Raycaster(), ndc=new THREE.Vector2();
const target=avatar.position.clone();
let controlEnabled=false;
function tapToGround(cx,cy){
  if(!controlEnabled) return;
  ndc.x=(cx/innerWidth)*2-1; ndc.y=-(cy/innerHeight)*2+1;
  ray.setFromCamera(ndc,camera);
  const hit=ray.intersectObject(water,false)[0];
  if(hit && Math.hypot(hit.point.x,hit.point.z)<=WORLD_R-1){ target.copy(hit.point); target.y=0; if(hintEl) hintEl.style.opacity=0; }
}
renderer.domElement.addEventListener('pointerdown', e=>tapToGround(e.clientX,e.clientY));

// ---------------- Sparkle bursts ----------------
const bursts=[];
function burst(pos,color='#FFE9A8',n=24){
  for(let i=0;i<n;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(0.08,6,6), new THREE.MeshBasicMaterial({color}));
    s.position.copy(pos); s.position.y+=1;
    const d=new THREE.Vector3(Math.random()-.5,Math.random()*1.1,Math.random()-.5).normalize();
    bursts.push({m:s,v:d.multiplyScalar(3+Math.random()*3),life:1}); scene.add(s); }
}
function confetti(){ const cols=['#FFC83D','#FF8FCF','#8FD0FF','#7EF0C0','#B69CFF'];
  for(let i=0;i<60;i++){ const d=document.createElement('div'); d.className='confetti';
    d.style.left=Math.random()*100+'vw'; d.style.background=cols[i%cols.length];
    d.style.animation=`fall ${1.6+Math.random()*1.4}s ${Math.random()*0.6}s ease-in forwards`;
    document.body.appendChild(d); setTimeout(()=>d.remove(),3600); } }

// ---------------- Bloom (gray -> color) ----------------
let bloom=0, blooming=false;
function startBloom(){ blooming=true; }

// =====================================================================
//  PHASE / STATE MACHINE
// =====================================================================
let phase='intro';
let energy=0;
function setEnergy(p){ energy=p; energyFill.style.width=p+'%'; }
function showHint(t){ hintEl.textContent=t; hintEl.style.opacity=1; }

function speak(name, text, btnLabel, onNext){
  bubbleName.textContent=name; bubbleText.textContent=text;
  bubbleNext.textContent=btnLabel||'Tap ▶';
  bubble.classList.remove('hidden');
  if(audioOn) say(text);
  bubbleNext.onclick=()=>{ bubble.classList.add('hidden'); if(onNext) onNext(); };
}

// --- Intro ---
$('start-btn').onclick=()=>{
  // unlock audio on user gesture
  audioOn=true; try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){}
  $('intro').classList.add('hidden'); hud.classList.remove('hidden');
  phase='meet';
  speak('Rumi',"Hi! I'm Rumi! Welcome to Harmony Harbor! Oh no… the Lighthouse went dark. A shy little Gloomling is hiding its words. Will you help me read to light it up?",
    "Let's go! ▶", beginExplore);
};
$('hear-btn').onclick=()=>{ if(phase==='explore') say("Follow the sparkles to the Gloomling by the lighthouse!");
  else if(!bubble.classList.contains('hidden') && audioOn) say(bubbleText.textContent); };

// --- Explore ---
function beginExplore(){
  phase='explore'; controlEnabled=true;
  setMarker(gloomling.position);
  showHint('Tap the ground to walk to the Gloomling! 👣');
  if(audioOn) say("Follow the sparkles!");
}

// --- Challenge prompt (reached the gloomling) ---
let challengeStarted=false;
function reachChallenge(){
  if(challengeStarted) return; challengeStarted=true;
  phase='challengePrompt'; controlEnabled=false; setMarker(null); hintEl.style.opacity=0;
  speak('Gloomling',"…I lost the words. Will you read them with me?","Yes! Let's read ✨", startChallenge);
}

// =====================================================================
//  LEARNING CHALLENGE — "The Singing Lighthouse"  (early reading)
//  3 rounds · audio support · adaptive · positive reinforcement · NO FAIL
// =====================================================================
const rounds=[
  { type:'choose', pic:'☀️', word:'sun',
    prompt:"Which letter says  sss …  like  s-s-sun?", say:"Which letter says sss, like sun?",
    options:[{t:'S',say:'sss'},{t:'M',say:'mmm'},{t:'T',say:'tuh'}], answer:'S' },
  { type:'choose', pic:'🐱', word:'cat',
    prompt:"Which word says  “cat”?", say:"Which word says cat?",
    options:[{t:'cat',say:'cat'},{t:'dog',say:'dog'},{t:'sun',say:'sun'}], answer:'cat' },
  { type:'blend', pic:'🐶', word:'dog',
    prompt:"Tap the sounds in order to read it!", say:"Tap the sounds in order. d… o… g… dog!",
    sounds:[{t:'d',say:'duh'},{t:'o',say:'aah'},{t:'g',say:'guh'}], answer:['d','o','g'] },
];
const praises=["You did it!","Wonderful reading!","You're a reading star!","Amazing!","Yay! You read it!"];
let roundIdx=0, mistakes=0, totalMistakes=0;

function startChallenge(){
  phase='challenge'; roundIdx=0; totalMistakes=0;
  challenge.classList.remove('hidden');
  renderRound();
}
function lights(){ document.querySelectorAll('.lite').forEach((l,i)=>{ l.textContent= i<roundIdx?'●':'○'; l.classList.toggle('on', i<roundIdx); }); }

function renderRound(){
  const r=rounds[roundIdx]; mistakes=0;
  chPic.textContent=r.pic; chPrompt.textContent=r.prompt; chOptions.innerHTML='';
  lights();
  if(audioOn) say(r.say);
  if(r.type==='choose') renderChoose(r);
  else renderBlend(r);
  // wire helper buttons
  $('ch-hear').onclick=()=>{ if(audioOn) say(r.say); };
  $('ch-hint').onclick=()=>giveHint(r);
}

// adaptive: if the child has struggled, show fewer options
function adaptiveOptions(r){
  let opts=r.options.slice();
  if(totalMistakes>=2){ // make it easier: keep answer + 1 distractor
    opts = opts.filter(o=>o.t===r.answer).concat(opts.filter(o=>o.t!==r.answer).slice(0,1));
  }
  // shuffle
  for(let i=opts.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[opts[i],opts[j]]=[opts[j],opts[i]];}
  return opts;
}
function renderChoose(r){
  adaptiveOptions(r).forEach(o=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=o.t;
    b.onclick=()=>{
      if(audioOn) say(o.say,{rate:0.8});
      if(o.t===r.answer){ correctRound(b); }
      else { wrongTry(b,r); }
    };
    chOptions.appendChild(b);
  });
}
let blendProgress=0;
function renderBlend(r){
  blendProgress=0;
  // present sounds (in order, but child must tap in order)
  r.sounds.forEach((s,idx)=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=s.t; b.dataset.idx=idx;
    b.onclick=()=>{
      if(audioOn) say(s.say,{rate:0.8});
      if(idx===blendProgress){ b.classList.add('correct'); blendProgress++;
        if(blendProgress===r.sounds.length){ if(audioOn) setTimeout(()=>say(r.word,{rate:0.8}),300); correctRound(b); } }
      else { mistakes++; totalMistakes++; if(audioOn) say("Start with the first sound!"); flashHintBlend(r); }
    };
    chOptions.appendChild(b);
  });
}
function flashHintBlend(r){
  const next=chOptions.querySelector(`[data-idx="${blendProgress}"]`);
  if(next){ next.classList.add('glowhint'); setTimeout(()=>next.classList.remove('glowhint'),1500); }
}
function giveHint(r){
  if(r.type==='blend'){ flashHintBlend(r); if(audioOn) say("Tap this one next!"); return; }
  // dim a wrong option + glow correct
  const btns=[...chOptions.querySelectorAll('.opt')];
  const wrong=btns.find(b=>b.textContent!==r.answer && !b.classList.contains('dim'));
  if(wrong) wrong.classList.add('dim');
  const right=btns.find(b=>b.textContent===r.answer);
  if(right){ right.classList.add('glowhint'); setTimeout(()=>right.classList.remove('glowhint'),1600); }
  if(audioOn) say(r.say);
}
function wrongTry(btn,r){
  mistakes++; totalMistakes++;
  btn.classList.add('dim');
  if(audioOn) say("Almost! Listen again.");
  // NO FAIL: after 2 misses in a round, model the answer and accept
  if(mistakes>=2){
    const right=[...chOptions.querySelectorAll('.opt')].find(b=>b.textContent===r.answer);
    if(right){ right.classList.add('glowhint');
      if(audioOn) say(`This one says ${r.word}. Tap it with me!`);
      right.onclick=()=>{ if(audioOn) say(r.word,{rate:0.8}); correctRound(right); }; }
  }
}
function correctRound(btn){
  btn.classList.remove('glowhint'); btn.classList.add('correct');
  chime('good');
  // light a lighthouse light
  burst(lighthouse.position,'#FFE9A8',10);
  const p=praises[(Math.random()*praises.length)|0];
  // disable further taps
  [...chOptions.querySelectorAll('.opt')].forEach(b=>b.onclick=null);
  setTimeout(()=>{
    roundIdx++; lights();
    if(roundIdx<rounds.length){ if(audioOn) say(p,{then:renderRound}); else renderRound(); }
    else { if(audioOn) say(p,{then:finishChallenge}); else finishChallenge(); }
  }, 700);
}

// --- Challenge complete -> bloom + rescue ---
function finishChallenge(){
  challenge.classList.add('hidden');
  phase='bloom';
  setEnergy(100); startBloom(); chime('win');
  // relight lighthouse
  lhMat.color.set('#f3ead8'); lhRoof.material.color.set('#e23e6b'); lhLightMat.emissive.set('#FFD24D'); lhLightMat.emissiveIntensity=1.2;
  burst(lighthouse.position,'#FFD24D',40);
  setTimeout(()=>{
    // gloomling -> twinkle
    gloomling.visible=false; twinkle.visible=true; twinkle.position.copy(gloomling.position);
    burst(twinkle.position,'#7EF0C0',30); chime('good');
    speak('Rumi',"You read all three words — the Lighthouse is shining! Look! The Gloomling turned into a happy Star Pal. Tap your new friend to say hi!",
      "Tap Twinkle! 🦊", enableTwinkleTap);
  }, 1600);
}
function enableTwinkleTap(){
  phase='rescue'; controlEnabled=false;
  showHint('Tap Twinkle to befriend! 🦊✨');
  const tapTwinkle=(e)=>{
    ndc.x=(e.clientX/innerWidth)*2-1; ndc.y=-(e.clientY/innerHeight)*2+1; ray.setFromCamera(ndc,camera);
    if(ray.intersectObject(twinkle,true).length){
      renderer.domElement.removeEventListener('pointerdown',tapTwinkle);
      burst(twinkle.position,'#FF8FCF',30); chime('good'); hintEl.style.opacity=0;
      twinkleFollows=true;
      speak('Twinkle',"*happy twinkle!* 🦊💛","Aww! ▶", beginTransform);
    }
  };
  renderer.domElement.addEventListener('pointerdown',tapTwinkle);
}

// --- Transformation reward loop ---
function beginTransform(){
  phase='transform';
  // Rumi walks to the child
  const tf=$('transform');
  // upgrade Rumi visuals: glowing gold + add cape + crown star
  setTimeout(()=>{
    tf.classList.remove('hidden');
    if(audioOn) say("You filled the harbor with harmony! Watch — Rumi is transforming into a Rising Star!");
    rumiJacketMat.emissive.set('#FFC83D'); rumiJacketMat.emissiveIntensity=0.6;
    if(!rumiCape){ rumiCape=new THREE.Mesh(new THREE.ConeGeometry(0.7,1.2,12,1,true), new THREE.MeshStandardMaterial({color:'#7B4FC4',emissive:'#5a3aa0',emissiveIntensity:.4,side:THREE.DoubleSide}));
      rumiCape.position.set(0,1.0,-0.3); rumi.add(rumiCape);
      rumiCrown=new THREE.Mesh(new THREE.OctahedronGeometry(0.2), new THREE.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFC83D',emissiveIntensity:1})); rumiCrown.position.set(0,2.5,0); rumi.add(rumiCrown); }
    burst(rumi.position,'#FFE9A8',40);
  }, 400);
  setTimeout(()=>{ tf.classList.add('hidden'); showReward(); }, 3600);
}
function showReward(){
  phase='reward'; $('reward').classList.remove('hidden'); confetti(); chime('win');
  if(audioOn) say("You earned a Reading Star, and Twinkle joined your team! Great job, reading star!");
  $('reward-next').onclick=()=>{ $('reward').classList.add('hidden'); showHub(); };
}
function showHub(){
  phase='hub'; $('hub').classList.remove('hidden');
  if(audioOn) say("Want to go on another adventure?");
  $('play-again').onclick=()=>location.reload();
  $('all-done').onclick=()=>{ if(audioOn) say("See you next time! Bye bye!"); $('hub').innerHTML='<div class="intro-star">💛</div><h1>See you next time!</h1><p>You can close the app now.</p>'; };
}

// ---------------- Main loop ----------------
let last=performance.now();
function tick(now){
  const dt=Math.min((now-last)/1000,0.05); last=now;
  const t=now/1000;

  // move avatar
  let moving=false;
  const dx=target.x-avatar.position.x, dz=target.z-avatar.position.z, d=Math.hypot(dx,dz);
  if(d>0.08){ moving=true; const step=Math.min(6*dt,d);
    avatar.position.x+=dx/d*step; avatar.position.z+=dz/d*step; avatar.rotation.y=Math.atan2(dx,dz); }
  avatar.position.y= moving? Math.abs(Math.sin(t*10))*0.12 : 0;

  // camera follows avatar
  const desired=avatar.position.clone().add(CAM_OFF);
  camera.position.lerp(desired, 1-Math.exp(-dt*6));
  camera.lookAt(avatar.position.x,1.2,avatar.position.z);

  // marker spin
  if(marker.visible){ marker.rotation.z+=dt*2; marker.position.y=0.1+Math.sin(t*3)*0.08; }

  // sparkles spin + collect on proximity
  for(let i=sparkles.length-1;i>=0;i--){ const s=sparkles[i]; s.rotation.y+=dt*2; s.position.y=1.2+Math.sin(t*3+i)*0.12;
    if(phase==='explore' && Math.hypot(s.position.x-avatar.position.x,s.position.z-avatar.position.z)<1.1){
      burst(s.position,'#FFD24D',8); chime('good'); scene.remove(s); sparkles.splice(i,1); } }

  // gloomling sad float / twinkle follow + bob
  if(gloomling.visible) gloomling.position.y=Math.sin(t*2)*0.1;
  if(twinkle.visible){ twinkle.position.y=(twinkleFollows?0:0)+Math.sin(t*3)*0.12+(twinkleFollows?0.0:0);
    if(twinkleFollows){ const behind=new THREE.Vector3(Math.sin(avatar.rotation.y)*-1.6,0,Math.cos(avatar.rotation.y)*-1.6);
      const goal=avatar.position.clone().add(behind); twinkle.position.lerp(new THREE.Vector3(goal.x,twinkle.position.y,goal.z),1-Math.exp(-dt*4)); }
    twinkle.children[5] && (twinkle.children[5].material.emissiveIntensity=0.6+Math.sin(t*6)*0.3); }

  // rumi idle bob + mic glow
  rumi.position.y=Math.sin(t*1.6)*0.04;

  // proximity: reached challenge
  if(phase==='explore' && Math.hypot(gloomling.position.x-avatar.position.x,gloomling.position.z-avatar.position.z)<2.0){ reachChallenge(); }

  // bloom animation
  if(blooming && bloom<1){ bloom=Math.min(1,bloom+dt*0.6);
    scene.background.copy(FOG_GRAY).lerp(FOG_BRIGHT,bloom);
    scene.fog.color.copy(FOG_GRAY).lerp(FOG_BRIGHT,bloom);
    hemi.intensity=0.62+0.5*bloom;
    water.material.color.copy(new THREE.Color('#7fb6bf')).lerp(new THREE.Color('#3fc8d2'),bloom);
    dock.material.color.copy(new THREE.Color('#e7c9a6')).lerp(new THREE.Color('#ffe3b0'),bloom); }

  // bursts
  for(let i=bursts.length-1;i>=0;i--){ const b=bursts[i]; b.life-=dt*1.4; b.m.position.addScaledVector(b.v,dt); b.v.y-=dt*4;
    if(b.life<=0){ scene.remove(b.m); bursts.splice(i,1); } }

  renderer.render(scene,camera);
  requestAnimationFrame(tick);
}
addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });
requestAnimationFrame(tick);
