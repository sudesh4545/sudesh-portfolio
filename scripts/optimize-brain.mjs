/**
 * Downscale public/neural-brain.png in place using only Node's built-in zlib.
 *
 * The kit ships the artwork at 1600x1280 (~1.9 MB), but the hero never renders
 * it wider than ~640 CSS px. Since it is the page's largest paint (and now
 * preloaded from index.html), shipping the full-size file is pure waste.
 *
 * Only handles what this specific file is: 8-bit RGBA, non-interlaced. Anything
 * else exits without touching the original.
 *
 * Usage: node scripts/optimize-brain.mjs [targetWidth]
 */
import { deflateSync, inflateSync } from 'node:zlib';
import { readFileSync, writeFileSync, statSync } from 'node:fs';

const FILE = new URL('../public/neural-brain.png', import.meta.url);
const TARGET_WIDTH = Number(process.argv[2]) || 900;
const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// ---------------------------------------------------------------- CRC32 ----
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const head = Buffer.alloc(4);
  head.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([head, body, crc]);
}

// ----------------------------------------------------------------- read ----
const png = readFileSync(FILE);
if (!png.subarray(0, 8).equals(SIGNATURE)) {
  console.error('Not a PNG — leaving the file alone.');
  process.exit(1);
}

let offset = 8;
let ihdr = null;
const idat = [];

while (offset < png.length) {
  const length = png.readUInt32BE(offset);
  const type = png.toString('ascii', offset + 4, offset + 8);
  const data = png.subarray(offset + 8, offset + 8 + length);

  if (type === 'IHDR') {
    ihdr = {
      width: data.readUInt32BE(0),
      height: data.readUInt32BE(4),
      depth: data[8],
      colorType: data[9],
      interlace: data[12],
    };
  } else if (type === 'IDAT') {
    idat.push(Buffer.from(data));
  } else if (type === 'IEND') {
    break;
  }

  offset += 12 + length;
}

if (!ihdr) {
  console.error('No IHDR chunk — leaving the file alone.');
  process.exit(1);
}
if (ihdr.depth !== 8 || ihdr.colorType !== 6 || ihdr.interlace !== 0) {
  console.error(
    `Unsupported PNG (depth ${ihdr.depth}, colorType ${ihdr.colorType}, interlace ${ihdr.interlace}) — leaving the file alone.`,
  );
  process.exit(1);
}
if (ihdr.width <= TARGET_WIDTH) {
  console.log(`Already ${ihdr.width}px wide (target ${TARGET_WIDTH}px) — nothing to do.`);
  process.exit(0);
}

// -------------------------------------------------------------- unfilter ----
const { width, height } = ihdr;
const BPP = 4;
const stride = width * BPP;
const raw = inflateSync(Buffer.concat(idat));
const pixels = Buffer.alloc(height * stride);

for (let y = 0; y < height; y += 1) {
  const filter = raw[y * (stride + 1)];
  const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
  const out = pixels.subarray(y * stride, (y + 1) * stride);
  const prior = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;

  for (let x = 0; x < stride; x += 1) {
    const a = x >= BPP ? out[x - BPP] : 0;
    const b = prior ? prior[x] : 0;
    const c = prior && x >= BPP ? prior[x - BPP] : 0;
    let value = line[x];

    switch (filter) {
      case 0:
        break;
      case 1:
        value += a;
        break;
      case 2:
        value += b;
        break;
      case 3:
        value += (a + b) >> 1;
        break;
      case 4: {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        break;
      }
      default:
        throw new Error(`Unknown filter type ${filter} on row ${y}`);
    }

    out[x] = value & 0xff;
  }
}

// --------------------------------------------------------------- resample ----
// Box filter over premultiplied alpha, so transparent pixels do not bleed
// their (undefined) colour into the glowing edges of the brain.
const newWidth = TARGET_WIDTH;
const newHeight = Math.max(1, Math.round((height / width) * newWidth));
const newStride = newWidth * BPP;
const scaled = Buffer.alloc(newHeight * newStride);
const xRatio = width / newWidth;
const yRatio = height / newHeight;

for (let y = 0; y < newHeight; y += 1) {
  const y0 = Math.floor(y * yRatio);
  const y1 = Math.min(height, Math.max(y0 + 1, Math.floor((y + 1) * yRatio)));

  for (let x = 0; x < newWidth; x += 1) {
    const x0 = Math.floor(x * xRatio);
    const x1 = Math.min(width, Math.max(x0 + 1, Math.floor((x + 1) * xRatio)));

    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    let count = 0;

    for (let sy = y0; sy < y1; sy += 1) {
      for (let sx = x0; sx < x1; sx += 1) {
        const i = sy * stride + sx * BPP;
        const alpha = pixels[i + 3];
        r += pixels[i] * alpha;
        g += pixels[i + 1] * alpha;
        b += pixels[i + 2] * alpha;
        a += alpha;
        count += 1;
      }
    }

    const o = y * newStride + x * BPP;
    if (a === 0) {
      scaled[o] = 0;
      scaled[o + 1] = 0;
      scaled[o + 2] = 0;
      scaled[o + 3] = 0;
    } else {
      scaled[o] = Math.round(r / a);
      scaled[o + 1] = Math.round(g / a);
      scaled[o + 2] = Math.round(b / a);
      scaled[o + 3] = Math.round(a / count);
    }
  }
}

// ---------------------------------------------------------------- encode ----
// Filter type 1 (Sub) then 2 (Up), picking whichever leaves the smaller sum of
// absolute values per row — the standard cheap heuristic.
const filtered = Buffer.alloc(newHeight * (newStride + 1));

for (let y = 0; y < newHeight; y += 1) {
  const row = scaled.subarray(y * newStride, (y + 1) * newStride);
  const prior = y > 0 ? scaled.subarray((y - 1) * newStride, y * newStride) : null;

  const sub = Buffer.alloc(newStride);
  const up = Buffer.alloc(newStride);
  let subScore = 0;
  let upScore = 0;

  for (let x = 0; x < newStride; x += 1) {
    sub[x] = (row[x] - (x >= BPP ? row[x - BPP] : 0)) & 0xff;
    up[x] = (row[x] - (prior ? prior[x] : 0)) & 0xff;
    subScore += sub[x] < 128 ? sub[x] : 256 - sub[x];
    upScore += up[x] < 128 ? up[x] : 256 - up[x];
  }

  const useSub = subScore <= upScore;
  filtered[y * (newStride + 1)] = useSub ? 1 : 2;
  (useSub ? sub : up).copy(filtered, y * (newStride + 1) + 1);
}

const newIhdr = Buffer.alloc(13);
newIhdr.writeUInt32BE(newWidth, 0);
newIhdr.writeUInt32BE(newHeight, 4);
newIhdr[8] = 8; // bit depth
newIhdr[9] = 6; // RGBA
newIhdr[10] = 0; // deflate
newIhdr[11] = 0; // adaptive filtering
newIhdr[12] = 0; // non-interlaced

const out = Buffer.concat([
  SIGNATURE,
  chunk('IHDR', newIhdr),
  chunk('IDAT', deflateSync(filtered, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

const before = statSync(FILE).size;
writeFileSync(FILE, out);

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
console.log(
  `${width}x${height} (${kb(before)})  ->  ${newWidth}x${newHeight} (${kb(out.length)})  ` +
    `= ${(100 - (out.length / before) * 100).toFixed(0)}% smaller`,
);
