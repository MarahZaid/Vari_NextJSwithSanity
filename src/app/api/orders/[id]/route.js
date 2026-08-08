import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { client } from "../../../../sanity/lib/client";
import { ORDER_BY_ID_QUERY } from "../../../../sanity/lib/queries";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await client.fetch(ORDER_BY_ID_QUERY, { id }, { cache: "no-store" });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = order.customerEmail === session.user.email;
  if (!isOwner && !session.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}