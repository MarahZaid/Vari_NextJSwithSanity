// سكربت لمرة وحدة: بيستورد التصنيفات لـ Sanity، وبيرفع الصور من Cloudinary
// كمان بيصير Sanity assets حقيقية.
//
// طريقة التشغيل:
//   1. تأكد إنه .env.local فيه:
//        NEXT_PUBLIC_SANITY_PROJECT_ID=...
//        NEXT_PUBLIC_SANITY_DATASET=production
//        SANITY_API_TOKEN=...   <-- توكن بصلاحية "Editor" من sanity.io/manage
//   2. node scripts/seed-categories.mjs
//
// السكربت "idempotent" - يعني لو شغّلته أكتر من مرة، بيعمل تحديث
// (createOrReplace) بدل ما يكرر نفس التصنيف.

import { config } from "dotenv";
import { createClient } from "@sanity/client";

// dotenv افتراضيًا بيقرأ ملف ".env" بس - إحنا مستخدمين ".env.local"
// (متل ما Next.js بيعمل)، فلازم نحدد المسار يدوي.
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

// بيانات التصنيفات (منقولة من الفايربيز القديم)
const categories = [
  {
    slug: "varidesk-converters",
    name: "VariDesk® Converters",
    plpTitle: "VariDesk Standing Desk Converters",
    shortDescription: "Turn any desk into a sit-stand desk",
    description:
      "Turn any desk into a standing desk with an original VariDesk® desktop riser.",
    discountPercentage: 20,
    mainImage:
      "https://res.cloudinary.com/gkhldzc0/image/upload/f_auto,q_auto/product1_mboz7n",
    heroImage:
      "https://res.cloudinary.com/gkhldzc0/image/upload/f_auto,q_auto/vari_converter-PLP-header-banner_woxkoo",
  },
  {
    slug: "standing-desks-and-tables",
    name: "Standing Desks and Tables",
    plpTitle: "Desks and Tables",
    shortDescription: "Full-size standing desks and tables",
    description: "Freestanding desks and tables for the home or the office.",
    mainImage:
      "https://res.cloudinary.com/gkhldzc0/image/upload/f_auto,q_auto/product2_fjalf0",
    heroImage: "",
  },
  {
    slug: "seating",
    name: "Seating",
    plpTitle: "Seating",
    shortDescription: "Chairs, active stools, lounge seating",
    description:
      "Our chair collection is designed to fit every body, every workspace, and every style. Whether you want breathable comfort for long work sessions, sculpted support that moves with you, or a sleek silhouette that makes a statement, there's a Vari® chair ready to rise to the occasion.",
    mainImage:
      "https://res.cloudinary.com/gkhldzc0/image/upload/f_auto,q_auto/product3_p8gcel",
    heroImage: "",
  },
  {
    slug: "storage",
    name: "Storage",
    plpTitle: "Storage",
    shortDescription: "File cabinets and desk storage",
    description:
      "Get organized with flexible storage solutions that ship fully assembled.",
    mainImage:
      "https://res.cloudinary.com/gkhldzc0/image/upload/f_auto,q_auto/product4_qx3ekj",
    heroImage: "",
  },
  {
    slug: "partitions-and-privacy",
    name: "Partitions & Privacy",
    plpTitle: "Partitions and Privacy",
    shortDescription: "Walls, cubicles, booths, and panels",
    description:
      "Ensure privacy with panels, walls, and other sound absorbing solutions",
    mainImage:
      "https://res.cloudinary.com/gkhldzc0/image/upload/f_auto,q_auto/product5_wh9xl6",
    heroImage: "",
  },
  {
    slug: "accessories",
    name: "Accessories",
    plpTitle: "Office & Standing Desk Accessories",
    shortDescription: "Mats, monitor arms, lighting, and more",
    description:
      "Enhance your space with accessories like standing mats, LED desk lamps, standing desk monitor arms, collaborative marker boards and more. Vari products assemble easily and don't require special tools, which means they can be assembled by almost anyone, reconfigured quickly, and work in almost any space.",
    mainImage:
      "https://res.cloudinary.com/gkhldzc0/image/upload/f_auto,q_auto/product6_whyacf",
    heroImage: "",
  },
];

async function uploadImageFromUrl(url, filename) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`فشل تحميل الصورة: ${url} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { filename });
  return asset;
}

async function run() {
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    console.log(`\n→ ${category.name}`);

    const mainImageAsset = await uploadImageFromUrl(
      category.mainImage,
      `${category.slug}-main.jpg`
    );
    console.log("  ✓ رفع mainImage");

    let heroImageAsset = null;
    if (category.heroImage) {
      heroImageAsset = await uploadImageFromUrl(
        category.heroImage,
        `${category.slug}-hero.jpg`
      );
      console.log("  ✓ رفع heroImage");
    }

    const doc = {
      _id: `category-${category.slug}`,
      _type: "category",
      name: category.name,
      plpTitle: category.plpTitle,
      slug: { _type: "slug", current: category.slug },
      shortDescription: category.shortDescription,
      description: category.description,
      orderRank: i + 1,
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: mainImageAsset._id },
      },
    };

    if (category.discountPercentage) {
      doc.discountPercentage = category.discountPercentage;
    }

    if (heroImageAsset) {
      doc.heroImage = {
        _type: "image",
        asset: { _type: "reference", _ref: heroImageAsset._id },
      };
    }

    await client.createOrReplace(doc);
    console.log(`  ✓ تم حفظ الوثيقة (${doc._id})`);
  }

  console.log("\n✅ خلص، كل التصنيفات انضافت لـ Sanity.");
}

run().catch((err) => {
  console.error("\n❌ صار خطأ:", err.message);
  process.exit(1);
});