import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { writeClient } from "../../../../../sanity/lib/writeClient";

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "completed", "cancelled"];

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await writeClient.patch(id).set({ status }).commit();
  return NextResponse.json(updated);
}