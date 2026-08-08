import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { writeClient } from "../../../../sanity/lib/writeClient";
import { client } from "../../../../sanity/lib/client";
import { ALL_PRODUCTS_QUERY } from "../../../../sanity/lib/queries";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) return null;
  return session;
}

export async function GET() {
  const products = await client.fetch(ALL_PRODUCTS_QUERY, {}, { cache: "no-store" });
  return NextResponse.json(products);
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name || !body.categoryId || body.price == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const doc = {
    _type: "product",
    name: body.name,
    slug: { _type: "slug", current: slugify(body.name) },
    category: { _type: "reference", _ref: body.categoryId },
    shortDescription: body.shortDescription || "",
    price: Number(body.price),
    oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
    discountLabel: body.discountLabel || undefined,
    stock: Number(body.stock) || 0,
    colors: [
      {
        _type: "colorVariant",
        _key: crypto.randomUUID(),
        name: "Default",
      },
    ],
  };

  const created = await writeClient.create(doc);
  return NextResponse.json(created, { status: 201 });
}