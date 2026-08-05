import { defineField, defineType } from "sanity";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
];

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
      description: "Optional – useful if you want to link the request to an actual account in the studio.",
    }),
    defineField({
      name: "customerName",
      title: "Customer name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerEmail",
      title: "Customer email",
      type: "string",
      description: "Primary source for linking orders to the account page (search by email)",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: "object",
          name: "orderItem",
          fields: [
            defineField({ name: "productName", title: "Product name", type: "string" }),
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({ name: "color", title: "Color", type: "string" }),
            defineField({ name: "price", title: "Price", type: "number" }),
            defineField({ name: "quantity", title: "Quantity", type: "number" }),
          ],
          preview: {
            select: { title: "productName", subtitle: "quantity" },
          },
        },
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: STATUS_OPTIONS },
      initialValue: "pending",
    }),
    defineField({ name: "subtotal", title: "Subtotal", type: "number" }),
    defineField({ name: "shippingFee", title: "Shipping fee", type: "number", initialValue: 0 }),
    defineField({ name: "pointsRedeemed", title: "Points redeemed", type: "number", initialValue: 0 }),
    defineField({ name: "pointsDiscount", title: "Points discount ($)", type: "number", initialValue: 0 }),
    defineField({
      name: "totalAmount",
      title: "Total amount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "paymentMethod", title: "Payment method", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "shippingAddress", title: "Shipping address", type: "string" }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "customerName", subtitle: "status" },
  },
});