// Generates minimal PNG icons for the extension without external dependencies.
// Produces: icons/icon16.png, icon32.png, icon48.png, icon128.png
// Design: rounded blue square with a stylized resize-arrow glyph.

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const OUT_DIR = path.join(__dirname, "..", "icons");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const SIZES = [16, 32, 48, 128];

// Colors
const BG = [37, 99, 235, 255]; // primary blue
const FG = [255, 255, 255, 255]; // white
const TRANSPARENT = [0, 0, 0, 0];

function makePixelBuffer(size) {
  const buf = Buffer.alloc(size * size * 4);
  const radius = Math.round(size * 0.22);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const inRounded = isInsideRoundedRect(x, y, size, radius);
      const color = inRounded ? BG : TRANSPARENT;
      buf[idx] = color[0];
      buf[idx + 1] = color[1];
      buf[idx + 2] = color[2];
      buf[idx + 3] = color[3];
    }
  }

  drawResizeGlyph(buf, size);
  return buf;
}

function isInsideRoundedRect(x, y, size, r) {
  if (x < r && y < r) return (r - x) ** 2 + (r - y) ** 2 <= r * r;
  if (x >= size - r && y < r)
    return (x - (size - r - 1)) ** 2 + (r - y) ** 2 <= r * r;
  if (x < r && y >= size - r)
    return (r - x) ** 2 + (y - (size - r - 1)) ** 2 <= r * r;
  if (x >= size - r && y >= size - r)
    return (x - (size - r - 1)) ** 2 + (y - (size - r - 1)) ** 2 <= r * r;
  return true;
}

function setPixel(buf, size, x, y, color) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const idx = (y * size + x) * 4;
  buf[idx] = color[0];
  buf[idx + 1] = color[1];
  buf[idx + 2] = color[2];
  buf[idx + 3] = color[3];
}

function fillRect(buf, size, x0, y0, w, h, color) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      setPixel(buf, size, x, y, color);
    }
  }
}

// Draws a diagonal double-arrow (↖↘) glyph centered in the icon.
function drawResizeGlyph(buf, size) {
  const pad = Math.round(size * 0.22);
  const thick = Math.max(2, Math.round(size * 0.09));
  const armLen = Math.round(size * 0.3);

  // Diagonal line (top-left to bottom-right).
  for (let i = pad; i <= size - pad - 1; i++) {
    for (let t = 0; t < thick; t++) {
      setPixel(buf, size, i, i + t - Math.floor(thick / 2), FG);
      setPixel(buf, size, i + t - Math.floor(thick / 2), i, FG);
    }
  }

  // Top-left arrow head (horizontal + vertical arm).
  fillRect(buf, size, pad, pad, armLen, thick, FG);
  fillRect(buf, size, pad, pad, thick, armLen, FG);

  // Bottom-right arrow head.
  const br = size - pad - 1;
  fillRect(buf, size, br - armLen + 1, br - thick + 1, armLen, thick, FG);
  fillRect(buf, size, br - thick + 1, br - armLen + 1, thick, armLen, FG);
}

// --- PNG encoding (minimal, no deps) ---

function crc32(buf) {
  let c;
  const table = crc32._table || (crc32._table = makeCrcTable());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(rgba, width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // color type: RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  // Add filter byte (0) at the start of each scanline.
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idatData = zlib.deflateSync(raw);

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idatData),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of SIZES) {
  const pixels = makePixelBuffer(size);
  const png = encodePNG(pixels, size, size);
  const outPath = path.join(OUT_DIR, `icon${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`wrote ${outPath} (${png.length} bytes)`);
}
