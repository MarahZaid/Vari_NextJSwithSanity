// سكربت لمرة وحدة: بيستورد تقييمات منتج "VariDesk Pro Plus 36" (p101 بالفايربيز
// القديم) لـ Sanity، وبيرفع صور التقييمات.
//
// ملاحظة: بيانات الفايربيز الأصلية فيها تقييمات لمنتجات تانية كمان (p201, p301)
// بس هدول من تصنيفات لسا ما ضفناها لـ Sanity، فبكتفي هلق بمنتج p101 اللي
// موجود فعليًا (product-varidesk-pro-plus-36). لما نضيف باقي التصنيفات/المنتجات
// بنقدر نرجع نوسع هاد السكربت.
//
// طريقة التشغيل: node scripts/seed-reviews.mjs

import { config } from "dotenv";
import { createClient } from "@sanity/client";

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

const PRODUCT_ID = "product-varidesk-pro-plus-36";

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/gkhldzc0/image/upload/f_auto,q_auto/";

const reviews = [
  { key: "rev1", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_2_fo4kn3", verified: true, createdAt: 1749772800000 },
  { key: "rev10", userName: "Hilary F.", rating: 5, title: "Love it. I only have", comment: "Love it. I only have one large Mac display on a stand and my laptop. It raises and lowers relatively easily.", image: "medium_square_1_d2yomc", verified: true, createdAt: 1722297600000 },
  { key: "rev11", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_3_gm9c09", verified: true, createdAt: 1749772800000 },
  { key: "rev12", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_9_kuwcpz", verified: true, createdAt: 1749772800000 },
  { key: "rev13", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_10_guzqf1", verified: true, createdAt: 1749772800000 },
  { key: "rev14", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_11_ueot4j", verified: true, createdAt: 1749772800000 },
  { key: "rev3", userName: "Hilary F.", rating: 5, title: "Love it. I only have", comment: "Love it. I only have one large Mac display on a stand and my laptop. It raises and lowers relatively easily.", image: "medium_square_12_pu3vb5", verified: true, createdAt: 1722297600000 },
  { key: "rev4", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_13_x0plyk", verified: true, createdAt: 1749772800000 },
  { key: "rev5", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_14_bp0zt4", verified: true, createdAt: 1749772800000 },
  { key: "rev6", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_16_tll0xn", verified: true, createdAt: 1749772800000 },
  { key: "rev7", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_24_hv5h1v", verified: true, createdAt: 1749772800000 },
  { key: "rev8", userName: "Naomi E.", rating: 5, title: "I am so happy with", comment: "I am so happy with this desk. It has completely changed how I feel during my day. I don't know what took me so long.", image: "medium_square_zutmke", verified: true, createdAt: 1749772800000 },
  { key: "rev9", userName: "Jacob H.", rating: 5, title: "Amazing", comment: "Amazing", image: "medium_square_31_x2swbt", verified: true, createdAt: 1749859200000 },
];

async function uploadImageFromUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`فشل تحميل الصورة: ${url} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = url.split("/").pop() || "review.jpg";
  return client.assets.upload("image", buffer, { filename });
}

async function run() {
  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    console.log(`\n→ (${i + 1}/${reviews.length}) ${r.userName} - ${r.title}`);

    const imageAsset = await uploadImageFromUrl(CLOUDINARY_BASE + r.image);
    console.log("  ✓ رفع الصورة");

    const doc = {
      _id: `review-${PRODUCT_ID}-${r.key}`,
      _type: "review",
      product: { _type: "reference", _ref: PRODUCT_ID },
      userName: r.userName,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      verified: r.verified,
      createdAt: new Date(r.createdAt).toISOString(),
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      },
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ تم حفظ التقييم (${doc._id})`);
  }

  console.log("\n✅ خلص، كل التقييمات انضافت لـ Sanity.");
}

run().catch((err) => {
  console.error("\n❌ صار خطأ:", err.message);
  process.exit(1);
});