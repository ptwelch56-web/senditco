import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PRINT_DIR = join(process.cwd(), "public", "print");

export async function GET() {
  try {
    const body = readFileSync(join(PRINT_DIR, "sendit-flyer.pdf"));
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="sendit-flyer.pdf"',
        "Content-Length": String(body.length),
      },
    });
  } catch {
    return NextResponse.json({ error: "Run npm run flyer:export" }, { status: 404 });
  }
}
