import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { client } from "../../../../sanity/lib/client";
import { writeClient } from "../../../../sanity/lib/writeClient";
import { CUSTOMER_ADDRESSES_QUERY } from "../../../../sanity/lib/queries";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await client.fetch(
    CUSTOMER_ADDRESSES_QUERY,
    { id: session.user.id },
    { cache: "no-store" }
  );

  return NextResponse.json({ addresses: addresses || [] });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { label, fullAddress, phone } = await request.json();

  if (!fullAddress?.trim()) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const newAddress = {
    _key: crypto.randomUUID(),
    _type: "address",
    label: label?.trim() || "Address",
    fullAddress: fullAddress.trim(),
    phone: phone?.trim() || "",
    isDefault: false,
  };

  await writeClient
    .patch(session.user.id)
    .setIfMissing({ addresses: [] })
    .append("addresses", [newAddress])
    .commit();

  return NextResponse.json({ address: newAddress }, { status: 201 });
}