import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DiscountTrendLineChart = ({ data }) => {
  // Format data for chart
  const chartData = [...data]
    .reverse() // Optional: reverse for chronological order
    .map((item) => ({
      name: `${item.month.slice(0, 3)} '${item.year.toString().slice(-2)}`,
      discount: item.discount,
    }));

  return (
    <div className="bg-white p-6 rounded-2xl ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Discounts</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tickFormatter={(v) => `₹${v}`}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => `₹${value}`}
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontSize: "0.85rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              color: "#111827",
            }}
          />
          <Line
            type="monotone"
            dataKey="discount"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiscountTrendLineChart;
