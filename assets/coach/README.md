# Learning-screen coach art (optional)

Drop character portraits here to replace the drawn cartoon face that appears in the
top-left during learning activities. If no files are present, the game draws Rumi
automatically — so this is purely an upgrade.

## Files (PNG, square, transparent background recommended)
- `rumi.png` — **required** to switch on images. The default/neutral "smile" face.
- `rumi-cheer.png` — *optional.* Shown when the child answers correctly.
- `rumi-think.png` — *optional.* Shown on a hint or a miss.

If only `rumi.png` exists, it's used for all three states.

## Size / framing
- ~**512×512 px**, head-and-shoulders, centered. It's displayed in a small circle
  (~74 px) so keep the face large and roughly centered; corners get cropped.
- Keep file size small (a few hundred KB each) so the panel loads instantly.

## Multi-character guides (live)
All three guides are wired and **rotate each day**: days 1–3 are Rumi (her onboarding
story), then it cycles **Mira → Zoey → Rumi → …** day by day. Each uses `<name>.png` +
optional `<name>-cheer.png` / `<name>-think.png`. Override for testing with
`?coach=rumi|mira|zoey` in the URL. The in-world NPC matches the day's guide.
Currently present: rumi, mira, zoey (smile/cheer/think each).
