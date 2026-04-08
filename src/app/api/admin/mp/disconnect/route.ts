import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { setSetting, deleteSetting } from "@/lib/settings";
import { STORE_STATUS_TAG } from "@/lib/store-status";

export async function POST() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await Promise.all([
    deleteSetting("mp_access_token"),
    deleteSetting("mp_account_email"),
    setSetting("mp_status", "unconfigured"),
  ]);
  revalidateTag(STORE_STATUS_TAG);

  return NextResponse.json({ success: true });
}
