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

## Other characters (later)
The loader currently uses `rumi`. When we let other characters guide a session
(Mira / Zoey), we'll add `mira.png` / `zoey.png` here and select by the engaged
character. Just say the word and I'll wire the switch.
