#!/usr/bin/env node
// Generate Reventure character voice clips with ElevenLabs.
// Reads tools/voice/casting.json + lines.json, writes assets/vo/<id>.mp3 + manifest.json.
// Requires env ELEVENLABS_API_KEY. Run from the repo root: node tools/voice/generate.mjs
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const API = 'https://api.elevenlabs.io/v1';
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error('❌ Missing ELEVENLABS_API_KEY'); process.exit(1); }

const casting = JSON.parse(await readFile('tools/voice/casting.json', 'utf8'));
const { lines } = JSON.parse(await readFile('tools/voice/lines.json', 'utf8'));
const OUT = path.resolve('assets/vo');
await mkdir(OUT, { recursive: true });

// 1) Resolve voice names -> ids from the account's voice list
const res = await fetch(`${API}/voices`, { headers: { 'xi-api-key': KEY } });
if (!res.ok) { console.error('❌ Could not list voices:', res.status, await res.text()); process.exit(1); }
const avail = (await res.json()).voices || [];
// Only "premade" (built-in default) voices work via the API on a free plan. Library voices
// require a paid plan, so we match against premade only.
const premade = avail.filter(v => v.category === 'premade');
const pool = premade.length ? premade : avail;
// Match a cast name: exact first, else "starts with" (so "Jessica" finds "Jessica - Playful, Bright, Warm").
const norm = s => String(s).toLowerCase().trim();
function idFor(name) {
  const want = norm(name);
  let v = pool.find(a => norm(a.name) === want);
  if (!v) v = pool.find(a => { const n = norm(a.name); return n === want || n.startsWith(want + ' ') || n.startsWith(want + '-'); });
  if (!v) v = pool.find(a => norm(a.name).startsWith(want));
  return v && v.voice_id;
}

const missing = [];
for (const [k, v] of Object.entries(casting.voices)) if (!idFor(v.name)) missing.push(`${k} -> "${v.name}"`);
if (missing.length) {
  console.error('❌ These cast voices are not available as PREMADE (free-API) voices:\n  ' + missing.join('\n  '));
  console.error('\nAvailable premade (free) voices: ' + pool.map(v => v.name).join(', '));
  console.error('\nFix: update tools/voice/casting.json to use names from the list above.');
  process.exit(1);
}

const settingsFor = key => {
  const v = casting.voices[key]; const d = casting.defaults;
  return {
    stability: v.stability ?? d.stability,
    similarity_boost: v.similarity_boost ?? d.similarity_boost,
    style: v.style ?? d.style,
    use_speaker_boost: v.use_speaker_boost ?? d.use_speaker_boost,
  };
};

async function tts(file, text, voiceKey) {
  const voiceId = idFor(casting.voices[voiceKey].name);
  const r = await fetch(`${API}/text-to-speech/${voiceId}?output_format=${casting.format}`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: casting.model, voice_settings: settingsFor(voiceKey) }),
  });
  if (r.status === 402 || r.status === 429) { throw new Error(`QUOTA ${r.status}: ${(await r.text()).slice(0,300)}`); }
  if (!r.ok) throw new Error(`${file}: ${r.status} ${await r.text()}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(path.join(OUT, file + '.mp3'), buf);
  console.log(`  ✓ ${file}.mp3  (${voiceKey}/${casting.voices[voiceKey].name}, ${buf.length} bytes)`);
}

// Optional batching: VO_BATCH=letters|words|blend|check|core|all (default all).
// Lines with no "batch" are treated as "core". Lets us spread generation across runs.
const BATCH = (process.env.VO_BATCH || 'all').trim();
const selected = lines.filter(l => BATCH === 'all' || (l.batch || 'core') === BATCH);
console.log(`Batch "${BATCH}": ${selected.length} of ${lines.length} lines`);

const GUIDES = ['rumi', 'mira', 'zoey'];
const FORCE = !!process.env.VO_FORCE; // set VO_FORCE=1 to re-render existing clips
const have = new Set((await readdir(OUT)).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));
const stems = []; let made = 0, skipped = 0;
async function maybe(file, text, voiceKey) {
  if (!FORCE && have.has(file)) { skipped++; stems.push(file); return; } // already generated — skip to save quota
  await tts(file, text, voiceKey); stems.push(file); made++; await sleep(350);
}
let stopped = null;
try {
  for (const line of selected) {
    if (line.rotating) { for (const g of GUIDES) await maybe(`${line.id}__${g}`, line.text, g); }
    else await maybe(line.id, line.text, line.character);
  }
} catch (e) { stopped = e; }
console.log(`Generated ${made} new clip(s), skipped ${skipped} existing.${FORCE ? ' (FORCE on)' : ''}`);
if (stopped) {
  console.error('\n⚠️ Stopped early: ' + stopped.message);
  if (/QUOTA|quota|402|429|credit|limit/i.test(stopped.message))
    console.error('Looks like the ElevenLabs monthly quota was hit. The clips made so far ARE saved & committed — just re-run later (it resumes via skip-existing), or upgrade the plan to finish in one go.');
}
// Always update the manifest from disk so committed clips are usable, even on a partial run.
const onDisk = (await readdir(OUT)).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();
await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(onDisk, null, 0) + '\n');
console.log(`\n✅ ${made} new clip(s) this run. Manifest now lists ${onDisk.length} total.${stopped ? ' (partial — re-run to continue)' : ''}`);
process.exit(0); // exit 0 so progress is committed even when we stop early

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
