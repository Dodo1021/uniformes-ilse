import { NextResponse } from "next/server";
import { stat, readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;

  // Reject path traversal and anything other than a plain filename
  if (
    !file ||
    file.includes("/") ||
    file.includes("\\") ||
    file.includes("..") ||
    file.startsWith(".")
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const fullPath = path.join(UPLOAD_DIR, file);

  try {
    const s = await stat(fullPath);
    if (!s.isFile()) return new NextResponse("Not found", { status: 404 });

    const ext = (file.split(".").pop() ?? "").toLowerCase();
    const contentType = MIME[ext] ?? "application/octet-stream";
    const data = await readFile(fullPath);

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(s.size),
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
