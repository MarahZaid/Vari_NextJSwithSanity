import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { writeClient } from "../../../../../sanity/lib/writeClient";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) return null;
  return session;
}

export async function PATCH(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const updated = await writeClient
    .patch(id)
    .set({
      name: body.name,
      plpTitle: body.plpTitle,
      shortDescription: body.shortDescription,
      description: body.description,
      discountPercentage: body.discountPercentage ? Number(body.discountPercentage) : undefined,
      orderRank: body.orderRank ? Number(body.orderRank) : undefined,
    })
    .commit();

  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await writeClient.delete(id);
  return NextResponse.json({ success: true });
}