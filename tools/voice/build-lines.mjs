#!/usr/bin/env node
// Regenerates tools/voice/lines.json: keeps the hand-authored "core" lines and (re)builds the
// gameplay batches (letters, ...) from the same banks/templates the game uses, so ids + texts match.
// Run: node tools/voice/build-lines.mjs
import { readFile, writeFile } from 'node:fs/promises';

// ---- mirror of the in-game banks/templates (keep identical to a1.js) ----
const LETTERBANK=[['S','sss','sun'],['M','mmm','moon'],['T','tuh','top'],['F','fff','fish'],['B','buh','bee'],['N','nnn','net'],['P','puh','pig'],['D','duh','dog'],['L','lll','leaf'],['R','rrr','red'],['C','kuh','cat'],['H','huh','hat'],['G','guh','goat'],['K','kuh','kite'],['V','vvv','van'],['W','wuh','web'],['Z','zzz','zip'],['J','juh','jam'],['A','aah','apple'],['E','eh','egg'],['I','ih','igloo'],['O','awe','octopus'],['U','uh','umbrella']];
const SIGHTBANK=[['cat','🐱','dog','sun'],['dog','🐶','cat','bus'],['sun','☀️','net','pig'],['red','🔴','mom','big'],['pig','🐷','bus','hat'],['bus','🚌','red','net'],['hat','🎩','dog','sun'],['mom','👩','big','net'],['big','🔵','pig','bus'],['net','🥅','cat','mom'],['box','📦','fox','dog'],['fox','🦊','box','sun'],['hen','🐔','dog','cat'],['top','🔝','net','sun'],['bug','🐛','box','pig'],['cup','☕','bus','mom'],['bed','🛏️','red','dog'],['van','🚐','fox','sun'],['jam','🍓','big','net'],['map','🗺️','mom','cat'],['fan','🪭','pig','box'],['rug','🧶','red','bus']];
const PH={a:'aah',e:'eh',i:'ih',o:'awe',u:'uh',b:'buh',c:'cuh',d:'duh',f:'fff',g:'guh',h:'huh',j:'juh',k:'kuh',l:'lll',m:'mmm',n:'nnn',p:'puh',r:'rrr',s:'sss',t:'tuh',v:'vvv',w:'wuh',x:'ks',y:'yuh',z:'zzz'};
const CVCWORDS=['cat','sun','dog','pig','hen','bed','top','bug','map','fan','net','cup','box','log','mop','jam','ten','rug','van','web','zip','rat','mat','sit','hop','fox','bat','pen','cub','gum','hut','lip','nut','wet','kid','mud','jet','gem','fin','pup','tag','win','dig','lid','pot','dot','fit','rib','bin'];
const RHYMETARGETS=['cat','bat','dog','pig','hen','top','bug','box','fan','rat','bed','mat','hop','hut','pen','cup','sit','net','win','pot'];
const vRhyme=w=>`What rhymes with ${w}?`;
const vCase=L=>`Find the little letter that says ${L[1]}!`;
const vLast=w=>`What sound does ${w} end with?`;
const LASTWORDS=CVCWORDS.filter(w=>'SMTFBNPDLRCHGKVWZJ'.includes(w.slice(-1).toUpperCase()));
const vSight=w=>`Tap the word — ${w}.`;
const SIGHTWORDS=[['the','and','to'],['and','the','it'],['is','in','it'],['to','go','so'],['in','it','is'],['it','in','at'],['you','we','my'],['my','me','we'],['see','we','me'],['we','me','he'],['go','so','up'],['up','at','on'],['at','on','in'],['on','at','up'],['can','me','he'],['he','we','me']];
const VOWELS=[['A','aah'],['E','eh'],['I','ih'],['O','awe'],['U','uh']];
const FAMILYBANK=[['at','cat','bus','pig'],['ig','pig','hat','sun'],['un','sun','cat','bed'],['og','dog','net','cup'],['en','hen','map','bug'],['op','top','fan','rat'],['ug','bug','pen','lid'],['ed','bed','fox','jam'],['an','fan','dog','tip'],['ap','map','hen','rug']];
const DIGRAPHBANK=[['sh','shh','ship'],['ch','chh','chick'],['th','thh','thumb'],['wh','wh','whale']];
const SYLLBANK=[['rabbit',2],['tiger',2],['apple',2],['butterfly',3],['banana',3],['pencil',2],['elephant',3],['flower',2],['dinosaur',3],['cookie',2]];
const vMiddle=w=>`What sound is in the middle of ${w}?`;
const vFamily=r=>`Which word ends with ${r}?`;
const vDigraph=D=>`Which two letters say ${D[1]}, like ${D[2]}?`;
const vSyll=w=>`How many parts do you hear in ${w}?`;
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

