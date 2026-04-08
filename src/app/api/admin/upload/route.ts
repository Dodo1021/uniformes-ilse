import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif", "svg"];
const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "No file" }, { status: 400 });

  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json(
      { error: "Archivo demasiado grande (máx 5MB)" },
      { status: 400 }
    );

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  if (!ALLOWED_EXT.includes(ext))
    return NextResponse.json({ error: "Formato no soportado" }, { status: 400 });

  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await prisma.upload.create({
    data: {
      filename,
      mimeType: MIME[ext] ?? "application/octet-stream",
      data: buffer,
    },
  });

  return NextResponse.json({ url: `/uploads/${filename}` });
}
