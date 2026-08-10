import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { writeClient } from "../../../../../sanity/lib/writeClient";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const { setDefault } = await request.json();

  const customer = await writeClient.getDocument(session.user.id);
  const addresses = customer?.addresses || [];

  const updated = addresses.map((addr) => ({
    ...addr,
    isDefault: setDefault ? addr._key === key : false,
  }));

  await writeClient.patch(session.user.id).set({ addresses: updated }).commit();

  return NextResponse.json({ addresses: updated });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;

  await writeClient
    .patch(session.user.id)
    .unset([`addresses[_key=="${key}"]`])
    .commit();

  return NextResponse.json({ success: true });
}