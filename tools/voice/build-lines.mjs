#!/usr/bin/env node
// Regenerates tools/voice/lines.json: keeps the hand-authored "core" lines and (re)builds the
// gameplay batches (letters, ...) from the same banks/templates the game uses, so ids + texts match.
// Run: node tools/voice/build-lines.mjs
import { readFile, writeFile } from 'node:fs/promises';

// ---- mirror of the in-game banks/templates (keep identical to a1.js) ----
const LETTERBANK=[['S','sss','sun'],['M','mmm','moon'],['T','tuh','top'],['F','fff','fish'],['B','buh','bee'],['N','nnn','net'],['P','puh','pig'],['D','duh','dog'],['L','lll','leaf'],['R','rrr','red'],['C','kuh','cat'],['H','huh','hat'],['G','guh','goat'],['K','kuh','kite'],['V','vvv','van'],['W','wuh','web'],['Z','zzz','zip'],['J','juh','jam']];
const SIGHTBANK=[['cat','🐱','dog','sun'],['dog','🐶','cat','bus'],['sun','☀️','net','pig'],['red','🔴','mom','big'],['pig','🐷','bus','hat'],['bus','🚌','red','net'],['hat','🎩','dog','sun'],['mom','👩','big','net'],['big','🔵','pig','bus'],['net','🥅','cat','mom'],['box','📦','fox','dog'],['fox','🦊','box','sun']];
const PH={a:'aah',e:'eh',i:'ih',o:'awe',u:'uh',b:'buh',c:'cuh',d:'duh',f:'fff',g:'guh',h:'huh',j:'juh',k:'kuh',l:'lll',m:'mmm',n:'nnn',p:'puh',r:'rrr',s:'sss',t:'tuh',v:'vvv',w:'wuh',x:'ks',y:'yuh',z:'zzz'};
const CVCWORDS=['cat','sun','dog','pig','hen','bed','top','bug','map','fan','net','cup','box','log','mop','jam','ten','rug','van','web','zip'];
const TRSET=['S','C','O','U','A','M','N','I','L','T'], TRBANK=LETTERBANK.filter(e=>TRSET.includes(e[0]));
const vSound=L=>`Which letter says ${L[1]}, like ${L[2]}?`;
const vTrace=L=>`${L[1]}. Trace the ${L[0]} with your finger!`;
const vWord=w=>`Which word says ${w}?`;
const vFirst=L=>`What sound does ${L[2]} start with? ${L[1]}, ${L[1]}, ${L[2]}.`;
const vBlend=w=>`Tap the sounds in order. ${w.split('').join('… ')}… ${w}!`;
const phId=p=>'ph_'+p.replace(/[^a-z]/gi,'');
const NARR='narrator';
const all=new Set(); // ids already produced (avoid re-rendering across batches)
const push=(arr,id,text,batch)=>{ if(all.has(id))return; all.add(id); arr.push({id,character:NARR,text,batch}); };

const letters=[];
for(const L of LETTERBANK){ push(letters,phId(L[1]),L[1],'letters'); push(letters,'q_snd_'+L[0].toLowerCase(),vSound(L),'letters'); }
for(const L of TRBANK) push(letters,'q_trace_'+L[0].toLowerCase(),vTrace(L),'letters');

const words=[];
for(const S of SIGHTBANK) push(words,'q_word_'+S[0],vWord(S[0]),'words');
for(const w of [...new Set(SIGHTBANK.flatMap(S=>[S[0],S[2],S[3]]))]) push(words,'word_'+w,w,'words');
for(const L of LETTERBANK) push(words,'q_first_'+L[2],vFirst(L),'words');

const blend=[];
for(const w of CVCWORDS){ push(blend,'q_blend_'+w,vBlend(w),'blend'); push(blend,'word_'+w,w,'blend'); for(const ch of w.split('')){ const p=PH[ch]||ch; push(blend,phId(p),p,'blend'); } }

const check=[]; // pig/red questions reuse existing q_word_ clips, so they're omitted here
push(check,'chk_intro',"Let's play Twinkle's Star Check! Just try your best — it's only for fun.",'check');
push(check,'chk_q1','Which letter says mmm?','check');
push(check,'chk_q2','What sound does leaf start with?','check');
push(check,'chk_q5','What rhymes with cat?','check');
push(check,'chk_q6','Which letter says tuh?','check');

// ---- merge: keep core, replace rebuilt gameplay batches ----
const doc=JSON.parse(await readFile('tools/voice/lines.json','utf8'));
const kept=doc.lines.filter(l=>!['letters','words','blend','check'].includes(l.batch));
doc.lines=[...kept,...letters,...words,...blend,...check];
await writeFile('tools/voice/lines.json', JSON.stringify(doc,null,2)+'\n');
console.log(`lines.json: ${kept.length} kept + ${letters.length} letters + ${words.length} words + ${blend.length} blend + ${check.length} check = ${doc.lines.length} total`);
