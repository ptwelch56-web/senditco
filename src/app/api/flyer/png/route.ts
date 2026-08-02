import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PRINT_DIR = join(process.cwd(), "public", "print");

function attachment(filename: string, contentType: string) {
  try {
    const body = readFileSync(join(PRINT_DIR, filename));
    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(body.length),
      },
    });
  } catch {
    return null;
  }
}

export async function GET() {
  return (
    attachment("sendit-flyer.png", "image/png") ??
    NextResponse.json({ error: "Run npm run flyer:export" }, { status: 404 })
  );
}
