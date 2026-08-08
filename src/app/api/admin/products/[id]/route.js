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
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const patch = {
    name: body.name,
    shortDescription: body.shortDescription,
    price: Number(body.price),
    oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
    discountLabel: body.discountLabel || undefined,
    stock: Number(body.stock) || 0,
  };

  if (body.categoryId) {
    patch.category = { _type: "reference", _ref: body.categoryId };
  }

  const updated = await writeClient.patch(id).set(patch).commit();
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await writeClient.delete(id);
  return NextResponse.json({ success: true });
}