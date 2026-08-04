import { defineField, defineType } from "sanity";

export const customer = defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "passwordHash",
      title: "Password hash",
      type: "string",
      description: "Encrypted with bcrypt—it cannot be manually edited from here, ever.",
      hidden: () => true,
      readOnly: true,
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "points",
      title: "Loyalty points",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isAdmin",
      title: "Is admin?",
      type: "boolean",
      initialValue: false,
      description: "Activate it to grant this account admin privileges.",
    }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "email" },
  },
});