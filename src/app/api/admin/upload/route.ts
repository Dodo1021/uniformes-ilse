import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

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
  if (!["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext))
    return NextResponse.json({ error: "Formato no soportado" }, { status: 400 });

  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
