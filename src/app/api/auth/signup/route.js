import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { client } from "../../../../sanity/lib/client";
import { writeClient } from "../../../../sanity/lib/writeClient";
import { CUSTOMER_BY_EMAIL_QUERY } from "../../../../sanity/lib/queries";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.toString().trim();
  const email = body?.email?.toString().trim().toLowerCase();
  const password = body?.password?.toString();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "The password must be at least 6 characters long." },
      { status: 400 }
    );
  }

  const existing = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, { email });
  if (existing) {
    return NextResponse.json(
      { error: "There is already an account registered with this email." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await writeClient.create({
    _type: "customer",
    name,
    email,
    passwordHash,
    phone: "",
    address: "",
    points: 50, 
    isAdmin: false,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}