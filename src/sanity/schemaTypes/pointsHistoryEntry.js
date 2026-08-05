import { defineField, defineType } from "sanity";

export const pointsHistoryEntry = defineType({
  name: "pointsHistoryEntry",
  title: "Points History Entry",
  type: "document",
  fields: [
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "number",
      description: "Positive if points are added, negative if they are deducted (redeemed).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: ["signup", "order", "redeem"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Related order",
      type: "reference",
      to: [{ type: "order" }],
    }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "type", subtitle: "amount" },
  },
});