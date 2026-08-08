import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { writeClient } from "../../../../../sanity/lib/writeClient";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { isAdmin } = await request.json();

  const updated = await writeClient.patch(id).set({ isAdmin: Boolean(isAdmin) }).commit();
  return NextResponse.json(updated);
}