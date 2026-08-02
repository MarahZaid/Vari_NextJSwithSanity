import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'Display name, e.g. "Standing Desks and Tables"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "plpTitle",
      title: "PLP page title",
      type: "string",
      description:
        'Title shown at the top of the category (PLP) page. Can differ from "Name", e.g. "VariDesk Standing Desk Converters"',
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "string",
      description: "Shown under the category name on the home page card",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "text",
      description: "Longer description, shown on the category (PLP) page",
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      description: "Used on the home page category card",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero / banner image",
      type: "image",
      options: { hotspot: true },
      description: "Used at the top of the category (PLP) page",
    }),
    defineField({
      name: "discountPercentage",
      title: "Discount percentage",
      type: "number",
      description: "Optional - if the whole category has a blanket discount, e.g. 20",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "orderRank",
      title: "Display order",
      type: "number",
      description: "Lower numbers show first on the home page",
    }),
  ],
  preview: {
    select: { title: "name", media: "mainImage" },
  },
});