export const filterGroups = [
  {
    title: "Finish",
    filterType: "finish",
    options: ["Black", "Espresso Wood", "Light Wood", "Silver", "Walnut", "White"].map(
      (v) => ({ label: v, value: v })
    ),
  },
  {
    title: "Warranty",
    filterType: "warranty",
    options: ["1 Years", "3 Years", "5 Years", "Lifetime"].map((v) => ({
      label: v,
      value: v,
    })),
  },
  {
    title: "Price",
    filterType: "price",
    options: [
      { label: "$1 – $200", value: "1-200" },
      { label: "$201 – $400", value: "201-400" },
      { label: "$401 – $600", value: "401-600" },
    ],
  },
  {
    title: "Certifications",
    filterType: "certifications",
    options: ["ANSI/BIFMA", "Greenguard", "Greenguard Gold"].map((v) => ({
      label: v,
      value: v,
    })),
  },
  {
    title: "Necessary Desk Depth",
    filterType: "depth",
    options: ["18", "23.5", "25.75", "28", "29.75"].map((v) => ({
      label: `${v}"`,
      value: v,
    })),
  },
];