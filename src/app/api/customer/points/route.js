import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { client } from "../../../../sanity/lib/client";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ points: 0 });
  }

  const points = await client.fetch(
    `*[_type == "customer" && _id == $id][0].points`,
    { id: session.user.id },
    { cache: "no-store" }
  );

  return NextResponse.json({ points: points || 0 });
}