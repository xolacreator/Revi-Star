# Doodle Stars ⭐

A bright, touch-friendly **coloring & dress-up** game for kids (ages 5–8).
No accounts, no ads, no data collection — just open it and play.

The cast is made of **original characters** that capture the *spirit* of
glam pop-star energy and magical winter, without copying any specific
copyrighted character. Rename and recolor them freely (see below).

## Worlds

| World | Mascot | Coloring scenes | Dress-up |
| ----- | ------ | --------------- | -------- |
| 🎤 Pop Star | Nova | Stage, Star, Speaker | Headbands, rainbow/pink/teal hair, sparkle/gold outfits, mic |
| ❄️ Frosty   | Wisp | Snowflake, Mountain, Snow buddy | Ice crown, snow/violet capes, frost wand |

## Two modes

- **Color** — fill in outline scenes (or a blank canvas) with a big-target
  palette and three brush sizes. Works with mouse or touch.
- **Dress up** — snap wardrobe items (hair, head, body, hand) onto the
  hero, rendered as recolorable SVG.

## Run it

It's a static site — no build step.

```bash
# Python (no install)
npm start            # serves at http://localhost:8080

# or Node
npm run serve
```

Then open <http://localhost:8080>. You can also just open `index.html`
directly in a browser.

## Project layout

```
index.html      # screens, canvas, toolbar mount points
characters.js   # CHARACTERS config: heroes, wardrobe, scenes, palettes
game.js         # drawing, dress-up rendering, toolbar, world switching
styles.css      # bright, big-target styling tuned for little fingers
```

## Customizing for your kid

Open `characters.js`:

- **Rename the hero** — change `hero.displayName` (e.g. `"Nova"` → the kid's name).
- **Recolor** — tweak `skin`, `hair`, `outfit`, or any wardrobe `color`.
- **Add wardrobe items** — push a new `{ id, label, slot, color }`.
  Slots the hero renders today: `head`, `hair`, `body`, `hand`.
- **Add coloring scenes** — add the scene name to `scenes` and define a
  matching drawing function in the `SCENES` object in `game.js`.
- **Add a whole new world** — copy a top-level block in `CHARACTERS` and add
  a matching `.world-card` button in `index.html`.

## License

MIT
