import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { writeClient } from "../../../../sanity/lib/writeClient";
import { client } from "../../../../sanity/lib/client";
import { ALL_CATEGORIES_QUERY } from "../../../../sanity/lib/queries";

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) return null;
  return session;
}

export async function GET() {
  const categories = await client.fetch(ALL_CATEGORIES_QUERY, {}, { cache: "no-store" });
  return NextResponse.json(categories);
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const created = await writeClient.create({
    _type: "category",
    name: body.name,
    plpTitle: body.plpTitle || body.name,
    slug: { _type: "slug", current: slugify(body.name) },
    shortDescription: body.shortDescription || "",
    description: body.description || "",
    discountPercentage: body.discountPercentage ? Number(body.discountPercentage) : undefined,
    orderRank: body.orderRank ? Number(body.orderRank) : 0,
  });

  return NextResponse.json(created, { status: 201 });
}