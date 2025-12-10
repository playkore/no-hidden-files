// Full CGA 16-color palette (for reference)
const CGA_COLORS = {
  0: "#000000", // black
  1: "#0000AA", // blue
  2: "#00AA00", // green
  3: "#00AAAA", // cyan
  4: "#AA0000", // red
  5: "#AA00AA", // magenta
  6: "#AA5500", // brown
  7: "#AAAAAA", // light gray
  8: "#555555", // dark gray
  9: "#5555FF", // light blue
  10: "#55FF55", // light green
  11: "#55FFFF", // light cyan
  12: "#FF5555", // light red
  13: "#FF55FF", // light magenta
  14: "#FFFF55", // yellow
  15: "#FFFFFF", // white
};

export const CGA_PALETTES = [
  // Palette 0, intensity = 0
  [
    CGA_COLORS[0], // black background
    CGA_COLORS[3], // cyan
    CGA_COLORS[4], // red
    CGA_COLORS[6], // brown
  ],

  // Palette 0, intensity = 1
  [
    CGA_COLORS[0], // black background
    CGA_COLORS[11], // light cyan
    CGA_COLORS[12], // light red
    CGA_COLORS[14], // yellow
  ],

  // Palette 1, intensity = 0
  [
    CGA_COLORS[0], // black background
    CGA_COLORS[2], // green
    CGA_COLORS[5], // magenta
    CGA_COLORS[6], // brown
  ],

  // Palette 1, intensity = 1
  [
    CGA_COLORS[0], // black background
    CGA_COLORS[10], // light green
    CGA_COLORS[13], // light magenta
    CGA_COLORS[14], // yellow
  ],
];
