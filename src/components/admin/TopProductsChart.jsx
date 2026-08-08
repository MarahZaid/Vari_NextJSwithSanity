"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function TopProductsChart({ data }) {
  if (!data.length) {
    return <p className="py-10 text-center text-sm text-[#6b7c84]">No sales data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7c84" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 11, fill: "#6b7c84" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eee", fontSize: 13 }} />
        <Bar dataKey="qty" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill="#22aaff" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}