/**
 * Black & white flyer — letter size 8.5×11″ @ 300 DPI
 * Run: npm run flyer:export
 */
import QRCode from "qrcode";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/print");

const SITE_URL = "https://senditandsons.com";
const SITE_DISPLAY = "senditandsons.com";
const PHONE = "336-437-3825";
const EMAIL = "starzndstripesmedia@gmail.com";

const W = 2550;
const H = 3300;
const PAGE_W_PT = 8.5 * 72;
const PAGE_H_PT = 11 * 72;

mkdirSync(outDir, { recursive: true });

const qrSvg = await QRCode.toString(SITE_URL, {
  type: "svg",
  margin: 1,
  width: 520,
  errorCorrectionLevel: "M",
});

const qrViewBox = qrSvg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 33 33";
const qrInner = qrSvg
  .replace(/<\?xml[^>]*>\s*/i, "")
  .replace(/<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "");

const qrSize = 520;
const qrX = (W - qrSize) / 2;
const qrY = 1180;

const flyerSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="8.5in" height="11in" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect x="80" y="80" width="${W - 160}" height="8" fill="#000000"/>
  <rect x="80" y="${H - 88}" width="${W - 160}" height="8" fill="#000000"/>

  <text x="${W / 2}" y="220" fill="#000000" font-family="Impact, Haettenschweiler, Arial Black, sans-serif" font-size="118" text-anchor="middle" letter-spacing="4">LEARN TO JUMP.</text>
  <text x="${W / 2}" y="360" fill="#000000" font-family="Impact, Haettenschweiler, Arial Black, sans-serif" font-size="148" text-anchor="middle" letter-spacing="6">SEND IT.</text>

  <text x="${W / 2}" y="480" fill="#000000" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" text-anchor="middle" letter-spacing="8">SENDIT AND SONS.CO</text>

  <text x="${W / 2}" y="620" fill="#000000" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="600" text-anchor="middle">Mobile BMX &amp; mountain bike jump lessons</text>
  <text x="${W / 2}" y="690" fill="#333333" font-family="Arial, Helvetica, sans-serif" font-size="38" text-anchor="middle">We bring the portable ramp + air bag to you.</text>
  <text x="${W / 2}" y="755" fill="#333333" font-family="Arial, Helvetica, sans-serif" font-size="38" text-anchor="middle">Events · birthday parties · schools &amp; festivals</text>

  <rect x="${qrX - 36}" y="${qrY - 36}" width="${qrSize + 72}" height="${qrSize + 72}" fill="#ffffff" stroke="#000000" stroke-width="6"/>
  <svg x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" viewBox="${qrViewBox}" shape-rendering="crispEdges">${qrInner}</svg>

  <text x="${W / 2}" y="${qrY + qrSize + 90}" fill="#000000" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" text-anchor="middle" letter-spacing="4">SCAN FOR INFO &amp; BOOKING</text>
  <text x="${W / 2}" y="${qrY + qrSize + 155}" fill="#000000" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="700" text-anchor="middle">${SITE_DISPLAY}</text>

  <line x1="200" y1="${qrY + qrSize + 220}" x2="${W - 200}" y2="${qrY + qrSize + 220}" stroke="#000000" stroke-width="3"/>

  <text x="${W / 2}" y="${qrY + qrSize + 310}" fill="#000000" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700" text-anchor="middle">${PHONE}</text>
  <text x="${W / 2}" y="${qrY + qrSize + 380}" fill="#333333" font-family="Arial, Helvetica, sans-serif" font-size="36" text-anchor="middle">${EMAIL}</text>

  <rect x="180" y="${qrY + qrSize + 430}" width="${W - 360}" height="120" fill="#000000"/>
  <text x="${W / 2}" y="${qrY + qrSize + 510}" fill="#ffffff" font-family="Impact, Arial Black, sans-serif" font-size="52" text-anchor="middle" letter-spacing="2">$30 ON-SPOT RIDES AT EVENTS</text>

  <text x="${W / 2}" y="${H - 180}" fill="#555555" font-family="Arial, Helvetica, sans-serif" font-size="32" text-anchor="middle">Based in Mebane, NC · Triangle &amp; Triad area</text>
  <text x="${W / 2}" y="${H - 120}" fill="#555555" font-family="Arial, Helvetica, sans-serif" font-size="28" text-anchor="middle">Helmets &amp; bikes available · Ages 8+ · First-timers welcome</text>
</svg>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>sendit flyer — print</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #eee; }
    .help { max-width: 36rem; margin: 0 auto; padding: 1.5rem; }
    .help button, .help a.dl { display: inline-block; margin: 0.5rem 0.5rem 0 0; padding: 0.75rem 1.25rem; font-weight: 700; background: #000; color: #fff; text-decoration: none; border: none; border-radius: 8px; cursor: pointer; }
    .stage { display: flex; justify-content: center; padding: 1rem 1rem 3rem; }
    .stage svg { max-width: 100%; height: auto; box-shadow: 0 8px 30px rgba(0,0,0,.2); }
    @media print {
      .help { display: none; }
      body { background: #fff; }
      .stage svg { width: 8.5in; height: 11in; box-shadow: none; }
      @page { size: letter; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="help">
    <h1>B&amp;W flyer — print tonight</h1>
    <p>Letter 8.5×11″ · QR → ${SITE_URL}</p>
    <a class="dl" href="/api/flyer/png">Download PNG</a>
    <a class="dl" href="/api/flyer/pdf">Download PDF</a>
    <button type="button" onclick="window.print()">Print</button>
  </div>
  <div class="stage">${flyerSvg.replace('<?xml version="1.0" encoding="UTF-8"?>', "")}</div>
</body>
</html>
`;

writeFileSync(join(outDir, "sendit-flyer.svg"), flyerSvg, "utf8");
writeFileSync(join(outDir, "sendit-flyer.html"), html, "utf8");

const pngBuffer = await sharp(Buffer.from(flyerSvg), { density: 300 })
  .resize(W, H, { fit: "fill" })
  .png()
  .toBuffer();

writeFileSync(join(outDir, "sendit-flyer.png"), pngBuffer);

const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([PAGE_W_PT, PAGE_H_PT]);
const pngImage = await pdfDoc.embedPng(pngBuffer);
page.drawImage(pngImage, { x: 0, y: 0, width: PAGE_W_PT, height: PAGE_H_PT });
writeFileSync(join(outDir, "sendit-flyer.pdf"), await pdfDoc.save());

console.log("Wrote:");
console.log(" ", join(outDir, "sendit-flyer.png"));
console.log(" ", join(outDir, "sendit-flyer.pdf"));
console.log(" ", join(outDir, "sendit-flyer.svg"));
