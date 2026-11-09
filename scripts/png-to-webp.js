/**
 * Convert PNGs in public/png to WebP without quality loss (lossless WebP).
 * Usage: node scripts/png-to-webp.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIR = path.join(__dirname, "..", "public", "png");

async function convertFile(file) {
  const src = path.join(DIR, file);
  const base = path.basename(file, path.extname(file)).toLowerCase();
  const dest = path.join(DIR, `${base}.webp`);

  await sharp(src).webp({ lossless: true }).toFile(dest);
  const inStat = fs.statSync(src);
  const outStat = fs.statSync(dest);
  console.log(`${file} -> ${path.basename(dest)}  (${inStat.size} → ${outStat.size} bytes)`);
}

async function main() {
  const files = fs
    .readdirSync(DIR)
    .filter((f) => /\.png$/i.test(f))
    .sort();

  if (!files.length) {
    console.error("No PNG files found in public/png");
    process.exit(1);
  }

  for (const file of files) {
    await convertFile(file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
