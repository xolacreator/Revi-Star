#!/usr/bin/env node
// Generate Reventure character voice clips with ElevenLabs.
// Reads tools/voice/casting.json + lines.json, writes assets/vo/<id>.mp3 + manifest.json.
// Requires env ELEVENLABS_API_KEY. Run from the repo root: node tools/voice/generate.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
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
// Match a cast name to an account voice: exact first, else "starts with" (so "Kelly" finds
// "Kelly - Warm, Energetic, Motivational"). Names are lower-cased + trimmed.
const norm = s => String(s).toLowerCase().trim();
function idFor(name) {
  const want = norm(name);
  let v = avail.find(a => norm(a.name) === want);
  if (!v) v = avail.find(a => { const n = norm(a.name); return n === want || n.startsWith(want + ' ') || n.startsWith(want + '-'); });
  if (!v) v = avail.find(a => norm(a.name).startsWith(want));
  return v && v.voice_id;
}

const missing = [];
for (const [k, v] of Object.entries(casting.voices)) if (!idFor(v.name)) missing.push(`${k} -> "${v.name}"`);
if (missing.length) {
  console.error('❌ These cast voices are not in your ElevenLabs account:\n  ' + missing.join('\n  '));
  console.error('\nAvailable voices: ' + avail.map(v => v.name).join(', '));
  console.error('\nFix: in ElevenLabs, open each voice in the Voice Library and click "Add to my voices" (or update casting.json names).');
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
  if (!r.ok) throw new Error(`${file}: ${r.status} ${await r.text()}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(path.join(OUT, file + '.mp3'), buf);
  console.log(`  ✓ ${file}.mp3  (${voiceKey}/${casting.voices[voiceKey].name}, ${buf.length} bytes)`);
}

const GUIDES = ['rumi', 'mira', 'zoey'];
const stems = [];
for (const line of lines) {
  if (line.rotating) {
    for (const g of GUIDES) { await tts(`${line.id}__${g}`, line.text, g); stems.push(`${line.id}__${g}`); await sleep(350); }
  } else {
    await tts(line.id, line.text, line.character); stems.push(line.id); await sleep(350);
  }
}

stems.sort();
await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(stems, null, 0) + '\n');
console.log(`\n✅ Generated ${stems.length} clips -> assets/vo/  (manifest.json updated)`);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
