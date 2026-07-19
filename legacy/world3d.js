// ============================================================
//  STARBOUND HUNTERS: LITTLE LEGENDS — Milestone 1
//  A walkable 3D district: tap to move your Star Hunter, walk up
//  to a Gloomling and "sing" to turn it into a Star Pal companion.
// ============================================================
import * as THREE from './vendor/three.module.min.js';

// ---------- renderer / scene / camera ----------
const root = document.getElementById('scene-root');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
root.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#bfe3ff');
scene.fog = new THREE.Fog('#cfe9ff', 26, 60);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
const CAM_OFFSET = new THREE.Vector3(0, 7.5, 10);

// ---------- lights ----------
scene.add(new THREE.HemisphereLight('#ffffff', '#c7b6ff', 1.05));
const sun = new THREE.DirectionalLight('#fff6e0', 1.1);
sun.position.set(8, 16, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -22; sun.shadow.camera.right = 22;
sun.shadow.camera.top = 22; sun.shadow.camera.bottom = -22;
scene.add(sun);

// ---------- ground ----------
const WORLD_R = 22;
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(WORLD_R, 64),
  new THREE.MeshStandardMaterial({ color: '#9be59a', roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// a cobbled plaza disc in the middle
const plaza = new THREE.Mesh(
  new THREE.CircleGeometry(8, 48),
  new THREE.MeshStandardMaterial({ color: '#f3d9ff', roughness: 1 })
);
plaza.rotation.x = -Math.PI / 2;
plaza.position.y = 0.01;
plaza.receiveShadow = true;
scene.add(plaza);

// scattered candy trees for that magical-city feel
function makeTree(x, z, capColor) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.3, 1.4, 8),
    new THREE.MeshStandardMaterial({ color: '#9a6a4f', roughness: 1 })
  );
  trunk.position.y = 0.7; trunk.castShadow = true;
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 16, 16),
    new THREE.MeshStandardMaterial({ color: capColor, roughness: 0.9 })
  );
  cap.position.y = 2.0; cap.castShadow = true;
  g.add(trunk, cap);
  g.position.set(x, 0, z);
  scene.add(g);
}
const treeColors = ['#ff9ed2', '#9ad7ff', '#ffd86b', '#b69cff', '#8ee9b0'];
for (let i = 0; i < 10; i++) {
  const a = (i / 10) * Math.PI * 2 + 0.3;
  const r = 13 + (i % 3) * 2.5;
  makeTree(Math.cos(a) * r, Math.sin(a) * r, treeColors[i % treeColors.length]);
}

// ---------- text labels (canvas sprites) ----------
function makeLabel(text) {
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 96;
  const c = cv.getContext('2d');
  c.font = 'bold 40px "Baloo 2", system-ui, sans-serif';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.lineWidth = 8; c.strokeStyle = 'rgba(80,40,120,0.85)';
  c.strokeText(text, 128, 50);
  c.fillStyle = '#ffffff'; c.fillText(text, 128, 50);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  spr.scale.set(4, 1.5, 1);
  return spr;
}

// ---------- district landmarks (stations) ----------
const stations = [];
function addStation({ x, z, color, name, label, action }) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.8, 0.4, 24),
    new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 })
  );
  base.position.y = 0.2; base.castShadow = true; base.receiveShadow = true;
  const build = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 2.2, 2.2),
    new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
  );
  build.position.y = 1.5; build.castShadow = true;
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.9, 1.3, 4),
    new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6 })
  );
  roof.position.y = 3.25; roof.rotation.y = Math.PI / 4; roof.castShadow = true;
  const lbl = makeLabel(label);
  lbl.position.y = 4.6;
  g.add(base, build, roof, lbl);
  g.position.set(x, 0, z);
  scene.add(g);
  stations.push({ pos: new THREE.Vector3(x, 0, z), radius: 3.2, name, action, group: g });
}
addStation({ x: -7, z: -5, color: '#ff8fcf', name: 'Style Studio',
  label: 'Style Studio', action: () => { location.href = 'classic.html'; } });
