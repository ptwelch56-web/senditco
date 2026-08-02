/**
 * Generates print-ready business card files in public/print/
 * Run: node scripts/generate-business-card.mjs
 */
import QRCode from "qrcode";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/print");

const SITE_URL = "https://senditandsons.com"; // homepage — must match siteHomeUrl() default
const SITE_DISPLAY = "senditandsons.com";
const PHONE = "336-437-3825";
const EMAIL = "starzndstripesmedia@gmail.com";
const TAGLINE = "Mobile BMX & mountain bike jump lessons";

const W = 1050;
const H = 600;
const CARD_WIDTH_PT = 3.5 * 72;
const CARD_HEIGHT_PT = 2 * 72;

mkdirSync(outDir, { recursive: true });

const qrModule = await QRCode.toString(SITE_URL, {
  type: "svg",
  margin: 1,
  width: 220,
  errorCorrectionLevel: "M",
});

const viewBoxMatch = qrModule.match(/viewBox="([^"]+)"/);
const qrViewBox = viewBoxMatch?.[1] ?? "0 0 25 25";
const qrInner = qrModule
  .replace(/<\?xml[^>]*>\s*/i, "")
  .replace(/<svg[^>]*>/i, "")
  .replace(/<\/svg>\s*$/i, "");

const qrBoxX = 752;
const qrBoxY = 148;
const qrBoxSize = 268;
const qrPad = 12;
const qrDrawSize = qrBoxSize - qrPad * 2;
const qrDrawX = qrBoxX + qrPad;
const qrDrawY = qrBoxY + qrPad;
const qrLabelX = qrBoxX + qrBoxSize / 2;

const cardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="3.5in" height="2in" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="stripe" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#070708"/>
  <rect width="${W}" height="42" fill="url(#stripe)"/>
  <ellipse cx="920" cy="80" rx="120" ry="80" fill="#dc2626" opacity="0.12"/>
  <ellipse cx="120" cy="520" rx="140" ry="100" fill="#1d4ed8" opacity="0.1"/>
  <text x="56" y="118" fill="#ffffff" font-family="Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" font-size="72" letter-spacing="1">SEND IT</text>
  <text x="56" y="168" fill="#ef4444" font-family="Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" font-size="38" letter-spacing="2">AND SONS.CO</text>
  <text x="56" y="218" fill="#a1a1aa" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" letter-spacing="3">${escapeXml(TAGLINE.toUpperCase())}</text>
  <text x="56" y="252" fill="#71717a" font-family="Arial, Helvetica, sans-serif" font-size="20">Ramp + air bag · Mebane, NC</text>
  <text x="56" y="480" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">${PHONE}</text>
  <text x="56" y="518" fill="#d4d4d8" font-family="Arial, Helvetica, sans-serif" font-size="22">${EMAIL}</text>
  <text x="56" y="554" fill="#fbbf24" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600">${SITE_DISPLAY}</text>
  <rect x="${qrBoxX}" y="${qrBoxY}" width="${qrBoxSize}" height="${qrBoxSize}" rx="12" fill="#ffffff"/>
  <svg x="${qrDrawX}" y="${qrDrawY}" width="${qrDrawSize}" height="${qrDrawSize}" viewBox="${qrViewBox}" shape-rendering="crispEdges">${qrInner}</svg>
  <text x="${qrLabelX}" y="${qrBoxY + qrBoxSize + 28}" fill="#a1a1aa" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" text-anchor="middle" letter-spacing="2">SCAN TO</text>
  <text x="${qrLabelX}" y="${qrBoxY + qrBoxSize + 50}" fill="#a1a1aa" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" text-anchor="middle" letter-spacing="2">BOOK &amp; PAY</text>
  <path d="M380 520 Q480 420 580 460 T720 440" stroke="#dc2626" stroke-width="6" fill="none" opacity="0.25" stroke-linecap="round"/>
  <circle cx="580" cy="460" r="10" fill="#dc2626" opacity="0.25"/>
</svg>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>sendit and sons.co — business card</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #18181b; color: #e4e4e7; }
    .help { max-width: 32rem; margin: 0 auto; padding: 2rem 1rem; }
    .help h1 { font-size: 1.5rem; margin: 0 0 0.75rem; }
    .help p, .help li { font-size: 0.875rem; line-height: 1.5; color: #a1a1aa; }
    .help button { margin-top: 1rem; padding: 0.75rem 1.5rem; font-weight: 700; background: #dc2626; color: #fff; border: none; border-radius: 9999px; cursor: pointer; }
    .stage { display: flex; justify-content: center; padding: 2rem 1rem 4rem; }
    .card-wrap { box-shadow: 0 25px 50px rgba(0,0,0,.5); line-height: 0; }
    @media print {
      .help { display: none !important; }
      body { background: #070708; }
      .stage { padding: 0; margin: 0; }
      @page { size: 3.5in 2in; margin: 0; }
      svg { width: 3.5in; height: 2in; }
    }
  </style>
</head>
<body>
  <div class="help">
    <h1>Business card — print today</h1>
    <p>Size: 3.5″ × 2″. QR → ${SITE_URL}</p>
    <p><a href="/api/business-card/pdf" download style="color:#f87171;font-weight:700">Download PDF for print shop</a></p>
    <ol>
      <li>Send <strong>sendit-business-card.pdf</strong> to your printer (FedEx, Staples, VistaPrint, etc.).</li>
      <li>Spec: <strong>3.5″ × 2″</strong> standard US business card, single-sided.</li>
      <li>Or use Print below to save another PDF from the preview.</li>
    </ol>
    <p>Source SVG (optional): <strong>sendit-business-card.svg</strong></p>
    <button type="button" onclick="window.print()">Print / Save PDF</button>
  </div>
  <div class="stage">
    <div class="card-wrap">
      ${cardSvg.replace('<?xml version="1.0" encoding="UTF-8"?>', "")}
    </div>
  </div>
</body>
</html>
`;

writeFileSync(join(outDir, "sendit-business-card.svg"), cardSvg, "utf8");
writeFileSync(join(outDir, "sendit-business-card.html"), html, "utf8");

const pngBuffer = await sharp(Buffer.from(cardSvg), { density: 300 })
  .resize(W, H, { fit: "fill" })
  .png()
  .toBuffer();

const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([CARD_WIDTH_PT, CARD_HEIGHT_PT]);
const pngImage = await pdfDoc.embedPng(pngBuffer);
page.drawImage(pngImage, {
  x: 0,
  y: 0,
  width: CARD_WIDTH_PT,
  height: CARD_HEIGHT_PT,
});
const pdfPath = join(outDir, "sendit-business-card.pdf");
writeFileSync(pdfPath, await pdfDoc.save());

const pngPath = join(outDir, "sendit-business-card.png");
writeFileSync(pngPath, pngBuffer);

console.log("Wrote:");
console.log(" ", pngPath, "(send this to most print shops)");
console.log(" ", pdfPath);
console.log(" ", join(outDir, "sendit-business-card.svg"));
console.log(" ", join(outDir, "sendit-business-card.html"));

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
