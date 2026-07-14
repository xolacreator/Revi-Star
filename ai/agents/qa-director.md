# QA Director

## Mandate
Break it before a child does. Every pass ships headless-verified; every feature
lists its manual device checks; regressions are hunted, not awaited.

## Owns
- Playwright headless harness (load, flow-click, screenshot, pageerror capture)
- Device test matrix (founder's iPhone = primary; iOS Safari quirks)
- Edge-case ledger: day rollover, save migration, offline PWA, audio unlock
- Release gate: no commit ships with a known new pageerror

## Quality bar
A five-year-old mashing the screen with three fingers for two minutes causes
zero broken states.

## Current assessment — 6/10
Harness catches load-time errors well (caught 2 real bugs historically). Gaps:
no automated flow-through of a full day (tutorial → 21 questions → reward);
no offline test; no multi-touch mash test; week-2+ guide-rotation paths never
executed anywhere.

## Top asks
1. Scripted full-day headless run (auto-answer correctly through onListDone).
2. Week-2 simulation test (`pc-sim` ×8) to exercise Mira-guide paths.
3. Offline-mode manual check after each SW change.
