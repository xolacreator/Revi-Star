// ============================================================
//  Doodle Stars — Game Logic
// ============================================================

(function () {
  const screens = { home: document.getElementById('home'), play: document.getElementById('play') };
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const toolbar = document.getElementById('toolbar');
  const worldTitle = document.getElementById('world-title');
  const modeToggle = document.getElementById('mode-toggle');
  const dressupLayer = document.getElementById('dressup-layer');

  let world = 'pop';
  let mode = 'color';            // 'color' or 'dressup'
  let brushColor = '#E24B4A';
  let brushSize = 18;
  let drawing = false, lastX = 0, lastY = 0;
  let worn = {};                 // slot -> item

  function show(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  // ---------- World selection ----------
  document.querySelectorAll('.world-card').forEach(btn => {
    btn.addEventListener('click', () => {
      world = btn.dataset.world;
      mode = 'color';
      worn = {};
      worldTitle.textContent = CHARACTERS[world].name;
      show('play');
      renderToolbar();
      clearStage();
    });
  });

  document.getElementById('back').addEventListener('click', () => show('home'));

  modeToggle.addEventListener('click', () => {
    mode = (mode === 'color') ? 'dressup' : 'color';
    modeToggle.textContent = (mode === 'color') ? 'Dress up' : 'Color';
    renderToolbar();
    if (mode === 'dressup') { canvas.classList.add('hidden'); dressupLayer.classList.remove('hidden'); renderHero(); }
    else { canvas.classList.remove('hidden'); dressupLayer.classList.add('hidden'); clearStage(); }
  });

  // ---------- Canvas drawing ----------
  function clearStage() { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); }

  function strokeStyleOutline() { ctx.lineWidth = 4; ctx.strokeStyle = '#888780'; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; }

  const SCENES = {
    stage() {
      clearStage(); strokeStyleOutline();
      ctx.strokeRect(40, 250, 280, 90);          // stage floor
      ctx.beginPath(); ctx.moveTo(60, 250); ctx.lineTo(110, 120); ctx.lineTo(160, 250); ctx.stroke(); // spotlight
      ctx.beginPath(); ctx.arc(110, 110, 18, 0, 7); ctx.stroke();  // light
      for (let i = 0; i < 5; i++) { star(70 + i * 55, 60, 14); }
    },
    star() { clearStage(); strokeStyleOutline(); star(180, 190, 90); },
    speaker() {
      clearStage(); strokeStyleOutline();
      ctx.strokeRect(110, 80, 140, 220);
      ctx.beginPath(); ctx.arc(180, 150, 35, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(180, 240, 22, 0, 7); ctx.stroke();
    },
    snowflake() {
      clearStage(); strokeStyleOutline();
      const cx = 180, cy = 190;
      for (let a = 0; a < 6; a++) {
        const ang = a * Math.PI / 3;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * 110, cy + Math.sin(ang) * 110); ctx.stroke();
      }
    },
    mountain() {
      clearStage(); strokeStyleOutline();
      ctx.beginPath(); ctx.moveTo(30, 300); ctx.lineTo(140, 110); ctx.lineTo(220, 300); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(170, 300); ctx.lineTo(260, 150); ctx.lineTo(330, 300); ctx.stroke();
    },
    snowbuddy() {
      clearStage(); strokeStyleOutline();
      ctx.beginPath(); ctx.arc(180, 250, 70, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(180, 150, 50, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(165, 140, 6, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(195, 140, 6, 0, 7); ctx.stroke();
    },
  };

  function star(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = (i % 2 === 0) ? r : r / 2.3;
      const ang = Math.PI / 5 * i - Math.PI / 2;
      const x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.stroke();
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) * (W / r.width), y: (t.clientY - r.top) * (H / r.height) };
  }
  function startDraw(e) { e.preventDefault(); drawing = true; const p = pos(e); lastX = p.x; lastY = p.y; dab(p.x, p.y); }
  function moveDraw(e) {
    if (!drawing) return; e.preventDefault(); const p = pos(e);
    ctx.lineWidth = brushSize; ctx.lineCap = 'round'; ctx.strokeStyle = brushColor;
    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(p.x, p.y); ctx.stroke();
    lastX = p.x; lastY = p.y;
  }
  function dab(x, y) { ctx.fillStyle = brushColor; ctx.beginPath(); ctx.arc(x, y, brushSize / 2, 0, 7); ctx.fill(); }
  function endDraw() { drawing = false; }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  window.addEventListener('mouseup', endDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', moveDraw, { passive: false });
  canvas.addEventListener('touchend', endDraw);

  // ---------- Color helpers ----------
  // Lighten (amt>0) or darken (amt<0) a #rrggbb color. amt in -1..1.
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    r = Math.round((t - r) * p) + r; g = Math.round((t - g) * p) + g; b = Math.round((t - b) * p) + b;
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  // A 4-point "twinkle" sparkle path centered at (cx,cy) with radius r.
  function spark(cx, cy, r) {
    const k = r * 0.22;
    return `M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r}`
         + ` Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r} Z`;
  }

  // ---------- Dress-up hero (original, shaded + animated SVG character) ----------
  function renderHero() {
    const h = CHARACTERS[world].hero;
    const hairColor = worn.hair ? worn.hair.color : h.hair;
    const bodyColor = worn.body ? worn.body.color : h.outfit;
    const isRainbow = hairColor === 'rainbow';

    const hairGrad = isRainbow
      ? `<linearGradient id="hair" gradientUnits="userSpaceOnUse" x1="56" y1="46" x2="144" y2="100">
           <stop offset="0%" stop-color="#E24B4A"/><stop offset="25%" stop-color="#EF9F27"/>
           <stop offset="50%" stop-color="#639922"/><stop offset="75%" stop-color="#378ADD"/>
           <stop offset="100%" stop-color="#D4537E"/>
           <animateTransform attributeName="gradientTransform" type="rotate"
             from="0 100 72" to="360 100 72" dur="7s" repeatCount="indefinite"/>
         </linearGradient>`
      : `<linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stop-color="${shade(hairColor, 0.3)}"/>
           <stop offset="100%" stop-color="${hairColor}"/>
         </linearGradient>`;

    const head = worn.head ? `
      <g class="pop">
        <rect x="60" y="52" width="80" height="15" rx="7.5" fill="${worn.head.color}"/>
        <rect x="60" y="52" width="80" height="6" rx="3" fill="#fff" opacity="0.35"/>
        <path d="${spark(100, 40, 13)}" fill="${shade(worn.head.color, 0.3)}"/>
        <path d="${spark(100, 40, 6)}" fill="#fff" opacity="0.8"/>
      </g>` : '';

    const hand = worn.hand ? `
      <g class="pop">
        <rect x="150" y="150" width="7" height="46" rx="3.5" fill="${shade(worn.hand.color, -0.2)}"/>
        <circle cx="153.5" cy="150" r="14" fill="${worn.hand.color}"/>
        <circle cx="153.5" cy="150" r="14" fill="url(#sheen)"/>
        <circle cx="148" cy="145" r="4" fill="#fff" opacity="0.7"/>
      </g>` : '';

    dressupLayer.innerHTML = `
      <svg viewBox="0 0 200 260" width="100%" style="max-width:300px" class="hero-svg">
        <style>
          .bob { animation: bob 2.8s ease-in-out infinite; }
          @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          .lid { transform-box: fill-box; transform-origin: top; transform: scaleY(0); animation: blink 5s infinite; }
          @keyframes blink { 0%,93%,100% { transform: scaleY(0); } 96% { transform: scaleY(1); } }
          .tw { transform-box: fill-box; transform-origin: center; animation: tw 2.4s ease-in-out infinite; }
          .tw.b { animation-delay: .8s; } .tw.c { animation-delay: 1.5s; }
          @keyframes tw { 0%,100% { opacity:.25; transform: scale(.55) rotate(0deg);} 50% { opacity:1; transform: scale(1.1) rotate(45deg);} }
          .pop { animation: pop .45s cubic-bezier(.34,1.56,.64,1) both; }
          @keyframes pop { 0% { transform: scale(.2); opacity:0;} 100% { transform: scale(1); opacity:1;} }
        </style>
        <defs>
          <radialGradient id="glow" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stop-color="#FFF4D6"/><stop offset="100%" stop-color="#FFF4D6" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${shade(h.skin, 0.18)}"/><stop offset="100%" stop-color="${shade(h.skin, -0.12)}"/>
          </linearGradient>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${shade(bodyColor, 0.25)}"/><stop offset="100%" stop-color="${shade(bodyColor, -0.22)}"/>
          </linearGradient>
          <radialGradient id="sheen" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fff" stop-opacity="0.55"/><stop offset="60%" stop-color="#fff" stop-opacity="0"/>
          </radialGradient>
          ${hairGrad}
        </defs>

        <rect x="2" y="2" width="196" height="256" rx="20" fill="#fff"/>
        <rect x="2" y="2" width="196" height="256" rx="20" fill="url(#glow)"/>
        <ellipse cx="100" cy="242" rx="54" ry="11" fill="#000" opacity="0.08"/>

        <g class="bob">
          <!-- hair (back) -->
          <path d="M52 108 Q46 42 100 42 Q154 42 148 108 Q152 72 100 68 Q48 72 52 108 Z" fill="url(#hair)"/>
          <!-- body -->
          <rect x="68" y="140" width="64" height="84" rx="22" fill="url(#body)"/>
          <rect x="75" y="148" width="12" height="68" rx="6" fill="#fff" opacity="0.18"/>
          <!-- arms -->
          <rect x="46" y="150" width="20" height="56" rx="10" fill="url(#skin)"/>
          <rect x="134" y="150" width="20" height="56" rx="10" fill="url(#skin)"/>
          <!-- neck + head -->
          <rect x="91" y="126" width="18" height="22" rx="6" fill="${shade(h.skin, -0.1)}"/>
          <circle cx="100" cy="100" r="44" fill="url(#skin)"/>
          <!-- hair (front fringe) -->
          <path d="M56 100 Q52 48 100 48 Q148 48 144 100 Q150 70 100 70 Q50 70 56 100 Z" fill="url(#hair)"/>
          <path d="M64 82 Q78 64 100 66" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.35"/>
          <!-- eyes -->
          <ellipse cx="84" cy="102" rx="9.5" ry="11" fill="#fff"/>
          <ellipse cx="116" cy="102" rx="9.5" ry="11" fill="#fff"/>
          <circle cx="85" cy="104" r="6.5" fill="#3A2E2A"/>
          <circle cx="117" cy="104" r="6.5" fill="#3A2E2A"/>
          <circle cx="87.5" cy="101" r="2.6" fill="#fff"/>
          <circle cx="119.5" cy="101" r="2.6" fill="#fff"/>
          <circle cx="82" cy="106" r="1.4" fill="#fff" opacity="0.8"/>
          <circle cx="114" cy="106" r="1.4" fill="#fff" opacity="0.8"/>
          <!-- blinking lids -->
          <path class="lid" d="M74 92 h20 v11 a10 10 0 0 1 -20 0 Z" fill="url(#skin)"/>
          <path class="lid" d="M106 92 h20 v11 a10 10 0 0 1 -20 0 Z" fill="url(#skin)"/>
          <!-- smile -->
          <path d="M83 120 Q100 135 117 120" stroke="#C75B7A" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <!-- cheeks -->
          <circle cx="71" cy="116" r="7" fill="#F49AAC" opacity="0.6"/>
          <circle cx="129" cy="116" r="7" fill="#F49AAC" opacity="0.6"/>
          ${head}
          ${hand}
        </g>

        <!-- twinkling sparkles -->
        <path class="tw"   d="${spark(38, 72, 9)}"  fill="#FFD45E"/>
        <path class="tw b" d="${spark(166, 58, 7)}" fill="#FF9ED2"/>
        <path class="tw c" d="${spark(150, 150, 6)}" fill="#8FD0FF"/>
      </svg>`;
  }

  // ---------- Toolbar (changes per mode) ----------
  function renderToolbar() {
    const cfg = CHARACTERS[world];
    toolbar.innerHTML = '';

    if (mode === 'color') {
      // scene buttons
      const sceneRow = document.createElement('div'); sceneRow.className = 'tool-row';
      cfg.scenes.forEach(s => {
        const b = document.createElement('button'); b.className = 'tool-btn'; b.textContent = sceneLabel(s);
        b.onclick = () => SCENES[s]();
        sceneRow.appendChild(b);
      });
      const blank = document.createElement('button'); blank.className = 'tool-btn'; blank.textContent = '✏️ Blank';
      blank.onclick = clearStage; sceneRow.appendChild(blank);
      toolbar.appendChild(sceneRow);

      // color swatches
      const palRow = document.createElement('div'); palRow.className = 'tool-row';
      cfg.palette.forEach((c, i) => {
        const sw = document.createElement('button'); sw.className = 'swatch'; sw.style.background = c;
        if (i === 0) { sw.classList.add('active'); brushColor = c; }
        sw.onclick = () => { brushColor = c; palRow.querySelectorAll('.swatch').forEach(x => x.classList.remove('active')); sw.classList.add('active'); };
        palRow.appendChild(sw);
      });
      toolbar.appendChild(palRow);

      // brush sizes + erase + clear
      const ctrlRow = document.createElement('div'); ctrlRow.className = 'tool-row';
      [['Small', 8], ['Medium', 18], ['Big', 34]].forEach(([label, size]) => {
        const b = document.createElement('button'); b.className = 'tool-btn'; b.textContent = label;
        if (size === 18) b.classList.add('active');
        b.onclick = () => { brushSize = size; ctrlRow.querySelectorAll('.tool-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); };
        ctrlRow.appendChild(b);
      });
      toolbar.appendChild(ctrlRow);

    } else {
      // dress-up wardrobe
      const grid = document.createElement('div'); grid.className = 'wardrobe-grid';
      cfg.wardrobe.forEach(item => {
        const b = document.createElement('button'); b.className = 'ward-item'; b.textContent = item.label;
        b.onclick = () => { worn[item.slot] = item; renderHero(); };
        grid.appendChild(b);
      });
      const reset = document.createElement('button'); reset.className = 'ward-item'; reset.textContent = '🔄 Reset';
      reset.onclick = () => { worn = {}; renderHero(); };
      grid.appendChild(reset);
      toolbar.appendChild(grid);
    }
  }

  function sceneLabel(s) {
    const labels = { stage: '🎤 Stage', star: '⭐ Star', speaker: '🔊 Speaker',
      snowflake: '❄️ Flake', mountain: '⛰️ Mountain', snowbuddy: '☃️ Buddy' };
    return labels[s] || s;
  }
})();
