import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { writeClient } from "../../../../sanity/lib/writeClient";

export async function PATCH(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = body?.name?.toString().trim();
  const phone = body?.phone?.toString().trim() ?? "";
  const address = body?.address?.toString().trim() ?? "";

  if (!name) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }

  await writeClient
    .patch(session.user.id)
    .set({ name, phone, address })
    .commit();

  return NextResponse.json({ ok: true });
}