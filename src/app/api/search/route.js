import { NextResponse } from "next/server";
import { client } from "../../../sanity/lib/client";
import { SEARCH_PREVIEW_PRODUCTS_QUERY, SEARCH_PREVIEW_CATEGORIES_QUERY } from "../../../sanity/lib/queries";

export async function GET(request) {
  const term = request.nextUrl.searchParams.get("q")?.trim();

  if (!term) {
    return NextResponse.json({ products: [], categories: [] });
  }

  const [products, categories] = await Promise.all([
    client.fetch(SEARCH_PREVIEW_PRODUCTS_QUERY, { term: `${term}*` }),
    client.fetch(SEARCH_PREVIEW_CATEGORIES_QUERY, { term: `${term}*` }),
  ]);

  return NextResponse.json({ products, categories });
}