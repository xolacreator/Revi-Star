#!/usr/bin/env node
// Regenerates tools/voice/lines.json: keeps the hand-authored "core" lines and (re)builds the
// gameplay batches (letters, ...) from the same banks/templates the game uses, so ids + texts match.
// Run: node tools/voice/build-lines.mjs
import { readFile, writeFile } from 'node:fs/promises';

// ---- mirror of the in-game banks/templates (keep identical to a1.js) ----
const LETTERBANK=[['S','sss','sun'],['M','mmm','moon'],['T','tuh','top'],['F','fff','fish'],['B','buh','bee'],['N','nnn','net'],['P','puh','pig'],['D','duh','dog'],['L','lll','leaf'],['R','rrr','red'],['C','kuh','cat'],['H','huh','hat'],['G','guh','goat'],['K','kuh','kite'],['V','vvv','van'],['W','wuh','web'],['Z','zzz','zip'],['J','juh','jam']];
const TRSET=['S','C','O','U','A','M','N','I','L','T'], TRBANK=LETTERBANK.filter(e=>TRSET.includes(e[0]));
const vSound=L=>`Which letter says ${L[1]}, like ${L[2]}?`;
const vTrace=L=>`${L[1]}. Trace the ${L[0]} with your finger!`;
const phId=p=>'ph_'+p.replace(/[^a-z]/gi,'');

const NARR='narrator';
const letters=[];
const seen=new Set();
for(const L of LETTERBANK){
  const pid=phId(L[1]); if(!seen.has(pid)){ seen.add(pid); letters.push({id:pid,character:NARR,text:L[1],batch:'letters'}); } // phoneme tap
  letters.push({id:'q_snd_'+L[0].toLowerCase(),character:NARR,text:vSound(L),batch:'letters'});                              // "Which letter says…"
}
for(const L of TRBANK) letters.push({id:'q_trace_'+L[0].toLowerCase(),character:NARR,text:vTrace(L),batch:'letters'});         // "… Trace the X…"

// ---- merge: keep everything except previously-built 'letters', then append fresh ----
const doc=JSON.parse(await readFile('tools/voice/lines.json','utf8'));
const kept=doc.lines.filter(l=>l.batch!=='letters');
doc.lines=[...kept,...letters];
await writeFile('tools/voice/lines.json', JSON.stringify(doc,null,2)+'\n');
console.log(`lines.json: ${kept.length} kept + ${letters.length} letters = ${doc.lines.length} total`);
