#!/usr/bin/env node
// Regenerates tools/voice/lines.json: keeps the hand-authored "core" lines and (re)builds the
// gameplay batches (letters, ...) from the same banks/templates the game uses, so ids + texts match.
// Run: node tools/voice/build-lines.mjs
import { readFile, writeFile } from 'node:fs/promises';

// ---- mirror of the in-game banks/templates (keep identical to a1.js) ----
const LETTERBANK=[['S','sss','sun'],['M','mmm','moon'],['T','tuh','top'],['F','fff','fish'],['B','buh','bee'],['N','nnn','net'],['P','puh','pig'],['D','duh','dog'],['L','lll','leaf'],['R','rrr','red'],['C','kuh','cat'],['H','huh','hat'],['G','guh','goat'],['K','kuh','kite'],['V','vvv','van'],['W','wuh','web'],['Z','zzz','zip'],['J','juh','jam']];
const SIGHTBANK=[['cat','🐱','dog','sun'],['dog','🐶','cat','bus'],['sun','☀️','net','pig'],['red','🔴','mom','big'],['pig','🐷','bus','hat'],['bus','🚌','red','net'],['hat','🎩','dog','sun'],['mom','👩','big','net'],['big','🔵','pig','bus'],['net','🥅','cat','mom'],['box','📦','fox','dog'],['fox','🦊','box','sun']];
const TRSET=['S','C','O','U','A','M','N','I','L','T'], TRBANK=LETTERBANK.filter(e=>TRSET.includes(e[0]));
const vSound=L=>`Which letter says ${L[1]}, like ${L[2]}?`;
const vTrace=L=>`${L[1]}. Trace the ${L[0]} with your finger!`;
const vWord=w=>`Which word says ${w}?`;
const vFirst=L=>`What sound does ${L[2]} start with? ${L[1]}, ${L[1]}, ${L[2]}.`;
const phId=p=>'ph_'+p.replace(/[^a-z]/gi,'');
const NARR='narrator';

const letters=[]; const seen=new Set();
for(const L of LETTERBANK){
  const pid=phId(L[1]); if(!seen.has(pid)){ seen.add(pid); letters.push({id:pid,character:NARR,text:L[1],batch:'letters'}); } // phoneme tap
  letters.push({id:'q_snd_'+L[0].toLowerCase(),character:NARR,text:vSound(L),batch:'letters'});                              // "Which letter says…"
}
for(const L of TRBANK) letters.push({id:'q_trace_'+L[0].toLowerCase(),character:NARR,text:vTrace(L),batch:'letters'});         // "… Trace the X…"

const words=[];
for(const S of SIGHTBANK) words.push({id:'q_word_'+S[0],character:NARR,text:vWord(S[0]),batch:'words'});                       // "Which word says…"
for(const w of [...new Set(SIGHTBANK.flatMap(S=>[S[0],S[2],S[3]]))]) words.push({id:'word_'+w,character:NARR,text:w,batch:'words'}); // word tap
for(const L of LETTERBANK) words.push({id:'q_first_'+L[2],character:NARR,text:vFirst(L),batch:'words'});                       // "What sound does X start with?"

// ---- merge: keep core + other batches, replace rebuilt ones ----
const doc=JSON.parse(await readFile('tools/voice/lines.json','utf8'));
const kept=doc.lines.filter(l=>l.batch!=='letters' && l.batch!=='words');
doc.lines=[...kept,...letters,...words];
await writeFile('tools/voice/lines.json', JSON.stringify(doc,null,2)+'\n');
console.log(`lines.json: ${kept.length} kept + ${letters.length} letters + ${words.length} words = ${doc.lines.length} total`);
