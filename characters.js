// ============================================================
//  Doodle Stars — Original Character Cast
// ============================================================
//  These are ORIGINAL characters. They capture the *spirit* of
//  the themes the kid loves (glam pop-star energy; magical winter)
//  without copying any specific copyrighted character.
//
//  Customize freely: rename them after the kid, recolor, add more.
// ============================================================

const CHARACTERS = {
  pop: {
    name: "Pop Star",
    // The mascot: a bright, big-eyed pop star with rainbow hair.
    // Drawn as simple SVG shapes so it's easy to recolor + extend.
    hero: {
      id: "nova",
      displayName: "Nova",            // <-- rename to the kid!
      skin: "#F4C9A8",
      hair: "#D4537E",                // swap for any rainbow shade
      outfit: "#7F77DD",
    },
    // Dress-up items: each is a layer that snaps onto the hero.
    wardrobe: [
      { id: "hat-star",   label: "Star headband", slot: "head",  color: "#EF9F27" },
      { id: "hair-rainbow", label: "Rainbow hair", slot: "hair", color: "rainbow" },
      { id: "hair-pink",  label: "Pink hair",     slot: "hair",  color: "#D4537E" },
      { id: "hair-teal",  label: "Teal hair",     slot: "hair",  color: "#1D9E75" },
      { id: "outfit-glam", label: "Sparkle suit",  slot: "body",  color: "#7F77DD" },
      { id: "outfit-gold", label: "Gold stage",    slot: "body",  color: "#EF9F27" },
      { id: "mic",        label: "Sparkly mic",    slot: "hand",  color: "#378ADD" },
    ],
    // Coloring scenes: outline drawings the kid fills in.
    scenes: ["stage", "star", "speaker"],
    palette: ["#E24B4A","#EF9F27","#639922","#378ADD","#7F77DD","#D4537E","#1D9E75","#FFFFFF"],
    // Sticker Play: tap to add, drag to move, double-tap to remove.
    playStickers: ["🎤","⭐","🌟","🎶","🌈","💖","🎸","👑","🎉","🦄"],
  },

  frost: {
    name: "Frosty",
    hero: {
      id: "winter",
      displayName: "Wisp",            // <-- rename to the kid!
      skin: "#F4C9A8",
      hair: "#B5D4F4",
      outfit: "#378ADD",
    },
    wardrobe: [
      { id: "crown-ice",  label: "Ice crown",   slot: "head", color: "#85B7EB" },
      { id: "cape-snow",  label: "Snow cape",   slot: "body", color: "#E6F1FB" },
      { id: "cape-violet",label: "Violet cape", slot: "body", color: "#7F77DD" },
      { id: "wand-frost", label: "Frost wand",  slot: "hand", color: "#85B7EB" },
    ],
    scenes: ["snowflake", "mountain", "snowbuddy"],
    palette: ["#85B7EB","#378ADD","#7F77DD","#B5D4F4","#E6F1FB","#1D9E75","#D4537E","#FFFFFF"],
    // Sticker Play: tap to add, drag to move, double-tap to remove.
    playStickers: ["❄️","⛄","☃️","🏔️","💎","🧊","🐧","✨","🦌","🌟"],
  },
};
