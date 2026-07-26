/**
 * Turns the raw photo dump in /raw into responsive AVIF + WebP + JPEG sets in
 * /public/media, and writes a manifest with intrinsic dimensions so every <img>
 * can reserve its space before the bytes land (no layout shift).
 *
 * Run with `npm run images`. Output is committed, so CI never needs sharp.
 */
import sharp from 'sharp'
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import { join, parse } from 'node:path'

const RAW = 'raw'
const OUT = 'public/media'
const MANIFEST = 'src/data/media.json'

/** Widths we actually serve. Anything wider is wasted bytes on a photo grid. */
const WIDTHS = [480, 960, 1600]

const SKIP = new Set(['donate-qr.jpeg', 'top.png'])

async function main() {
  await mkdir(OUT, { recursive: true })
  const files = (await readdir(RAW)).filter(
    (f) => /\.(jpe?g|png)$/i.test(f) && !SKIP.has(f),
  )

  const manifest = {}

  for (const file of files) {
    const { name } = parse(file)
    const input = join(RAW, file)
    const image = sharp(input, { failOn: 'none' }).rotate()
    const meta = await image.metadata()
    const aspect = (meta.width ?? 1) / (meta.height ?? 1)

    const widths = WIDTHS.filter((w) => w <= (meta.width ?? 0)).concat(
      WIDTHS.some((w) => w <= (meta.width ?? 0)) ? [] : [meta.width ?? 480],
    )

    for (const w of widths) {
      const resized = sharp(input, { failOn: 'none' })
        .rotate()
        .resize({ width: w, withoutEnlargement: true })

      await resized
        .clone()
        .avif({ quality: 52, effort: 6 })
        .toFile(join(OUT, `${name}-${w}.avif`))
      await resized
        .clone()
        .webp({ quality: 74 })
        .toFile(join(OUT, `${name}-${w}.webp`))
      await resized
        .clone()
        .jpeg({ quality: 76, mozjpeg: true })
        .toFile(join(OUT, `${name}-${w}.jpg`))
    }

    // A 24px blurred placeholder, inlined as a data URI, so a photo fades in
    // from its own colours instead of from an empty grey box.
    const blurBuf = await sharp(input, { failOn: 'none' })
      .rotate()
      .resize({ width: 24 })
      .blur(1.2)
      .webp({ quality: 40 })
      .toBuffer()

    manifest[name] = {
      widths,
      aspect: Number(aspect.toFixed(4)),
      blur: `data:image/webp;base64,${blurBuf.toString('base64')}`,
    }

    console.log(`✓ ${name}  ${meta.width}×${meta.height}  →  ${widths.join(', ')}`)
  }

  // Square logo derivatives for the favicon and the nav mark.
  for (const size of [256]) {
    await sharp(join(RAW, 'logo.jpeg'))
      .resize(size, size)
      .webp({ quality: 88 })
      .toFile(join(OUT, `logo-${size}.webp`))
    await sharp(join(RAW, 'logo.jpeg'))
      .resize(size, size)
      .jpeg({ quality: 88 })
      .toFile(join(OUT, `logo-${size}.jpg`))
  }

  // Social share card.
  await sharp(join(RAW, '3.jpeg'))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(join(OUT, 'og.jpg'))

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`\nWrote ${Object.keys(manifest).length} entries to ${MANIFEST}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
