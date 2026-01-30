function getLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Blend foreground with background (simple alpha blending)
// bg is opaque hex, fg is hex with alpha (0-1)
// Approximate blending for checking contrast against a background
function blend(bgHex, fgHex, alpha) {
  const bgR = parseInt(bgHex.slice(1, 3), 16);
  const bgG = parseInt(bgHex.slice(3, 5), 16);
  const bgB = parseInt(bgHex.slice(5, 7), 16);

  const fgR = parseInt(fgHex.slice(1, 3), 16);
  const fgG = parseInt(fgHex.slice(3, 5), 16);
  const fgB = parseInt(fgHex.slice(5, 7), 16);

  const r = Math.round((1 - alpha) * bgR + alpha * fgR);
  const g = Math.round((1 - alpha) * bgG + alpha * fgG);
  const b = Math.round((1 - alpha) * bgB + alpha * fgB);

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const colors = {
  bg: "#1a1a1a",
  bgLight: "#2a2a2a",
  text: "#f0f0f0",
  textLight: "#b0b0b0",
  primary: "#4a9fd4", // Used for links and headings
  legacyCardBgStart: "#2a2a2a", // Approx for gradient
  legacyCardBgEnd: "#1f1f1f",
  legacyEmail: "#6bb3e0",
  legacyInsta: "#e055a6",
  legacyEmailBgBase: "#6bb3e0", // rgba base
  legacyInstaBgBase: "#e055a6", // rgba base
};

const pairs = [
  { name: "Body Text (Text on Bg)", fg: colors.text, bg: colors.bg },
  { name: "Light Text (TextLight on Bg)", fg: colors.textLight, bg: colors.bg },
  { name: "Headings/Links (Primary on Bg)", fg: colors.primary, bg: colors.bg },
  { name: "Table Text (Text on BgLight)", fg: colors.text, bg: colors.bgLight },
  {
    name: "Table Light Text (TextLight on BgLight)",
    fg: colors.textLight,
    bg: colors.bgLight,
  },
];

// Complex pairs (blended backgrounds)
// Legacy Email Link: color #6bb3e0 on background rgba(107, 179, 224, 0.1) which is on card bg #2a2a2a (approx)
// #6bb3e0 is rgb(107, 179, 224)
const emailBg = blend(colors.legacyCardBgStart, "#6bb3e0", 0.1);
pairs.push({
  name: "Legacy Email Link (on blended bg)",
  fg: "#6bb3e0",
  bg: emailBg,
});

// Legacy Instagram Link: color #e055a6 on background rgba(224, 85, 166, 0.1)
const instaBg = blend(colors.legacyCardBgStart, "#e055a6", 0.1);
pairs.push({
  name: "Legacy Insta Link (Current - #e055a6)",
  fg: "#e055a6",
  bg: instaBg,
});

// Proposed Fix: Lighten the pink
const newInstaColor = "#ff7eb9"; // Lighter pink
// Keep background same or adjust? The css uses rgba(224, 85, 166, 0.1) which matches the old color.
// If we change text, we might want to keep bg subtle or match it.
// Let's assume we keep bg as is for now, or match it to new color (very small difference in contrast for bg).
const newInstaBg = blend(colors.legacyCardBgStart, newInstaColor, 0.1);
pairs.push({
  name: "Legacy Insta Link (Proposed - #ff7eb9)",
  fg: newInstaColor,
  bg: newInstaBg,
});

// Button Accent (White on Orange #ff8c00)
pairs.push({
  name: "Button Accent (White on #ff8c00)",
  fg: "#ffffff",
  bg: "#ff8c00",
});
// Proposed Fix for Button Accent: Dark Text
pairs.push({
  name: "Button Accent Proposed (Dark Text #1a1a1a on #ff8c00)",
  fg: "#1a1a1a",
  bg: "#ff8c00",
});

// Button Primary in Dark Mode
// Bg: #4a9fd4, Text: #ffffff
pairs.push({
  name: "Button Primary Dark Mode (White on #4a9fd4)",
  fg: "#ffffff",
  bg: "#4a9fd4",
});

// Fix Options for Button Primary Dark Mode:
// Option A: Dark Text on Light Blue Button
pairs.push({
  name: "Button Primary Dark Mode (Dark Text #1a1a1a on #4a9fd4)",
  fg: "#1a1a1a",
  bg: "#4a9fd4",
});

// Option B: Darker Blue Button (e.g. #1565a0) with White Text
// Check button visibility against page bg (#1a1a1a)
pairs.push({
  name: "Button Option B (Button #1565a0 on Page #1a1a1a)",
  fg: "#1565a0",
  bg: "#1a1a1a",
});
// Check text legibility
pairs.push({
  name: "Button Option B (White Text on Button #1565a0)",
  fg: "#ffffff",
  bg: "#1565a0",
});

// Button Accent Hover (Dark Text on #e67e00)
pairs.push({
  name: "Button Accent Hover (Dark Text on #e67e00)",
  fg: "#1a1a1a",
  bg: "#e67e00",
});

// Button Primary Dark Mode Hover (Dark Text on #6bb3e0)
pairs.push({
  name: "Button Primary Dark Mode Hover (Dark Text on #6bb3e0)",
  fg: "#1a1a1a",
  bg: "#6bb3e0",
});

console.log("Contrast Ratios (Dark Mode):");
console.log("----------------------------");
pairs.forEach((p) => {
  const ratio = getContrast(p.fg, p.bg).toFixed(2);
  const aaNormal = ratio >= 4.5 ? "PASS" : "FAIL";
  const aaLarge = ratio >= 3.0 ? "PASS" : "FAIL";
  const aaaNormal = ratio >= 7.0 ? "PASS" : "FAIL";

  console.log(`${p.name}:`);
  console.log(`  FG: ${p.fg}, BG: ${p.bg}`);
  console.log(`  Ratio: ${ratio}:1`);
  console.log(`  WCAG AA Normal Text (4.5:1): ${aaNormal}`);
  console.log(`  WCAG AA Large Text  (3.0:1): ${aaLarge}`);
  console.log("---");
});