const rhyme=[]; // rhyme prompts; the option words reuse existing word_ clips
for(const w of RHYMETARGETS) push(rhyme,'q_rhyme_'+w,vRhyme(w),'rhyme');

const kase=[]; // uppercase->lowercase prompts (one per letter); option taps reuse phoneme clips
for(const L of LETTERBANK) push(kase,'q_case_'+L[0].toLowerCase(),vCase(L),'case');

const last=[]; // ending-sound prompts; option taps reuse phoneme clips
for(const w of LASTWORDS) push(last,'q_last_'+w,vLast(w),'last');

const sight=[]; // high-frequency word recognition: prompt + the function words themselves
for(const W of SIGHTWORDS){ push(sight,'q_sight_'+W[0],vSight(W[0]),'sight'); for(const w of W) push(sight,'word_'+w,w,'sight'); }

const check=[]; // pig/red questions reuse existing q_word_ clips, so they're omitted here
push(check,'chk_intro',"Let's play Twinkle's Star Check! Just try your best — it's only for fun.",'check');
push(check,'chk_q1','Which letter says mmm?','check');
push(check,'chk_q2','What sound does leaf start with?','check');
push(check,'chk_q5','What rhymes with cat?','check');
push(check,'chk_q6','Which letter says tuh?','check');

// "extra" batch: narration that was previously on the device voice (now clipped so nothing is silent).
const R='rumi', N='narrator';
const extra=[
  ['xtra_grew', N, 'Wow, Revvy Star! You grew today! Look how brightly you shine!'],
  ['xtra_lookatyou', N, 'Look at you, Revvy Star!'],
  ['xtra_thisone', N, "This one! Let's tap it together!"],
  ['xtra_startry', N, "Great trying! You're a reading star!"],
  ['xtra_day1', R, 'Amazing reading, Revvy Star! The lighthouse is shining, and the Gloomling became a happy Star Pal. Tap your new friend!'],
  ['xtra_day2', R, 'Wonderful, Revvy Star! Look, Twinkle is glowing, almost ready to evolve tomorrow!'],
  ['explore_new', N, "Let's find today's adventure!"],
  ['explore_first', N, 'Follow the sparkles!'],
  ['tip_0', N, 'Tap the ground, or hold and drag, to walk with me!'],
  ['tip_1', N, 'Look for the glowing star and listen for its sound!'],
  ['tip_2', N, "You're doing amazing. Sound it out, nice and slow."],
  ['tip_3', N, 'Tap Twinkle to say hello!'],
  ['tip_4', N, 'Every sound you learn makes you shine brighter!'],
  ['greet_g0', N, "You're back! Let's keep our reading streak glowing!"],
  ['greet_g1', N, 'Another day, another adventure in Harmony Harbor!'],
  ['greet_g2', N, 'Twinkle missed you! Ready to read together?'],
  ['greet_g3', N, 'The harbor shines brighter every day you read!'],
  ['greet_g4', N, "Let's find new sounds and words today!"],
  ['tease_d1', N, 'Tomorrow, help read the harbor signs, and find Twinkle a brand-new look!'],
  ['tease_d2', N, 'Tomorrow, blend sounds to read a whole word, and Twinkle will evolve!'],
  ['tease_d3', N, 'You played three days in a row! More adventures are coming soon.'],
  ['tease_more', N, 'Come back tomorrow for more sounds, words, and sparkles!'],
  ['tease_wk3', N, "Three whole weeks of reading! You're a true Star Hunter!"],
].map(([id,character,text])=>({id,character,text,batch:'extra'}));

