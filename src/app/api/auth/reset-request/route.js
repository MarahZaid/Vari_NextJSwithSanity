import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.toString().trim().toLowerCase();

  console.log("Password reset requested for:", email);

  return NextResponse.json({ ok: true });
}