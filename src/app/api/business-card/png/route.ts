import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PRINT_DIR = join(process.cwd(), "public", "print");

function fileResponse(filename: string, contentType: string) {
  try {
    const body = readFileSync(join(PRINT_DIR, filename));
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(body.length),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return null;
  }
}

export async function GET() {
  const res = fileResponse("sendit-business-card.png", "image/png");
  if (res) return res;
  return NextResponse.json(
    { error: "Print file missing. Run: npm run card:export" },
    { status: 404 },
  );
}
