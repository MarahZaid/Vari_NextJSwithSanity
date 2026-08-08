"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7c84" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#6b7c84" }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => [`$${value.toFixed(2)}`, "Sales"]}
          contentStyle={{ borderRadius: 10, border: "1px solid #eee", fontSize: 13 }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#22aaff"
          strokeWidth={2.5}
          dot={{ fill: "#22aaff", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}