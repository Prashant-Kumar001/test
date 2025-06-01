import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const SixMonthProductBarChart = ({ sixMonthProducts }) => {
  const data = sixMonthProducts
    ?.map((item) => ({
      name: `${item.month.slice(0, 3)} '${String(item.year).slice(2)}`,
      products: item.orderCount,
    }))
    .reverse(); // So it shows from oldest to most recent

  return (
    <div className="bg-white p-6 border-t-2 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Product Orders - Last 6 Months
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={28} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => `${value} products`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Bar dataKey="products" fill="#10B981" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="products" position="top" fill="#374151" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SixMonthProductBarChart;
