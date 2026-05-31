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

  // ---------- Dress-up hero (original SVG character) ----------
  function renderHero() {
    const h = CHARACTERS[world].hero;
    const hairColor = worn.hair ? worn.hair.color : h.hair;
    const bodyColor = worn.body ? worn.body.color : h.outfit;
    const hairFill = (hairColor === 'rainbow') ? 'url(#rainbow)' : hairColor;

    dressupLayer.innerHTML = `
      <svg viewBox="0 0 200 240" width="100%" style="max-width:300px">
        <defs>
          <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E24B4A"/><stop offset="25%" stop-color="#EF9F27"/>
            <stop offset="50%" stop-color="#639922"/><stop offset="75%" stop-color="#378ADD"/>
            <stop offset="100%" stop-color="#D4537E"/>
          </linearGradient>
        </defs>
        <!-- body -->
        <rect x="70" y="140" width="60" height="80" rx="20" fill="${bodyColor}"/>
        <!-- arms -->
        <rect x="48" y="150" width="20" height="55" rx="10" fill="${h.skin}"/>
        <rect x="132" y="150" width="20" height="55" rx="10" fill="${h.skin}"/>
        <!-- head -->
        <circle cx="100" cy="100" r="42" fill="${h.skin}"/>
        <!-- hair -->
        <path d="M58 95 Q60 48 100 48 Q140 48 142 95 Q120 72 100 72 Q80 72 58 95 Z" fill="${hairFill}"/>
        <!-- eyes -->
        <circle cx="86" cy="100" r="7" fill="#2C2C2A"/>
        <circle cx="114" cy="100" r="7" fill="#2C2C2A"/>
        <circle cx="88" cy="98" r="2.5" fill="#fff"/>
        <circle cx="116" cy="98" r="2.5" fill="#fff"/>
        <!-- smile -->
        <path d="M86 118 Q100 130 114 118" stroke="#B5476A" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- cheeks -->
        <circle cx="74" cy="112" r="6" fill="#F4A9B8" opacity="0.7"/>
        <circle cx="126" cy="112" r="6" fill="#F4A9B8" opacity="0.7"/>
        ${worn.head ? `<rect x="66" y="52" width="68" height="14" rx="7" fill="${worn.head.color}"/>
          <polygon points="100,30 106,48 94,48" fill="${worn.head.color}"/>` : ''}
        ${worn.hand ? `<circle cx="152" cy="150" r="12" fill="${worn.hand.color}"/>
          <rect x="148" y="150" width="8" height="40" rx="4" fill="${worn.hand.color}"/>` : ''}
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