addStation({ x: 7, z: -5, color: '#7aa6ff', name: 'Performance Stage',
  label: 'Stage', action: () => toast('🎤 Concerts coming soon!') });
addStation({ x: 0, z: -9, color: '#ffd34d', name: 'Color Quest',
  label: 'Color Quest', action: () => toast('🎨 Learning missions coming soon!') });

// ---------- the Star Hunter (player) ----------
const hero = new THREE.Group();
const heroMat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 });
const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 0.7, 6, 12), heroMat('#ff7ec4'));
body.position.y = 0.95; body.castShadow = true;
const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), heroMat('#ffe0c2'));
head.position.y = 1.85; head.castShadow = true;
const hair = new THREE.Mesh(new THREE.SphereGeometry(0.56, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), heroMat('#6a4bc4'));
hair.position.y = 1.9;
const starHat = new THREE.Mesh(new THREE.OctahedronGeometry(0.28), new THREE.MeshStandardMaterial({ color: '#ffe44d', emissive: '#a98a00', emissiveIntensity: 0.4 }));
starHat.position.y = 2.5;
hero.add(body, head, hair, starHat);
hero.position.set(0, 0, 4);
scene.add(hero);

// ---------- Gloomling (rescue target) ----------
let gloomling = new THREE.Group();
const gloomBody = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 20, 20),
  new THREE.MeshStandardMaterial({ color: '#5a5570', roughness: 0.9 })
);
gloomBody.position.y = 1.0; gloomBody.castShadow = true;
const gloomEye = (x) => {
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), new THREE.MeshStandardMaterial({ color: '#fff' }));
  e.position.set(x, 1.15, 0.7); return e;
};
gloomling.add(gloomBody, gloomEye(-0.25), gloomEye(0.25));
gloomling.position.set(-2, 0, -3);
scene.add(gloomling);
let gloomActive = true;
const gloomStation = { pos: gloomling.position.clone(), radius: 3.0, name: 'Gloomling',
  isGloom: true, action: rescueGloomling, group: gloomling };
stations.push(gloomStation);

// ---------- companions (Star Pals) ----------
const pals = [];
let palCount = 0;
function spawnPal(pos, color) {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 18),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.25, roughness: 0.5 }));
  b.position.y = 0; b.castShadow = true;
  const ear = (x) => { const e = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 12),
    new THREE.MeshStandardMaterial({ color, roughness: 0.5 })); e.position.set(x, 0.55, 0); return e; };
  g.add(b, ear(-0.25), ear(0.25));
  g.position.copy(pos); g.position.y = 1.4;
  scene.add(g);
  pals.push({ group: g, phase: Math.random() * 6 });
  palCount++;
  document.getElementById('pal-count').textContent = palCount;
}

// ---------- sparkles ----------
const sparks = [];
function burst(pos, color) {
  for (let i = 0; i < 26; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6),
      new THREE.MeshBasicMaterial({ color }));
    s.position.copy(pos); s.position.y += 1;
    const dir = new THREE.Vector3((Math.random() - 0.5), Math.random() * 1.2, (Math.random() - 0.5)).normalize();
    sparks.push({ mesh: s, vel: dir.multiplyScalar(3 + Math.random() * 3), life: 1 });
    scene.add(s);
  }
}

function rescueGloomling() {
  if (!gloomActive) return;
  gloomActive = false;
  const idx = stations.indexOf(gloomStation); if (idx > -1) stations.splice(idx, 1);
  const palColor = '#7ef0c0';
  burst(gloomling.position, '#fff2a8');
  // shrink the gloomling away, then a pal pops in its place
  const startPos = gloomling.position.clone();
  let t = 0;
  const shrink = () => {
    t += 0.06;
    const s = Math.max(0, 1 - t);
    gloomling.scale.setScalar(s);
    if (s > 0) requestAnimationFrame(shrink);
    else { scene.remove(gloomling); spawnPal(startPos, palColor); toast('🌟 New Star Pal joined you!'); }
  };
  shrink();
  hidePrompt();
}