const middle=[];
for(const w of CVCWORDS){ push(middle,'q_mid_'+w,vMiddle(w),'middle'); }
for(const v of VOWELS) push(middle,phId(v[1]),v[1],'middle');

const family=[];
for(const F of FAMILYBANK){ push(family,'q_fam_'+F[0],vFamily(F[0]),'family'); for(const w of [F[1],F[2],F[3]]) push(family,'word_'+w,w,'family'); }

const digraph=[];
for(const D of DIGRAPHBANK){ push(digraph,'q_dig_'+D[0],vDigraph(D),'digraph'); push(digraph,'dg_'+D[0],D[1],'digraph'); }

const syll=[];
for(const S of SYLLBANK){ push(syll,'q_syl_'+S[0],vSyll(S[0]),'syll'); push(syll,'word_'+S[0],S[0],'syll'); }
for(const n of ['1','2','3']) push(syll,'num_'+n,n,'syll');

// ---- AudioBible packs: shop voice (Zoey), mission intros + celebrations (rotating guides), goodnight ----
const shop=[
  ['shop_welcome','Welcome to the Star Shop!'],['shop_thanks1','Ooh, great pick!'],
  ['shop_thanks2','Enjoy it, superstar!'],['shop_deny','Almost! Read a little more to earn more stars!'],
  ['shop_item_fireworks','A firework show!'],['shop_item_trail','A sparkle trail!'],
  ['shop_item_balloons','Party balloons!'],['shop_item_bow','A bow for Twinkle!'],
  ['shop_bye','Come back soon!'],['shop_equip','Looking great!'],
].map(([id,text])=>({id,character:'zoey',text,batch:'shop'}));

const mission=[
  ['mis_letters','The harbor signs lost their letters. Help me find them!'],
  ['mis_sounds','Listen close. The sounds are hiding today!'],
  ['mis_words','The bakery orders are all mixed up. Read them with me!'],
  ['mis_rhyme','The Music Hall needs rhymes for tonight song!'],
  ['mis_blend','Let us stretch sounds together until they make a word!'],
  ['mis_sight','Quick words light the lighthouse fastest. Ready?'],
  ['cel_7','Seven stars already? You are on fire!'],
  ['cel_14','Halfway, superstar!'],
  ['cel_18','Just three to go. You have got this!'],
  ['cel_a','Wow, look at all those stars!'],
  ['cel_b','You are shining brighter and brighter!'],
  ['cel_c','Keep going, reading star!'],
].map(([id,text])=>({id,character:'rumi',text,batch:'mission',rotating:true}));

const night=[
  ['night_1','The harbor is getting sleepy. Great reading today.'],
  ['night_2','The stars will wait for you. Goodnight, Star Hunter.'],
].map(([id,text])=>({id,character:NARR,text,batch:'night'}));

// ---- merge: keep core, replace rebuilt gameplay batches ----
const doc=JSON.parse(await readFile('tools/voice/lines.json','utf8'));
const kept=doc.lines.filter(l=>!['letters','words','blend','rhyme','case','last','sight','check','extra','middle','family','digraph','syll','shop','mission','night'].includes(l.batch));
doc.lines=[...kept,...letters,...words,...blend,...rhyme,...kase,...last,...sight,...check,...extra,...middle,...family,...digraph,...syll,...shop,...mission,...night];
await writeFile('tools/voice/lines.json', JSON.stringify(doc,null,2)+'\n');
console.log(`+new: ${middle.length} middle, ${family.length} family, ${digraph.length} digraph, ${syll.length} syll, ${shop.length} shop, ${mission.length} mission, ${night.length} night`);
console.log(`lines.json: ${kept.length} kept + ${letters.length} L + ${words.length} W + ${blend.length} blend + ${rhyme.length} rhyme + ${kase.length} case + ${last.length} last + ${sight.length} sight + ${check.length} check + ${extra.length} extra = ${doc.lines.length} total`);
