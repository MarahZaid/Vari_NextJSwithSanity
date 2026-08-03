import { defineField, defineType } from "sanity";

const colorVariant = defineField({
  name: "colors",
  title: "Color variants",
  type: "array",
  validation: (Rule) => Rule.required().min(1),
  of: [
    {
      type: "object",
      name: "colorVariant",
      fields: [
        defineField({ name: "name", title: "Color name", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "colorImg", title: "Swatch image", type: "image", validation: (Rule) => Rule.required() }),
        defineField({ name: "mainImage", title: "Main image", type: "image" }),
        defineField({ name: "hoverImage", title: "Hover image", type: "image" }),
        defineField({
          name: "images",
          title: "Gallery images",
          type: "array",
          of: [{ type: "image" }],
        }),
      ],
      preview: {
        select: { title: "name", media: "colorImg" },
      },
    },
  ],
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "oldPrice",
      title: "Old price (before discount)",
      type: "number",
    }),
    defineField({
      name: "discountLabel",
      title: "Discount label",
      type: "string",
      description: 'e.g. "30% Off - Vari Deal Days"',
    }),
    defineField({
      name: "hasVideo",
      title: "Has video?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "video",
      title: "Video URL",
      type: "url",
      hidden: ({ document }) => !document?.hasVideo,
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "rating",
      title: "Average rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "reviewsCount",
      title: "Reviews count",
      type: "number",
    }),
    defineField({
      name: "reviewsBreakdown",
      title: "Reviews breakdown",
      type: "object",
      fields: [
        defineField({ name: "star1", title: "1 star", type: "number" }),
        defineField({ name: "star2", title: "2 star", type: "number" }),
        defineField({ name: "star3", title: "3 star", type: "number" }),
        defineField({ name: "star4", title: "4 star", type: "number" }),
        defineField({ name: "star5", title: "5 star", type: "number" }),
      ],
    }),
    colorVariant,
    defineField({
      name: "specs",
      title: "Specs",
      type: "object",
      fields: [
        defineField({
          name: "certifications",
          title: "Certifications",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "desktopDepth", title: "Desktop depth", type: "string" }),
        defineField({ name: "desktopWidth", title: "Desktop width", type: "string" }),
        defineField({
          name: "finish",
          title: "Finish options",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "warranty", title: "Warranty", type: "string" }),
        defineField({ name: "power", title: "Power", type: "string" }),
      ],
    }),
    defineField({
      name: "details",
      title: "Details",
      type: "object",
      fields: [
        defineField({
          name: "bullets",
          title: "Bullet points",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "certificationsText", title: "Certifications text", type: "string" }),
        defineField({ name: "extrasInBox", title: "Extras in box", type: "text" }),
        defineField({ name: "quote", title: "Quote", type: "text" }),
        defineField({ name: "quoteSource", title: "Quote source", type: "string" }),
        defineField({ name: "shipping", title: "Shipping info", type: "text" }),
        defineField({ name: "warrantyText", title: "Warranty text", type: "text" }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "shortDescription", media: "colors.0.mainImage" },
  },
});