// ---------- HUD prompt ----------
const promptEl = document.getElementById('prompt');
const promptText = document.getElementById('prompt-text');
const promptBtn = document.getElementById('prompt-btn');
let activeStation = null;
function showPrompt(st) {
  activeStation = st;
  if (st.isGloom) { promptText.textContent = 'A sad Gloomling!'; promptBtn.textContent = 'Sing ✨'; }
  else { promptText.textContent = st.name; promptBtn.textContent = 'Enter ✨'; }
  promptEl.classList.remove('hidden');
}
function hidePrompt() { activeStation = null; promptEl.classList.add('hidden'); }
promptBtn.addEventListener('click', () => { if (activeStation && activeStation.action) activeStation.action(); });

let toastTimer = null;
function toast(msg) {
  let t = document.getElementById('toast3d');
  if (!t) { t = document.createElement('div'); t.id = 'toast3d'; t.className = 'toast3d'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

// ---------- tap to move ----------
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const target = hero.position.clone();
function pointerToGround(clientX, clientY) {
  ndc.x = (clientX / window.innerWidth) * 2 - 1;
  ndc.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObject(ground, false)[0];
  if (hit) {
    const p = hit.point;
    if (Math.hypot(p.x, p.z) <= WORLD_R - 0.5) { target.copy(p); target.y = 0; }
    document.getElementById('hud-hint').classList.add('fade');
  }
}
renderer.domElement.addEventListener('pointerdown', (e) => pointerToGround(e.clientX, e.clientY));

// ---------- main loop ----------
const clock = new THREE.Clock();
const SPEED = 6;
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // move hero toward target
  const dx = target.x - hero.position.x, dz = target.z - hero.position.z;
  const dist = Math.hypot(dx, dz);
  let moving = false;
  if (dist > 0.08) {
    moving = true;
    const step = Math.min(SPEED * dt, dist);
    hero.position.x += (dx / dist) * step;
    hero.position.z += (dz / dist) * step;
    hero.rotation.y = Math.atan2(dx, dz);
  }
  hero.position.y = moving ? Math.abs(Math.sin(t * 10)) * 0.12 : 0; // little bob
  starHat.rotation.y += dt * 2;

  // camera follow
  const desired = hero.position.clone().add(CAM_OFFSET);
  camera.position.lerp(desired, 1 - Math.exp(-dt * 6));
  camera.lookAt(hero.position.x, 1.2, hero.position.z);

  // pals follow in a little trail
  pals.forEach((p, i) => {
    const behind = new THREE.Vector3(Math.sin(hero.rotation.y) * -(2 + i * 1.2), 1.4, Math.cos(hero.rotation.y) * -(2 + i * 1.2));
    const goal = hero.position.clone().add(behind);
    p.group.position.lerp(goal, 1 - Math.exp(-dt * 4));
    p.group.position.y = 1.4 + Math.sin(t * 3 + p.phase) * 0.18;
  });

  // gloomling gentle float
  if (gloomActive) gloomling.position.y = Math.sin(t * 2) * 0.12;

  // sparkles
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.life -= dt * 1.4;
    s.mesh.position.addScaledVector(s.vel, dt);
    s.vel.y -= dt * 4;
    if (s.life <= 0) { scene.remove(s.mesh); sparks.splice(i, 1); }
  }

  // proximity check (nearest interactable in range)
  let near = null, best = Infinity;
  for (const st of stations) {
    const d = Math.hypot(st.pos.x - hero.position.x, st.pos.z - hero.position.z);
    if (d < st.radius && d < best) { best = d; near = st; }
  }
  if (near && near !== activeStation) showPrompt(near);
  else if (!near && activeStation) hidePrompt();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

// ---------- resize ----------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// go!
document.getElementById('loading').classList.add('hidden');
tick();
