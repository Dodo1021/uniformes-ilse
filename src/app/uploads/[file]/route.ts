import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;

  if (
    !file ||
    file.includes("/") ||
    file.includes("\\") ||
    file.includes("..") ||
    file.startsWith(".")
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const upload = await prisma.upload.findUnique({
    where: { filename: file },
  });

  if (!upload) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Prisma returns Buffer for Bytes columns; wrap in Blob for cross-runtime BodyInit compat
  const buf = upload.data as unknown as Buffer;
  const blob = new Blob([new Uint8Array(buf)], { type: upload.mimeType });

  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": String(blob.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
