/**
 * Generates WebP variants for marketing assets. Run after adding new raster images:
 *   node scripts/optimize-images.mjs
 * Requires: sharp (devDependency)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");

async function toWebp(src, dest, { width, quality = 82 } = {}) {
  let pipeline = sharp(src).rotate();
  if (width) pipeline = pipeline.resize(width, undefined, { withoutEnlargement: true });
  await pipeline.webp({ quality, effort: 6 }).toFile(dest);
}

async function main() {
  const galleryDir = path.join(publicDir, "assets/images/gallery");
  const files = fs.readdirSync(galleryDir).filter((f) => /\.(png|jpe?g)$/i.test(f));

  for (const file of files) {
    const base = path.join(galleryDir, file);
    const name = path.basename(file, path.extname(file));
    const thumbPath = path.join(galleryDir, `${name}-thumb.webp`);
    const fullWebpPath = path.join(galleryDir, `${name}.webp`);
    await toWebp(base, thumbPath, { width: 480, quality: 80 });
    await toWebp(base, fullWebpPath, { quality: 85 });
    console.log("OK", path.relative(publicDir, thumbPath), path.relative(publicDir, fullWebpPath));
  }

  const heroJpg = path.join(publicDir, "assets/images/home/landingPicture.jpg");
  if (fs.existsSync(heroJpg)) {
    const out = path.join(publicDir, "assets/images/home/landingPicture.webp");
    await toWebp(heroJpg, out, { width: 1920, quality: 82 });
    console.log("OK", path.relative(publicDir, out));
  }

  const homePic = path.join(publicDir, "assets/images/home/homePicture.png");
  if (fs.existsSync(homePic)) {
    const out = path.join(publicDir, "assets/images/home/homePicture.webp");
    await toWebp(homePic, out, { width: 1200, quality: 82 });
    console.log("OK", path.relative(publicDir, out));
  }

  const banner = path.join(publicDir, "assets/images/galleryBanner.png");
  if (fs.existsSync(banner)) {
    const out = path.join(publicDir, "assets/images/galleryBanner.webp");
    await toWebp(banner, out, { width: 1600, quality: 82 });
    console.log("OK", path.relative(publicDir, out));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
