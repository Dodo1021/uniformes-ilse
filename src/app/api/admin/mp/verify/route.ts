import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { verifyToken, maskToken } from "@/lib/mp";
import { setSetting } from "@/lib/settings";
import { STORE_STATUS_TAG } from "@/lib/store-status";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { token?: string };
  const token = (body.token ?? "").trim();
  if (!token)
    return NextResponse.json(
      { success: false, error: "Token requerido" },
      { status: 400 }
    );

  const result = await verifyToken(token);

  if (!result.ok) {
    if (result.reason === "invalid") {
      await setSetting("mp_status", "invalid");
      revalidateTag(STORE_STATUS_TAG);
    }
    return NextResponse.json({ success: false, error: result.error });
  }

  await Promise.all([
    setSetting("mp_access_token", token),
    setSetting("mp_status", "valid"),
    setSetting("mp_account_email", result.email ?? ""),
  ]);
  revalidateTag(STORE_STATUS_TAG);

  return NextResponse.json({
    success: true,
    email: result.email,
    maskedToken: maskToken(token),
  });
}
