// سكربت لمرة وحدة: بيستورد منتجات تصنيف "VariDesk Converters" لـ Sanity،
// وبيرفع كل صور الألوان (colorImg, mainImage, hoverImage, gallery) لـ Sanity assets.
//
// طريقة التشغيل:
//   node scripts/seed-products.mjs
//
// المتطلبات (نفس المتطلبات تبع seed-categories.mjs):
//   NEXT_PUBLIC_SANITY_PROJECT_ID و SANITY_API_TOKEN بملف .env.local
//
// idempotent: بيعمل createOrReplace، فآمن تعيد تشغيله أكتر من مرة.

import { config } from "dotenv";
import { createClient } from "@sanity/client";
import { products } from "./products-data.mjs";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "❌ ناقص NEXT_PUBLIC_SANITY_PROJECT_ID أو SANITY_API_TOKEN بملف .env.local"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

// التصنيف اللي منربط فيه المنتجات - لازم يكون متطابق مع الـ _id
// اللي انعمل بسكربت seed-categories.mjs
const CATEGORY_ID = "category-varidesk-converters";

// كاش بسيط حتى ما نرفع نفس الصورة مرتين لو تكررت بين منتجين
const uploadCache = new Map();

async function uploadImageFromUrl(url) {
  if (!url) return null;
  if (uploadCache.has(url)) return uploadCache.get(url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`فشل تحميل الصورة: ${url} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = url.split("/").pop() || "image.jpg";
  const asset = await client.assets.upload("image", buffer, { filename });

  uploadCache.set(url, asset);
  return asset;
}

function toImageField(asset) {
  if (!asset) return undefined;
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function buildColorField(color) {
  const colorImgAsset = await uploadImageFromUrl(color.colorImg);
  const mainImageAsset = await uploadImageFromUrl(color.mainImage);
  const hoverImageAsset = await uploadImageFromUrl(color.hoverImage);

  const imageAssets = [];
  for (const imgUrl of color.images || []) {
    const asset = await uploadImageFromUrl(imgUrl);
    if (asset) imageAssets.push(asset);
  }

  return {
    _key: color.name.toLowerCase().replace(/\s+/g, "-"),
    name: color.name,
    colorImg: toImageField(colorImgAsset),
    mainImage: toImageField(mainImageAsset),
    hoverImage: toImageField(hoverImageAsset),
    images: imageAssets.map((asset, i) => ({
      _key: `img${i}`,
      ...toImageField(asset),
    })),
  };
}

async function run() {
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    console.log(`\n→ (${i + 1}/${products.length}) ${p.name}`);

    const colors = [];
    for (const color of p.colors) {
      console.log(`  ↳ رفع صور اللون: ${color.name}`);
      colors.push(await buildColorField(color));
    }

    const doc = {
      _id: `product-${p.slug}`,
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: CATEGORY_ID },
      shortDescription: p.shortDescription,
      price: p.price,
      oldPrice: p.oldPrice ?? undefined,
      discountLabel: p.discountLabel ?? undefined,
      hasVideo: p.hasVideo,
      video: p.video ?? undefined,
      stock: p.stock,
      rating: p.rating ?? undefined,
      reviewsCount: p.reviewsCount ?? undefined,
      reviewsBreakdown: p.reviewsBreakdown,
      specs: p.specs,
      details: p.details,
      colors,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ تم حفظ المنتج (${doc._id})`);
  }

  console.log("\n✅ خلص، كل المنتجات انضافت لـ Sanity.");
}

run().catch((err) => {
  console.error("\n❌ صار خطأ:", err.message);
  process.exit(1);
});